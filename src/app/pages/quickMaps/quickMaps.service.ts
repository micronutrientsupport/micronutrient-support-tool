import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { FoodSystemsDataSource } from 'src/app/apiAndObjects/objects/foodSystemsDataSource';
import { BiomarkerDataSource } from 'src/app/apiAndObjects/objects/biomarkerDataSource';
import { DietDataService } from 'src/app/services/dietData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Accessor, NullableAccessor } from 'src/utility/accessor';
import { QuickMapsQueryParams } from './queryParams/quickMapsQueryParams';
import { QuickMapsQueryParamKey } from './queryParams/quickMapsQueryParamKey.enum';
import { DictItemConverter } from './queryParams/converters/dictItemConverter';
import { StringConverter } from './queryParams/converters/stringConverter';
import { ActivatedRoute } from '@angular/router';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomaker';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';

@Injectable()
export class QuickMapsService {
  public readonly init = new Accessor<boolean>(false);
  public readonly slim = new Accessor<boolean>(false);
  public readonly country = new NullableAccessor<CountryDictionaryItem>(null);
  public readonly micronutrient = new NullableAccessor<MicronutrientDictionaryItem>(null);
  public readonly measure = new NullableAccessor<MicronutrientMeasureType>(null);
  public readonly FoodSystemsDataSource = new NullableAccessor<FoodSystemsDataSource>(null);
  public readonly biomarkerDataSource = new NullableAccessor<BiomarkerDataSource>(null);
  public readonly ageGenderGroup = new NullableAccessor<AgeGenderDictionaryItem>(null);
  public readonly biomarkerSelect = new NullableAccessor<BiomarkerDataSource>(null);

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public parameterChangedObs = this.parameterChangedSrc.asObservable();

  private readonly dietParameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dietParameterChangedObs = this.dietParameterChangedSrc.asObservable();

  private readonly biomarkerParameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public biomarkerParameterChangedObs = this.biomarkerParameterChangedSrc.asObservable();

  private readonly biomarkerDataSrc = new BehaviorSubject<Biomarker>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public biomarkerDataObs = this.biomarkerDataSrc.asObservable();

