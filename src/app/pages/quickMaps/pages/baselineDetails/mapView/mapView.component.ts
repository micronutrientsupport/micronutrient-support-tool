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
import { DietDataService } from 'src/app/services/dietData.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import {
  FEATURE_TYPE,
  MnAvailibiltyItem,
  MnAvailibiltyItemFeatureProperties,
} from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';
import * as GeoJSON from 'geojson';
import { MapDownloadService } from 'src/app/services/mapDownload.service';
import { ExtendedRespose } from 'src/app/apiAndObjects/objects/mnAvailibilityCountryItem';
import { SignificantFiguresPipe } from 'src/app/pipes/significantFigures.pipe';
@Component({
  selector: 'app-map-view',
  templateUrl: './mapView.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './mapView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignificantFiguresPipe],
})
export class MapViewComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'map-view';
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;
  @Input() card: CardComponent;

  public readonly dataLevelEnum = DataLevel;
  public title = '';
  public downloadTitle = '';
  public selectedTab: number;
  public absoluteMapDiv: HTMLDivElement;
  public thresholdMapDiv: HTMLDivElement;
  public showThresholdMap = false;
  private data: Array<MnAvailibiltyItem>;
  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;
  private absoluteMap: L.Map;
  private absoluteDataLayer: L.GeoJSON;
  private absoluteDefaultRange = [10, 50, 100, 250, 500, 1000, 1500];
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

  constructor(
    private dialogService: DialogService,
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dietDataService: DietDataService,
    private mapDownloadService: MapDownloadService,
    private sigFig: SignificantFiguresPipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MapViewDialogData>,
  ) {
    this.colourPalette = ColourPalette.getSelectedPalette(MapViewComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(MapViewComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }

  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.map1Element.nativeElement);
    this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);

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
      this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToTab(2)));
      this.subscriptions.push(
        this.card.onResizeObs.subscribe(() => {
          this.absoluteMap.invalidateSize();
          this.thresholdMap.invalidateSize();
        }),
      );

      // respond to parameter updates only if all set
      this.subscriptions.push(
        this.quickMapsService.dietParameterChangedObs.subscribe(() => {
          const country = this.quickMapsService.country.get();
          const micronutrient = this.quickMapsService.micronutrient.get();
          const FoodSystemsDataSource = this.quickMapsService.FoodSystemsDataSource.get();

          this.title =
            (FoodSystemsDataSource.dataLevel == DataLevel.HOUSEHOLD
              ? 'Median apparent intake of '
              : 'Median nutrient availability of ') +
            micronutrient.name +
            (FoodSystemsDataSource.dataLevel == DataLevel.HOUSEHOLD ? ' (AFE) in ' : ' (per capita) in ') +
            country.name;
          this.downloadTitle = 'Baseline Map';
          if (null != this.card) {
            this.card.title = this.title;
          }

          //  only if all set
          if (null != country && null != micronutrient && null != FoodSystemsDataSource) {
            this.init(this.dietDataService.getMicronutrientAvailability(country, micronutrient, FoodSystemsDataSource));
          }
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(
        Promise.resolve({
          data: this.dialogData.dataIn.data,
          meta: { bins: { desc: '', data: this.dialogData.dataIn.absoluteRange } },
        }),
      );
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

  public navigateToTab(tab: number): void {
    this.selectedTab = tab;
    this.cdr.detectChanges();
  }

  public exportMapAsImage(id: string): void {
    if (id === 'threshold') {
      this.thresholdMapDiv = document.getElementById('threshold-map') as HTMLDivElement;
      this.mapDownloadService.captureElementAsImage(this.thresholdMapDiv, `${this.downloadTitle}-threshold-values`);
    } else {
      this.absoluteMapDiv = document.getElementById('absolute-map') as HTMLDivElement;
      this.mapDownloadService.captureElementAsImage(this.absoluteMapDiv, `${this.downloadTitle}-absolute-values`);
    }
  }

  private init(dataPromise: Promise<ExtendedRespose<MnAvailibiltyItem>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: ExtendedRespose<MnAvailibiltyItem>) => {
        this.data = data.data;
        if (data.meta.bins) {
          const range = data.meta.bins.data as number[];
          if (range[0] === 0) {
            // Remove initial 0
            range.shift();
          }
          this.absoluteRange = range;
        } else {
          this.absoluteRange = this.absoluteDefaultRange;
        }
        if (null == data) {
          void this.dialogService.openInvalidParametersDialog();
          throw new Error('data error');
        }
        this.errorSrc.next(false);

        // create featureCollection from data
        this.areaFeatureCollection = {
          type: 'FeatureCollection',
          features: data.data.map((item) => item.toFeature()),
        };

        // Only display threshold map when houeshold level data and a valid threshold exists
        if (
          this.quickMapsService.FoodSystemsDataSource.get().dataLevel == DataLevel.HOUSEHOLD &&
          data.data[0].deficientValue
        ) {
          this.showThresholdMap = true;
        } else {
          this.showThresholdMap = false;
          if (this.selectedTab == 1) {
            // If currently on the thresholds tab, switch to absout
            this.selectedTab = 0;
          }
        }
        this.cdr.detectChanges();

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
      addItemToHtml(
        colourGradient.moreThanHex,
        `>${previousGradObj.lessThanTestValue} ${this.quickMapsService.micronutrient.get().unit}`,
      );

      return div;
    };

    this.absoluteLegend.addTo(this.absoluteMap);
  }

  private triggerFitBounds(tabIndex: number): void {
    this.tabVisited.set(tabIndex, true);

    if (this.areaBounds.isValid()) {
      (0 === tabIndex ? this.absoluteMap : this.thresholdMap).fitBounds(this.areaBounds);
    }
  }
  // <aggregationAreaType>: <aggregationAreaName>
  // Dietary Availability (AFE): <dietarySupply><unit> per day
  // Prevalence of deficiency (EAR): <deficientPercentage> of sample households (<deficientCount>/<household_count)
  //
  private getTooltip(feature: FEATURE_TYPE): string {
    const props = feature.properties;

    if (this.quickMapsService.FoodSystemsDataSource.get().dataLevel === DataLevel.HOUSEHOLD) {
      const dietarySupplySF = this.sigFig.transform(props.dietarySupply, 3);
      let table = `
      <table>
      <tbody>
        <tr>
          <td><strong>Geography:</td>
          <td>${props.areaName}</td>
        </tr>
        <tr>
          <td><strong>Dietary Availability:</td>
          <td>${dietarySupplySF} ${props.unit} (AFE) per day</td>
        </tr>`;
      if (props.deficientValue) {
        table += `
        <tr>
          <td><strong>Prevalence of inadequate<br/>apparent intake (EAR):</td>
          <td>${props.deficientPercentage}% of sampled<br/>households (${props.deficientCount}/${props.householdCount})</td>
        </tr>`;
      }
      table += `
      </tbody>
      </table>`;
      return table;
    } else {
      const dietarySupplySF = this.sigFig.transform(props.dietarySupply, 3);
      const defThreshold = props.dietarySupply < props.deficientValue ? 'Below' : 'Above';
      let table = `
      <table>
      <tbody>
        <tr>
          <td><strong>Geography:</td>
          <td>${props.areaName}</td>
        </tr>
        <tr>
          <td><strong>Dietary Availability:</td>
          <td>${dietarySupplySF} ${props.unit} per capita per day</td>
        </tr>`;
      if (props.deficientValue) {
        table += `
          <tr>
            <td><strong>Inadequacy:</td>
            <td>${defThreshold} the threshold for<br/>inadequacy</td>
          </tr>`;
      }
      table += `
      </tbody>
      </table>`;
      return table;
    }
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
      absoluteRange: this.absoluteRange,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface MapViewDialogData {
  title: string;
  data: Array<MnAvailibiltyItem>;
  absoluteRange: number[];
  selectedTab: number;
}
