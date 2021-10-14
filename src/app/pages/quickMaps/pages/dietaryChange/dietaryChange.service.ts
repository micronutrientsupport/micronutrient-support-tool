import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DietaryChangeItem } from 'src/app/apiAndObjects/objects/dietaryChange.item';
import { DietaryChangeMode } from './dietaryChangeMode.enum';

@Injectable()
export class DietaryChangeService {
  private initSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public initObservable = this.initSrc.asObservable();

  private readonly modeSrc = new BehaviorSubject<DietaryChangeMode>(DietaryChangeMode.COMPOSITION);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public modeObs = this.modeSrc.asObservable();

  private readonly changeItemsSrc = new BehaviorSubject<Array<DietaryChangeItem>>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public changeItemsObs = this.changeItemsSrc.asObservable();

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly parameterChangedObs = this.parameterChangedSrc.asObservable();

  private parameterChangeTimeout: NodeJS.Timeout;

  // private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(injector: Injector) {
    // this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    // this.setMeasure(this.quickMapsParameters.getMeasure());
    // this.setDataLevel(this.quickMapsParameters.getDataLevel());

    this.initSubscriptions();
    this.initSrc.next(true);
  }

  public get mode(): DietaryChangeMode {
    return this.modeSrc.value;
  }
  public setMode(mode: DietaryChangeMode, force = false): void {
    this.setValue(this.modeSrc, mode, force);
  }
  public get changeItems(): Array<DietaryChangeItem> {
    return this.changeItemsSrc.value;
  }
  public setChangeItems(changeItems: Array<DietaryChangeItem>, force = false): void {
    this.setValue(this.changeItemsSrc, changeItems, force);
  }

  // public updateQueryParams(): void {
  //   const paramsObj = {} as Record<string, string | Array<string>>;
  //   paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = null != this.country ? this.country.id : null;
  //   paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] =
  //     null != this.micronutrient ? this.micronutrient.id : null;
  //   paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE] = this.measure;
  //   paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL] = this.dataLevel;
  //   paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.AGE_GENDER_GROUP] =
  //     null != this.ageGenderGroup ? this.ageGenderGroup.id : null;
  //   this.quickMapsParameters.setQueryParams(paramsObj);
  // }

  protected setValue<T>(srcRef: BehaviorSubject<T>, value: T, force: boolean): void {
    if (force || srcRef.value !== value) {
      srcRef.next(value);
    }
  }

  private initSubscriptions(): void {
    // set up the parameter changed triggers on param changes
    this.modeObs.subscribe(() => this.parameterChanged());
    this.changeItemsObs.subscribe(() => this.parameterChanged());
  }

  private parameterChanged(): void {
    // this.updateQueryParams();
    // ensure not triggered too many times in quick succession
    clearTimeout(this.parameterChangeTimeout);
    this.parameterChangeTimeout = setTimeout(() => {
      this.parameterChangedSrc.next();
    }, 100);
  }
}
