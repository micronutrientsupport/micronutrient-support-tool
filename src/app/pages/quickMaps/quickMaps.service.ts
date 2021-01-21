import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

@Injectable()
export class QuickMapsService {
  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;

  private slimSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public slimObservable = this.slimSubject.asObservable();

  private readonly countryIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public countryIdObs = this.countryIdSrc.asObservable();

  private readonly micronutrientIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public micronutrientIdObs = this.micronutrientIdSrc.asObservable();

  private readonly popGroupIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public popGroupIdObs = this.popGroupIdSrc.asObservable();

  private readonly mndDataIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public mndDataIdObs = this.mndDataIdSrc.asObservable();

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
    this.setPopGroupId(QuickMapsQueryParams.getPopGroupId(route.snapshot));
    this.setMndDataId(QuickMapsQueryParams.getMndsDataId(route.snapshot));

    this.countryIdObs.subscribe(() => this.updateQueryParams());
    this.micronutrientIdObs.subscribe(() => this.updateQueryParams());
    this.popGroupIdObs.subscribe(() => this.updateQueryParams());
    this.mndDataIdObs.subscribe(() => this.updateQueryParams());

    void dictionariesService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();
      });
    this.countryIdObs.subscribe(() => this.parameterChanged());
    this.micronutrientIdObs.subscribe(() => this.parameterChanged());
    this.popGroupIdObs.subscribe(() => this.parameterChanged());
    this.mndDataIdObs.subscribe(() => this.parameterChanged());
  }

  public sideNavToggle(): void {
    this.slimSubject.next(!this.slimSubject.value);
    // ensure content reacts to change in size
    let count = 0;
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      if (20 === count++) {
        clearInterval(interval);
      }
    }, 50);
  }

  public get countryId(): string {
    return this.countryIdSrc.value;
  }
  public get countryDict(): DictionaryItem {
    return this.countriesDictionary.getItem(this.countryId);
  }
  public setCountryId(countryId: string, force = false): void {
    if (force || this.countryId !== countryId) {
      this.countryIdSrc.next(countryId);
    }
  }

  public get micronutrientId(): string {
    return this.micronutrientIdSrc.value;
  }
  public get micronutrientDict(): DictionaryItem[] {
    const arrayOfMicroDict: DictionaryItem[] = [];
    arrayOfMicroDict.push(this.micronutrientsDictionary.getItem(this.micronutrientId));
    return arrayOfMicroDict;
  }
  public setMicronutrientId(micronutrientId: string, force = false): void {
    if (force || micronutrientId !== this.micronutrientId) {
      this.micronutrientIdSrc.next(micronutrientId);
    }
  }

  public get popGroupId(): string {
    return this.popGroupIdSrc.value;
  }
  public setPopGroupId(popGroupId: string, force = false): void {
    if (force || this.popGroupId !== popGroupId) {
      this.popGroupIdSrc.next(popGroupId);
    }
  }

  public get mndDataId(): string {
    return this.mndDataIdSrc.value;
  }
  public setMndDataId(mndDataId: string, force = false): void {
    if (force || this.mndDataId !== mndDataId) {
      this.mndDataIdSrc.next(mndDataId);
    }
  }

  private parameterChanged(): void {
    this.updateQueryParams();
    this.parameterChangedSrc.next();
  }

  private updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = this.countryId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID] = this.micronutrientId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.POP_GROUP_ID] = this.popGroupId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_DATASET] = this.mndDataId;
    QuickMapsQueryParams.setQueryParams(this.router, this.activatedRoute, paramsObj);
  }
}
