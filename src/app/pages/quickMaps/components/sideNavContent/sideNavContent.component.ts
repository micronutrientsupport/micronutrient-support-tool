/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';

@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent implements OnInit {
  public toolTips = [
    'some text exaplaining this form field',
    'some text exaplaining this form field',
    'some text exaplaining this form field',
    'some text exaplaining this form field',
  ];
  public errorReponse = ['Please select somthing', 'Please select a', 'Please select MND(s)'];
  public mndButtonToggleGroup = ['vitamin', 'mineral', 'other'];
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public searchByCountry: boolean;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupsDictionary: Dictionary;

  public nationSelectFormControlArray: Dictionary;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public selectedGeography: DictionaryItem;

  public quickMapsPopulationGroup: DictionaryItem;
  public quickMapsMicronutrientDataOptions: DictionaryItem;
  public quickMapsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
    private router: Router,
    public quickMapsService: QuickMapsService,
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
        this.selectedGeography = this.countriesDictionary.getItems()[0];
        this.quickMapsMicronutrientDataOptions = this.micronutrientsDictionary.getItems()[0];
        this.quickMapsPopulationGroup = this.popGroupsDictionary.getItems()[0];

        this.updatePopulationAndMicronutrients();
      });

    this.quickMapsForm = this.fb.group({
      nation: ['', Validators.required],
      mndsExploreComp: ['', Validators.required],
    });

    this.quickMapsForm.get('nation').valueChanges.subscribe((value: DictionaryItem) => {
      this.selectedGeography = value;
    });

  }

  ngOnInit(): void {
    this.nationSelectFormControlArray = this.countriesDictionary;
    this.selectMNDsFiltered = this.micronutrientsDictionary
      .getItems()
      .filter((micronutrientsDictionary: MicronutrientDictionaryItem) => micronutrientsDictionary.type === 'vitamin');
  }

  public mndChange(changeEvent: MatButtonToggleChange): void {
    this.selectMNDsFiltered = this.micronutrientsDictionary
      .getItems()
      .filter(
        (micronutrientsDictionary: MicronutrientDictionaryItem) => micronutrientsDictionary.type === changeEvent.value,
      );
  }

  public countryChange(geography: MatButtonToggleChange): void {
    if (geography.value === 'singleNation') {
      this.searchByCountry = true;
      this.nationSelectFormControlArray = this.countriesDictionary;
    } else {
      this.searchByCountry = false;
      this.nationSelectFormControlArray = this.regionDictionary;
    }
  }

  public updatePopulationAndMicronutrients(): void {
    void this.currentDataService
      .getMicronutrientDataOptions(
        this.selectedGeography,
        this.quickMapsPopulationGroup,
        this.quickMapsMicronutrientDataOptions,
      )
      .then((options: Array<MicronutrientDataOption>) => {
        this.micronutrientDataOptions = options;
        console.log('MicronutrientDataOption', options);
      });
  }

  // public closeSideNav(): void {
  //   this.quickMapsService.closeSideNav();
  // }

  public submitForm(): void {
    console.warn(this.quickMapsForm.value);
  }
}