  private parameterChangeTimeout: NodeJS.Timeout;
  private dietParameterChangeTimeout: NodeJS.Timeout;
  private biomarkerParameterChangeTimeout: NodeJS.Timeout;

  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    injector: Injector,
    private dietDataService: DietDataService,
    private dictionaryService: DictionaryService,
    private apiService: ApiService,
    private readonly route: ActivatedRoute,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    void Promise.all([
      this.quickMapsParameters.getCountry().then((country) => this.country.set(country)),
      this.quickMapsParameters.getMicronutrient().then((micronutrient) => {
        this.micronutrient.set(micronutrient);
      }),
      this.quickMapsParameters.getAgeGenderGroup().then((ageGenderGroupFromParams) =>
        (null != ageGenderGroupFromParams
          ? // use one from params
            Promise.resolve(ageGenderGroupFromParams)
          : // get default from dictionary
            this.dictionaryService
              .getDictionary(DictionaryType.AGE_GENDER_GROUPS)
              .then((dict) => dict.getItems<AgeGenderDictionaryItem>().find((item) => item.isDefault))
        ).then((ageGenderGroup) => this.ageGenderGroup.set(ageGenderGroup)),
      ),
      this.quickMapsParameters.getMeasure().then((measure) => this.measure.set(measure)),
    ])
      .then(() =>
        this.setInitialDataSources(
          this.country.get(),
          this.measure.get(),
          this.micronutrient.get(),
          this.ageGenderGroup.get(),
        ),
      )
      .then(() => {
        this.initSubscriptions();
        this.init.set(true);
      });
  }

  public getMicronutrientRefresh(): void {
    this.quickMapsParameters.getMicronutrient(this.route.snapshot.queryParamMap).then((micronutrient) => {
      console.log('refresh', micronutrient);
      this.micronutrient.set(micronutrient);
    });
  }

  public sideNavOpen(): void {
    this.slim.set(false);
    // ensure content reacts to change in size
    let count = 0;
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      if (200 === count++) {
        clearInterval(interval);
      }
    }, 10);
  }

  public sideNavToggle(): void {
    this.slim.set(!this.slim.get());
    // ensure content reacts to change in size
    let count = 0;
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      if (200 === count++) {
        clearInterval(interval);
      }
    }, 10);
  }

  public get dataSource(): FoodSystemsDataSource | BiomarkerDataSource {
    return this.FoodSystemsDataSource.get() ?? this.biomarkerDataSource.get();
  }
  public setDataSource(dataSource: FoodSystemsDataSource | BiomarkerDataSource, force = false): void {
    const newDietVal = dataSource instanceof FoodSystemsDataSource ? dataSource : null;
    this.FoodSystemsDataSource.set(newDietVal, force);
    const newBiomarkerVal = dataSource instanceof BiomarkerDataSource ? dataSource : null;
    this.biomarkerDataSource.set(newBiomarkerVal, force);
  }

  public updateQueryParams(): void {
    this.quickMapsParameters.setQueryParams([
      new DictItemConverter(QuickMapsQueryParamKey.COUNTRY_ID, DictionaryType.COUNTRIES).setItem(this.country.get()),
      new DictItemConverter(QuickMapsQueryParamKey.MICRONUTRIENT_ID, DictionaryType.MICRONUTRIENTS).setItem(
        this.micronutrient.get(),
      ),
      new StringConverter(QuickMapsQueryParamKey.MEASURE).setItem(this.measure.get()),

      // Biomarker query params
      new DictItemConverter(QuickMapsQueryParamKey.AGE_GENDER_GROUP_ID, DictionaryType.AGE_GENDER_GROUPS).setItem(
        this.ageGenderGroup.get(),
      ),
      new StringConverter(QuickMapsQueryParamKey.BIOMARKER).setItem(
        this.biomarkerDataSource.get()?.biomarkerName ? this.biomarkerDataSource.get()?.biomarkerName : '',
      ),
      new StringConverter(QuickMapsQueryParamKey.SURVEY_ID).setItem(
        this.biomarkerDataSource.get()?.id ? this.biomarkerDataSource.get()?.id : '',
      ),
      new StringConverter(QuickMapsQueryParamKey.AGGREGATION_FIELD).setItem(
        this.biomarkerDataSource.get()?.aggFields ? this.biomarkerDataSource.get()?.aggFields[1] : '',
      ),
    ]);
  }

  private parameterChanged(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.parameterChangeTimeout);
    this.parameterChangeTimeout = setTimeout(() => {
      this.updateQueryParams();
      this.parameterChangedSrc.next();
    }, 100);
  }

  private dietParameterChanged(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.dietParameterChangeTimeout);
    this.dietParameterChangeTimeout = setTimeout(() => {
      this.dietParameterChangedSrc.next();
    }, 100);
  }

  private biomarkerParameterChanged(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.biomarkerParameterChangeTimeout);
    this.biomarkerParameterChangeTimeout = setTimeout(() => {
      this.biomarkerParameterChangedSrc.next();
    }, 100);
  }

  private initSubscriptions(): void {
    // set up the parameter changed triggers on param changes
    this.country.obs.subscribe(() => this.parameterChanged());
    this.micronutrient.obs.subscribe(() => this.parameterChanged());
    this.measure.obs.subscribe(() => this.parameterChanged());
    this.FoodSystemsDataSource.obs.subscribe(() => this.parameterChanged());
    this.biomarkerDataSource.obs.subscribe(() => this.parameterChanged());
    this.ageGenderGroup.obs.subscribe(() => this.parameterChanged());

    this.country.obs.subscribe(() => this.dietParameterChanged());
    this.micronutrient.obs.subscribe(() => this.dietParameterChanged());
    this.measure.obs.subscribe(() => this.dietParameterChanged());
    this.FoodSystemsDataSource.obs.subscribe(() => this.dietParameterChanged());

    this.country.obs.subscribe(() => this.biomarkerParameterChanged());
    this.micronutrient.obs.subscribe(() => this.biomarkerParameterChanged());
    this.measure.obs.subscribe(() => this.biomarkerParameterChanged());
    this.biomarkerDataSource.obs.subscribe(() => this.biomarkerParameterChanged());
    this.ageGenderGroup.obs.subscribe(() => this.biomarkerParameterChanged());
  }

  private setInitialDataSources(
    country: CountryDictionaryItem,
    measure: MicronutrientMeasureType,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup: AgeGenderDictionaryItem,
  ): Promise<void> {
    const promises = new Array<Promise<unknown>>();
    if (MicronutrientMeasureType.FOOD_SYSTEMS === measure) {
      promises.push(
        this.dietDataService
          .getDataSources(country, micronutrient, true)
          .then((ds) => this.FoodSystemsDataSource.set(ds[0])), // always first item
      );
    } else {
      this.FoodSystemsDataSource.set(null);
    }
    if (MicronutrientMeasureType.BIOMARKER === measure) {
      promises.push(
        this.getBiomarkerDataSources(country, micronutrient, ageGenderGroup, true).then((ds) =>
          this.biomarkerDataSource.set(ds[0]),
        ), // always first item
      );
    } else {
      this.biomarkerDataSource.set(null);
    }
    return Promise.all(promises).then();
  }

  public getBiomarkerDataSources(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup: AgeGenderDictionaryItem,
    singleOptionOnly = false,
  ): Promise<Array<BiomarkerDataSource>> {
    return this.apiService.endpoints.biomarker.getDataSources.call(
      {
        country,
        micronutrient,
        ageGenderGroup,
        singleOptionOnly,
      },
      false,
    );
  }

  public getBiomarkerData(): void {
    this.apiService.endpoints.biomarker.getBiomarker
      .call(
        {
          surveyId: this.biomarkerDataSource.get().id,
          groupId: this.ageGenderGroup.get().groupId,
          biomarker: this.biomarkerDataSource.get().biomarkerName,
          aggregationField: this.biomarkerDataSource.get().aggFields[1], //TODO: Specify which aggField to use as default.
        },
        false,
      )
      .then((data: Array<Biomarker>) => {
        // console.debug('data', data);
        this.biomarkerDataSrc.next(data.shift());
      });
  }
}
