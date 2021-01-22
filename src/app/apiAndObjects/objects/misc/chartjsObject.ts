export interface ChartJSObject {
  type: string;
  data: {
    labels?: Array<string | number>;
    datasets: Array<{
      label: string;
      data: Array<number>;
      backgroundColor?: string;
      borderColor?: string;
      fill?: boolean;
    }>;
  };
  options?: {
    legend?: {
      display: boolean;
    };
    scales: {
      xAxes: [
        {
          id?: string;
          stacked?: boolean;
          display?: boolean;
          scaleLabel?: {
            display: boolean;
            labelString: string;
          };
        }
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
        }
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
        }
      ];
    };
  };
  plugins?: Array<unknown>;
}
