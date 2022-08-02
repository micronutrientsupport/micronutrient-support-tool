import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import ColorHash from 'color-hash-ts';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-intervention-cost-summary-detailed-total-graph',
  templateUrl: './graphCosts.component.html',
  styleUrls: ['./graphCosts.component.scss'],
})
export class InterventionCostSummaryDetailedCostsGraphComponent implements OnInit {
  @Input() recurringCost: Array<RecurringCost>;

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

  constructor(private qcService: QuickchartService, private interventionDataService: InterventionDataService) {}

  ngOnInit(): void {
    if (null != this.recurringCost) {
      this.initialiseGraph();
    }
  }

  // public openSectionCostReviewDialog(costs: RecurringCosts): void {
  //   console.debug(costs);
  // }

  private initialiseGraph(): void {
    const timePeriod = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    const yearlyChartData = {
      labels: timePeriod,
      datasets: [],
    };

    this.recurringCost.forEach((rc: RecurringCost) => {
      rc.costs.forEach((data: RecurringCosts) => {
        yearlyChartData.datasets.push({
          label: data.section,
          data: [
            data.year0Total,
            data.year1Total,
            data.year2Total,
            data.year3Total,
            data.year4Total,
            data.year5Total,
            data.year6Total,
            data.year7Total,
            data.year8Total,
            data.year9Total,
          ],
          backgroundColor: this.genColorHex(data.section),
        });
      });
    });

    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: yearlyChartData,
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
            },
          ],
          yAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Thousands of 2021 USD',
              },

              display: true,
            },
          ],
        },
      },
    };

    this.chartData = generatedChart;
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.interventionDataService.setInterventionDetailedChartPNG(
      this.qcService.getChartAsImageUrl(chartForRender, 'png'),
    );
    this.interventionDataService.setInterventionDetailedChartPDF(
      this.qcService.getChartAsImageUrl(chartForRender, 'pdf'),
    );
  }

  private genColorHex(foodTypeIndex: string) {
    const colorHash = new ColorHash();
    return colorHash.hex(foodTypeIndex);
  }
}
