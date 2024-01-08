import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { MicronutrientType } from 'src/app/apiAndObjects/objects/enums/micronutrientType.enum';

import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';
import { QuickMapsRouteGuardService } from '../../quickMapsRouteGuard.service';
import { GeographyTypes } from './geographyTypes.enum';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { BiomarkerDataSource } from 'src/app/apiAndObjects/objects/biomarkerDataSource';
import { FoodSystemsDataSource } from 'src/app/apiAndObjects/objects/foodSystemsDataSource';
import { DietDataService } from 'src/app/services/dietData.service';
import { BiomarkerDataService } from 'src/app/services/biomarkerData.service';
import { Named } from 'src/app/apiAndObjects/objects/named.interface';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
@Unsubscriber('subscriptions')
@Component({
  selector: 'app-side-nav-content',
  templateUrl: './sideNavContent.component.html',
  styleUrls: ['./sideNavContent.component.scss'],
})
export class SideNavContentComponent {
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
  public dataSources = new Array<Named>();
  public biomarkerSources = new Array<BiomarkerDataSource>();
  public quickMapsForm: UntypedFormGroup;
  public sideNavToggleLock = new UntypedFormControl(false);
  public btnViewResultsActive = false;
  private subscriptions = new Array<Subscription>();

  constructor(
    public dictionariesService: DictionaryService,
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    public routeGuardService: QuickMapsRouteGuardService,
    private fb: UntypedFormBuilder,
    private dietDataService: DietDataService,
    private biomarkerDataService: BiomarkerDataService,
    private router: Router,
    private dialogService: DialogService,
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
          nation: [this.quickMapsService.country.get(), Validators.required],
          micronutrient: [this.quickMapsService.micronutrient.get(), Validators.required],
          measure: [this.quickMapsService.measure.get(), Validators.required],
          dataSource: [this.quickMapsService.dataSource, Validators.required],
          ageGenderGroup: [
            this.quickMapsService.ageGenderGroup.get(),
            (control: AbstractControl) => this.ageGenderRequiredValidator(control),
          ],
        });

        this.subscriptions.push(
          this.quickMapsService.country.obs.subscribe((value) => {
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
          this.quickMapsService.micronutrient.obs.subscribe((value) => {
            // really only used on first load to pre-select correct type
            const mndType = null != value ? value.type : MicronutrientType.VITAMIN;
            this.mndChange(mndType);
          }),
        );

        this.subscriptions.push(
          this.quickMapsForm.get('nation').valueChanges.subscribe((value: CountryDictionaryItem) => {
            this.quickMapsService.country.set(value);
            this.quickMapsForm.get('micronutrient').reset();
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('micronutrient').valueChanges.subscribe((value: MicronutrientDictionaryItem) => {
            this.quickMapsService.micronutrient.set(value, true);
            this.updateDataMeasureOptions();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('measure').valueChanges.subscribe((value: MicronutrientMeasureType) => {
            this.quickMapsService.measure.set(value);
            // force re-validation of age-gender group
            this.quickMapsForm.get('ageGenderGroup').updateValueAndValidity();
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('ageGenderGroup').valueChanges.subscribe((value: AgeGenderDictionaryItem) => {
            if (this.measureBiomarkerEnabled) {
              this.quickMapsService.ageGenderGroup.set(value);
              this.updatAgeGenderGroups();
            }
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm
            .get('dataSource')
            .valueChanges.subscribe((value: FoodSystemsDataSource | BiomarkerDataSource) => {
              this.quickMapsService.setDataSource(value);
            }),
        );

        this.updateDataMeasureOptions();
      });
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
        this.quickMapsService.measure.get() === MicronutrientMeasureType.FOOD_SYSTEMS
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
      valid = measureControl.value === MicronutrientMeasureType.FOOD_SYSTEMS || null != ageGenderControl.value;
    }
    return valid ? null : { ageGender: 'required' };
  }

  private updateDataMeasureOptions(): void {
    const micronutrient = this.quickMapsService.micronutrient.get();

    this.measureDietEnabled = null != micronutrient && micronutrient.isDiet;
    this.measureBiomarkerEnabled = null != micronutrient && micronutrient.isBiomarker;

    const measureControl = this.quickMapsForm.get('measure');
    const currentMeasure = measureControl.value as MicronutrientMeasureType;

    let requiredMeasureValue = currentMeasure;
    // there's got to be a nicer way to do all of this :-(
    if (null == currentMeasure) {
      // if nothing selected, select first enabled one
      if (this.measureDietEnabled) {
        requiredMeasureValue = MicronutrientMeasureType.FOOD_SYSTEMS;
      } else if (this.measureBiomarkerEnabled) {
        requiredMeasureValue = MicronutrientMeasureType.BIOMARKER;
      }
    } else if (!this.measureDietEnabled && !this.measureBiomarkerEnabled) {
      // nothing enabled, set value to null
      requiredMeasureValue = null;
    } else {
      // if disabled item selected, change it.
      if (!this.measureDietEnabled && currentMeasure === MicronutrientMeasureType.FOOD_SYSTEMS) {
        requiredMeasureValue = MicronutrientMeasureType.BIOMARKER;
      } else if (!this.measureBiomarkerEnabled && currentMeasure === MicronutrientMeasureType.BIOMARKER) {
        requiredMeasureValue = MicronutrientMeasureType.FOOD_SYSTEMS;
      }
    }

    measureControl.setValue(requiredMeasureValue);
  }

  private updatAgeGenderGroups(): void {
    const country = this.quickMapsService.country.get();
    const micronutrient = this.quickMapsService.micronutrient.get();
    const measure = this.quickMapsService.measure.get();
    const ageGenderGroup = this.quickMapsService.ageGenderGroup.get();

    let biomarkerSourcePromise: Promise<Array<BiomarkerDataSource>> = Promise.resolve([] as Array<BiomarkerDataSource>);
    biomarkerSourcePromise = this.biomarkerDataService.getDataSources(country, micronutrient, ageGenderGroup, false);

    void biomarkerSourcePromise.then((options: Array<BiomarkerDataSource>) => {
      console.debug(options);
      this.biomarkerSources = options;
      if (null != country && null != micronutrient && null != measure) {
        if (options.length >= 1) {
          this.quickMapsForm.get('biomarkerDataSources').setValue(options[0]);
        }
      }
    });
  }

  private updateDataSources(): void {
    let dataSourcePromise: Promise<Array<Named>> = Promise.resolve([] as Array<Named>);
    // no point in calling API if required parameters aren't set
    const country = this.quickMapsService.country.get();
    const micronutrient = this.quickMapsService.micronutrient.get();
    const measure = this.quickMapsService.measure.get();

    if (null != country && null != micronutrient && null != measure) {
      switch (measure) {
        case MicronutrientMeasureType.FOOD_SYSTEMS: {
          dataSourcePromise = this.dietDataService.getDataSources(country, micronutrient, true);
          break;
        }
      }
    }
    void dataSourcePromise.then((options: Array<Named>) => {
      this.dataSources = options;
      if (null != country && null != micronutrient && null != measure) {
        if (options.length === 0) {
          if (!this.showGoButton) {
            // valid data --> invalid data
            this.navigate(AppRoutes.QUICK_MAPS_NO_RESULTS);
          } else {
            // location page with invalid data
            this.btnViewResultsActive = false;
          }
        } else if (options.length >= 1) {
          this.quickMapsForm.get('dataSource').setValue(options[0]);
          if (this.showGoButton) {
            this.btnViewResultsActive = true;
          }
        }
      }
    });
  }

  private navigate(appRoute: AppRoute): void {
    console.debug('navigate', this.quickMapsService.measure, appRoute);
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

  public tourSetNation(countryId: string): void {
    const countryDictionaryMWI = this.countriesDictionary.getItem(countryId);
    this.quickMapsForm.get('nation').setValue(countryDictionaryMWI);
  }

  public tourSetMicronutrient(mnId: string): void {
    const micronutrientDictionaryCalcium = this.micronutrientsDictionary.getItem(mnId);
    this.quickMapsForm.get('micronutrient').setValue(micronutrientDictionaryCalcium);
  }
}
