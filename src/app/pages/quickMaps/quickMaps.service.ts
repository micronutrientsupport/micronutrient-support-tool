import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { DietDataSource } from 'src/app/apiAndObjects/objects/dietDataSource';
import { BiomarkerDataSource } from 'src/app/apiAndObjects/objects/biomarkerDataSource';
import { BiomarkerDataService } from 'src/app/services/biomarkerData.service';
import { DietDataService } from 'src/app/services/dietData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Accessor, NullableAccessor } from 'src/utility/accessor';

@Injectable()
export class QuickMapsService {
  public readonly init = new Accessor<boolean>(false);
  public readonly slim = new Accessor<boolean>(false);
  public readonly country = new NullableAccessor<CountryDictionaryItem>(null);
  public readonly micronutrient = new NullableAccessor<MicronutrientDictionaryItem>(null);
  public readonly measure = new NullableAccessor<MicronutrientMeasureType>(null);
  public readonly dietDataSource = new NullableAccessor<DietDataSource>(null);
  public readonly biomarkerDataSource = new NullableAccessor<BiomarkerDataSource>(null);

  private readonly ageGenderGroupSrc = new BehaviorSubject<AgeGenderDictionaryItem>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public ageGenderObs = this.ageGenderGroupSrc.asObservable();

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

  private parameterChangeTimeout: NodeJS.Timeout;
  private dietParameterChangeTimeout: NodeJS.Timeout;
  private biomarkerParameterChangeTimeout: NodeJS.Timeout;

  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    injector: Injector,
    private dietDataService: DietDataService,
    private biomarkerDataService: BiomarkerDataService,
    private dictionaryService: DictionaryService,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    this.measure.set(this.quickMapsParameters.getMeasure());

    void Promise.all([
      this.quickMapsParameters.getCountry().then((country) => this.country.set(country)),
      this.quickMapsParameters.getMicronutrient().then((micronutrient) => this.micronutrient.set(micronutrient)),
      this.quickMapsParameters.getAgeGenderGroup().then((ageGenderGroupFromParams) =>
        (null != ageGenderGroupFromParams
          ? // use one from params
            Promise.resolve(ageGenderGroupFromParams)
          : // get default from dictionary
            this.dictionaryService
              .getDictionary(DictionaryType.AGE_GENDER_GROUPS)
              .then((dict) => dict.getItems<AgeGenderDictionaryItem>().find((item) => item.isDefault))
        ).then((ageGenderGroup) => this.setAgeGenderGroup(ageGenderGroup)),
      ),
    ])
      .then(() =>
        this.setInitialDataSources(
          this.country.get(),
          this.measure.get(),
          this.micronutrient.get(),
          this.ageGenderGroup,
        ),
      )
      .then(() => {
        this.initSubscriptions();
        this.init.set(true);
      });
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

  public get dataSource(): DietDataSource | BiomarkerDataSource {
    return this.dietDataSource.get() ?? this.biomarkerDataSource.get();
  }
  public setDataSource(dataSource: DietDataSource | BiomarkerDataSource, force = false): void {
    const newDietVal = dataSource instanceof DietDataSource ? dataSource : null;
    this.dietDataSource.set(newDietVal, force);
    const newBiomarkerVal = dataSource instanceof BiomarkerDataSource ? dataSource : null;
    this.biomarkerDataSource.set(newBiomarkerVal, force);
  }

  public get ageGenderGroup(): AgeGenderDictionaryItem {
    return this.ageGenderGroupSrc.value;
  }
  public setAgeGenderGroup(ageGenderGroup: AgeGenderDictionaryItem, force = false): void {
    this.setValue(this.ageGenderGroupSrc, ageGenderGroup, force);
  }

  public updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = this.country.get()?.id;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] = this.micronutrient.get()?.id;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE] = this.measure.get();
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.AGE_GENDER_GROUP_ID] =
      null != this.ageGenderGroup ? this.ageGenderGroup.id : null;
    this.quickMapsParameters.setQueryParams(paramsObj);
  }

  protected setValue<T>(srcRef: BehaviorSubject<T>, value: T, force: boolean): void {
    if (force || srcRef.value !== value) {
      srcRef.next(value);
    }
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
    this.dietDataSource.obs.subscribe(() => this.parameterChanged());
    this.biomarkerDataSource.obs.subscribe(() => this.parameterChanged());
    this.ageGenderObs.subscribe(() => this.parameterChanged());

    this.country.obs.subscribe(() => this.dietParameterChanged());
    this.micronutrient.obs.subscribe(() => this.dietParameterChanged());
    this.measure.obs.subscribe(() => this.dietParameterChanged());
    this.dietDataSource.obs.subscribe(() => this.dietParameterChanged());

    this.country.obs.subscribe(() => this.biomarkerParameterChanged());
    this.micronutrient.obs.subscribe(() => this.biomarkerParameterChanged());
    this.measure.obs.subscribe(() => this.biomarkerParameterChanged());
    this.biomarkerDataSource.obs.subscribe(() => this.biomarkerParameterChanged());
    this.ageGenderObs.subscribe(() => this.biomarkerParameterChanged());
  }

  private setInitialDataSources(
    country: CountryDictionaryItem,
    measure: MicronutrientMeasureType,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup: AgeGenderDictionaryItem,
  ): Promise<void> {
    const promises = new Array<Promise<void>>();
    if (MicronutrientMeasureType.DIET === measure) {
      promises.push(
        this.dietDataService.getDataSources(country, micronutrient, true).then((ds) => this.dietDataSource.set(ds[0])), // always first item
      );
    } else {
      this.dietDataSource.set(null);
    }
    if (MicronutrientMeasureType.BIOMARKER === measure) {
      promises.push(
        this.biomarkerDataService
          .getDataSources(country, micronutrient, ageGenderGroup, true)
          .then((ds) => this.biomarkerDataSource.set(ds[0])), // always first item
      );
    } else {
      this.biomarkerDataSource.set(null);
    }
    return Promise.all(promises).then(() => {});
  }
}
