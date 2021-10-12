/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradient, ColourGradientObject } from '../../../components/colourObjects/colourGradient';
import { ColourPalette } from '../../../components/colourObjects/colourPalette';
import { ColourPaletteType } from '../../../components/colourObjects/colourPaletteType.enum';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
export interface MapDataType {
  name: string;
  value: string;
}
import { DietDataService } from 'src/app/services/dietData.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import {
  FEATURE_TYPE,
  MnAvailibiltyItem,
  MnAvailibiltyItemFeatureProperties,
} from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';
import * as GeoJSON from 'geojson';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';

@Component({
  selector: 'app-map-view',
  templateUrl: './mapView.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './mapView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'map-view';
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;
  @Input() card: CardComponent;

  public snapshot = document.getElementById('snapshot');
  public readonly dataLevelEnum = DataLevel;
  public title = '';
  public selectedTab: number;

  public selectedDataType: MapDataType;

  public dataList: Array<MapDataType> = [
    { name: 'Absolute Values', value: 'absolute' },
    { name: 'Variation from Threshold', value: 'threshold' },
  ];
  private data: Array<MnAvailibiltyItem>;
  private subregiondata: SubRegionDataItem;
  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;

  private absoluteMap: L.Map;
  private absoluteDataLayer: L.GeoJSON;
  private absoluteRange = [10, 50, 100, 250, 500, 1000, 1500];
  private absoluteLegend: L.Control;

  private thresholdMap: L.Map;
  private thresholdDataLayer: L.GeoJSON;
  private thresholdRange = [10, 20, 40, 60, 80, 99];
  private thresholdLegend: L.Control;
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry, MnAvailibiltyItemFeatureProperties>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  private tabVisited = new Map<number, boolean>();

  private simpleMapScreenshoterAbs: SimpleMapScreenshoter;
  private simpleMapScreenshoterthres: SimpleMapScreenshoter;
  private bla: SimpleMapScreenshoter = new SimpleMapScreenshoter({ hidden: true });

  constructor(
    private dialogService: DialogService,
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dietDataService: DietDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MapViewDialogData>,
  ) {
    this.colourPalette = ColourPalette.getSelectedPalette(MapViewComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(MapViewComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }

  public downloadMap(): void {
    this.bla
      .takeScreen('image')
      .then((blob: Blob) => {
        // console.debug('blob', blob);
        saveAs(blob, 'screenshot.png');
      })
      .catch((e) => {
        alert(e.toString());
      });
  }

  // //  trying to get leaflet-image to work with canvas
  // public downloadMap(err, canvas): void {
  //   const img = document.createElement('img');
  //   const dimensions = this.absoluteMap.getSize();
  //   img.width = dimensions.x;
  //   img.height = dimensions.y;
  //   img.src = canvas.toDataURL();
  //   this.snapshot.innerHTML = '';
  //   this.snapshot.appendChild(img);
  // }

  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.map1Element.nativeElement);
    this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);
    // this.simpleMapScreenshoterAbs = L.simpleMapScreenshoter({hidden: true}).addTo(this.absoluteMap);
    // this.simpleMapScreenshoter.addTo(this.thresholdMap);

    // const bla: SimpleMapScreenshoter = L.simpleMapScreenshoter({ hidden: false });
    // bla.addTo(this.absoluteMap);
    // new SimpleMapScreenshoter({ hidden: true }).addTo(this.absoluteMap);

    // const bla: SimpleMapScreenshoter =  new SimpleMapScreenshoter({ hidden: false }).addTo(this.absoluteMap);
    // bla.takeScreen();

    // test polygon
    L.polygon([
      [40, -74],
      [51.503, -0.06],
      [20, -20],
    ]).addTo(this.absoluteMap);

    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.showExpand = true;
      this.card.showSettings = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.card.onSettingsClickObs.subscribe(() => {
        // console.debug('palette on dialog open:', this.colourPalette);
        void this.dialogService.openMapSettingsDialog(MapViewComponent.COLOUR_PALETTE_ID).then(() => {
          this.colourPalette = ColourPalette.getSelectedPalette(MapViewComponent.COLOUR_PALETTE_ID);
          if (null == this.colourPalette) {
            this.colourPalette = this.defaultPalette;
          }
          this.changeColourRamp();
        });
      });

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
      this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));
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
        this.quickMapsService.dietParameterChangedObs.subscribe(() => {
          this.init(
            this.dietDataService.getMicronutrientAvailability(
              this.quickMapsService.country,
              this.quickMapsService.micronutrient,
              this.quickMapsService.dietDataSource,
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

  public navigateToInfoTab(): void {
    this.selectedTab = 2;
    this.cdr.detectChanges();
  }
  public setDataSelection(dataType: MapDataType): void {
    this.selectedDataType = dataType;
  }

  public exportMapImage(): void {
    // const node = document.getElementById('threshold-map');
    domtoimage.toBlob(this.thresholdMap, { innerHeight: 400, innerWidth: 400 }).then((blob) => {
      window.saveAs(blob, 'my-node.png');
    });

    // domtoimage
    //   .toPng(this.thresholdMap, { innerHeight: 400, innerWidth: 400 })
    //   .then((dataUrl) => {
    //     const img = new Image();
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     img.src = dataUrl;
    //     document.body.appendChild(img);
    //     console.debug('img', img);
    //   })
    //   .catch((error) => {
    //     console.error('oops, something went wrong!', error);
    //   });
  }

  private init(dataPromise: Promise<Array<MnAvailibiltyItem>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<MnAvailibiltyItem>) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.errorSrc.next(false);

        // create featureCollection from data
        this.areaFeatureCollection = {
          type: 'FeatureCollection',
          features: data.map((item) => item.toFeature()),
        };
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
      .finally(() => {
        this.loadingSrc.next(false);
        // this.cdr.detectChanges();
      })
      .catch((e) => {
        this.errorSrc.next(true);
        throw e;
      });
  }

  // will need to define colour gradient as argument for this function and refactor other functions to allow for changing the gradients.
  private changeColourRamp(): void {
    this.initialiseMapAbsolute();
    this.initialiseMapThreshold();
  }

  private refreshThresholdLegend(colourGradient: ColourGradient): void {
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    this.thresholdLegend = new L.Control({ position: 'bottomright' });

    this.thresholdLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
      const addItemToHtml = (colourHex: string, text: string) => {
        div.innerHTML += `<span style="display: flex; align-items: center;">
        <span style="background-color:
        ${colourHex};
        height:10px; width:10px; display:block; margin-right:5px;">
        </span><span>${text}</span>`;
      };

      let previousGradObj: ColourGradientObject;
      colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject) => {
        let text = '';
        if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }

        addItemToHtml(gradObj.hexString, text);
        previousGradObj = gradObj;
      });
      addItemToHtml(colourGradient.moreThanHex, `>${previousGradObj.lessThanTestValue}%`);

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
      const addItemToHtml = (colourHex: string, text: string) => {
        div.innerHTML += `<span style="display: flex; align-items: center;">
        <span style="background-color:
        ${colourHex};
        height:10px; width:10px; display:block; margin-right:5px;">
        </span><span>${text}</span>`;
      };

      let previousGradObj: ColourGradientObject;
      colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject) => {
        let text = '';
        if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }
        addItemToHtml(gradObj.hexString, text);
        previousGradObj = gradObj;
      });
      addItemToHtml(colourGradient.moreThanHex, `>${previousGradObj.lessThanTestValue}mg`);

      return div;
    };

    this.absoluteLegend.addTo(this.absoluteMap);
    this.bla.addTo(this.absoluteMap);
  }

  private triggerFitBounds(tabIndex: number): void {
    this.tabVisited.set(tabIndex, true);

    if (this.areaBounds.isValid()) {
      (0 === tabIndex ? this.absoluteMap : this.thresholdMap).fitBounds(this.areaBounds);
    }
  }

  // TODO: reword
  // <aggregationAreaType>: <aggregationAreaName>
  // Dietary Availability (AFE): <dietarySupply><unit> per day
  // Prevalence of deficiency (EAR): <deficientPercentage> of sample households (<deficientCount>/<household_count)
  //
  // what about when data level is country??
  private getTooltip(feature: FEATURE_TYPE): string {
    const props = feature.properties;
    return `
    <div>
      ${props.areaType}:<b>${props.areaName}</b><br/>
      Absolute value: ${props.dietarySupply}${props.unit}<br/>
      Threshold: ${props.deficientPercentage}%<br/>
    </div>`;
  }
  private createGeoJsonLayer(featureColourFunc: (feature: FEATURE_TYPE) => string): L.GeoJSON {
    return L.geoJSON(this.areaFeatureCollection, {
      style: (feature: FEATURE_TYPE) => ({
        fillColor: featureColourFunc(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }),
      onEachFeature: (feature: FEATURE_TYPE, layer: UnknownLeafletFeatureLayerClass) => {
        layer.bindTooltip(this.getTooltip(feature));
      },
    });
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private initialiseMapAbsolute(): void {
    if (null != this.absoluteDataLayer) {
      this.absoluteMap.removeLayer(this.absoluteDataLayer);
    }
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    const absoluteGradient = new ColourGradient(this.absoluteRange, this.colourPalette);

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      absoluteGradient.getColour(feat.properties.dietarySupply),
    ).addTo(this.absoluteMap);
    // console.debug('absolute', this.absoluteDataLayer);

    this.refreshAbsoluteLegend(absoluteGradient);
  }

  private initialiseMapThreshold(): void {
    if (null != this.thresholdDataLayer) {
      this.thresholdMap.removeLayer(this.thresholdDataLayer);
    }
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    const thresholdGradient = new ColourGradient(this.thresholdRange, this.colourPalette);

    this.thresholdDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      // this.getThresholdColourRange(feat.properties.mnThreshold, this.ColourObject.type),
      thresholdGradient.getColour(feat.properties.deficientPercentage),
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
}

export interface MapViewDialogData {
  title: string;
  data: Array<MnAvailibiltyItem>;
  selectedTab: number;
}
