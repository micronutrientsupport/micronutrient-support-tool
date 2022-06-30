import { AnimationOptions, ChartData, TooltipItem, ChartOptions } from 'chart.js';
import { TopFoodSource } from '../topFoodSource';

export interface ChartsJSDataObject {
  labels?: Array<string | number>;
  datasets: Array<{
    data?: Array<unknown | string>;
    label?: string;
    backgroundColor?: (result?: ChartData) => string | Array<string>;
    borderColor?: string;
    outlierColor?: string;
    outlierRadius?: number;
    fill?: boolean;
    tree?: Array<TopFoodSource>;
    key?: string;
    groups?: Array<string>;
    groupLabels?: boolean;
    fontColor?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    hoverBorderColor?: string | Array<string>;
    hoverOffset?: number;
    hoverBorderWidth?: number;
    hoverBackgroundColor?: string;
    spacing?: number;
    borderWidth?: number;
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
    animation?: AnimationOptions;
    maintainAspectRatio?: boolean;
    responsive?: boolean;
    aspectRatio?: number;
    legend?: {
      display: boolean;
      position?: string;
      align?: string;
      labels?: {
        usePointStyle?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generateLabels?: (chart: any) => {
          text: string;
          fillStyle: string;
          strokeStyle: string;
          lineWidth: string;
          hidden: boolean;
          index: number;
        };
      };
      onClick?: (event) => unknown;
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
          ticks?: {
            min?: number;
            max?: number;
            stepSize?: number;
          };
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
      annotations: Array<{
        type: string;
        id?: string;
        mode: string;
        scaleID: string;
        value: number; // data-value at which the line is drawn
        borderWidth: number;
        borderColor: string;
        label: {
          enabled: boolean;
          content?: string;
          backgroundColor?: string;
        };
      }>;
    };
    tooltips?: {
      callbacks?: {
        title?: (item: TooltipItem, data: ChartData) => unknown;
        label?: (item: TooltipItem, result: ChartData) => string;
      };
      backgroundColor?: Array<string> | string;
      titleFontSize?: number;
      titleFontColor?: string;
      bodyFontColor?: string;
      bodyFontSize?: number;
      displayColors?: boolean;
      borderColor?: string;
      borderWidth?: number;
    };
  };
  plugins?: Array<unknown>;
}
