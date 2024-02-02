/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Chart, LinearScale, CategoryScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomarker';
import { AggregatedOutliers } from 'src/app/apiAndObjects/objects/biomarker/aggregatedOutliers';
import { AggregatedStats } from 'src/app/apiAndObjects/objects/biomarker/aggregatedStat';
import { TotalStats } from 'src/app/apiAndObjects/objects/biomarker/totalStats';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { Subscription } from 'rxjs';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { CardComponent } from 'src/app/components/card/card.component';
import { TitleCasePipe } from '@angular/common';
Chart.register(BoxPlotController, BoxAndWiskers);
@Component({
  selector: 'app-status-chart',
  templateUrl: './statusChart.component.html',
  styleUrls: ['./statusChart.component.scss'],
})
export class StatusChartComponent implements AfterViewInit {
  @ViewChild('boxplot') public c1!: ElementRef<HTMLCanvasElement>;
  @Input() biomarkerDataUpdating: boolean;
  @Input() card: CardComponent;

  @Input() set biomarkerData(micronutrientName: string) {
    if (null != micronutrientName) {
      this.micronutirentName = micronutrientName;
    }
  }

  public chartData: Chart;
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
  public outlierControl = new UntypedFormControl(true);
  public micronutirentName: string;

  public activeBiomarker: Biomarker;
  private subscriptions = new Array<Subscription>();
  public bmAggStats: Array<AggregatedStats>;
  public bmAggOutliers: Array<AggregatedOutliers>;
  public bmTotalStats: Array<TotalStats>;
  public labels: Array<number>;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';

  constructor(public quickMapsService: QuickMapsService, private titlecasePipe: TitleCasePipe) {}

  ngOnInit(): void {
    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.quickMapsService.micronutrient.obs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
      this.quickMapsService.ageGenderGroup.obs.subscribe((ageGenderGroup: AgeGenderDictionaryItem) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
      this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
        if (data) {
          this.activeBiomarker = data;
          this.bmAggStats = this.activeBiomarker.aggregatedStats;
          this.bmAggOutliers = this.activeBiomarker.aggregatedOutliers;
          this.bmTotalStats = this.activeBiomarker.totalStats;
          this.labels = this.activeBiomarker.binnedValues.binLabel;
          console.log('chart tab updated with data:', data);

          this.setChart();
        }
      }),
    );
  }

  private setChart() {
    if (this.chartData) {
      this.chartData.destroy();
    }

    const ctx = this.c1.nativeElement.getContext('2d');
    const generatedChart = new Chart(ctx, {
      type: 'boxplot',
      data: {
        labels: this.bmAggStats.map((a) => this.titlecasePipe.transform(a.aggregation)),
        datasets: [
          {
            label: `${this.selectedNutrient}`,
            backgroundColor: () => '#ff6384',
            borderColor: '#000000',
            outlierRadius: 4,
            data: this.bmAggStats.map((val, index) => ({
              min: val.minimum,
              q1: val.lowerQuartile,
              median: val.median,
              q3: val.upperQuartile,
              max: val.maximum,
              outliers: this.bmAggOutliers[index] ? this.bmAggOutliers[index].measurement : [],
            })),
          },
        ],
      },
      options: {
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: `${this.titlecasePipe.transform(this.quickMapsService.aggField.get().replace('_', ' '))}`,
            },
          },
          y: {
            title: {
              display: true,
              text: `Concentration of ${this.selectedNutrient} in microg/DI`,
            },
          },
        },
        plugins: {},
      },
    });
    this.chartData = generatedChart;
  }
}
