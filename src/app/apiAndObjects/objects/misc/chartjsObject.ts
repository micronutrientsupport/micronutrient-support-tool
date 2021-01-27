import { ChartData, ChartTooltipItem } from 'chart.js';
import { TopFoodSource } from '../topFoodSource';

export interface ChartJSObject {
  type: string;
  data: {
    labels?: Array<string | number>;
    datasets: Array<{
      data?: Array<number>;
      label?: string;
      backgroundColor?: () => string;
      borderColor?: string;
      fill?: boolean;
      tree?: Array<TopFoodSource>;
      key?: string;
      groups?: Array<string>;
      groupLabels?: boolean;
      fontColor?: string;
      fontFamily?: string;
      fontSize?: number;
      fontStyle?: string;
    }>;
  };
  options?: {
    maintainAspectRatio?: boolean;
    responsive?: boolean;
    legend?: {
      display: boolean;
    };
    scales?: {
      xAxes: [
        {
          id?: string;
          stacked?: boolean;
          display?: boolean;
          scaleLabel?: {
            display: boolean;
            labelString: string;
          };
        },
      ];
      yAxes: [
        {
          id?: string;
          stacked?: boolean;
          display?: boolean;
          scaleLabel?: {
            display: boolean;
            labelString: string;
          };
          barPercentage?: number;
          categoryPercentage?: number;
        },
      ];
    };
    annotation?: {
      annotations: [
        {
          type: string;
          id: string;
          mode: string;
          scaleID: string;
          value: number; // data-value at which the line is drawn
          borderWidth: number;
          borderColor: string;
          label: {
            enabled: boolean;
            content?: string;
          };
        },
      ];
    };
    tooltips?: {
      callbacks?: {
        title: () => string;
        label: (item: ChartTooltipItem, result: ChartData) => string;
      };
    };
  };
  plugins?: Array<unknown>;
}
