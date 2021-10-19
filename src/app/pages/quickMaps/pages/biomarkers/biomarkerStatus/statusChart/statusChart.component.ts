/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { ChartjsComponent } from '@ctrl/ngx-chartjs';
import { BiomarkerDataType } from '../biomarkerStatus.component';

@Component({
  selector: 'app-status-chart',
  templateUrl: './statusChart.component.html',
  styleUrls: ['./statusChart.component.scss'],
})
export class StatusChartComponent implements AfterViewInit {
  @ViewChild('boxplot') boxPlot: ChartjsComponent;

  @Input() set biomarkerData(micronutrientName: string) {
    if (null != micronutrientName) {
      this.micronutirentName = micronutrientName;
    }
  }

  @Input() set selectedDataType(dataType: BiomarkerDataType) {
    if (null != dataType) {
      this.selectedOption = dataType.value;
    }
  }

  public selectedNutrient = '';
  public selectedOption;

  public boxChartData: ChartJSObject;
  public barChartData: ChartJSObject;

  public boxChartPNG: string;
  public boxChartPDF: string;
  public excessBarChartPNG: string;
  public excessBarChartPDF: string;
  public deficiencyBarChartPNG: string;
  public deficiencyBarChartPDF: string;
  public combinedBarChartPNG: string;
  public combinedBarChartPDF: string;

  public defThreshold = 20;
  public abnThreshold = 60;
  public showOutliers = true;
  public outlierControl = new FormControl(true);
  public micronutirentName: string;

  private outlierSet: any[] = [];

  constructor(private qcService: QuickchartService) {}

  ngAfterViewInit(): void {
    this.renderAllCharts();
    this.initialiseBoxChart([
      this.randomBoxPlot(0, 100),
      this.randomBoxPlot(0, 20),
      this.randomBoxPlot(20, 70),
      this.randomBoxPlot(60, 100),
      this.randomBoxPlot(50, 100),
    ]);
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
            label: this.micronutirentName,
            backgroundColor: () => 'rgba(0,220,255,0.5)',
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
}
