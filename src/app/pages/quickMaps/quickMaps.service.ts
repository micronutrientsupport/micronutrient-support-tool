import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { DataSource } from 'src/app/apiAndObjects/objects/dataSource';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { AgeGenderGroup } from 'src/app/apiAndObjects/objects/ageGenderGroup';
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

  private readonly dataSourceSrc = new BehaviorSubject<DataSource>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataSourceObs = this.dataSourceSrc.asObservable();

  private readonly dataLevelSrc = new BehaviorSubject<DataLevel>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataLevelObs = this.dataLevelSrc.asObservable();

  private readonly ageGenderGroupSrc = new BehaviorSubject<AgeGenderGroup>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public ageGenderObs = this.ageGenderGroupSrc.asObservable();

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public parameterChangedObs = this.parameterChangedSrc.asObservable();

  private parameterChangeTimeout: NodeJS.Timeout;

  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    injector: Injector,
    private currentDataService: CurrentDataService,
    private dietDataService: DietDataService,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    this.setMeasure(this.quickMapsParameters.getMeasure());
    this.setDataLevel(this.quickMapsParameters.getDataLevel());

    void Promise.all([
      this.quickMapsParameters.getCountry().then((country) => this.setCountry(country)),
      this.quickMapsParameters.getMicronutrient().then((micronutrient) => this.setMicronutrient(micronutrient)),
    ])
      .then(() => this.setInitialAgeGender(this.micronutrient))
      .then(() => this.setInitialDataSource(this.country, this.micronutrient, this.ageGenderGroup))
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

  public get dataSource(): DataSource {
    return this.dataSourceSrc.value;
  }
  public setDataSource(dataSource: DataSource, force = false): void {
    this.setValue(this.dataSourceSrc, dataSource, force);
  }

  public get dataLevel(): DataLevel {
    return this.dataLevelSrc.value;
  }
  public setDataLevel(dataLevel: DataLevel, force = false): void {
    this.setValue(this.dataLevelSrc, dataLevel, force);
  }

  public get ageGenderGroup(): AgeGenderGroup {
    return this.ageGenderGroupSrc.value;
  }
  public setAgeGenderGroup(ageGenderGroup: AgeGenderGroup, force = false): void {
    this.setValue(this.ageGenderGroupSrc, ageGenderGroup, force);
  }

  public updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = null != this.country ? this.country.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] =
      null != this.micronutrient ? this.micronutrient.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE] = this.measure;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL] = this.dataLevel;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.AGE_GENDER_GROUP] =
      null != this.ageGenderGroup ? this.ageGenderGroup.id : null;
    this.quickMapsParameters.setQueryParams(paramsObj);
  }

  protected setValue<T>(srcRef: BehaviorSubject<T>, value: T, force: boolean): void {
    if (force || srcRef.value !== value) {
      srcRef.next(value);
    }
  }

  private parameterChanged(): void {
    this.updateQueryParams();
    // ensure not triggered too many times in quick succession
    clearTimeout(this.parameterChangeTimeout);
    this.parameterChangeTimeout = setTimeout(() => {
      this.parameterChangedSrc.next();
    }, 100);
  }

  private setInitialAgeGender(micronutrient: MicronutrientDictionaryItem): Promise<void> {
    // if age-gender query param is set, then find the corresponding AgeGenderGroup
    const ageGenderGroupId = this.quickMapsParameters.getAgeGenderGroupId();
    if (null == micronutrient || null == ageGenderGroupId) {
      return Promise.resolve();
    } else {
      return this.currentDataService
        .getAgeGenderGroups([micronutrient])
        .then((ageGenderGroups: Array<AgeGenderGroup>) =>
          this.setAgeGenderGroup(ageGenderGroups.find((option) => option.id === ageGenderGroupId)),
        );
    }
  }

  private initSubscriptions(): void {
    // set up the parameter changed triggers on param changes
    this.countryObs.subscribe(() => this.parameterChanged());
    this.micronutrientObs.subscribe(() => this.parameterChanged());
    this.measureObs.subscribe(() => this.parameterChanged());
    this.dataSourceObs.subscribe(() => this.parameterChanged());
    this.dataLevelObs.subscribe(() => this.parameterChanged());
    this.ageGenderObs.subscribe(() => this.parameterChanged());
  }

  private setInitialDataSource(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup: AgeGenderGroup,
  ): Promise<void> {
    return this.dietDataService
      .getDataSources(country, micronutrient, ageGenderGroup, true)
      .then((groups) => this.setDataSource(groups[0])); // always first item
  }
}
