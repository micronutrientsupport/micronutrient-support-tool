import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-detailed-total-graph',
  templateUrl: './graphCosts.component.html',
  styleUrls: ['./graphCosts.component.scss'],
})
export class InterventionCostSummaryDetailedCostsGraphComponent implements OnInit {
  @Input() recurringCost: RecurringCost;
  public chartData: ChartJSObject;

  public dataSource = new MatTableDataSource<RecurringCosts>();
  public displayHeaders = [
    'section',
    'year0Total',
    'year1Total',
    'year2Total',
    'year3Total',
    'year4Total',
    'year5Total',
    'year6Total',
    'year7Total',
    'year8Total',
    'year9Total',
  ];

  constructor(private dialogService: DialogService) {}

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
            label: 'Premix',
            backgroundColor: () => '#809ec2',
            data: [0, 2, 3, 2, 8, 9, 10, 11, 12, 13],
            fill: true,
          },
          {
            label: 'Industry',
            backgroundColor: () => '#9c85c0',
            data: [0, 1.5, 2, 3, 9, 9.5, 15, 10, 10, 15],
            fill: true,
          },
          {
            label: 'Government',
            backgroundColor: () => '#f3a447',
            data: [0, 1.5, 7, 8, 13, 9.5, 10.5, 10, 10, 15],
            fill: true,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Annual undiscounted wheat flour fortification costs by activity',
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },

        scales: {
          xAxes: [
            {
              stacked: true,
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
