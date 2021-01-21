export interface ChartJSObject {
  type: string;
  data: {
    labels?: Array<string>;
    datasets: Array<{
      label: string;
      data: Array<number>;
      backgroundColor?: string;
    }>;
  };
  options?: {
    scales: {
      xAxes: [
        {
          stacked?: boolean;
          scaleLabel?: {
            display: boolean;
            labelString: string;
          };
        }
      ];
      yAxes: [
        {
          stacked?: boolean;
          scaleLabel?: {
            display: boolean;
            labelString: string;
          };
          barPercentage?: number;
          categoryPercentage?: number;
        }
      ];
    };
  };
}
