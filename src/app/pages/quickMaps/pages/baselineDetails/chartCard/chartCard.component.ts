/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chartCard.component.html',
  styleUrls: ['./chartCard.component.scss'],
})
export class ChartCardComponent implements OnInit {
  public meatva = [];
  public totalva = [];
  public labels = [];
  public bin = [];
  public frequency = [];

  private countryId: any;
  private micronutrientIds: any[];
  private populationIds: any;
  private micronutrientData: any = 2;
  ƒ;

  public graph = {
    data: [
      {
        x: this.meatva,
        y: this.labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: 'red',
        },
        xaxis: { text: 'x Axis', color: 'black' },
      },
    ],
    layout: {
      // autosize: false,
      height: 270,
      yaxis: {
        title: {
          text: 'People per Household',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
      },
      xaxis: {
        title: {
          text: 'Vitamin A from Meat (μg)',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
      },
    },
  };

  // histo
  public histograph = {
    data: [
      {
        x: this.bin,
        y: this.frequency,
        type: 'bar',
        mode: 'markers',
        marker: {
          color: 'red',
        },
        xaxis: { text: 'x Axis', color: 'black' },
      },
    ],
    layout: {
      autosize: true,
      height: 270,
      yaxis: {
        scaleLabel: {
          display: true,
          labelString: 'hello',
        },
        title: {
          text: 'Frequency',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
      },
      xaxis: {
        title: {
          text: 'Bin size',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
        // ticks: 'outside',
        // tick0: 0,
        dtick: 250,
        // ticklen: 8,
        tickwidth: 0.25,
        // tickcolor: '#000'
      },
    },
  };

  // chartjs
  public graphStyle = {
    display: 'block',
    color: '#098',
  };

  public data = {
    labels: this.labels,
    datasets: [
      // {
      //   label: 'People per Household',
      //   data: this.labels,
      // },
      {
        label: 'Vitamin A from Meat',
        backgroundColor: 'red',
        data: this.meatva,
        pointBackgroundColor: 'red',
      },
      {
        label: 'Total Vitamin A',
        backgroundColor: 'blue',
        data: this.totalva,
        pointBackgroundColor: 'blue',
      },
    ],
  };

  public histoGraphStyle = {
    display: 'block',
    color: '#098',
  };

  public jsdata = {
    labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
    datasets: [
      {
        label: 'Frequency',
        data: this.frequency,
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
      },
      {
        label: 'bin',
        data: this.bin,
        backgroundColor: 'blue',
        pointBackgroundColor: 'blue',
      },
    ],
  };

  constructor(
    private http: HttpClient,
    private papa: Papa,
    private dialogService: DialogService,
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
  ) {}

  ngOnInit(): void {
    this.quickMapsService.countryIdObs.subscribe((cId) => {
      this.countryId = cId;
      this.plotHistogramData();
    });

    this.quickMapsService.micronutrientIdsObs.subscribe((mnIds) => {
      this.micronutrientIds = mnIds;
      this.plotHistogramData();
    });

    this.quickMapsService.popGroupIdObs.subscribe((popIds) => {
      this.populationIds = popIds;
      this.plotHistogramData();
    });

    void this.http.get('./assets/dummyData/trial_data_truncated.csv', { responseType: 'text' }).subscribe((data) => {
      const rawData = this.papa.parse(data, { header: true });
      const rawDataArray = rawData.data;

      rawDataArray.forEach((item) => {
        this.meatva.push(Number(item['va.meat']));
        this.totalva.push(Number(item['va.supply']));
        this.labels.push(item.pc);
      });
    });
  }

  private plotHistogramData(): void {
    if (this.countryId && this.micronutrientIds && this.populationIds && this.micronutrientData) {
      void this.currentDataService
        .getHouseholdHistogramData(this.countryId, this.micronutrientIds, this.populationIds, this.micronutrientData)
        .then((theData) => {
          const rawDataArray = theData[0].data;
          rawDataArray.forEach((item) => {
            this.bin.push(Number(item.bin));
            this.frequency.push(Number(item.frequency));
          });
        });
    }
  }

  public openDialog(): void {
    void this.dialogService.openChartDialog(this.histograph);
  }
}
