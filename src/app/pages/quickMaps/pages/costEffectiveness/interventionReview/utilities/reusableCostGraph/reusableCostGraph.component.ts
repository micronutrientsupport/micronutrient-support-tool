import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ArcElement, CategoryScale, Chart, ChartData, Color, Legend, PieController, TooltipItem } from 'chart.js';
import { StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { Tooltip } from 'chart.js';

@Component({
  selector: 'app-reusable-cost-graph',
  templateUrl: './reusableCostGraph.component.html',
  styleUrls: ['./reusableCostGraph.component.scss'],
})
export class ReusableCostGraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() costData: RecurringCost | StartUpScaleUpCost;
  @ViewChild('pieChart') public c1!: ElementRef<HTMLCanvasElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  public costChart: Chart<'pie'>;
  public chartColours: Array<Color> = ['#703aa3', '#1c0d31', '#dca9a7', '#763671', '#98557d', '#461e53'];
  public canRenderChart = true;
  private chartData: ChartData<'pie'>;

  ngOnInit(): void {
    this.initChartData();
    Chart.register(PieController, ArcElement, Legend, Tooltip, CategoryScale);
    Chart.defaults.font.family = 'Quicksand, sans-serif';
  }

  ngAfterViewInit(): void {
    if (null != this.chartData) {
      this.initialiseCostPieChart();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.costChart) {
      this.costChart.destroy();
    }
  }

  private initChartData(): void {
    const data = [];
    this.costData.costs.forEach((cost) => {
      let total = 0;
      Object.entries(cost).forEach(([key, value]) => {
        if (/year\dTotal/.test(key)) {
          total += Number(value);
        }
      });
      data.push(Number(Number(total).toFixed(2)));
    });

    this.canRenderChart = !data.every((item) => item === 0);

    const chartLabels = <Array<string>>[...new Set(this.costData.costs.map((item) => item.section))];
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: this.costData.category,
          data: data,
          backgroundColor: this.chartColours,
          hoverBorderColor: this.chartColours,
        },
      ],
    };
    this.chartData = chartData;
    console.log(chartLabels);
  }

  private initialiseCostPieChart() {
    // TODO: CHART DOESN'T RENDER WHEN ALL VALUES ARE ZERO
    if (this.c1) {
      const ctx = this.c1.nativeElement.getContext('2d');
      const generatedChart = new Chart(ctx, {
        type: 'pie',
        data: this.chartData,
        options: {
          devicePixelRatio: 2,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              onClick: () => {
                return null;
              },
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  const dataset = data.datasets[0];

                  if (data) {
                    return data.labels.map((label: string, i: number) => {
                      const value = dataset.data[i];
                      return {
                        index: i,
                        datasetIndex: i,
                        text:
                          label +
                          '(' +
                          Number(value).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: 'USD',
                          }) +
                          ')',
                        fillStyle: this.chartColours[i],
                        strokeStyle: this.chartColours[i],
                        hidden: chart.getDatasetMeta(i).hidden,
                      };
                    });
                  } else {
                    return [];
                  }
                },
              },
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems: TooltipItem<'pie'>[]) => {
                  return tooltipItems[0].label;
                },
                label: (tooltipItem: TooltipItem<'pie'>) => {
                  const datasetVal = tooltipItem.dataset.data[tooltipItem.dataIndex];
                  return datasetVal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });
                },
              },
              backgroundColor: '#fff',
              titleColor: '#000',
              titleFont: {
                size: 16,
              },
              bodyColor: '#000',
              bodyFont: {
                size: 16,
              },
              borderWidth: 1,
              borderColor: '#000',
            },
          },
        },
      });
      this.costChart = generatedChart;
    }
  }
}
