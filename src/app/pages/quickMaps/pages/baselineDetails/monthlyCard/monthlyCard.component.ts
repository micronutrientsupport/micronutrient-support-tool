import { Component, OnInit } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MonthlyFoodGroups } from 'src/app/apiAndObjects/objects/monthlyFoodGroups';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-monthly-card',
  templateUrl: './monthlyCard.component.html',
  styleUrls: ['./monthlyCard.component.scss'],
})
export class MonthlyCardComponent implements OnInit {
  public countriesDictionaryItem: Dictionary;

  constructor(private currentData: CurrentDataService, private dictService: DictionaryService) {
    void this.dictService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
      this.countriesDictionaryItem = dict;
    });

    // this.currentData;
    // .getMonthlyFoodGroups(this.countriesDictionaryItem, )
    // .then((data: MonthlyFoodGroups) => {})
    // .catch((err) => console.error(err));
  }

  ngOnInit(): void {}
}
