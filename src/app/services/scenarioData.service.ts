import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { FoodDictionaryItem } from '../apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from '../apiAndObjects/objects/currentComposition';

@Injectable()
export class ScenarioDataService {
  constructor(private apiService: ApiService) {}

  public getCurrentComposition(foodItem: FoodDictionaryItem, dataSource: DataSource): Promise<CurrentComposition> {
    return this.apiService.endpoints.scenario.getCurrentComposition.call({
      foodItem,
      dataSource,
    });
  }

  public getCurrentConsumption(foodItem: FoodDictionaryItem, dataSource: DataSource): Promise<CurrentConsumption> {
    return this.apiService.endpoints.scenario.getCurrentConsumption.call({
      foodItem,
      dataSource,
    });
  }
}
