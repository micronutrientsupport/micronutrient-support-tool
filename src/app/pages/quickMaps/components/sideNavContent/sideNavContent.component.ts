/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';
import { GeographyTypes } from './geographyTypes.enum';

@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent implements OnInit {
  public readonly MICRONUTRIENT_TYPE_ENUM = MicronutrientType;
  public readonly GEOGRAPHY_TYPE_ENUM = GeographyTypes;
  public errorReponse = ['Please select somthing', 'Please select a', 'Please select MND(s)'];
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public searchByCountry: boolean;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupsDictionary: Dictionary;

  public geographyOptionArray: Array<DictionaryItem>;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public quickMapsMicronutrientDataOptions: DictionaryItem;
  public quickMapsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
    private router: Router,
    private route: ActivatedRoute,
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
        this.quickMapsMicronutrientDataOptions = this.micronutrientsDictionary.getItems()[0];

        this.quickMapsForm = this.fb.group({
          nation: [this.countriesDictionary.getItem(this.quickMapsService.countryId), Validators.required],
          micronutrients: [this.micronutrientsDictionary.getItems(this.quickMapsService.micronutrientIds), Validators.required],
          popGroup: [this.popGroupsDictionary.getItem(this.quickMapsService.popGroupId), Validators.required],
          mndsData: [null, Validators.required],
        });

        this.countryChange(GeographyTypes.COUNTRY);
        this.mndChange(MicronutrientType.VITAMIN);

        this.updatePopulationAndMicronutrients();

        this.quickMapsForm.get('nation').valueChanges.subscribe((value: DictionaryItem) => {
          this.quickMapsService.setCountryId(value.id);
          this.updatePopulationAndMicronutrients();
        });
        this.quickMapsForm.get('micronutrients').valueChanges.subscribe((values: Array<DictionaryItem>) => {
          this.quickMapsService.setMicronutrientIds(values.map(item => item.id));
          this.updatePopulationAndMicronutrients();
        });
        this.quickMapsForm.get('popGroup').valueChanges.subscribe((value: DictionaryItem) => {
          this.quickMapsService.setPopGroupId(value.id);
          this.updatePopulationAndMicronutrients();
        });
        // this.quickMapsForm.get('mndsData').valueChanges.subscribe((value: DictionaryItem) => {
        //   // this.quickMapsService.set(value.id);
        // });
      });
  }

  ngOnInit(): void {
  }

  public mndChange(type: MicronutrientType): void {
    this.selectMNDsFiltered = this.micronutrientsDictionary
      .getItems()
      .filter(
        (micronutrientsDictionary: MicronutrientDictionaryItem) => micronutrientsDictionary.type === type,
      );
  }

  public countryChange(type: GeographyTypes): void {
    if (type === GeographyTypes.COUNTRY) {
      this.searchByCountry = true;
      this.geographyOptionArray = this.countriesDictionary.getItems();
    } else {
      this.searchByCountry = false;
      this.geographyOptionArray = this.regionDictionary.getItems();
    }
  }

  public updatePopulationAndMicronutrients(): void {
    const country = this.countriesDictionary.getItem(this.quickMapsService.countryId);
    const microNutrients = this.micronutrientsDictionary.getItems(this.quickMapsService.micronutrientIds);
    const popGroup = this.popGroupsDictionary.getItem(this.quickMapsService.popGroupId);

    if ((null != country)
      && (microNutrients.length > 0)
      && (null != popGroup)) {

      void this.currentDataService
        .getMicronutrientDataOptions(
          country,
          microNutrients,
          popGroup,
        )
        .then((options: Array<MicronutrientDataOption>) => {
          this.micronutrientDataOptions = options;
          console.log('MicronutrientDataOption', options);
        });
    } else {
      // clear
      this.micronutrientDataOptions = [];
    }
  }

  // public closeSideNav(): void {
  //   this.quickMapsService.closeSideNav();
  // }

  public submitForm(): void {
    console.warn(this.quickMapsForm.value);

    if (this.quickMapsForm.valid) {
      void this.router.navigate(AppRoutes.QUICK_MAPS_BASELINE.getRoute(), {
        queryParams: this.route.snapshot.queryParams,
      });
    }
  }
}
