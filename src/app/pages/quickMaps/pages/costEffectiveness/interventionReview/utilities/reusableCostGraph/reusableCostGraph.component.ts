import { Component, Input, OnInit } from '@angular/core';
// import { ChartJSObject, ChartsJSDataObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { Chart } from 'chart.js';
import { StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';

@Component({
  selector: 'app-reusable-cost-graph',
  templateUrl: './reusableCostGraph.component.html',
  styleUrls: ['./reusableCostGraph.component.scss'],
})
export class ReusableCostGraphComponent implements OnInit {
  public costChart: Chart<'pie'>;
  @Input() costData: RecurringCost | StartUpScaleUpCost;

  public chartColours: Array<string> = ['#703aa3', '#1c0d31', '#dca9a7', '#763671', '#98557d', '#461e53'];

  ngOnInit(): void {
    if (null != this.costData) {
      this.initialiseCostPieChart(this.costData);
    }
  }

  private initialiseCostPieChart(costData) {
    const chartLabels = <Array<string>>[...new Set(costData.costs.map((item) => item.section))];

    // init the pie chart
    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: costData.category,
          data: [],
          // backgroundColor: () => this.chartColours,
          // hoverBorderColor: this.chartColours,
          // borderWidth: 0,
          // hoverBorderWidth: 3,
          // hoverOffset: 5,
        },
      ],
    };

    costData.costs.forEach((cost) => {
      let total = 0;
      Object.entries(cost).forEach(([key, value]) => {
        if (/year\dTotal/.test(key)) total += +value;
      });
      chartData.datasets[0].data.push(Number(total).toFixed(2));
    });

    const generatedChart = new Chart('pie-chart', {
      type: 'pie',
      data: chartData,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            onClick: () => {
              return null;
            },
            // labels: { // TODO: chart fix labels
            //   generateLabels: (chart) => {
            //     const data = chart.data;
            //     if (data.labels.length && data.datasets.length) {
            //       return data.labels.map(function (label, i) {
            //         const meta = chart.getDatasetMeta(0);
            //         const ds = data.datasets[0];
            //         const arc = meta.data[i];
            //         const custom = (arc && arc.custom) || {};
            //         const getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
            //         const arcOpts = chart.options.elements.arc;
            //         const fill = custom.backgroundColor
            //           ? custom.backgroundColor
            //           : getValueAtIndexOrDefault(ds.backgroundColor(), i, arcOpts.backgroundColor);
            //         const stroke = custom.borderColor
            //           ? custom.borderColor
            //           : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
            //         const bw = custom.borderWidth
            //           ? custom.borderWidth
            //           : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

            //         // value of the current label
            //         const value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];

            //         return {
            //           // add the value to the string
            //           text:
            //             label +
            //             ' (' +
            //             (+value).toLocaleString('en-US', {
            //               minimumFractionDigits: 2,
            //               maximumFractionDigits: 2,
            //               style: 'currency',
            //               currency: 'USD',
            //             }) +
            //             ')',
            //           fillStyle: fill,
            //           strokeStyle: stroke,
            //           lineWidth: bw,
            //           hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
            //           index: i,
            //         };
            //       });
            //     } else {
            //       return [];
            //     }
            //   },
            //   usePointStyle: true,
            // },
          },
          tooltip: {
            // callbacks: {
            //   title: (item: Chart.ChartTooltipItem, data: Chart.ChartData) => {
            //     return data.labels[item[0].index];
            //   },
            //   label: (item: Chart.ChartTooltipItem, data: Chart.ChartData) => {
            //     const dataset_value = data.datasets[item.datasetIndex].data[item.index];
            //     return (+dataset_value).toLocaleString('en-US', {
            //       minimumFractionDigits: 2,
            //       maximumFractionDigits: 2,
            //       style: 'currency',
            //       currency: 'USD',
            //     });
            //   },
            // },
            // backgroundColor: '#fff',
            // titleFontSize: 16,
            // titleFontColor: '#000',
            // bodyFontSize: 14,
            // bodyFontColor: '#000',
            // borderWidth: 1,
            // borderColor: '#000',
          },
        },
      },
    });

    this.costChart = generatedChart;
  }
}
