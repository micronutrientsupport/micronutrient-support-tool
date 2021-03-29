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
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { CustomColourObject } from './colourObject';
import { CustomGradientObject } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/customGradientObject';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';
import { DEFAULT_ABSOLUTE_COLOUR_GRADIENTS, DEFAULT_THRESHOLD_COLOUR_GRADIENTS } from './colourGradients';
import { ColourGradientObject } from './colourGradient';

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

  public title = '';
  public ColourObject: CustomColourObject = {
    type: null,
    customObject: null,
  };
  // private data: Array<SubRegionDataItem>;
  public defaultColourScheme: ColourGradientType;
  private data: SubRegionDataItem;

  private absoluteMap: L.Map;
  private absoluteDataLayer: L.GeoJSON;
  private absoluteLegend: L.Control;
  // private absoluteRange = [0, 10, 50, 100, 250, 500, 1000, 1500];

  private thresholdMap: L.Map;
  private thresholdDataLayer: L.GeoJSON;
  private thresholdLegend: L.Control;
  // private thresholdRange = [0, 10, 20, 40, 60, 80, 99];
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection;

  private thresholdGradients = DEFAULT_THRESHOLD_COLOUR_GRADIENTS;
  private absoluteGradients = DEFAULT_ABSOLUTE_COLOUR_GRADIENTS;
  private selectedThresholdGradient = this.thresholdGradients[0];
  private selectedAbsoluteGradient = this.absoluteGradients[0];

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  private tabVisited = new Map<number, boolean>();

  constructor(
    private dialogService: DialogService,
    private dictionaryService: DictionaryService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private currentDataService: CurrentDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MapViewDialogData>,
  ) { }

  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.map1Element.nativeElement);
    this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);

    // checks if user has defined colour scheme and
    const retrievedType = localStorage.getItem('ColourObject');
    this.ColourObject.type = retrievedType as ColourGradientType;
    if (this.ColourObject.type == null) {
      this.ColourObject.type = ColourGradientType.BLUEREDYELLOWGREEN;
    }
    const retrievedObject = localStorage.getItem('customColourScheme');
    if (null != retrievedObject) {
      this.ColourObject.customObject = JSON.parse(retrievedObject) as CustomGradientObject;
    }
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.showExpand = true;
      this.card.showSettings = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.card.onSettingsClickObs.subscribe(() => {
        void this.dialogService
          .openMapSettingsDialog(this.ColourObject)
          .then((data: DialogData<CustomColourObject, CustomColourObject>) => {
            if (data.dataOut.type !== null) {
              // if (data.dataOut.type === ColourGradientType.CUSTOM) {
              // }
              this.changeColourRamp();
              this.ColourObject.customObject = data.dataOut.customObject;
              this.ColourObject.type = data.dataOut.type;
              localStorage.setItem('customColourScheme', JSON.stringify(this.ColourObject.customObject));
              localStorage.setItem('ColourObject', this.ColourObject.type);
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
        this.initialiseMapAbsolute();
        this.initialiseMapThreshold();
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
    return feat.properties as SubRegionDataItemFeatureProperties;
  }

  // will need to define colour gradient as argument for this function and refactor other functions to allow for changing the gradients.
  private changeColourRamp(): void {
    this.absoluteMap.removeLayer(this.absoluteDataLayer);
    this.thresholdMap.removeLayer(this.thresholdDataLayer);

    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }
    if (null != this.thresholdLegend) {
      this.absoluteMap.removeControl(this.thresholdLegend);
    }

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      this.selectedAbsoluteGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.absoluteMap);

    this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      this.selectedThresholdGradient.getColour(this.getFeatProps(feat).mn_threshold),
    ).addTo(this.thresholdMap);

    this.refreshAbsoluteLegend();
    this.refreshThresholdLegend();
  }

  private refreshThresholdLegend(): void {
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    this.thresholdLegend = new L.Control({ position: 'bottomright' });

    this.thresholdLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
      let previousGradObj: ColourGradientObject;
      this.selectedThresholdGradient.gradientObjects.forEach((gradObj: ColourGradientObject, index: number) => {
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

  private refreshAbsoluteLegend(): void {
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    this.absoluteLegend = new L.Control({ position: 'bottomright' });

    this.absoluteLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
      let previousGradObj: ColourGradientObject;
      this.selectedAbsoluteGradient.gradientObjects.forEach((gradObj: ColourGradientObject, index: number) => {
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

  private initialiseMapAbsolute(): void {
    if (null != this.absoluteDataLayer) {
      this.absoluteMap.removeLayer(this.absoluteDataLayer);
    }
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      this.selectedAbsoluteGradient.getColour(this.getFeatProps(feat).mn_threshold),
    ).addTo(this.absoluteMap);

    this.refreshAbsoluteLegend();
  }

  private initialiseMapThreshold(): void {
    if (null != this.thresholdDataLayer) {
      this.thresholdMap.removeLayer(this.thresholdDataLayer);
    }
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      // this.getThresholdColourRange(feat.properties.mnThreshold, this.ColourObject.type),
      this.selectedThresholdGradient.getColour(this.getFeatProps(feat).mn_threshold),
    ).addTo(this.thresholdMap);

    this.refreshThresholdLegend();
  }

  // private getAbsoluteColourRange(absoluteValue: number, colourGradient: ColourGradientType): string {
  //   if (null == this.ColourObject.customObject) {
  //     colourGradient = ColourGradientType.BLUEREDYELLOWGREEN;
  //   }
  //   switch (true) {
  //     case absoluteValue > 1500:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#2ca25f';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#332288';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[0];
  //       } else {
  //         return '#045E56';
  //       }
  //     case absoluteValue > 1000:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#addd8e';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#117733';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[1];
  //       } else {
  //         return '#237E64';
  //       }
  //     case absoluteValue > 500:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#ffeda0';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#44AA99';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[2];
  //       } else {
  //         return '#8ADABB';
  //       }
  //     case absoluteValue > 250:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#feb24c';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#88CCEE';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[3];
  //       } else {
  //         return '#F6F2DC';
  //       }
  //     case absoluteValue > 100:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#f03b20';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#DDCC77';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[4];
  //       } else {
  //         return '#E7B8B0';
  //       }
  //     case absoluteValue > 50:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#bd0026';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#CC6677';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[5];
  //       } else {
  //         return '#CF8174';
  //       }
  //     case absoluteValue > 10:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#7a0177';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#AA4499';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[6];
  //       } else {
  //         return '#A26157';
  //       }
  //     case absoluteValue > 0:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#354969';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#882255';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.absoluteValues[7];
  //       } else {
  //         return '#762418';
  //       }
  //   }
  // }
  // private getThresholdColourRange(thresholdValue: number, colourGradient: ColourGradientType): string {
  //   if (null == this.ColourObject.customObject) {
  //     colourGradient = ColourGradientType.BLUEREDYELLOWGREEN;
  //   }
  //   switch (true) {
  //     case thresholdValue > 99:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#2ca25f';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#332288';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[0];
  //       } else {
  //         return '#045E56';
  //       }
  //     case thresholdValue > 80:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#addd8e';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#117733';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[1];
  //       } else {
  //         return '#237E64';
  //       }
  //     case thresholdValue > 60:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#ffeda0';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#44AA99';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[2];
  //       } else {
  //         return '#8ADABB';
  //       }
  //     case thresholdValue > 40:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#feb24c';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#88CCEE';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[3];
  //       } else {
  //         return '#F6F2DC';
  //       }
  //     case thresholdValue > 20:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#f03b20';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#DDCC77';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[4];
  //       } else {
  //         return '#E7B8B0';
  //       }
  //     case thresholdValue > 10:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#bd0026';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#CC6677';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[5];
  //       } else {
  //         return '#CF8174';
  //       }
  //     case thresholdValue > 0:
  //       if (colourGradient === ColourGradientType.BLUEREDYELLOWGREEN) {
  //         return '#7a0177';
  //       } else if (colourGradient === ColourGradientType.COLOURBLIND) {
  //         return '#AA4499';
  //       } else if (colourGradient === ColourGradientType.CUSTOM) {
  //         return this.ColourObject.customObject.thresholdValues[6];
  //       } else {
  //         return '#A26157';
  //       }
  //   }
  // }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<MapViewDialogData>(MapViewComponent, {
      title: this.title,
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface MapViewDialogData {
  title: string;
  data: SubRegionDataItem;
  selectedTab: number;
}
