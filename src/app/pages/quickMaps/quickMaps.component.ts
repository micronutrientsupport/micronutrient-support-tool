import { Component } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-quick-maps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent {
  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupsDictionary: Dictionary;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public searchByCountry = true;
  public selectedCountry: DictionaryItem;
  public selectedRegion: DictionaryItem;
  public selectedMicronutrient: DictionaryItem;
  public selectedPopulateionGroup: DictionaryItem;

  constructor(dictionariesService: DictionaryService, private currentDataService: CurrentDataService) {
    dictionariesService
      .getDictionaries([
        DictionaryType.COUNTRIES,
        DictionaryType.REGIONS,
        DictionaryType.MICRONUTRIENTS,
        DictionaryType.POPULATION_GROUPS,
      ])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();
        this.popGroupsDictionary = dicts.shift();

        // test
        (this.selectedCountry = this.countriesDictionary.getItems()[0]),
          (this.selectedRegion = this.regionDictionary.getItems()[0]),
          (this.selectedMicronutrient = this.micronutrientsDictionary.getItems()[0]),
          (this.selectedPopulateionGroup = this.popGroupsDictionary.getItems()[0]),
          this.updateMicronutrientDataOptions();
      });
  }

  public updateMicronutrientDataOptions(): void {
    this.currentDataService
      .getMicronutrientDataOptions(
        this.searchByCountry ? this.selectedCountry : this.selectedRegion,
        this.selectedMicronutrient,
        this.selectedPopulateionGroup,
      )
      .then((options: Array<MicronutrientDataOption>) => {
        this.micronutrientDataOptions = options;
        console.log('MicronutrientDataOption', options);
      });
  }
}
