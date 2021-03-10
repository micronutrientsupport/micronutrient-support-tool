/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';
import { GeographyTypes } from './geographyTypes.enum';
@Unsubscriber('subscriptions')
@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent implements OnInit {
  @Input() showGoButton: boolean;
  public readonly ROUTES = AppRoutes;
  public readonly MICRONUTRIENT_TYPE_ENUM = MicronutrientType;
  public readonly MICRONUTRIENT_MEASURE_TYPE_ENUM = MicronutrientMeasureType;
  public readonly GEOGRAPHY_TYPE_ENUM = GeographyTypes;
  public errorReponse = ['Please select somthing', 'Please select a', 'Please select MND(s)'];
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public searchByCountry: boolean;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;

  public measureDietEnabled = false;
  public measureBiomarkerEnabled = false;

  public geographyOptionArray: Array<DictionaryItem>;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public quickMapsForm: FormGroup;

  public sideNavToggleLock = new FormControl(false);

  private subscriptions = new Array<Subscription>();

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
          nation: [this.quickMapsService.country, Validators.required],
          micronutrient: [this.quickMapsService.micronutrient, Validators.required],
          measure: [this.quickMapsService.measure, Validators.required], // to be initialized from service
          mndsData: [this.quickMapsService.mndDataOption, Validators.required],
        });

        // watches changes so that reacts to location component selections
        this.subscriptions.push(
          this.quickMapsService.countryObs.subscribe(country => this.quickMapsForm.get('nation').setValue(country))
        );

        // TODO: should setting these be dependant on query params?
        this.countryChange(GeographyTypes.COUNTRY);
        this.mndChange(MicronutrientType.VITAMIN);

        this.updateDataMeasureOptions();
        this.updateMicronutrientDataOptions();

        this.subscriptions.push(
          this.quickMapsForm.get('nation').valueChanges.subscribe((value: CountryDictionaryItem) => {
            this.quickMapsService.setCountry(value);
            this.updateMicronutrientDataOptions();
          })
        );
        this.subscriptions.push(
          this.quickMapsForm.get('micronutrient').valueChanges.subscribe((value: MicronutrientDictionaryItem) => {
            this.quickMapsService.setMicronutrient(value);
            this.updateDataMeasureOptions();
          })
        );
        this.subscriptions.push(
          this.quickMapsForm.get('measure').valueChanges.subscribe((value: MicronutrientMeasureType) => {
            this.quickMapsService.setMeasure(value);
            this.updateMicronutrientDataOptions();
          })
        );
        this.subscriptions.push(
          this.quickMapsForm.get('mndsData').valueChanges.subscribe((value: MicronutrientDataOption) => {
            this.quickMapsService.setMndDataOption(value);
            if (null != value) {
              if (!value.dataLevelOptions.includes(this.quickMapsService.dataLevel)) {
                this.quickMapsService.setDataLevel(value.dataLevelOptions[0]);
              }
            }
          })
        );
      });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.quickMapsService.measureObs.subscribe(() => {
        if (!this.showGoButton) {
          // delay to let the query params update first, otherwise
          // the navigation gets cancelled
          setTimeout(() => {
            this.navigate();
          }, 100);
        }
      })
    );
  }

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
    const micronutrient = this.quickMapsService.micronutrient;

    this.measureDietEnabled = ((null != micronutrient) && micronutrient.isDiet);
    this.measureBiomarkerEnabled = ((null != micronutrient) && micronutrient.isBiomarker);

    const measureControl = this.quickMapsForm.get('measure');
    const initialMeasure = measureControl.value as MicronutrientMeasureType;

    // there's got to be a nicer way to do all of this :-(
    if (null == initialMeasure) {
      // if nothing selected, select first enabled one
      if (this.measureDietEnabled) {
        measureControl.setValue(MicronutrientMeasureType.DIET);
      } else if (this.measureBiomarkerEnabled) {
        measureControl.setValue(MicronutrientMeasureType.BIOMARKER);
      }
    } else if ((!this.measureDietEnabled) && (!this.measureBiomarkerEnabled)) {
      // nothing enabled, set value to null
      measureControl.setValue(null);

    } else { // if disabled item selected, change it.
      if (!this.measureDietEnabled && (initialMeasure === MicronutrientMeasureType.DIET)) {
        measureControl.setValue(MicronutrientMeasureType.BIOMARKER);
      } else if (!this.measureBiomarkerEnabled && (initialMeasure === MicronutrientMeasureType.BIOMARKER)) {
        measureControl.setValue(MicronutrientMeasureType.DIET);
      }
    }
  }

  public updateMicronutrientDataOptions(): void {
    const country = this.quickMapsService.country;
    const measure = this.quickMapsService.measure;

    if ((null != country) && (null != measure)) {

      void this.currentDataService
        .getMicronutrientDataOptions(
          country,
          measure,
          true,
        )
        .then((options: Array<MicronutrientDataOption>) => {
          this.micronutrientDataOptions = options;
          // if only one option, preselect
          if (1 === options.length) {
            this.quickMapsForm.get('mndsData').setValue(options[0]);
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
      this.navigate(true);
    }
  }

  private navigate(minimiseSideNav = false): void {
    const route = (this.quickMapsService.measure === MicronutrientMeasureType.DIET)
      ? AppRoutes.QUICK_MAPS_BASELINE
      : AppRoutes.QUICK_MAPS_BIOMARKER;

    // console.debug('navigate', this.quickMapsService.measure, route);
    void this.router.navigate(route.getRoute(), {
      queryParams: this.route.snapshot.queryParams,
    });
    if (minimiseSideNav) {
      this.minimiseSideNav();
    }
  }
}
