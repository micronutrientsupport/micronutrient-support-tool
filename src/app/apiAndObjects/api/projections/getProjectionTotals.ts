import { HttpClient } from '@angular/common/http';
import { ProjectedAvailability } from '../../objects/projectedAvailability';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { ImpactScenarioDictionaryItem } from '../../objects/dictionaries/impactScenarioDictionaryItem';
import { lastValueFrom } from 'rxjs';

export class GetProjectionTotals extends Endpoint<
  Array<ProjectedAvailability>,
  GetProjectionTotalsParams,
  ProjectedAvailability
> {
  protected callLive(params: GetProjectionTotalsParams): Promise<Array<ProjectedAvailability>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', 'projections', 'totals'],
      RequestMethod.GET,
      this.removeNullsFromObject({
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
        scenarioId: null != params.scenario ? params.scenario.id : null,
        year: params.year,
      }) as Record<string, string>,
    );
    return this.buildObjectsFromResponse(ProjectedAvailability, callResponsePromise);
  }

  protected callMock(params: GetProjectionTotalsParams): Promise<Array<ProjectedAvailability>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ProjectedAvailability,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/projection-total.json')) as Promise<
              Array<ProjectedAvailability>
            >,
          );
        }, 1500);
      }).then((data: Array<Record<string, unknown>>) =>
        data.map((item) => {
          item[params.micronutrient.id] = item.Fe;
          item[params.micronutrient.id + 'Diff'] = item.FeDiff;
          return item;
        }),
      ),
    );
  }
}

export interface GetProjectionTotalsParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  scenario?: ImpactScenarioDictionaryItem;
  year?: string;
}
