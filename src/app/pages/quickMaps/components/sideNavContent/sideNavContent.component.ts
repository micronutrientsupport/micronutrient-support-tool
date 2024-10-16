import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
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
  public selectedBiomarker: string;
  public selectMNDsFiltered = new Array<DictionaryItem>();
  public dataSources = new Array<Named | BiomarkerDataSource>();
  public biomarkerNames = new Array<BiomarkerDataSource>();
  public quickMapsForm: UntypedFormGroup;
  public sideNavToggleLock = new UntypedFormControl(false);
  public btnViewResultsActive = false;

  public viewBiomarkerResultsButtonDisabled = false;
  private subscriptions = new Array<Subscription>();

  constructor(
    public dictionariesService: DictionaryService,
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    public routeGuardService: QuickMapsRouteGuardService,
    private fb: UntypedFormBuilder,
    private dietDataService: DietDataService,
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
          biomarkerSelect: [
            this.quickMapsService.biomarkerSelect.get(),
            (control: AbstractControl) => this.biomarkerRequiredValidator(control),
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
            const oldMeasure = this.quickMapsService.measure.get();
            if (value !== oldMeasure && value) {
              this.quickMapsService.measure.set(value);

              if (
                value == MicronutrientMeasureType.BIOMARKER &&
                this.quickMapsForm.valid &&
                this.showGoButton == false
              ) {
                // Nav to Biomarker
                this.navigate(AppRoutes.QUICK_MAPS_BIOMARKER);
              } else if (
                value == MicronutrientMeasureType.FOOD_SYSTEMS &&
                this.quickMapsForm.valid &&
                this.showGoButton == false
              ) {
                // Nav to Food Systems
                this.navigate(AppRoutes.QUICK_MAPS_BASELINE);
              } else if (!this.quickMapsForm.valid) {
                // this.navigate(AppRoutes.QUICK_MAPS_NO_RESULTS);
              }
            }
            this.quickMapsService.measure.set(value);

            // force re-validation of age-gender group
            this.quickMapsForm.get('ageGenderGroup').updateValueAndValidity();
            this.updateDataSources();
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('ageGenderGroup').valueChanges.subscribe((value: AgeGenderDictionaryItem) => {
            if (
              this.quickMapsService.measure.get() === MicronutrientMeasureType.BIOMARKER &&
              this.measureBiomarkerEnabled
            ) {
              this.quickMapsService.ageGenderGroup.set(value);
              this.updatAgeGenderGroups();
            }
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm.get('biomarkerSelect').valueChanges.subscribe((value: BiomarkerDataSource) => {
            this.selectedBiomarker = value.biomarkerName;
            const biomarkerOptions = [];
            biomarkerOptions.push(value);
            if (biomarkerOptions.length === 0) {
              if (!this.showGoButton) {
                console.debug('call');
                // valid data --> invalid data
                this.navigate(AppRoutes.QUICK_MAPS_NO_RESULTS);
              } else {
                // location page with invalid data
                this.btnViewResultsActive = false;
              }
            } else if (biomarkerOptions.length >= 1) {
              this.quickMapsForm.get('dataSource').setValue(biomarkerOptions[0]);
            }
            this.dataSources = biomarkerOptions;
          }),
        );
        this.subscriptions.push(
          this.quickMapsForm
            .get('dataSource')
            .valueChanges.subscribe((value: FoodSystemsDataSource | BiomarkerDataSource) => {
              this.quickMapsService.setDataSource(value);
              if (this.quickMapsService.measure.get() === MicronutrientMeasureType.BIOMARKER) {
                this.quickMapsService.getBiomarkerData();
              }
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
      if (this.quickMapsService.measure.get() === MicronutrientMeasureType.FOOD_SYSTEMS) {
        this.navigate(AppRoutes.QUICK_MAPS_BASELINE);
      } else {
        // this.quickMapsService.aggField.set(this.quickMapsService.biomarkerDataSource.get().aggFields[1]);
        this.quickMapsService.getBiomarkerData();
        this.navigate(AppRoutes.QUICK_MAPS_BIOMARKER);
      }
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

  private biomarkerRequiredValidator(biomarkerControl: AbstractControl): ValidationErrors {
    let valid = true;
    if (null != this.quickMapsForm) {
      const measureControl = this.quickMapsForm.get('measure');
      valid = measureControl.value !== MicronutrientMeasureType.BIOMARKER || null != biomarkerControl.value;
    }
    return valid ? null : { biomarker: 'required' };
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
    biomarkerSourcePromise = this.quickMapsService.getBiomarkerDataSources(
      country,
      micronutrient,
      ageGenderGroup,
      false,
    );

    void biomarkerSourcePromise.then((options: Array<BiomarkerDataSource>) => {
      this.biomarkerNames = options;
      if (null != country && null != micronutrient && null != measure) {
        if (options.length >= 1 && this.quickMapsForm.get('biomarkerSelect')) {
          this.viewBiomarkerResultsButtonDisabled = false;
          this.quickMapsForm.get('biomarkerSelect').setValue(options[0]);
        } else if (options.length === 0) {
          this.viewBiomarkerResultsButtonDisabled = true;
        }
      }
    });
    this.updateDataSources();
  }

  private updateDataSources(): void {
    let dataSourcePromise: Promise<Array<Named>> = Promise.resolve([] as Array<Named>);
    // no point in calling API if required parameters aren't set
    const country = this.quickMapsService.country.get();
    const micronutrient = this.quickMapsService.micronutrient.get();
    const measure = this.quickMapsService.measure.get();
    const ageGenderGroup = this.quickMapsService.ageGenderGroup.get();

    if (null != country && null != micronutrient && null != measure) {
      switch (measure) {
        case MicronutrientMeasureType.FOOD_SYSTEMS: {
          dataSourcePromise = this.dietDataService.getDataSources(country, micronutrient, true);
          break;
        }
        case MicronutrientMeasureType.BIOMARKER: {
          dataSourcePromise = this.quickMapsService.getBiomarkerDataSources(
            country,
            micronutrient,
            ageGenderGroup,
            true,
          );
          break;
        }
      }
    }
    void dataSourcePromise.then((options: Array<Named>) => {
      this.dataSources = options;
      if (null != country && null != micronutrient && null != measure) {
        if (options.length === 0) {
          if (!this.showGoButton /*&& measure === MicronutrientMeasureType.FOOD_SYSTEMS*/) {
            // Will only show 'No No Results' page for Food Systems Data.
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

@Pipe({
  name: 'filterAgeGroup',
})
export class filterAgeGroupPipe implements PipeTransform {
  async transform(
    value: Observable<DictionaryItem[]>,
    dataSource: Array<BiomarkerDataSource>,
    biomarker: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<DictionaryItem[]> {
    console.log('Pipeypipeu');

    const currentDataSource = dataSource.find((element) => element.biomarkerName === biomarker);
    const currentAgGroups = currentDataSource.groupId;

    const v = await firstValueFrom(value);

    const nV = v.reduce<DictionaryItem[]>((prev: DictionaryItem[], curr: DictionaryItem): DictionaryItem[] => {
      console.log(prev);
      console.log(curr);

      if (currentAgGroups.includes(curr.id)) {
        prev.push(curr);
      }
      return prev;
    }, [] as DictionaryItem[]);

    console.log({ value, nV });
    return Promise.resolve(nV);
  }
}
