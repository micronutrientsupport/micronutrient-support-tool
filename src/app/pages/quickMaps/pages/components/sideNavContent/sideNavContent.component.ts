import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent implements OnInit {
  public geoInterest = 'some text exaplaining this form field';
  public mndsExploreComp = 'some text exaplaining this form field';
  public populationGroup = 'some text exaplaining this form field';
  public geoInterestToolTip = 'some text exaplaining this form field';
  public examples = ['example1', 'example2', 'exmpale3'];
  public generalResponse = 'Please select something';

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

  constructor(
    private fb: FormBuilder,
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
  ) {
    void dictionariesService
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
        this.selectedCountry = this.countriesDictionary.getItems()[0];
        this.selectedRegion = this.regionDictionary.getItems()[0];
        this.selectedMicronutrient = this.micronutrientsDictionary.getItems()[0];
        this.selectedPopulateionGroup = this.popGroupsDictionary.getItems()[0];

        this.updateMicronutrientDataOptions();
      });
  }

  quickMapsForm = this.fb.group({
    nation: [''],
    multiNation: [''],
    mndsExploreComp: ['', Validators.required],
    populationGroup: ['', Validators.required],
    microNutrientOptions: ['', Validators.required],
  });

  ngOnInit(): void {
    // console.log('countriesDicitionary', this.countriesDictionary);
  }

  public updateMicronutrientDataOptions(): void {
    void this.currentDataService
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

  public submitForm(): void {
    console.warn(this.quickMapsForm.value);
  }
}
