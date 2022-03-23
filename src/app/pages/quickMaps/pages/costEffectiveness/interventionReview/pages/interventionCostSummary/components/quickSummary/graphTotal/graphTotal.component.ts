import { Component, Input, OnInit } from '@angular/core';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
@Component({
  selector: 'app-intervention-cost-summary-quick-total-graph',
  templateUrl: './graphTotal.component.html',
  styleUrls: ['./graphTotal.component.scss'],
})
export class InterventionCostSummaryQuickTotalGraphComponent implements OnInit {
  @Input() recurringCost: RecurringCost;
  public chartData: ChartJSObject;

  ngOnInit(): void {
    this.initialiseGraph();
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  // TODO: This is dummy data until API calls are available to populate
  private initialiseGraph(): void {
    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        datasets: [
          {
            label: 'Undiscounted',
            backgroundColor: () => '#809ec2',
            data: [0, 2, 3, 2, 8, 9, 10, 11, 12, 13],
            fill: true,
          },
          {
            label: 'Discounted',
            backgroundColor: () => '#9c85c0',
            data: [0, 1.5, 2, 3, 9, 9.5, 10.5, 10, 10, 15],
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
    console.log(this.chartData);
  }
}
