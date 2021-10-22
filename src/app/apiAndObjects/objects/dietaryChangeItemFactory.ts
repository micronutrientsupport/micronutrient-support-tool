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
    foodItem: string | FoodDictionaryItem,
    scenarioValue: string | number | FoodDictionaryItem,
  ): Promise<DietaryChangeItem> {
    const foodDictItem =
      typeof foodItem === 'string' ? this.getFoodItemByIdFromDict(this.foodGroupsDict, foodItem) : foodItem;
    const mode = this.modeAccessor.get();
    const dds = this.dietDataSourceAccessor.get();
    const micronutrient = this.micronutrientAccessor.get();

    const changeItem = this.makeChangeItem(mode);
    changeItem.foodItem = foodDictItem;
    changeItem.foodGroup = foodDictItem?.group;

    if (changeItem instanceof FoodItemChangeItem) {
      changeItem.scenarioValue =
        scenarioValue instanceof FoodDictionaryItem
          ? scenarioValue
          : this.getFoodItemByIdFromDict(this.foodGroupsDict, String(scenarioValue));
      changeItem.scenarioFoodItemGroup = changeItem.scenarioValue?.group;
    } else {
      changeItem.scenarioValue = Number(scenarioValue);
    }

    // TODO: now validate what we've got

    // call out for other values
    return Promise.all([
      this.setCurrentValues(changeItem, mode, dds, micronutrient),
      this.setCompositions(changeItem, dds, micronutrient),
      // eslint-disable-next-line arrow-body-style
    ]).then(() => {
      // console.debug('ietm', changeItem);
      return changeItem;
    });
  }

  private setCurrentValues(
    changeItem: DietaryChangeItem,
    mode: DietaryChangeMode,
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    return changeItem instanceof FoodItemChangeItem
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          changeItem.updatingScenarioValue = true;
          resolve(
            this.scenarioDataService
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
    dds: DietDataSource,
    micronutrient: MicronutrientDictionaryItem,
  ): Promise<void> {
    return !(changeItem instanceof FoodItemChangeItem)
      ? Promise.resolve()
      : Promise.all([
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
            if (null == changeItem.scenarioValue) {
              resolve();
            } else {
              changeItem.scenarioComposition = null;
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
