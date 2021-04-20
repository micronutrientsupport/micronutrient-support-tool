/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Component,
  Input,
  Optional,
  Inject,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import * as L from 'leaflet';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuickMapsService } from '../../../quickMaps.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { CustomColourObject } from './colourObject';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';
import { DEFAULT_ABSOLUTE_COLOUR_GRADIENTS, DEFAULT_THRESHOLD_COLOUR_GRADIENTS, PALETTES } from './colourGradients';
import { ColourGradient, ColourGradientObject } from './colourGradient';
import { ColourPalette } from './colourPalette';

@Component({
  selector: 'app-map-view',
  templateUrl: './mapView.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './mapView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;
  @Input() card: CardComponent;

  public colourPalette: ColourPalette;
  public title = '';
  // private data: Array<SubRegionDataItem>;
  public defaultColourScheme: ColourGradientType;
  private data: SubRegionDataItem;


  private absoluteMap: L.Map;
  private absoluteDataLayer: L.GeoJSON;
  private absoluteRange = [10, 50, 100, 250, 500, 1000, 1500, 2000];
  private absoluteLegend: L.Control;

  private thresholdMap: L.Map;
  private thresholdDataLayer: L.GeoJSON;
  private thresholdRange = [10, 20, 40, 60, 80, 99, 101];
  private thresholdLegend: L.Control;
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection;

  private thresholdGradients = DEFAULT_THRESHOLD_COLOUR_GRADIENTS;
  private absoluteGradients = DEFAULT_ABSOLUTE_COLOUR_GRADIENTS;
  private selectedThresholdGradient = this.thresholdGradients[2];
  private selectedAbsoluteGradient = this.absoluteGradients[2];

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  private tabVisited = new Map<number, boolean>();

  constructor(
    private dialogService: DialogService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private currentDataService: CurrentDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MapViewDialogData>,
  ) {
    this.retrieveColourPalette()
  }

  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.map1Element.nativeElement);
    this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);

    // const retrievedObject = localStorage.getItem('customColourScheme');
    // if (null != retrievedObject) {
    //   // this.ColourObject.customObject = JSON.parse(retrievedObject) as CustomGradientObject;
    // }
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.showExpand = true;
      this.card.showSettings = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.card.onSettingsClickObs.subscribe(() => {
        void this.dialogService
          .openMapSettingsDialog(this.colourPalette)
          .then((data: DialogData<ColourPalette, ColourPalette>) => {
            if (data.dataOut !== null) {
              this.retrieveColourPalette()
              this.changeColourRamp(this.colourPalette);
            }
          });
      });

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
      this.subscriptions.push(
        this.card.onResizeObs.subscribe(() => {
          this.absoluteMap.invalidateSize();
          this.thresholdMap.invalidateSize();
        }),
      );

      this.subscriptions.push(
        this.quickMapsService.countryObs.subscribe((country) => {
          this.title = 'Map View' + (null == country ? '' : ` - ${country.name}`);
          if (null != this.card) {
            this.card.title = this.title;
          }
          // this.cdr.detectChanges();
        }),
      );

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(
            this.currentDataService.getSubRegionData(
              this.quickMapsService.country,
              this.quickMapsService.micronutrient,
              this.quickMapsService.mndDataOption,
              this.quickMapsService.dataLevel,
            ),
          );
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.title = this.dialogData.dataIn.title;
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.absoluteMap.invalidateSize();
        break;
      case 1:
        this.thresholdMap.invalidateSize();
        break;
    }
    if (!this.tabVisited.has(tabChangeEvent.index)) {
      this.triggerFitBounds(tabChangeEvent.index);
    }
  }

  private init(dataPromise: Promise<SubRegionDataItem>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: SubRegionDataItem) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.errorSrc.next(false);
        this.areaFeatureCollection = data.geoJson;

        this.initialiseMapAbsolute(this.colourPalette);
        this.initialiseMapThreshold(this.colourPalette);
        this.areaBounds = this.absoluteDataLayer.getBounds();

        // reset visited
        this.tabVisited.clear();
        // trigger current fit bounds
        // seems to need a small delay after page navigation to projections and back to baseline
        setTimeout(() => {
          this.triggerFitBounds(this.tabGroup.selectedIndex);
        }, 0);
      })
      .catch((err) => {
        this.errorSrc.next(true);
        console.error(err);
      })
      .finally(() => {
        this.loadingSrc.next(false);
        // this.cdr.detectChanges();
      });
  }

  private getFeatProps(feat: GeoJSON.Feature): SubRegionDataItemFeatureProperties {
    // console.debug(feat.properties);
    return feat.properties as SubRegionDataItemFeatureProperties;
  }

  // will need to define colour gradient as argument for this function and refactor other functions to allow for changing the gradients.
  private changeColourRamp(colourPalette: ColourPalette): void {

    const absoluteGradient = new ColourGradient(this.absoluteRange, colourPalette);
    const thresholdGradient = new ColourGradient(this.thresholdRange, colourPalette);

    this.absoluteMap.removeLayer(this.absoluteDataLayer);
    this.thresholdMap.removeLayer(this.thresholdDataLayer);

    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }
    if (null != this.thresholdLegend) {
      this.absoluteMap.removeControl(this.thresholdLegend);
    }

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      absoluteGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.absoluteMap);

    this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      thresholdGradient.getColour(this.getFeatProps(feat).mn_threshold),
    ).addTo(this.thresholdMap);

    this.refreshAbsoluteLegend(absoluteGradient);
    this.refreshThresholdLegend(thresholdGradient);
  }

  private refreshThresholdLegend(colourGradient: ColourGradient): void {
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    this.thresholdLegend = new L.Control({ position: 'bottomright' });

    this.thresholdLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
      let previousGradObj: ColourGradientObject;
      colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject, index: number) => {
        let text = '';
        if (index + 1 === this.selectedThresholdGradient.gradientObjects.length) {
          text = `>${previousGradObj.lessThanTestValue}%`;
        } else if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }

        div.innerHTML += `<span style="display: flex; align-items: center;">
          <span style="background-color:
          ${gradObj.hexString};
          height:10px; width:10px; display:block; margin-right:5px;">
          </span><span>${text}</span>`;
        previousGradObj = gradObj;
      });
      return div;
    };
    this.thresholdLegend.addTo(this.thresholdMap);
  }

  private refreshAbsoluteLegend(colourGradient: ColourGradient): void {
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    this.absoluteLegend = new L.Control({ position: 'bottomright' });

    this.absoluteLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
      let previousGradObj: ColourGradientObject;
      colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject, index: number) => {
        let text = '';
        if (index + 1 === this.selectedAbsoluteGradient.gradientObjects.length) {
          text = `>${previousGradObj.lessThanTestValue}mg`;
        } else if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }

        div.innerHTML += `<span style="display: flex; align-items: center;">
          <span style="background-color:
          ${gradObj.hexString};
          height:10px; width:10px; display:block; margin-right:5px;">
          </span><span>${text}</span>`;
        previousGradObj = gradObj;
      });

      return div;
    };

    this.absoluteLegend.addTo(this.absoluteMap);
  }

  private triggerFitBounds(tabIndex: number): void {
    this.tabVisited.set(tabIndex, true);
    switch (tabIndex) {
      case 0:
        this.absoluteMap.fitBounds(this.areaBounds);
        break;
      case 1:
        this.thresholdMap.fitBounds(this.areaBounds);
        break;
    }
  }

  private getTooltip(feature: GeoJSON.Feature): string {
    const props = this.getFeatProps(feature);
    return `
    <div>
      Region:<b>${props.subregion_name}</b><br/>
      Absolute value: ${props.mn_absolute}${props.mn_absolute_unit}<br/>
      Threshold: ${props.mn_threshold}${props.mn_threshold_unit}<br/>
    </div>`;
  }

  private createGeoJsonLayer(featureColourFunc: (feature: GeoJSON.Feature) => string): L.GeoJSON {
    return L.geoJSON(this.areaFeatureCollection, {
      style: (feature) => ({
        fillColor: featureColourFunc(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }),
      onEachFeature: (feature: GeoJSON.Feature, layer: UnknownLeafletFeatureLayerClass) => {
        layer.bindTooltip(this.getTooltip(feature));
      },
    });
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    const map = L.map(mapElement, {}).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  }

  private initialiseMapAbsolute(colourPalette: ColourPalette): void {
    if (null != this.absoluteDataLayer) {
      this.absoluteMap.removeLayer(this.absoluteDataLayer);
    }
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    const absoluteGradient = new ColourGradient(this.absoluteRange, colourPalette);

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      absoluteGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.absoluteMap);
    // console.debug('absolute', this.absoluteDataLayer);

    this.refreshAbsoluteLegend(absoluteGradient);

  }

  private initialiseMapThreshold(colourPalette: ColourPalette): void {
    if (null != this.thresholdDataLayer) {
      this.thresholdMap.removeLayer(this.thresholdDataLayer);
    }
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    const thresholdGradient = new ColourGradient(this.thresholdRange, colourPalette);

    this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      // this.getThresholdColourRange(feat.properties.mnThreshold, this.ColourObject.type),
      thresholdGradient.getColour(this.getFeatProps(feat).mn_threshold),
    ).addTo(this.thresholdMap);
    // console.debug('threshold', this.thresholdDataLayer);

    this.refreshThresholdLegend(thresholdGradient);
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<MapViewDialogData>(MapViewComponent, {
      title: this.title,
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }

  private retrieveColourPalette(): void {
    // checks if user has defined colour scheme and
    const retievedPalette = JSON.parse(localStorage.getItem('colourPalette')) as ColourPalette;
    if (null == retievedPalette) {
      // Set default palette to BRGY
      this.colourPalette = PALETTES.find((value: ColourPalette) => value.name === ColourGradientType.BLUEREDYELLOWGREEN);
    } else {
      const paletteToDisplay = new ColourPalette(retievedPalette.name, retievedPalette.colourHex);
      this.colourPalette = paletteToDisplay;
    }
  }
}

export interface MapViewDialogData {
  title: string;
  data: SubRegionDataItem;
  selectedTab: number;
}
