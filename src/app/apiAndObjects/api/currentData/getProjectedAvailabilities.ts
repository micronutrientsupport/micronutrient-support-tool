import { HttpClient } from '@angular/common/http';
import { ProjectedAvailability } from '../../objects/projectedAvailability';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';

export class GetProjectedAvailabilities extends Endpoint<Array<ProjectedAvailability>, null, ProjectedAvailability> {
  protected callLive(): Promise<Array<ProjectedAvailability>> {
    const callResponsePromise = this.apiCaller.doCall('projection-total', RequestMethod.GET);
    return this.buildObjectsFromResponse(ProjectedAvailability, callResponsePromise);
  }

  protected callMock(): Promise<Array<ProjectedAvailability>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ProjectedAvailability,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/projection-total.json').toPromise());
        }, 1500);
      }),
    );
  }
}
