import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';

@Injectable()
export class QuickMapsService {
  private slimSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public slimObservable = this.slimSubject.asObservable();

  private readonly countryIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public countryIdObs = this.countryIdSrc.asObservable();

  private readonly micronutrientIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public micronutrientIdObs = this.micronutrientIdSrc.asObservable();

  private readonly mndDataIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public mndDataIdObs = this.mndDataIdSrc.asObservable();

  private readonly dataLevelSrc = new BehaviorSubject<DataLevel>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataLevelObs = this.dataLevelSrc.asObservable();

  private readonly dataLevelOptionsSrc = new BehaviorSubject<Array<DataLevel>>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dataLevelOptionsObs = this.dataLevelOptionsSrc.asObservable();

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public parameterChangedObs = this.parameterChangedSrc.asObservable();

  constructor(
    public dictionariesService: DictionaryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    route: ActivatedRoute,
  ) {
    // set from query params on init
    this.setCountryId(QuickMapsQueryParams.getCountryId(route.snapshot));
    this.setMicronutrientId(QuickMapsQueryParams.getMicronutrientId(route.snapshot));
    this.setMndDataId(QuickMapsQueryParams.getMndsDataId(route.snapshot));
    this.setDataLevel(QuickMapsQueryParams.getDataLevel(route.snapshot));

    this.countryIdObs.subscribe(() => this.parameterChanged());
    this.micronutrientIdObs.subscribe(() => this.parameterChanged());
    this.mndDataIdObs.subscribe(() => this.parameterChanged());
    this.dataLevelObs.subscribe(() => this.parameterChanged());
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

  public get countryId(): string {
    return this.countryIdSrc.value;
  }
  public setCountryId(countryId: string, force = false): void {
    this.setValue(this.countryIdSrc, countryId, force);
  }

  public get micronutrientId(): string {
    return this.micronutrientIdSrc.value;
  }
  public setMicronutrientId(micronutrientId: string, force = false): void {
    this.setValue(this.micronutrientIdSrc, micronutrientId, force);
  }

  public get mndDataId(): string {
    return this.mndDataIdSrc.value;
  }
  public setMndDataId(mndDataId: string, force = false): void {
    this.setValue(this.mndDataIdSrc, mndDataId, force);
  }

  public get dataLevel(): DataLevel {
    return this.dataLevelSrc.value;
  }
  public setDataLevel(dataLevel: DataLevel, force = false): void {
    this.setValue(this.dataLevelSrc, dataLevel, force);
  }
  public get dataLevelOptions(): Array<DataLevel> {
    return this.dataLevelOptionsSrc.value;
  }
  public setDataLevelOptions(dataLevels: Array<DataLevel>, force = false): void {
    this.setValue(this.dataLevelOptionsSrc, dataLevels, force);
    if (!dataLevels.includes(this.dataLevel)) {
      this.setDataLevel(dataLevels[0]);
    }
  }

  public updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = this.countryId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] = this.micronutrientId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_DATASET] = this.mndDataId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL] = this.dataLevel;
    QuickMapsQueryParams.setQueryParams(this.router, this.activatedRoute, paramsObj);
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
}
