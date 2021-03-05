import { HttpClient } from '@angular/common/http';
import { ProjectionsSummaryCard as ProjectionsSummaryCard } from '../../objects/projectionsSummaryCard';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectionsSummaryCardData extends CacheableEndpoint<
  Array<ProjectionsSummaryCard>, ProjectionsSummaryCardParams, ProjectionsSummaryCard> {
  protected getCacheKey(params: ProjectionsSummaryCardParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
    // params: TopFoodParams,
  ): Promise<Array<ProjectionsSummaryCard>> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall('projections/summary', RequestMethod.GET, {

    });

    return this.buildObjectsFromResponse(ProjectionsSummaryCard, callResponsePromise);
  }

  protected callMock(
    // params: TopFoodParams,
  ): Promise<Array<ProjectionsSummaryCard>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ProjectionsSummaryCard,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            httpClient.get('').toPromise()
              .then((objects: Array<Record<string, unknown>>) => {
                if (null != objects[0]) {
                  // change something so that the display changes a little
                  objects[0].value = Math.floor(Math.random() * 3);
                }
                return objects;
              })
          );
        }, 1500);
      }),
    );
  }
}

export interface ProjectionsSummaryCardParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  scenarioId: string;
}
