import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/interventionCostSummary';
// import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { Chart } from 'chart.js';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
@Component({
  selector: 'app-intervention-cost-summary-quick-total-graph',
  templateUrl: './graphTotal.component.html',
  styleUrls: ['./graphTotal.component.scss'],
})
export class InterventionCostSummaryQuickTotalGraphComponent implements AfterViewInit, OnDestroy {
  @Input() summaryCosts: InterventionCostSummary;
  @ViewChild('barChart') public c1!: ElementRef<HTMLCanvasElement>;

  public chartData: Chart;
  public chartPNG: string;
  public chartPDF: string;

  constructor(private qcService: QuickchartService, private interventionDataService: InterventionDataService) {}

  ngAfterViewInit(): void {
    this.initialiseGraph();
  }

  ngOnDestroy(): void {
    this.chartData.destroy();
  }

  // public openSectionCostReviewDialog(costs: RecurringCosts): void {
  // console.debug(costs);
  // }

  private initialiseGraph(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const discountedValues: any[] = Object.values(this.summaryCosts.summaryCostsDiscounted).splice(4, 10);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unDiscountedValues: any[] = Object.values(this.summaryCosts.summaryCosts).splice(4, 10);

    const ctx = this.c1.nativeElement.getContext('2d');
    const generatedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        datasets: [
          {
            label: 'Undiscounted',
            backgroundColor: () => '#809ec2',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            // data: unDiscountedValues,
            // fill: true,
          },
          {
            label: 'Discounted',
            backgroundColor: () => '#9c85c0',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            // data: discountedValues,
            // fill: true,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Total annual wheat flour fortification costs',
          },
          legend: {
            display: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            // id: 'x-axis-0',
          },
          y: {
            title: {
              display: true,
              text: 'Thousands of 2021 USD',
            },
            display: true,
            // id: 'y-axis-0',
          },
        },
      },
    });

    this.chartData = generatedChart;
    // const chartForRender: Chart = JSON.parse(JSON.stringify(generatedChart));
    // this.interventionDataService.setInterventionSummaryChartPNG(
    //   this.qcService.getChartAsImageUrl(chartForRender, 'png'),
    // );
    // this.interventionDataService.setInterventionSummaryChartPDF(
    //   this.qcService.getChartAsImageUrl(chartForRender, 'pdf'),
    // );
  }
}
