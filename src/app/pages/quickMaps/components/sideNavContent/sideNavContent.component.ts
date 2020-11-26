/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { MiscApiService } from 'src/app/services/miscApi.service';
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

  public popGroupOptions = new Array<PopulationGroup>();

  public geographyOptionArray: Array<DictionaryItem>;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public quickMapsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
    private miscApiService: MiscApiService,
    private router: Router,
    private route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
  ) {
    void dictionariesService
      .getDictionaries([
        DictionaryType.COUNTRIES,
        DictionaryType.REGIONS,
        DictionaryType.MICRONUTRIENTS,
      ])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsForm = this.fb.group({
          nation: [this.quickMapsService.countryId, Validators.required],
          micronutrients: [this.quickMapsService.micronutrientIds, Validators.required],
          popGroup: [this.quickMapsService.popGroupId, Validators.required],
          mndsData: [this.quickMapsService.mndDataId, Validators.required],
        });

        this.countryChange(GeographyTypes.COUNTRY);
        this.mndChange(MicronutrientType.VITAMIN);

        this.updatePopulationGroupOptions();

        this.quickMapsForm.get('nation').valueChanges.subscribe((value: string) => {
          this.quickMapsService.setCountryId(value);
          this.updatePopulationGroupOptions();
        });
        this.quickMapsForm.get('micronutrients').valueChanges.subscribe((values: Array<string>) => {
          this.quickMapsService.setMicronutrientIds(values);
          this.updateMicronutrientDataOptions();
        });
        this.quickMapsForm.get('popGroup').valueChanges.subscribe((value: string) => {
          this.quickMapsService.setPopGroupId(value);
          this.updateMicronutrientDataOptions();
        });
        this.quickMapsForm.get('mndsData').valueChanges.subscribe((value: string) => {
          this.quickMapsService.setMndDataId(value);
        });
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

  public updatePopulationGroupOptions(): void {
    const country = this.countriesDictionary.getItem(this.quickMapsService.countryId);
    void ((null == country)
      ? Promise.resolve([])
      : this.miscApiService.getPopulationGroups(country, true))
      .then((options: Array<PopulationGroup>) => {
        this.popGroupOptions = options;
        // console.log('popGroupOptions', options);
        // if only one option, preselect
        if (1 === options.length) {
          this.quickMapsForm.get('popGroup').setValue(options[0].id);
        } else {
          this.updateMicronutrientDataOptions();
        }
      });
  }

  public updateMicronutrientDataOptions(): void {
    const country = this.countriesDictionary.getItem(this.quickMapsService.countryId);
    const microNutrients = this.micronutrientsDictionary.getItems(this.quickMapsService.micronutrientIds);
    const popGroup = this.popGroupOptions.find(item => (item.id === this.quickMapsService.popGroupId));

    if ((null != country)
      && (microNutrients.length > 0)
      && (null != popGroup)) {

      void this.currentDataService
        .getMicronutrientDataOptions(
          country,
          microNutrients,
          popGroup,
          true,
        )
        .then((options: Array<MicronutrientDataOption>) => {
          this.micronutrientDataOptions = options;
          // if only one option, preselect
          if (1 === options.length) {
            this.quickMapsForm.get('mndsData').setValue(options[0].id);
          }
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
