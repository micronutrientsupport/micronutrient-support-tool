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
  public vegva = [];

  public labels = [];
  public bin = [];
  public frequency = [];

  private countryId: any;
  private micronutrientIds: any[];
  private populationIds: any;
  private micronutrientData: any = 2;

  public graph = {
    data: [
      {
        x: this.meatva,
        y: this.labels,
        type: 'scatter',
        name: 'Meat',
        mode: 'markers',
        marker: {
          color: 'red',
        },
        xaxis: { text: 'x Axis', color: 'black' },
      },
      {
        x: this.vegva,
        y: this.labels,
        type: 'scatter',
        name: 'Veg',
        mode: 'markers',
        marker: {
          color: 'yellow',
        },
        xaxis: { text: 'x Axis', color: 'black' },
      },
      {
        x: this.totalva,
        y: this.labels,
        type: 'scatter',
        name: 'Total',
        mode: 'markers',
        marker: {
          color: 'blue',
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
          text: 'Vitamin A from food groups (μg)',
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
          text: 'Bin',
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
      {
        label: 'Vitamin A from Veg',
        backgroundColor: 'yellow',
        data: this.vegva,
        pointBackgroundColor: 'yellow',
      },
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
    labels: this.bin,
    datasets: [
      {
        label: 'Frequency',
        data: this.frequency,
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
    });

    this.quickMapsService.micronutrientIdsObs.subscribe((mnIds) => {
      this.micronutrientIds = mnIds;
    });

    this.quickMapsService.popGroupIdObs.subscribe((popIds) => {
      this.populationIds = popIds;
      // call for update graph method
    });

    // consider moving out of ngOnInit:
    void this.currentDataService
      .getHouseholdHistogramData(this.countryId, this.micronutrientIds, this.populationIds, this.micronutrientData)
      .then((theData) => {
        const rawDataArray = theData[0].data;

        rawDataArray.forEach((item) => {
          this.bin.push(Number(item.bin));
          this.frequency.push(Number(item.frequency));
        });
      });

    void this.http.get('./assets/dummyData/trial_data_truncated.csv', { responseType: 'text' }).subscribe((data) => {
      const rawData = this.papa.parse(data, { header: true });
      const rawDataArray = rawData.data;

      rawDataArray.forEach((item) => {
        this.meatva.push(Number(item['va.meat']));
      });
      rawDataArray.forEach((item) => {
        this.vegva.push(Number(item['va.veg']));
      });
      rawDataArray.forEach((item) => {
        this.totalva.push(Number(item['va.supply']));
      });

      rawDataArray.forEach((item) => {
        this.labels.push(item.pc);
      });
    });

    //   void this.http
    //     .get('./assets/dummyData/household_histogram.json', { responseType: 'json' })
    //     .subscribe((data: any) => {
    //       console.log(data[0].data);
    //       const rawDataArray = data[0].data;

    //       rawDataArray.forEach((item) => {
    //         this.bin.push(Number(item.bin));
    //         this.frequency.push(Number(item.frequency));
    //       });

    //       console.log(this.frequency, this.bin);
    //       // rawDataArray.forEach((item) => {
    //       //   this.labels.push(item.pc);
    //       // });
    //     });
  }
  public openDialog(): void {
    void this.dialogService.openChartDialog(this.histograph);
  }
}
