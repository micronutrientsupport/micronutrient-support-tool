/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';
import { DataSource } from 'src/app/apiAndObjects/objects/dataSource';

import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';
import { QuickMapsRouteGuardService } from '../../quickMapsRouteGuard.service';
import { GeographyTypes } from './geographyTypes.enum';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
@Unsubscriber('subscriptions')
@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent implements OnInit {
  @Input() showGoButton: boolean; // indicates if we're on the location select page or not
  public readonly ROUTES = AppRoutes;
  public readonly MICRONUTRIENT_TYPE_ENUM = MicronutrientType;
  public readonly MICRONUTRIENT_MEASURE_TYPE_ENUM = MicronutrientMeasureType;
  public readonly GEOGRAPHY_TYPE_ENUM = GeographyTypes;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public ageGenderGroupsDictionary: Dictionary;

  public measureDietEnabled = false;
  public measureBiomarkerEnabled = false;

  public selectedGeographyType: GeographyTypes;
  public selectedMndType: MicronutrientType;

  public geographyOptionArray: Array<DictionaryItem>;
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public dataSources = new Array<DataSource>();

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
    public routeGuardService: QuickMapsRouteGuardService,
  ) {
    void dictionariesService
      .getDictionaries([
        DictionaryType.COUNTRIES,
        DictionaryType.REGIONS,
        DictionaryType.MICRONUTRIENTS,
        DictionaryType.AGE_GENDER_GROUPS,
      ])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();
        this.ageGenderGroupsDictionary = dicts.shift();

        this.quickMapsForm = this.fb.group({
          nation: [this.quickMapsService.country, Validators.required],
          micronutrient: [this.quickMapsService.micronutrient, Validators.required],
          measure: [this.quickMapsService.measure, Validators.required], // to be initialized from service
          dataSource: [this.quickMapsService.dataSource, Validators.required],
          ageGenderData: [
            this.quickMapsService.ageGenderGroup,
            (control: AbstractControl) => this.ageGenderRequiredValidator(control),
          ],
        });

        this.subscriptions.push(
          this.quickMapsService.countryObs.subscribe((value) => {
            const geographyType = this.regionDictionary.getItems().includes(value)
              ? GeographyTypes.REGION
              : GeographyTypes.COUNTRY;
            // really only used on first load to pre-select correct type
            this.geographyTypeChange(geographyType);
            // reacts to changes from location component selections
            this.quickMapsForm.get('nation').setValue(value);
          }),
        );
        this.subscriptions.push(
          this.quickMapsService.micronutrientObs.subscribe((value) => {
            // really only used on first load to pre-select correct type
            const mndType = null != value ? value.type : MicronutrientType.VITAMIN;
            this.mndChange(mndType);
          }),
        );

        this.subscriptions.push(
          this.quickMapsForm.get('nation').valueChanges.subscribe((value: CountryDictionaryItem) => {
            this.quickMapsService.setCountry(value);
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('micronutrient').valueChanges.subscribe((value: MicronutrientDictionaryItem) => {
            this.quickMapsService.setMicronutrient(value);
            this.updateDataMeasureOptions();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('measure').valueChanges.subscribe((value: MicronutrientMeasureType) => {
            this.quickMapsService.setMeasure(value);
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('ageGenderData').valueChanges.subscribe((value: AgeGenderDictionaryItem) => {
            this.quickMapsService.setAgeGenderGroup(value);
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('dataSource').valueChanges.subscribe((value: DataSource) => {
            this.quickMapsService.setDataSource(value);
            if (null == value) {
              this.quickMapsService.setDataLevel(null);
            } else if (!value.dataLevelOptions.includes(this.quickMapsService.dataLevel)) {
              this.quickMapsService.setDataLevel(value.dataLevelOptions[0]);
            }
          }),
        );

        this.updateDataMeasureOptions();
      });
  }

  ngOnInit(): void {
    // If selections are made that invalidates the current page, navigate
    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        // only if not showing the "view results" button (on location select page)
        if (!this.showGoButton) {
          this.checkCurrentRouteValid();
        }
      }),
    );
  }

  public mndChange(type: MicronutrientType): void {
    if (type !== this.selectedMndType) {
      this.selectedMndType = type;

      this.selectMNDsFiltered = this.micronutrientsDictionary
        .getItems()
        .filter((micronutrientsDictionary: MicronutrientDictionaryItem) => micronutrientsDictionary.type === type)
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    }
  }

  public minimiseSideNav(): void {
    this.sideNavToggleLock.setValue(this.sideNavToggleLock.value === true ? true : false);
    if (this.sideNavToggleLock.value === false) {
      this.quickMapsService.sideNavToggle();
    }
  }

  public geographyTypeChange(type: GeographyTypes): void {
    if (type !== this.selectedGeographyType) {
      this.selectedGeographyType = type;

      this.geographyOptionArray = (type === GeographyTypes.COUNTRY ? this.countriesDictionary : this.regionDictionary)
        .getItems()
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    }
  }

  public submitForm(): void {
    if (this.quickMapsForm.valid) {
      this.navigate(
        this.quickMapsService.measure === MicronutrientMeasureType.DIET
          ? AppRoutes.QUICK_MAPS_BASELINE
          : AppRoutes.QUICK_MAPS_BIOMARKER,
      );
      this.minimiseSideNav();
    }
  }

  private ageGenderRequiredValidator(ageGenderControl: AbstractControl): ValidationErrors {
    let valid = true;
    if (null != this.quickMapsForm) {
      const measureControl = this.quickMapsForm.get('measure');
      valid = measureControl.value === MicronutrientMeasureType.DIET || null != ageGenderControl.value;
    }
    return valid ? null : { ageGender: 'required' };
  }

  private updateDataMeasureOptions(): void {
    const micronutrient = this.quickMapsService.micronutrient;

    this.measureDietEnabled = null != micronutrient && micronutrient.isDiet;
    this.measureBiomarkerEnabled = null != micronutrient && micronutrient.isBiomarker;

    const measureControl = this.quickMapsForm.get('measure');
    const currentMeasure = measureControl.value as MicronutrientMeasureType;

    let requiredMeasureValue = currentMeasure;
    // there's got to be a nicer way to do all of this :-(
    if (null == currentMeasure) {
      // if nothing selected, select first enabled one
      if (this.measureDietEnabled) {
        requiredMeasureValue = MicronutrientMeasureType.DIET;
      } else if (this.measureBiomarkerEnabled) {
        requiredMeasureValue = MicronutrientMeasureType.BIOMARKER;
      }
    } else if (!this.measureDietEnabled && !this.measureBiomarkerEnabled) {
      // nothing enabled, set value to null
      requiredMeasureValue = null;
    } else {
      // if disabled item selected, change it.
      if (!this.measureDietEnabled && currentMeasure === MicronutrientMeasureType.DIET) {
        requiredMeasureValue = MicronutrientMeasureType.BIOMARKER;
      } else if (!this.measureBiomarkerEnabled && currentMeasure === MicronutrientMeasureType.BIOMARKER) {
        requiredMeasureValue = MicronutrientMeasureType.DIET;
      }
    }

    measureControl.setValue(requiredMeasureValue);
  }

  private updateDataSources(): void {
    void this.currentDataService
      .getDataSources(
        this.quickMapsService.country,
        this.quickMapsService.measure,
        this.quickMapsService.micronutrient,
        this.quickMapsService.ageGenderGroup,
        true,
      )
      .then((options: Array<DataSource>) => {
        this.dataSources = options;

        // if only one option, preselect
        if (1 === options.length) {
          this.quickMapsForm.get('dataSource').setValue(options[0]);
        }
      });
  }

  private navigate(appRoute: AppRoute): void {
    // console.debug('navigate', this.quickMapsService.measure, route);
    void this.router.navigate(appRoute.getRoute(), {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  private checkCurrentRouteValid(): void {
    // delay to let the query params update first, otherwise
    // the navigation gets cancelled
    setTimeout(() => {
      void this.routeGuardService.getRequiredNavRoute().then((requiredRoute: AppRoute) => {
        if (null != requiredRoute) {
          // console.debug('Should Nav', requiredRoute);
          this.navigate(requiredRoute);
        }
      });
    }, 100);
  }
}
