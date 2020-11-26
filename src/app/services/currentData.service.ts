import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { PopulationGroup } from '../apiAndObjects/objects/populationGroup';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { DictionaryItem } from '../apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from './dictionary.service';

@Injectable()
export class CurrentDataService {
  constructor(private apiService: ApiService, private dictService: DictionaryService) {
  }

  public getMicronutrientDataOptions(
    countryOrgroup: DictionaryItem,
    micronutrients: Array<DictionaryItem>,
    populationGroup: PopulationGroup,
    singleOptionOnly: boolean,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.currentData.getMicronutrientDataOptions.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientIds: micronutrients.map(item => item.id),
      populationGroupId: populationGroup.id,
      singleOptionOnly: singleOptionOnly,
    });
  }

  public getSubRegionData(
    countryOrgroup: DictionaryItem,
    micronutrients: Array<DictionaryItem>,
    populationGroup: PopulationGroup,
    mndsData: MicronutrientDataOption,
  ): Promise<Array<SubRegionDataItem>> {
    return this.apiService.currentData.getSubRegionData.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientIds: micronutrients.map(item => item.id),
      populationGroupId: populationGroup.id,
      mndsDataId: mndsData.id,
    });
  }
}
