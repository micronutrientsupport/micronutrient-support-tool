import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    route: ActivatedRoute,
  ) {
    // set from query params on init
    this.setCountryId(QuickMapsQueryParams.getCountryId(route.snapshot));
    this.setMicronutrientId(QuickMapsQueryParams.getMicronutrientId(route.snapshot));
    this.setPopGroupId(QuickMapsQueryParams.getPopGroupId(route.snapshot));
    this.setMndDataId(QuickMapsQueryParams.getMndsDataId(route.snapshot));

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
      if (200 === count++) {
        clearInterval(interval);
      }
    }, 10);
  }

  public get countryId(): string {
    return this.countryIdSrc.value;
  }
  public setCountryId(countryId: string, force = false): void {
    if (force || (this.countryId !== countryId)) {
      this.countryIdSrc.next(countryId);
    }
  }

  public get micronutrientId(): string {
    return this.micronutrientIdSrc.value;
  }
  public setMicronutrientId(micronutrientId: string, force = false): void {
    if (force || (micronutrientId !== this.micronutrientId)) {
      this.micronutrientIdSrc.next(micronutrientId);
    }
  }

  public get popGroupId(): string {
    return this.popGroupIdSrc.value;
  }
  public setPopGroupId(popGroupId: string, force = false): void {
    if (force || (this.popGroupId !== popGroupId)) {
      this.popGroupIdSrc.next(popGroupId);
    }
  }

  public get mndDataId(): string {
    return this.mndDataIdSrc.value;
  }
  public setMndDataId(mndDataId: string, force = false): void {
    if (force || (this.mndDataId !== mndDataId)) {
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
