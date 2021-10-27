import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { FoodDictionaryItem } from '../apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { NumberChangeItem, DietaryChangeItem, FoodItemChangeItem } from '../apiAndObjects/objects/dietaryChangeItem';
import { DietaryChangeMode } from '../pages/quickMaps/pages/dietaryChange/dietaryChangeMode.enum';
import { DietDataSource } from '../apiAndObjects/objects/dietDataSource';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MnAvailibiltyItem } from '../apiAndObjects/objects/mnAvailibilityItem.abstract';
import { CurrentConsumption } from '../apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from '../apiAndObjects/objects/currentComposition';
import { CurrentValue } from '../apiAndObjects/objects/currentValue.interface';

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
    micronutrient: MicronutrientDictionaryItem,
    changeItems: Array<NumberChangeItem>,
  ): Promise<Array<MnAvailibiltyItem>> {
    return this.apiService.endpoints.scenario.getDietChangeComposition.call({
      dataSource,
      micronutrient,
      changeItems,
    });
  }

  public getDietChangeConsumption(
    dataSource: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
    changeItems: Array<NumberChangeItem>,
  ): Promise<Array<MnAvailibiltyItem>> {
    return this.apiService.endpoints.scenario.getDietChangeConsumption.call({
      dataSource,
      micronutrient,
      changeItems,
    });
  }

  public getDietChangeFoodItem(
    dataSource: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
    changeItems: Array<FoodItemChangeItem>,
  ): Promise<Array<MnAvailibiltyItem>> {
    return this.apiService.endpoints.scenario.getDietChangeFoodItem.call({
      dataSource,
      micronutrient,
      changeItems,
    });
  }

  public getDietChange(
    dataSource: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
    mode: DietaryChangeMode,
    changeItems: Array<DietaryChangeItem>,
  ): Promise<Array<MnAvailibiltyItem>> {
    // console.debug('getDietChange', changeItems);
    type promiseFuncType = (
      dataSourcey: DietDataSource,
      micronutrienty: MicronutrientDictionaryItem,
      changeItemsy: Array<DietaryChangeItem>,
    ) => Promise<Array<MnAvailibiltyItem>>;
    let promiseFunc: promiseFuncType;

    let typeCheckFunc: (item: DietaryChangeItem) => boolean;

    switch (mode) {
      case DietaryChangeMode.COMPOSITION:
        typeCheckFunc = (item) => item instanceof NumberChangeItem;
        promiseFunc = this.getDietChangeComposition;
        break;
      case DietaryChangeMode.CONSUMPTION:
        typeCheckFunc = (item) => item instanceof NumberChangeItem;
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
    return promiseFunc(dataSource, micronutrient, changeItems);
  }
}
