import { Component, Input, OnInit } from '@angular/core';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/interventionCostSummary';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
@Component({
  selector: 'app-intervention-cost-summary-quick-total-graph',
  templateUrl: './graphTotal.component.html',
  styleUrls: ['./graphTotal.component.scss'],
})
export class InterventionCostSummaryQuickTotalGraphComponent implements OnInit {
  @Input() summaryCosts: InterventionCostSummary;
  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;

  constructor(private qcService: QuickchartService, private interventionDataService: InterventionDataService) {}

  ngOnInit(): void {
    this.initialiseGraph();
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  private initialiseGraph(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const discountedValues: any[] = Object.values(this.summaryCosts.summaryCostsDiscounted).splice(4, 10);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unDiscountedValues: any[] = Object.values(this.summaryCosts.summaryCosts).splice(4, 10);

    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        datasets: [
          {
            label: 'Undiscounted',
            backgroundColor: () => '#809ec2',
            data: unDiscountedValues,
            fill: true,
          },
          {
            label: 'Discounted',
            backgroundColor: () => '#9c85c0',
            data: discountedValues,
            fill: true,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Total annual wheat flour fortification costs',
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },

        scales: {
          xAxes: [
            {
              display: true,
              id: 'x-axis-0',
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Thousands of 2021 USD',
              },

              display: true,
              id: 'y-axis-0',
            },
          ],
        },
      },
    };

    this.chartData = generatedChart;
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.interventionDataService.setInterventionSummaryChartPNG(
      this.qcService.getChartAsImageUrl(chartForRender, 'png'),
    );
    this.interventionDataService.setInterventionSummaryChartPDF(
      this.qcService.getChartAsImageUrl(chartForRender, 'pdf'),
    );
  }
}
