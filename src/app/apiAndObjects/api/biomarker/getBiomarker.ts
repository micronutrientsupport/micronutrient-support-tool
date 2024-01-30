import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Biomarker } from '../../objects/biomarker';

export class GetBiomarker extends CacheableEndpoint<Array<Biomarker>, GetBiomarkerParams, Biomarker> {
  protected getCacheKey(params: GetBiomarkerParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetBiomarkerParams): Promise<Array<Biomarker>> {
    const callResponsePromise = this.apiCaller.doCall(['biomarker'], RequestMethod.GET, {
      surveyId: params.surveyId,
      groupId: params.groupId,
      biomarker: params.biomarker,
      aggregationField: params.aggregationField,
    });
    return this.buildObjectsFromResponse(Biomarker, callResponsePromise);
  }

  protected callMock(): Promise<Biomarker[]> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      Biomarker,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(lastValueFrom(httpClient.get('/assets/exampleData/biomarker.json')));
        }, 1500);
      }),
    );
  }
}

export interface GetBiomarkerParams {
  surveyId: string;
  groupId: string;
  biomarker: string;
  aggregationField?: string;
}
