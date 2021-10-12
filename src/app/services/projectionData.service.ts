import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { ImpactScenarioDictionaryItem } from '../apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { FoodSourceGroup } from '../apiAndObjects/objects/enums/foodSourceGroup.enum';
import { MicronutrientProjectionSource } from '../apiAndObjects/objects/micronutrientProjectionSource.abstract';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { ProjectionsSummary } from '../apiAndObjects/objects/projectionSummary';

@Injectable()
export class ProjectionDataService {
  constructor(private apiService: ApiService) {
    // TEST
    // void MicronutrientDictionaryItem.constructObject({ id: 'A' })
    //   .then((item: MicronutrientDictionaryItem) => {
    //     void this.apiService.endpoints.currentData.getAgeGenderGroups.call({
    //       micronutrients: [item],
    //     }).then(data => console.debug(data));
    //   });
  }

  public getProjectionSources(
    foodSourceGroup: FoodSourceGroup,
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    scenario: ImpactScenarioDictionaryItem,
    year?: string,
  ): Promise<Array<MicronutrientProjectionSource>> {
    return this.apiService.endpoints.projections.getMicronutrientProjectionSources.call({
      foodSourceGroup: foodSourceGroup,
      country: country,
      micronutrient: micronutrient,
      scenario: scenario,
      year: year,
    });
  }

  public getProjectionSummaries(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    scenario: ImpactScenarioDictionaryItem,
  ): Promise<ProjectionsSummary> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.projections.getProjectionSummaries.call({
      country: country,
      micronutrient: micronutrient,
      scenario: scenario,
    });
  }

  public getProjectedAvailabilities(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    scenario?: ImpactScenarioDictionaryItem,
    year?: string,
  ): Promise<Array<ProjectedAvailability>> {
    return this.apiService.endpoints.projections.getProjectionTotals.call({
      country: country,
      micronutrient: micronutrient,
      scenario: scenario,
      year: year,
    });
  }
}
