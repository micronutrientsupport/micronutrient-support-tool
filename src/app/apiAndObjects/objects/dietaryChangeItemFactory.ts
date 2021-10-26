import { DietaryChangeMode } from 'src/app/pages/quickMaps/pages/dietaryChange/dietaryChangeMode.enum';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { Accessor } from 'src/utility/accessor';
import { Dictionary } from '../_lib_code/objects/dictionary';
import { CurrentComposition } from './currentComposition';
import { CurrentValue } from './currentValue.interface';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';
import { MicronutrientDictionaryItem } from './dictionaries/micronutrientDictionaryItem';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from './dietaryChangeItem';
import { DietDataSource } from './dietDataSource';

export class DietaryChangeItemFactory {
  constructor(
    private scenarioDataService: ScenarioDataService,
    private foodGroupsDict: Dictionary,
    private modeAccessor: Accessor<DietaryChangeMode>,
    private dietDataSourceAccessor: Accessor<DietDataSource>,
    private micronutrientAccessor: Accessor<MicronutrientDictionaryItem>,
  ) {}

  public makeItem(
    foodItem?: string | FoodDictionaryItem,
    scenarioValue?: string | number | FoodDictionaryItem,
  ): Promise<DietaryChangeItem> {
    const mode = this.modeAccessor.get();
    const changeItem = this.makeChangeItem(mode);

    if (null != foodItem) {
      const foodDictItem =
        typeof foodItem === 'string' ? this.getFoodItemByIdFromDict(this.foodGroupsDict, foodItem) : foodItem;

      changeItem.foodItem = foodDictItem;
      changeItem.foodGroup = foodDictItem?.group;
    }

    if (null != scenarioValue) {
      if (changeItem instanceof FoodItemChangeItem) {
        changeItem.scenarioValue =
          scenarioValue instanceof FoodDictionaryItem
            ? scenarioValue
            : this.getFoodItemByIdFromDict(this.foodGroupsDict, String(scenarioValue));
        changeItem.scenarioFoodItemGroup = changeItem.scenarioValue?.group;
      } else {
        changeItem.scenarioValue = Number(scenarioValue);
      }
    }

    const dds = this.dietDataSourceAccessor.get();
    const micronutrient = this.micronutrientAccessor.get();
    // call out for other values
    return Promise.all([
      this.setCurrentValues(changeItem, mode, dds, micronutrient),
      this.setCompositions(changeItem, dds, micronutrient),
      // eslint-disable-next-line arrow-body-style
    ]).then(() => {
      // console.debug('ietm', changeItem);

      // set usable flag
      if (changeItem instanceof FoodItemChangeItem) {
        changeItem.isUseable = null != changeItem.scenarioComposition;
      } else {
        if (null == changeItem.scenarioValue) {
          // default to current value
          changeItem.scenarioValue = changeItem.currentValue as number;
        }
        changeItem.isUseable = null != changeItem.scenarioValue;
      }
      return changeItem;
    });
  }

  private setCurrentValues(
    changeItem: DietaryChangeItem,
    mode: DietaryChangeMode,
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    if (changeItem instanceof FoodItemChangeItem || null == changeItem.foodItem) {
      changeItem.currentValue = null;
      changeItem.updatingScenarioValue = false;
      return Promise.resolve();
    } else {
      return new Promise<void>((resolve) => {
        changeItem.updatingScenarioValue = true;
        resolve(
          this.scenarioDataService
            .getCurrentValue(dds, mode, changeItem.foodItem, micronutrient)
            .then((currentValue: CurrentValue) => {
              if (null == currentValue) {
                changeItem.noData = true;
              } else {
                changeItem.currentValue = currentValue.value;
              }
            })
            .finally(() => (changeItem.updatingScenarioValue = false)),
        );
      });
    }
  }

  private setCompositions(
    changeItem: DietaryChangeItem,
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    if (!(changeItem instanceof FoodItemChangeItem) || null == changeItem.foodItem) {
      changeItem.currentComposition = null;
      changeItem.updatingComposition = null;
      changeItem.scenarioComposition = null;
      changeItem.updatingScenarioComposition = false;
      return Promise.resolve();
    } else {
      return Promise.all([
        new Promise<void>((resolve) => {
          changeItem.updatingComposition = true;
          resolve(
            this.scenarioDataService
              .getCurrentComposition(changeItem.foodItem, dds, micronutrient)
              .then((currentComposition: CurrentComposition) => {
                changeItem.currentComposition = currentComposition;
              })
              .finally(() => (changeItem.updatingComposition = false)),
          );
        }),
        new Promise<void>((resolve) => {
          changeItem.scenarioComposition = null;
          if (null == changeItem.scenarioValue) {
            changeItem.updatingScenarioComposition = false;
            resolve();
          } else {
            changeItem.updatingScenarioComposition = true;
            resolve(
              this.scenarioDataService
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
