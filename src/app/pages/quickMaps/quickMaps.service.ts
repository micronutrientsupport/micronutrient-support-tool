import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

@Injectable()
export class QuickMapsService {
  private slimSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public slimObservable = this.slimSubject.asObservable();

  private readonly countryIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public countryIdObs = this.countryIdSrc.asObservable();

  private readonly micronutrientIdsSrc = new BehaviorSubject<Array<string>>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public micronutrientIdsObs = this.micronutrientIdsSrc.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    route: ActivatedRoute,
  ) {
    // set from query params on init
    this.setCountryId(QuickMapsQueryParams.getCountryId(route.snapshot));
    this.setMicronutrientIds(QuickMapsQueryParams.getMicronutrientIds(route.snapshot));

    this.countryIdObs.subscribe(() => this.updateQueryParams());
    this.micronutrientIdsObs.subscribe(() => this.updateQueryParams());
  }

  public sideNavToggle(): void {
    this.slimSubject.next(!this.slimSubject.value);
  }

  public get countryId(): string {
    return this.countryIdSrc.value;
  }
  public setCountryId(countryId: string, force = false): void {
    if (force || (this.countryId !== countryId)) {
      this.countryIdSrc.next(countryId);
    }
  }

  public get micronutrientIds(): Array<string> {
    return this.micronutrientIdsSrc.value;
  }
  public setMicronutrientIds(micronutrientIds: Array<string>, force = false): void {
    micronutrientIds = QuickMapsQueryParams.filterAndSortArray(micronutrientIds);
    if (force || (!QuickMapsQueryParams.arrayValuesSame(micronutrientIds, this.micronutrientIds))) {
      this.micronutrientIdsSrc.next(micronutrientIds);
    }
  }

  private updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = this.countryId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_IDS] = this.micronutrientIds;
    QuickMapsQueryParams.setQueryParams(this.router, this.activatedRoute, paramsObj);

  }

}
