import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class QuickMapsService {
  private static readonly QUERY_PARAM_COUNTRY_ID = 'countryId';
  private readonly selectedCountryIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public selectedCountryObs = this.selectedCountryIdSrc.asObservable();

  constructor(private activatedRoute: ActivatedRouteSnapshot) {
    this.setSelectedCountryId(this.activatedRoute.queryParamMap.get(QuickMapsService.QUERY_PARAM_COUNTRY_ID));
  }

  public get selectedCountryId(): string {
    return this.selectedCountryIdSrc.value;
  }

  public setSelectedCountryId(countryId: string, force = false): void {
    if (force || (this.selectedCountryId !== countryId)) {
      this.selectedCountryIdSrc.next(countryId);
    }
  }
}
