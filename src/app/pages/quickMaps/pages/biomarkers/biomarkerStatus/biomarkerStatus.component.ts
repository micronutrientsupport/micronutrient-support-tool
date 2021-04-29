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
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('map1') mapElement: ElementRef;
  @ViewChild('boxplot') boxplot: ChartjsComponent;
  @ViewChild('barchart') barchart: ChartjsComponent;

  @Input() card: CardComponent;

  public boxChartData: ChartJSObject;
  public barChartData: ChartJSObject;
  public title: string;
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
  public mineralData: Array<BiomarkerStatusData>;

  public boxChartPNG: string;
  public boxChartPDF: string;

  public excessBarChartPNG: string;
  public excessBarChartPDF: string;
  public deficiencyBarChartPNG: string;
  public deficiencyBarChartPDF: string;
  public combinedBarChartPNG: string;
  public combinedBarChartPDF: string;

  private biomarkerMap: L.Map;
  private subscriptions = new Array<Subscription>();
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  constructor(
    public quickMapsService: QuickMapsService,
    private http: HttpClient,
    private papa: Papa,
    private currentDataService: CurrentDataService,
    private qcService: QuickchartService,
    private dialogService: DialogService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<BiomarkerStatusDialogData>,
  ) {}
  ngAfterViewInit(): void {
    this.init();
    this.card.showExpand = true;
    this.biomarkerMap = this.initialiseMap(this.mapElement.nativeElement);
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));

    // Detect changes in quickmaps parameters:
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      const mnName = this.quickMapsService.micronutrient.name;
      const agName = this.quickMapsService.ageGenderGroup.name;
      const titlePrefix = (null == mnName ? '' : `${mnName}`) + ' Status';
      const titleSuffix = ' in ' + (null == agName ? '' : `${agName}`);
      this.title = titlePrefix + titleSuffix;
      if (null != this.card) {
        this.card.title = this.title;
      }
    });

    // Render all charts initially for download;
    this.renderAllCharts();
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
        title = `Prevalence of ${this.quickMapsService.micronutrient.name} deficiency`;
        break;
      case 'poe':
        title = `Prevalence of ${this.quickMapsService.micronutrient.name} excess`;
        break;
      case 'cde':
        title = `Combined prevalence of ${this.quickMapsService.micronutrient.name} deficiency and excess`;
        break;
    }
    title = title + ' per participants characteristics';

    this.barChartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: dataObj,
      },
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

    // Generate chart renders for download.
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

  // Show/remove outlier data on boxplot.
  public toggleShowOutlier(): void {
    this.showOutliers = this.outlierControl.value;
    if (!this.showOutliers) {
      this.boxChartData.data.datasets[0].data.forEach((data: any) => {
        console.log(data);
        // hide outliers
      });
    } else {
      // show outliers
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      this.biomarkerMap.invalidateSize();
    }
  }

  private init(): void {
    void this.http
      .get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' })
      .toPromise()
      .then((data: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const blob = this.papa.parse(data, { header: true }).data;
        const dataArray = new Array<BiomarkerStatusData>();

        console.log(this.quickMapsService.ageGenderGroup.id); // all; adult_women; adult_men; children

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

  // Capture value from data select dropdown.
  private dataSelected(value: any, origin: string) {
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
    switch (type) {
      case 'pod':
        return [
          {
            label: 'Deficiency',
            data: this.randomValues(6, 0, 100),
            borderColor: '#AF50A2',
            backgroundColor: '#AF50A2',
            fill: true,
          },
        ];
      case 'poe':
        return [
          {
            label: 'Excess',
            data: this.randomValues(6, 0, 100),
            borderColor: '#50AF5D',
            backgroundColor: '#50AF5D',
            fill: true,
          },
        ];
      case 'cde':
        return [
          {
            label: 'Deficiency',
            data: this.randomValues(6, 0, 100),
            borderColor: '#AF50A2',
            backgroundColor: '#AF50A2',
            fill: true,
          },
          {
            label: 'Excess',
            data: this.randomValues(6, 0, 100),
            borderColor: '#50AF5D',
            backgroundColor: '#50AF5D',
            fill: true,
          },
        ];
      default:
        return null;
    }
  }

  // Capture value from characteristic select dropdown in table tab.
  private charactersiticSelected(value: any) {
    this.selectedCharacteristic = value;
    console.log('charactersiticSelected');
    if (this.selectedOption) {
      // do something
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

  private initialiseMap(mapElement: HTMLElement): L.Map {
    const map = L.map(mapElement, {}).setView([6.6194073, 20.9367017], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  }
}
