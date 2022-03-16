import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
@Component({
  selector: 'app-intervention-cost-summary-quick-total-graph',
  templateUrl: './graphTotal.component.html',
  styleUrls: ['./graphTotal.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionCostSummaryQuickTotalGraphComponent implements OnInit {
  @Input() recurringCost: RecurringCost;
  public chartData: ChartJSObject;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initialiseGraph();
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  private initialiseGraph(): void {
    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: {
        labels: ['Chocolate', 'Vanilla', 'Strawberry'],
        datasets: [
          {
            label: 'Blue',
            backgroundColor: () => '#ff9084',
            data: [3, 7, 4],
            fill: true,
          },
          {
            label: 'Red',
            backgroundColor: () => '#0220',
            data: [4, 3, 5],
            fill: true,
          },
          {
            label: 'Green',
            backgroundColor: () => '#ee2384',
            data: [7, 2, 6],
            fill: true,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'bing',
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },

        scales: {
          xAxes: [
            {
              // scaleLabel: {
              //   display: true,
              //   labelString: 'bong',
              // },
              display: true,
              id: 'x-axis-0',
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Count',
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
    // this.cdr.detectChanges();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    // this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    // this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }
}
