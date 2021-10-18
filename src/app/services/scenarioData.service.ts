import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { FoodDictionaryItem } from '../apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from '../apiAndObjects/objects/currentComposition';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from '../apiAndObjects/objects/dietaryChange.item';
import { DietaryChangeMode } from '../pages/quickMaps/pages/dietaryChange/dietaryChangeMode.enum';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { CurrentValue } from '../apiAndObjects/objects/currentValue.interface';
import { DietDataSource } from '../apiAndObjects/objects/dietDataSource';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';

@Injectable()
export class ScenarioDataService {
  constructor(private apiService: ApiService) {}

  public getCurrentComposition(
    foodItem: FoodDictionaryItem,
    dataSource: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<CurrentComposition> {
    return this.apiService.endpoints.scenario.getCurrentComposition.call({
      dataSource,
      foodItem,
      micronutrient,
    });
  }

  public getCurrentConsumption(foodItem: FoodDictionaryItem, dataSource: DietDataSource): Promise<CurrentConsumption> {
    return this.apiService.endpoints.scenario.getCurrentConsumption.call({
      dataSource,
      foodItem,
    });
  }

  public getCurrentValue(
    dataSource: DietDataSource,
    mode: DietaryChangeMode,
    foodItem: FoodDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<CurrentValue> {
    switch (mode) {
      case DietaryChangeMode.COMPOSITION:
        return this.getCurrentComposition(foodItem, dataSource, micronutrient);
      case DietaryChangeMode.CONSUMPTION:
        return this.getCurrentConsumption(foodItem, dataSource);
    }
  }

  public getDietChangeComposition(
    dataSource: DietDataSource,
    changeItems: Array<CompositionChangeItem>,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.scenario.getDietChangeComposition.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChangeConsumption(
    dataSource: DietDataSource,
    changeItems: Array<ConsumptionChangeItem>,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.scenario.getDietChangeConsumption.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChangeFoodItem(
    dataSource: DietDataSource,
    changeItems: Array<FoodItemChangeItem>,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.scenario.getDietChangeFoodItem.call({
      dataSource,
      changeItems,
    });
  }

  public getDietChange(
    dataSource: DietDataSource,
    mode: DietaryChangeMode,
    changeItems: Array<DietaryChangeItem>,
  ): Promise<SubRegionDataItem> {
    // console.debug('getDietChange', changeItems);
    type promiseFuncType = (
      dataSourcey: DietDataSource,
      changeItemsy: Array<DietaryChangeItem>,
    ) => Promise<SubRegionDataItem>;
    let promiseFunc: promiseFuncType;

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
    promiseFunc = promiseFunc.bind(this) as promiseFuncType;
    return promiseFunc(dataSource, changeItems);
  }
}
