import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { ApiMetadata } from '../../objects/apiMetadata';

export class GetApiMetadata extends Endpoint<ApiMetadata, GetApiMetadataParams, ApiMetadata> {
  protected callLive(): Promise<ApiMetadata> {
    const callResponsePromise = this.apiCaller.doCall(
      ['self', 'version'],
      RequestMethod.GET,
      this.removeNullsFromObject({}) as Record<string, string>,
    );
    return this.buildObjectFromResponse(ApiMetadata, callResponsePromise);
  }

  protected callMock(): Promise<ApiMetadata> {
    return Promise.resolve(
      ApiMetadata.constructObject({
        apiVersion: 'x',
        dataVersion: 'y',
        schemaVersion: 'z',
      }) as Promise<ApiMetadata>,
    );
  }
}

export interface GetApiMetadataParams {
  fetchApiVersion?: boolean;
  fetchSchemaVersion?: boolean;
  fetchDataVersion?: boolean;
}
