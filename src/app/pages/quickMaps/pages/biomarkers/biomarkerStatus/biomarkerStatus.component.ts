/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from 'leaflet';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  Optional,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CardComponent } from 'src/app/components/card/card.component';
import { FormControl } from '@angular/forms';
import { ChartjsComponent } from '@ctrl/ngx-chartjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { MatMenu } from '@angular/material/menu';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { ColourPalette } from '../../../components/colourObjects/colourPalette';
import { ColourPaletteType } from '../../../components/colourObjects/colourPaletteType.enum';
import { ColourGradient, ColourGradientObject } from '../../../components/colourObjects/colourGradient';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';
import { AgeGenderGroup } from 'src/app/apiAndObjects/objects/ageGenderGroup';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
export interface BiomarkerStatusDialogData {
  data: any;
  selectedTab: number;
}

export interface BiomarkerStatusData {
  areaName: string;
  ageGenderGroup: string;
  mineralLevelOne: string;
  mineralOutlier: string;
}

interface TableObject {
  region: string;
  n: number;
  deficient: string;
  confidence: string;
}
@Component({
  selector: 'app-biomarker-status',
  templateUrl: './biomarkerStatus.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerStatus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiomarkerStatusComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'biomarker-map-view';
  @Input() card: CardComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('map1') mapElement: ElementRef;
  @ViewChild('boxplot') boxPlot: ChartjsComponent;
  @ViewChild('settingsMenu', { static: true }) menu: MatMenu;

  public boxChartData: ChartJSObject;
  public barChartData: ChartJSObject;
  public title: string;
  public selectedTab: number;
  public displayedColumns = ['region', 'n', 'deficient', 'confidence'];
  public defThreshold = 20;
  public abnThreshold = 60;
  public showOutliers = true;
  public outlierControl = new FormControl(true);
  public dataTypes = new FormControl();
  public characteristics = new FormControl();
  public dataList: any[] = [
    { name: 'Prevalence of Deficiency', value: 'pod' },
    { name: 'Prevalence of Excess', value: 'poe' },
    { name: 'Combined deficiency and excess', value: 'cde' },
    { name: 'Concentration Data', value: 'cda' },
  ];

  public characteristicList: any[] = [
    { name: 'Regions', value: 'reg' },
    { name: 'Residence', value: 'res' },
    { name: 'Age group', value: 'age' },
    { name: 'Wealth Quintiles', value: 'qui' },
    { name: 'All characteristics', value: 'all' },
    { name: 'Total', value: 'tot' },
  ];
  public dataSource: MatTableDataSource<TableObject>;
  public totalSamples: number;
  public selectedOption: any;
  public selectedCharacteristic: any;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';
  public mineralData: Array<BiomarkerStatusData>;

  public boxChartPNG: string;
  public boxChartPDF: string;

  public excessBarChartPNG: string;
  public excessBarChartPDF: string;
  public deficiencyBarChartPNG: string;
  public deficiencyBarChartPDF: string;
  public combinedBarChartPNG: string;
  public combinedBarChartPDF: string;
  public hidden = true;

  // Copied in from MapView, structure will be similar but will however may change
  public temporaryData: SubRegionDataItem; // Temporary until new data coming in from API
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
  private areaFeatureCollection: GeoJSON.FeatureCollection;
  private subscriptions = new Array<Subscription>();
  private outlierSet: any[] = [];

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private tabVisited = new Map<number, boolean>();

  constructor(
    public quickMapsService: QuickMapsService,
    private http: HttpClient,
    private papa: Papa,
    private currentDataService: CurrentDataService,
    private qcService: QuickchartService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<BiomarkerStatusDialogData>,
  ) {
    this.colourPalette = ColourPalette.getSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }
  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.mapElement.nativeElement);
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
    this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

    this.subscriptions.push(
      this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
    );

    this.subscriptions.push(
      this.quickMapsService.ageGenderObs.subscribe((ageGenderGroup: AgeGenderGroup) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
    );

    // Render all charts initially for download;
    this.renderAllCharts();
    this.card.showExpand = true;
    this.card.showSettingsMenu = true;
    this.card.matMenu = this.menu;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.initialiseBoxChart([
      this.randomBoxPlot(0, 100),
      this.randomBoxPlot(0, 20),
      this.randomBoxPlot(20, 70),
      this.randomBoxPlot(60, 100),
      this.randomBoxPlot(50, 100),
    ]);

    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.init();
        this.initMap(
          this.currentDataService.getSubRegionData(
            this.quickMapsService.country,
            this.quickMapsService.micronutrient,
            this.quickMapsService.dataSource,
            this.quickMapsService.dataLevel,
          ),
        );
      }),
    );
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public initialiseBoxChart(data: any): void {
    this.boxChartData = {
      plugins: [ChartAnnotation],
      type: 'boxplot',
      data: {
        labels: ['Central', 'North', 'South', 'South East', 'West'],
        datasets: [
          {
            label: this.quickMapsService.micronutrient.name,
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            outlierColor: 'rgba(0,0,0,0.2)',
            outlierRadius: 3,
            data: data,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        title: {
          display: true,
          text: 'Boxplot',
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'defLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.defThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(255,0,0,0.5)',
              label: {
                enabled: true,
                content: 'Deficiency threshold',
                backgroundColor: 'rgba(255,0,0,0.8)',
              },
            },
            {
              type: 'line',
              id: 'abnLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.abnThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(0,0,255,0.5)',
              label: {
                enabled: true,
                content: 'Threshold for abnormal values',
                backgroundColor: 'rgba(0,0,255,0.8)',
              },
            },
          ],
        },
      },
    };

    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(this.boxChartData));
    this.boxChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.boxChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public initialiseBarChart(dataObj: any, type: string): void {
    let title = '';
    switch (type) {
      case 'pod':
        title = `Prevalence of ${this.selectedNutrient} deficiency`;
        break;
      case 'poe':
        title = `Prevalence of ${this.selectedNutrient} excess`;
        break;
      case 'cde':
        title = `Combined prevalence of ${this.selectedNutrient} deficiency and excess`;
        break;
    }
    title = title + ' per participants characteristics';

    this.barChartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: dataObj,
      options: {
        title: {
          display: true,
          text: title,
        },
        maintainAspectRatio: true,
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
        },
        scales: {
          xAxes: [
            {
              display: true,
            },
          ],
          yAxes: [
            {
              display: true,
              id: 'y-axis-0',
            },
          ],
        },
      },
    };

    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(this.barChartData));
    switch (type) {
      case 'pod':
        this.deficiencyBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
        this.deficiencyBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
        break;
      case 'poe':
        this.excessBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
        this.excessBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
        break;
      case 'cde':
        this.combinedBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
        this.combinedBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
        break;
    }
  }

  public toggleShowOutlier(): void {
    this.showOutliers = this.outlierControl.value;
    if (!this.showOutliers) {
      // Hide outliers
      this.boxChartData.data.datasets[0].data.forEach((data: any) => {
        this.outlierSet.push(data.outliers);
        data.outliers = null;
      });
      this.boxPlot.renderChart();
    } else {
      // Show outliers
      this.boxChartData.data.datasets[0].data.forEach((data: any, idx: number) => {
        data.outliers = this.outlierSet[idx];
      });
      this.boxPlot.renderChart();
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      this.absoluteMap.invalidateSize();
    }
  }

  public openMapSettings(): void {
    void this.dialogService.openMapSettingsDialog(BiomarkerStatusComponent.COLOUR_PALETTE_ID).then(() => {
      this.colourPalette = ColourPalette.getSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID);
      if (null == this.colourPalette) {
        this.colourPalette = this.defaultPalette;
      }
      this.changeColourRamp(this.colourPalette);
    });
  }

  // Capture value from data select dropdown.
  public dataSelected(value: string, origin: string): void {
    this.selectedOption = value;
    switch (origin) {
      case 'map':
        break;
      case 'table':
        if (this.selectedCharacteristic) {
          console.log('dataSelected');
          this.generateTable();
        }
        break;
      case 'chart':
        const barData = this.getBarData(value);
        this.initialiseBarChart(barData, this.selectedOption);
        break;
    }
  }

  // Capture value from characteristic select dropdown in table tab.
  public charactersiticSelected(value: string): void {
    this.selectedCharacteristic = value;
    console.log('charactersiticSelected');
    if (this.selectedOption) {
      // do something
    }
  }

  private init(): void {
    const mnName = this.quickMapsService.micronutrient.name;
    const agName = this.quickMapsService.ageGenderGroup.name;
    const titlePrefix = (null == mnName ? '' : `${mnName}`) + ' Status';
    const titleSuffix = ' in ' + (null == agName ? '' : `${agName}`);
    this.title = titlePrefix + titleSuffix;
    if (null != this.card) {
      this.card.title = this.title;
    }
    void this.http
      .get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' })
      .toPromise()
      .then((data: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const blob = this.papa.parse(data, { header: true }).data;
        const dataArray = new Array<BiomarkerStatusData>();

        // console.log(this.quickMapsService.ageGenderGroup.id); // all; adult_women; adult_men; children

        blob.forEach((simpleData) => {
          const statusData: BiomarkerStatusData = {
            areaName: simpleData.AreaName,
            ageGenderGroup: simpleData.DemoGpN,
            mineralLevelOne: simpleData.ZnAdj_gdL,
            mineralOutlier: simpleData.Zn_gdL_Outlier,
          };
          dataArray.push(statusData);
        });

        const filterByParamatersArray = dataArray.filter(
          (value) => value.areaName === 'Area6' && value.ageGenderGroup === 'WRA',
        );

        this.mineralData = filterByParamatersArray;
        this.generateTable();
        this.dataSource.paginator = this.paginator;
      });
  }

  private generateTable() {
    const n = this.mineralData.length;
    const dataArray = new Array<TableObject>();

    this.totalSamples = n;

    this.mineralData.forEach((data: BiomarkerStatusData) => {
      const tableObject: TableObject = {
        region: data.areaName,
        n: n,
        deficient: data.mineralLevelOne,
        confidence: data.mineralOutlier,
      };
      dataArray.push(tableObject);
    });

    this.dataSource = new MatTableDataSource(dataArray);
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<BiomarkerStatusDialogData>(BiomarkerStatusComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }

  private renderAllCharts() {
    this.initialiseBoxChart([
      this.randomBoxPlot(0, 100),
      this.randomBoxPlot(0, 20),
      this.randomBoxPlot(20, 70),
      this.randomBoxPlot(60, 100),
      this.randomBoxPlot(50, 100),
    ]);

    this.initialiseBarChart(this.getBarData('pod'), 'pod');
    this.initialiseBarChart(this.getBarData('poe'), 'poe');
    this.initialiseBarChart(this.getBarData('cde'), 'cde');
  }

  private getBarData(type: string): any {
    const barLabel = [
      'Central',
      'North',
      'South',
      'South East',
      'West',
      '15-19',
      '20-29',
      '30-39',
      'Urban',
      'Rural',
      'Poorest',
      'Poorer',
      'Middle',
      'Richer',
      'Richest',
      'Total',
    ];
    switch (type) {
      case 'pod':
        return {
          labels: ['Region', 'Age group', 'Residence', 'Wealth quintiles'],
          datasets: [
            {
              label: barLabel[0],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[1],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[2],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[3],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[4],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
          ],
        };

      case 'poe':
        return {
          labels: ['Region', 'Age group', 'Residence', 'Wealth quintiles'],
          datasets: [
            {
              label: barLabel[0],
              data: this.randomValues(4, 0, 100),
              borderColor: '#50AF5D',
              backgroundColor: '#50AF5D',
              fill: true,
            },
            {
              label: barLabel[1],
              data: this.randomValues(4, 0, 100),
              borderColor: '#50AF5D',
              backgroundColor: '#50AF5D',
              fill: true,
            },
            {
              label: barLabel[2],
              data: this.randomValues(4, 0, 100),
              borderColor: '#50AF5D',
              backgroundColor: '#50AF5D',
              fill: true,
            },
            {
              label: barLabel[3],
              data: this.randomValues(4, 0, 100),
              borderColor: '#50AF5D',
              backgroundColor: '#50AF5D',
              fill: true,
            },
            {
              label: barLabel[4],
              data: this.randomValues(4, 0, 100),
              borderColor: '#50AF5D',
              backgroundColor: '#50AF5D',
              fill: true,
            },
          ],
        };

      case 'cde':
        return {
          labels: ['Region', 'Age group', 'Residence', 'Wealth quintiles'],
          datasets: [
            {
              label: barLabel[0],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[1],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[2],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[3],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
            {
              label: barLabel[4],
              data: this.randomValues(4, 0, 100),
              borderColor: '#AF50A2',
              backgroundColor: '#AF50A2',
              fill: true,
            },
          ],
        };
      default:
        return null;
    }
  }

  private randomValues(count: number, min: number, max: number) {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
  }

  // Return the correct interface to dislpay outliers
  private randomBoxPlot(min: any, max: any) {
    const values = this.randomValues(5, min, max).sort((a, b) => a - b);

    return {
      min: values[0],
      q1: values[1],
      median: values[2],
      q3: values[3],
      max: values[4],
      outliers: Array(20)
        .fill(1)
        .map(() => Math.round(Math.random() * 120)),
    };
  }

  private initMap(dataPromise: Promise<SubRegionDataItem>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: SubRegionDataItem) => {
        this.temporaryData = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.errorSrc.next(false);
        this.areaFeatureCollection = data.geoJson;

        this.initialiseMapAbsolute(this.colourPalette);
        // this.initialiseMapThreshold(this.colourPalette);
        this.areaBounds = this.absoluteDataLayer.getBounds();

        // reset visited
        this.tabVisited.clear();
        // trigger current fit bounds
        // seems to need a small delay after page navigation to projections and back to baseline
        setTimeout(() => {
          this.triggerFitBounds(this.tabGroup.selectedIndex);
        }, 100); // for some reason needs a slightly longer delay than mapView.ts for trigger to work.
      })
      .catch(() => this.errorSrc.next(true))
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private triggerFitBounds(tabIndex: number): void {
    this.tabVisited.set(tabIndex, true);
    if (tabIndex === 0) {
      this.absoluteMap.fitBounds(this.areaBounds);
    }
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

  private getTooltip(feature: GeoJSON.Feature): string {
    const props = this.getFeatProps(feature);
    return `
    <div>
      Region:<b>${props.subregion_name}</b><br/>
      Absolute value: ${props.mn_absolute}${props.mn_absolute_unit}<br/>
      Threshold: ${props.mn_threshold}${props.mn_threshold_unit}<br/>
    </div>`;
  }

  private getFeatProps(feat: GeoJSON.Feature): SubRegionDataItemFeatureProperties {
    return feat.properties as SubRegionDataItemFeatureProperties;
  }

  private changeColourRamp(colourPalette: ColourPalette): void {
    const absoluteGradient = new ColourGradient(this.absoluteRange, colourPalette);
    // const thresholdGradient = new ColourGradient(this.thresholdRange, colourPalette);

    this.absoluteMap.removeLayer(this.absoluteDataLayer);
    // this.thresholdMap.removeLayer(this.thresholdDataLayer);

    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }
    if (null != this.thresholdLegend) {
      this.absoluteMap.removeControl(this.thresholdLegend);
    }

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      absoluteGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.absoluteMap);

    // this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
    // thresholdGradient.getColour(this.getFeatProps(feat).mn_threshold),
    // ).addTo(this.thresholdMap);

    this.refreshAbsoluteLegend(absoluteGradient);
    // this.refreshThresholdLegend(thresholdGradient);
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
  }
}
