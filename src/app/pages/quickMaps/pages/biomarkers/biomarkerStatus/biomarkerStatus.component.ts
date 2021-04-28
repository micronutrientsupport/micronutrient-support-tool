/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from 'leaflet';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { CardComponent } from 'src/app/components/card/card.component';
import { FormControl } from '@angular/forms';
import { ChartjsComponent } from '@ctrl/ngx-chartjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MatMenu } from '@angular/material/menu';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { ColourPalette } from '../../../components/colourObjects/colourPalette';
import { ColourPaletteType } from '../../../components/colourObjects/colourPaletteType.enum';
import { ColourGradient, ColourGradientObject } from '../../../components/colourObjects/colourGradient';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';

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
  @ViewChild('map1') mapElement: ElementRef;
  @ViewChild('boxplot') boxplot: ChartjsComponent;
  @ViewChild('barchart') barchart: ChartjsComponent;
  @ViewChild('settingsMenu', { static: true }) menu: MatMenu;


  public boxChartData: ChartJSObject;
  public barChartData: ChartJSObject;
  public dialogData: any;
  public title: string;
  public displayedColumns = ['a', 'b', 'c', 'd'];
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
    { name: 'Concentration Data', value: 'cda' }
  ];

  public characteristicList: any[] = [
    { name: 'Regions', value: 'reg' },
    { name: 'Residence', value: 'res' },
    { name: 'Age group', value: 'age' },
    { name: 'Wealth Quintiles', value: 'qui' },
    { name: 'All characteristics', value: 'all' },
    { name: 'Total', value: 'tot' }
  ];
  public totalSamples = 6587;
  public selectedOption: any;
  public selectedCharacteristic: any;
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
  private defaultPalette = ColourPalette.PALETTES.find((value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN);
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
  //

  private biomarkerMap: L.Map;
  // private currentChartData: ChartJSObject;
  private subscriptions = new Array<Subscription>();

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  constructor(
    public quickMapsService: QuickMapsService,
    private currentDataService: CurrentDataService,
    private qcService: QuickchartService,
    private dialogService: DialogService,
  ) {
    this.colourPalette = ColourPalette.getSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }
  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.mapElement.nativeElement);
    // this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);

    // Detect changes in quickmaps parameters:
    this.quickMapsService.parameterChangedObs.subscribe(() => {

      const mnName: string = this.quickMapsService.micronutrient.name;
      const agName: string = this.quickMapsService.ageGenderGroup.name;
      const titlePrefix = (null == mnName ? '' : `${mnName}`) + ' Status';
      const titleSuffix = ' in ' + (null == agName ? '' : `${agName}`);
      this.title = titlePrefix + titleSuffix;
      if (null != this.card) {
        this.card.title = this.title;
      }

    });

    this.card.showExpand = true;
    this.card.showSettingsMenu = true;
    this.card.matMenu = this.menu;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
    // this.biomarkerMap = this.initialiseMap(this.mapElement.nativeElement);

    this.initialiseBoxChart([
      this.randomBoxPlot(0, 100),
      this.randomBoxPlot(0, 20),
      this.randomBoxPlot(20, 70),
      this.randomBoxPlot(60, 100),
      this.randomBoxPlot(50, 100),
    ]);

    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.init(
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public initialiseBoxChart(data: any): void {
    this.boxChartData = {
      plugins: [ChartAnnotation],
      type: 'boxplot',
      data: {
        labels: ['Central', 'North', 'South', 'South East', 'West'],
        datasets: [
          {
            label: 'Zinc',
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            outlierColor: 'rgba(0,0,0,0.2)',
            outlierRadius: 3,
            data: data,
          }
        ]
      },
      options: {
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
                backgroundColor: 'rgba(255,0,0,0.8)'
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
                backgroundColor: 'rgba(0,0,255,0.8)'
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
  public initialiseBarChart(dataObj: any): void {
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
          text: 'Prevalence of Zinc deficiency per participants\' characteristics',
        },
        maintainAspectRatio: false,
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
    this.excessBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.excessBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');

    this.deficiencyBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.deficiencyBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');

    this.combinedBarChartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.combinedBarChartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  // Show/remove outlier data on boxplot.
  public toggleShowOutlier(): void {
    this.showOutliers = this.outlierControl.value;
    if (!this.showOutliers) {
      this.boxChartData.data.datasets[0].data.forEach((data: any) => {
        console.log('remove', data);
        // this.boxplot.updateChart();
      });
    } else {
      //   this.currentChartData.data.datasets[0].data.forEach((data: any, idx: number) => {
      //     console.log('put back', data, idx);
      //     this.boxplot.updateChart();
      //   });
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      // this.biomarkerMap.invalidateSize(); // TODO: add again
    }
  }

  public openMapSettings(): void {
    void this.dialogService.openMapSettingsDialog(BiomarkerStatusComponent.COLOUR_PALETTE_ID)
      .then(() => {
        this.colourPalette = ColourPalette.getSelectedPalette(BiomarkerStatusComponent.COLOUR_PALETTE_ID);
        if (null == this.colourPalette) {
          this.colourPalette = this.defaultPalette;
        }
        this.changeColourRamp(this.colourPalette);
      });
  }

  // Capture value from data select dropdown.
  private dataSelected(value: any, origin: string) {
    this.selectedOption = value;
    switch (origin) {
      case 'map': break;
      case 'table': break;
      case 'chart':
        const barData = this.getBarData(value);
        this.initialiseBarChart(barData);
        break;
    }
  }

  private getBarData(type: string): any {
    switch (type) {
      case 'pod': return [{
        label: 'Deficiency',
        data: this.randomValues(6, 0, 100),
        borderColor: '#AF50A2',
        backgroundColor: '#AF50A2',
        fill: true,
      }];
      case 'poe': return [{
        label: 'Excess',
        data: this.randomValues(6, 0, 100),
        borderColor: '#50AF5D',
        backgroundColor: '#50AF5D',
        fill: true,
      }];
      case 'cde': return [
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
      default: return null;
    }
  }

  // Capture value from characteristic select dropdown in table tab.
  private charactersiticSelected(value: any) {
    this.selectedCharacteristic = value;
    console.log(value);
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
    const values = this.randomValues(6, min, max).sort((a, b) => a - b);

    return {
      min: values[0],
      q1: values[1],
      median: values[2],
      q3: values[3],
      max: values[4],
      outliers: Array(20).fill(1).map(() => Math.round(Math.random() * 120))
    };
  }

  private init(dataPromise: Promise<SubRegionDataItem>): void {
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
        // this.tabVisited.clear();
        // trigger current fit bounds
        // seems to need a small delay after page navigation to projections and back to baseline
        setTimeout(() => {
          // this.triggerFitBounds(this.tabGroup.selectedIndex);
        }, 0);
      })
      .catch(() => this.errorSrc.next(true))
      .finally(() => {
        this.loadingSrc.next(false);
        // this.cdr.detectChanges();
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
