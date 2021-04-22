import { ChartAnimationOptions, ChartData, ChartTooltipItem } from 'chart.js';
import { TopFoodSource } from '../topFoodSource';

export interface ChartsJSDataObject {
  labels?: Array<string | number>;
  datasets: Array<{
    data?: Array<number | string>;
    label?: string;
    backgroundColor?: string;
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
}

export interface ChartJSObject {
  type: string;
  data: ChartsJSDataObject;
  options?: {
    title?: {
      display: boolean;
      text: string;
    };
    animation?: ChartAnimationOptions;
    maintainAspectRatio?: boolean;
    responsive?: boolean;
    legend?: {
      display: boolean;
      position?: string;
      align?: string;
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
      annotations: Array<
        {
          type: string;
          id: string;
          mode: string;
          scaleID: string;
          value: number; // data-value at which the line is drawn
          borderWidth: number;
          borderColor: string;
          outlierColor?: string;
          outlierRadius?: number;
          label: {
            enabled: boolean;
            content?: string;
            backgroundColor?: string;
          };
        }
      >;
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
