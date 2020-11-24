import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

@Injectable()
export class QuickMapsService {
  private readonly countryIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public countryIdObs = this.countryIdSrc.asObservable();

  private readonly micronutrientIdsSrc = new BehaviorSubject<Array<string>>(null);
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

  public get selectedCountryId(): string {
    return this.countryIdSrc.value;
  }
  public setCountryId(countryId: string, force = false): void {
    if (force || (this.selectedCountryId !== countryId)) {
      this.countryIdSrc.next(countryId);
    }
  }

  public get selectedMicronutrientIds(): Array<string> {
    return this.micronutrientIdsSrc.value;
  }
  public setMicronutrientIds(micronutrientIds: Array<string>, force = false): void {
    micronutrientIds = QuickMapsQueryParams.filterAndSortArray(micronutrientIds);
    if (force || (QuickMapsQueryParams.compareArrays(micronutrientIds, this.selectedMicronutrientIds))) {
      this.micronutrientIdsSrc.next(micronutrientIds);
    }
  }

  private updateQueryParams(): void {
    const paramsObj = {} as Record<string, string | Array<string>>;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID] = this.selectedCountryId;
    paramsObj[QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_IDS] = this.selectedMicronutrientIds;
    QuickMapsQueryParams.setQueryParams(this.router, this.activatedRoute, paramsObj);

  }

}
