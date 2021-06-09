import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { FoodDictionaryItem } from '../apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from '../apiAndObjects/objects/currentComposition';
import { DietChangeFoodItem } from '../apiAndObjects/objects/dietChangeFoodItem';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from '../apiAndObjects/objects/dietaryChange.item';
import { DietChangeComposition } from '../apiAndObjects/objects/dietChangeComposition';
import { DietChangeConsumption } from '../apiAndObjects/objects/dietChangeConsumption';
import { DietaryChangeMode } from '../pages/quickMaps/pages/dietaryChange/dietaryChangeMode.enum';
import { DietChangeData } from '../apiAndObjects/objects/dietChangeData';

@Injectable()
export class ScenarioDataService {
  constructor(private apiService: ApiService) {}

  public getCurrentComposition(foodItem: FoodDictionaryItem, dataSource: DataSource): Promise<CurrentComposition> {
    return this.apiService.endpoints.scenario.getCurrentComposition.call({
      dataSource,
      foodItem,
    });
  }

  public getCurrentConsumption(foodItem: FoodDictionaryItem, dataSource: DataSource): Promise<CurrentConsumption> {
    return this.apiService.endpoints.scenario.getCurrentConsumption.call({
      dataSource,
      foodItem,
    });
  }

  public getDietChangeComposition(
    dataSource: DataSource,
    changeItems: Array<CompositionChangeItem>,
  ): Promise<DietChangeComposition> {
    return this.apiService.endpoints.scenario.getDietChangeComposition.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChangeConsumption(
    dataSource: DataSource,
    changeItems: Array<ConsumptionChangeItem>,
  ): Promise<DietChangeConsumption> {
    return this.apiService.endpoints.scenario.getDietChangeConsumption.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChangeFoodItem(
    dataSource: DataSource,
    changeItems: Array<FoodItemChangeItem>,
  ): Promise<DietChangeFoodItem> {
    return this.apiService.endpoints.scenario.getDietChangeFoodItem.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChange(
    dataSource: DataSource,
    mode: DietaryChangeMode,
    changeItems: Array<DietaryChangeItem>,
  ): Promise<DietChangeData> {
    let promiseFunc: (dataSourcey: DataSource, changeItemsy: Array<DietaryChangeItem>) => Promise<DietChangeData>;

    let typeCheckFunc: (item: DietaryChangeItem) => boolean;

    switch (mode) {
      case DietaryChangeMode.COMPOSITION:
        typeCheckFunc = (item) => item instanceof CompositionChangeItem;
        promiseFunc = this.getDietChangeComposition;
        break;
      case DietaryChangeMode.CONSUMPTION:
        typeCheckFunc = (item) => item instanceof ConsumptionChangeItem;
        promiseFunc = this.getDietChangeConsumption;
        break;
      case DietaryChangeMode.FOOD_ITEM:
        typeCheckFunc = (item) => item instanceof FoodItemChangeItem;
        promiseFunc = this.getDietChangeFoodItem;
        break;
    }

    // check change items all correct type
    if (!changeItems.every((item) => typeCheckFunc(item))) {
      throw new Error('Incorrect DietaryChangeItem type for DietaryChangeMode');
    }
    return promiseFunc(dataSource, changeItems);
  }
}
