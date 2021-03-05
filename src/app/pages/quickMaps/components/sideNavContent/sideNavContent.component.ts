/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
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
  @Input() showGoButton: boolean;
  public readonly ROUTES = AppRoutes;
  public readonly MICRONUTRIENT_TYPE_ENUM = MicronutrientType;
  public readonly GEOGRAPHY_TYPE_ENUM = GeographyTypes;
  public errorReponse = ['Please select somthing', 'Please select a', 'Please select MND(s)'];
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public searchByCountry: boolean;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;

  public geographyOptionArray: Array<DictionaryItem>;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public quickMapsForm: FormGroup;

  public sideNavToggleLock = new FormControl(false);

  constructor(
    private fb: FormBuilder,
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
    private router: Router,
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
  ) {
    void dictionariesService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsForm = this.fb.group({
          nation: [this.quickMapsService.countryId, Validators.required],
          micronutrient: [this.quickMapsService.micronutrient, Validators.required],
          measure: [null, Validators.required], // to be initialized from service
          mndsData: [this.quickMapsService.mndDataId, Validators.required],
        });

        // watches changes so that reacts to location component selections
        this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
          this.quickMapsForm.get('nation').setValue(countryId);
        });

        // TODO: should setting these be dependant on query params?
        this.countryChange(GeographyTypes.COUNTRY);
        this.mndChange(MicronutrientType.VITAMIN);

        this.updateMicronutrientDataOptions();

        this.quickMapsForm.get('nation').valueChanges.subscribe((value: string) => {
          this.quickMapsService.setCountryId(value);
        });
        this.quickMapsForm.get('micronutrient').valueChanges.subscribe((value: MicronutrientDictionaryItem) => {
          this.quickMapsService.setMicronutrient(value);
          this.updateDataMeasureOptions();
          this.updateMicronutrientDataOptions();
        });
        this.quickMapsForm.get('mndsData').valueChanges.subscribe((value: string) => {
          this.quickMapsService.setMndDataId(value);
          const selectedItem = this.micronutrientDataOptions.find(option => option.id === value);
          if (null != selectedItem) {
            this.quickMapsService.setDataLevelOptions(selectedItem.dataLevelOptions);
          }
        });
      });

  }

  ngOnInit(): void { }

  public mndChange(type: MicronutrientType): void {
    this.selectMNDsFiltered = this.micronutrientsDictionary
      .getItems()
      .filter((micronutrientsDictionary: MicronutrientDictionaryItem) => micronutrientsDictionary.type === type);
  }

  public minimiseSideNav(): void {
    this.sideNavToggleLock.setValue((this.sideNavToggleLock.value === true) ? true : false);
    if (this.sideNavToggleLock.value === false) {
      this.quickMapsService.sideNavToggle();
    }
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

  public updateDataMeasureOptions(): void {
    
  }

  public updateMicronutrientDataOptions(): void {
    const country = this.countriesDictionary.getItem(this.quickMapsService.countryId);
    // const measure = this.quickMapsService.measure;
    const measure = true;

    if ((null != country) && (null != measure)) {

      void this.currentDataService
        .getMicronutrientDataOptions(
          country,
          MicronutrientMeasureType.DIET, // TODO: JON temp hardcoded, replace after dan code merge
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
    // console.warn(this.quickMapsForm.value);

    if (this.quickMapsForm.valid) {
      void this.router.navigate(AppRoutes.QUICK_MAPS_BASELINE.getRoute(), {
        queryParams: this.route.snapshot.queryParams,
      });
      this.minimiseSideNav();
    }
  }
}
