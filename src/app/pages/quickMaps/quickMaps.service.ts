import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { DietDataSource } from 'src/app/apiAndObjects/objects/dietDataSource';
import { BiomarkerDataSource } from 'src/app/apiAndObjects/objects/biomarkerDataSource';
import { BiomarkerDataService } from 'src/app/services/biomarkerData.service';
import { DietDataService } from 'src/app/services/dietData.service';

@Injectable()
export class QuickMapsService {
  private initSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public initObservable = this.initSrc.asObservable();

  private slimSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public slimObservable = this.slimSubject.asObservable();

  private readonly countrySrc = new BehaviorSubject<CountryDictionaryItem>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public countryObs = this.countrySrc.asObservable();

  private readonly micronutrientSrc = new BehaviorSubject<MicronutrientDictionaryItem>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public micronutrientObs = this.micronutrientSrc.asObservable();

  private readonly measureSrc = new BehaviorSubject<MicronutrientMeasureType>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public measureObs = this.measureSrc.asObservable();

  private readonly dietDataSourceSrc = new BehaviorSubject<DietDataSource>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dietDataSourceObs = this.dietDataSourceSrc.asObservable();

  private readonly biomarkerDataSourceSrc = new BehaviorSubject<BiomarkerDataSource>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public biomarkerDataSourceObs = this.biomarkerDataSourceSrc.asObservable();

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
    private currentDataService: CurrentDataService,
    private dietDataService: DietDataService,
    private biomarkerDataService: BiomarkerDataService,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    this.setMeasure(this.quickMapsParameters.getMeasure());

    void Promise.all([
      this.quickMapsParameters.getCountry().then((country) => this.setCountry(country)),
      this.quickMapsParameters.getMicronutrient().then((micronutrient) => this.setMicronutrient(micronutrient)),
      this.quickMapsParameters.getAgeGenderGroup().then((ageGenderGroup) => this.setAgeGenderGroup(ageGenderGroup)),
    ])
      .then(() => this.setInitialDataSources(this.country, this.measure, this.micronutrient, this.ageGenderGroup))
      .then(() => {
        this.initSubscriptions();
        this.initSrc.next(true);
      });
  }

  public sideNavToggle(): void {
    this.slimSubject.next(!this.slimSubject.value);
    // ensure content reacts to change in size
    let count = 0;
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      if (200 === count++) {
        clearInterval(interval);
      }
    }, 10);
  }

  public get country(): CountryDictionaryItem {
    return this.countrySrc.value;
  }
  public setCountry(country: CountryDictionaryItem, force = false): void {
    this.setValue(this.countrySrc, country, force);
  }

  public get micronutrient(): MicronutrientDictionaryItem {
    return this.micronutrientSrc.value;
  }
  public setMicronutrient(micronutrient: MicronutrientDictionaryItem, force = false): void {
    this.setValue(this.micronutrientSrc, micronutrient, force);
  }

  public get measure(): MicronutrientMeasureType {
    return this.measureSrc.value;
  }
  public setMeasure(measure: MicronutrientMeasureType, force = false): void {
    this.setValue(this.measureSrc, measure, force);
  }

  public get dietDataSource(): DietDataSource {
    return this.dietDataSourceSrc.value;
  }
  public setDietDataSource(dataSource: DietDataSource, force = false): void {
    this.setValue(this.dietDataSourceSrc, dataSource, force);
  }

  public get biomarkerDataSource(): BiomarkerDataSource {
    return this.biomarkerDataSourceSrc.value;
  }
  public setBiomarkerDataSource(dataSource: BiomarkerDataSource, force = false): void {
    this.setValue(this.biomarkerDataSourceSrc, dataSource, force);
  }

  public get dataSource(): DietDataSource | BiomarkerDataSource {
    return this.dietDataSourceSrc.value ?? this.biomarkerDataSourceSrc.value;
  }
  public setDataSource(dataSource: DietDataSource | BiomarkerDataSource, force = false): void {
    const newDietVal = dataSource instanceof DietDataSource ? dataSource : null;
    const newBiomarkerVal = dataSource instanceof BiomarkerDataSource ? dataSource : null;
    this.setDietDataSource(newDietVal, force);
    this.setBiomarkerDataSource(newBiomarkerVal, force);
  }

  public get ageGenderGroup(): AgeGenderDictionaryItem {
    return this.ageGenderGroupSrc.value;
  }
  public setAgeGenderGroup(ageGenderGroup: AgeGenderDictionaryItem, force = false): void {
    this.setValue(this.ageGenderGroupSrc, ageGenderGroup, force);
  }

  public updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = null != this.country ? this.country.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] =
      null != this.micronutrient ? this.micronutrient.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE] = this.measure;
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
    this.countryObs.subscribe(() => this.parameterChanged());
    this.micronutrientObs.subscribe(() => this.parameterChanged());
    this.measureObs.subscribe(() => this.parameterChanged());
    this.dietDataSourceObs.subscribe(() => this.parameterChanged());
    this.biomarkerDataSourceObs.subscribe(() => this.parameterChanged());
    this.ageGenderObs.subscribe(() => this.parameterChanged());

    this.countryObs.subscribe(() => this.dietParameterChanged());
    this.micronutrientObs.subscribe(() => this.dietParameterChanged());
    this.measureObs.subscribe(() => this.dietParameterChanged());
    this.dietDataSourceObs.subscribe(() => this.dietParameterChanged());

    this.countryObs.subscribe(() => this.biomarkerParameterChanged());
    this.micronutrientObs.subscribe(() => this.biomarkerParameterChanged());
    this.measureObs.subscribe(() => this.biomarkerParameterChanged());
    this.biomarkerDataSourceObs.subscribe(() => this.biomarkerParameterChanged());
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
        this.dietDataService.getDataSources(country, micronutrient, true).then((ds) => this.setDietDataSource(ds[0])), // always first item
      );
    } else {
      this.setDietDataSource(null);
    }
    if (MicronutrientMeasureType.BIOMARKER === measure) {
      promises.push(
        this.biomarkerDataService
          .getDataSources(country, micronutrient, ageGenderGroup, true)
          .then((ds) => this.setBiomarkerDataSource(ds[0])), // always first item
      );
    } else {
      this.setBiomarkerDataSource(null);
    }
    return Promise.all(promises).then(() => {});
  }
}
