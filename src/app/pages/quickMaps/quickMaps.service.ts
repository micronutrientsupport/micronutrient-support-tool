import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { CurrentDataService } from 'src/app/services/currentData.service';

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

  private readonly mndDataOptionSrc = new BehaviorSubject<MicronutrientDataOption>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public mndDataOptionObs = this.mndDataOptionSrc.asObservable();

  private readonly dataLevelSrc = new BehaviorSubject<DataLevel>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataLevelObs = this.dataLevelSrc.asObservable();

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public parameterChangedObs = this.parameterChangedSrc.asObservable();

  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(injector: Injector, private currentDataService: CurrentDataService) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    const promises = new Array<Promise<unknown>>();

    promises.push(
      this.quickMapsParameters.getCountry().then((country) => this.setCountry(country)),
      this.quickMapsParameters.getMicronutrient().then((micronutrient) => this.setMicronutrient(micronutrient)),
      this.getMndOption().then((option) => this.setMndDataOption(option)),
    );
    this.setMeasure(this.quickMapsParameters.getMeasure());
    this.setDataLevel(this.quickMapsParameters.getDataLevel());

    void Promise.all(promises).then(() => {
      this.countryObs.subscribe(() => this.parameterChanged());
      this.micronutrientObs.subscribe(() => this.parameterChanged());
      this.measureObs.subscribe(() => this.parameterChanged());
      this.mndDataOptionObs.subscribe(() => this.parameterChanged());
      this.dataLevelObs.subscribe(() => this.parameterChanged());

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

  public get mndDataOption(): MicronutrientDataOption {
    return this.mndDataOptionSrc.value;
  }
  public setMndDataOption(mndDataOption: MicronutrientDataOption, force = false): void {
    this.setValue(this.mndDataOptionSrc, mndDataOption, force);
  }

  public get dataLevel(): DataLevel {
    return this.dataLevelSrc.value;
  }
  public setDataLevel(dataLevel: DataLevel, force = false): void {
    this.setValue(this.dataLevelSrc, dataLevel, force);
  }

  public updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = null != this.country ? this.country.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] =
      null != this.micronutrient ? this.micronutrient.id : null;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE] = this.measure;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL] = this.dataLevel;
    this.quickMapsParameters.setQueryParams(paramsObj);
  }

  protected setValue<T>(srcRef: BehaviorSubject<T>, value: T, force: boolean): void {
    if (force || srcRef.value !== value) {
      srcRef.next(value);
    }
  }

  private parameterChanged(): void {
    this.updateQueryParams();
    this.parameterChangedSrc.next();
  }

  private getMndOption(): Promise<MicronutrientDataOption> {
    return Promise.all([this.quickMapsParameters.getCountry()]).then(
      (data: [CountryDictionaryItem]) =>
        null == data[0]
          ? null
          : this.currentDataService
            .getDataSources(data[0], this.quickMapsParameters.getMeasure(), true)
            .then((options) => options[0]), // first item
    );
  }
}
