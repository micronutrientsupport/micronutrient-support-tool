import { Component, OnInit } from '@angular/core';
import { MonthlyFoodGroups } from 'src/app/apiAndObjects/objects/monthlyFoodGroups';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
// import * as stacked100 from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-monthly-card',
  templateUrl: './monthlyCard.component.html',
  styleUrls: ['./monthlyCard.component.scss'],
})
export class MonthlyCardComponent implements OnInit {

  public rawData: MonthlyFoodGroups;
  public chartData;

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
  ) {


    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.currentDataService.getMonthlyFoodGroups(
        this.quickMapsService.countryId,
        [this.quickMapsService.micronutrientId],
        this.quickMapsService.popGroupId,
        this.quickMapsService.mndDataId
      )
        .then((data: MonthlyFoodGroups) => {
          this.rawData = data;
        })
        .catch((err) => console.error(err))
        .finally(() => this.initialiseGraph());
    });

    // void this.dictService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
    //   this.countriesDictionaryItem = dict;
    // });
  }

  ngOnInit(): void {

  }

  public initialiseGraph(): void {
    this.chartData = {
      type: 'bar',
      // plugins: {
      //   stacked100: { enable: true }
      // },
      data: {
        labels: ['Foo', 'Bar'],
        datasets: [
          { label: 'bad', data: [5, 25], backgroundColor: 'rgba(244, 143, 177, 0.6)' },
          { label: 'better', data: [15, 10], backgroundColor: 'rgba(255, 235, 59, 0.6)' },
          { label: 'good', data: [10, 8], backgroundColor: 'rgba(100, 181, 246, 0.6)' }
        ]
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        }
      }
    };
  }
}
