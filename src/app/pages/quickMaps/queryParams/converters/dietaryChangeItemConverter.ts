import { Injector } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CurrentComposition } from 'src/app/apiAndObjects/objects/currentComposition';
import { CurrentValue } from 'src/app/apiAndObjects/objects/currentValue.interface';
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from 'src/app/apiAndObjects/objects/dietaryChangeItem';
import { DietDataSource } from 'src/app/apiAndObjects/objects/dietDataSource';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { DietaryChangeMode } from '../../pages/dietaryChange/dietaryChangeMode.enum';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';
import { Converter } from './converter.abstract';

export class DietaryChangeItemsConverter extends Converter<Array<DietaryChangeItem>> {
  constructor(queryStringkey: QuickMapsQueryParamKey) {
    super(queryStringkey);
  }

  public getString(): string {
    return this.item
      .filter((item) => item.isUseable())
      .map((item) =>
        item instanceof FoodItemChangeItem
          ? [item.foodItem.id, String(item.scenarioValue.id)].join('-')
          : [item.foodItem.id, String(item.scenarioValue)].join('-'),
      )
      .join(',');
  }
  public getItem(
    injector: Injector,
    modeProm: Promise<DietaryChangeMode>,
    dietDataSourceProm: Promise<DietDataSource>,
    micronutrientProm: Promise<MicronutrientDictionaryItem>,
  ): Promise<Array<DietaryChangeItem>> {
    const dictionariesService = injector.get<DictionaryService>(DictionaryService);
    const scenarioDataService = injector.get<ScenarioDataService>(ScenarioDataService);

    return Promise.all([
      modeProm,
      dietDataSourceProm,
      micronutrientProm,
      dictionariesService.getDictionary(DictionaryType.FOOD_GROUPS),
    ]).then((deps: Array<unknown>) => {
      const mode = deps.shift() as DietaryChangeMode;
      const dds = deps.shift() as DietDataSource;
      const micronutrient = deps.shift() as MicronutrientDictionaryItem;
      const foodGroupsDict = deps.shift() as Dictionary;

      return Promise.all(
        this.stringValue.split(',').map((itemString) => {
          const foodItemId = itemString.split('-')[0];
          const scenarioValue = itemString.split('-')[1];

          const changeItem = this.makeChangeItem(mode);
          changeItem.foodItem = this.getFoodItemByIdFromDict(foodGroupsDict, foodItemId);
          changeItem.foodGroup = changeItem.foodItem?.group;

          if (changeItem instanceof FoodItemChangeItem) {
            changeItem.scenarioValue = this.getFoodItemByIdFromDict(foodGroupsDict, scenarioValue);
            changeItem.scenarioFoodItemGroup = changeItem.scenarioValue?.group;
          } else {
            changeItem.scenarioValue = Number(scenarioValue);
          }

          // call out for other values
          return Promise.all([
            this.setCurrentValues(changeItem, mode, scenarioDataService, dds, micronutrient),
            this.setCompositions(changeItem, scenarioDataService, dds, micronutrient),
            // eslint-disable-next-line arrow-body-style
          ]).then(() => {
            // console.debug('ietm', changeItem);
            return changeItem;
          });
        }),
      );
    });
  }

  private setCurrentValues(
    changeItem: DietaryChangeItem,
    mode: DietaryChangeMode,
    scenarioDataService: ScenarioDataService,
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    return changeItem instanceof FoodItemChangeItem
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          changeItem.updatingScenarioValue = true;
          resolve(
            scenarioDataService
              .getCurrentValue(dds, mode, changeItem.foodItem, micronutrient)
              .then((currentValue: CurrentValue) => {
                changeItem.currentValue = currentValue.value;
              })
              .finally(() => (changeItem.updatingScenarioValue = false)),
          );
        });
  }

  private setCompositions(
    changeItem: DietaryChangeItem,
    scenarioDataService: ScenarioDataService,
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    return !(changeItem instanceof FoodItemChangeItem)
      ? Promise.resolve()
      : Promise.all([
          new Promise<void>((resolve) => {
            changeItem.updatingComposition = true;
            resolve(
              scenarioDataService
                .getCurrentComposition(changeItem.foodItem, dds, micronutrient)
                .then((currentComposition: CurrentComposition) => {
                  changeItem.currentComposition = currentComposition;
                })
                .finally(() => (changeItem.updatingComposition = false)),
            );
          }),
          new Promise<void>((resolve) => {
            if (null == changeItem.scenarioValue) {
              resolve();
            } else {
              changeItem.scenarioComposition = null;
              changeItem.updatingScenarioComposition = true;
              resolve(
                scenarioDataService
                  .getCurrentComposition(changeItem.scenarioValue, dds, micronutrient)
                  .then((scenarioComposition: CurrentComposition) => {
                    changeItem.scenarioComposition = scenarioComposition;
                  })
                  .finally(() => (changeItem.updatingScenarioComposition = false)),
              );
            }
          }),
        ]).then(() => Promise.resolve());
  }

  private getFoodItemByIdFromDict(foodGroupDict: Dictionary, itemId: string): FoodDictionaryItem {
    // extract all the food items from the groups then return the one we want
    return new Array<FoodDictionaryItem>()
      .concat(
        ...foodGroupDict
          .getItems<FoodGroupDictionaryItem>()
          .map((groupItem: FoodGroupDictionaryItem) => groupItem.foodItems.getItems<FoodDictionaryItem>()),
      )
      .find((foodItem) => foodItem.id === itemId);
  }

  private makeChangeItem(mode: DietaryChangeMode): DietaryChangeItem {
    switch (mode) {
      case DietaryChangeMode.COMPOSITION:
        return new CompositionChangeItem();
      case DietaryChangeMode.CONSUMPTION:
        return new ConsumptionChangeItem();
      case DietaryChangeMode.FOOD_ITEM:
        return new FoodItemChangeItem();
    }
  }
}
