import { DietaryChangeMode } from 'src/app/pages/quickMaps/pages/dietaryChange/dietaryChangeMode.enum';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { Accessor } from 'src/utility/accessor';
import { Dictionary } from '../_lib_code/objects/dictionary';
import { CurrentComposition } from './currentComposition';
import { CurrentValue } from './currentValue.interface';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';
import { MicronutrientDictionaryItem } from './dictionaries/micronutrientDictionaryItem';
import { NumberChangeItem, DietaryChangeItem, FoodItemChangeItem } from './dietaryChangeItem';
import { FoodSystemsDataSource } from './foodSystemsDataSource';

export class DietaryChangeItemFactory {
  constructor(
    private scenarioDataService: ScenarioDataService,
    private foodGroupsDict: Dictionary,
    private modeAccessor: Accessor<DietaryChangeMode>,
    private FoodSystemsDataSourceAccessor: Accessor<FoodSystemsDataSource>,
    private micronutrientAccessor: Accessor<MicronutrientDictionaryItem>,
  ) {}

  public makeItem(
    _foodItem?: string | FoodDictionaryItem,
    _scenarioValue?: string | number | FoodDictionaryItem,
  ): Promise<DietaryChangeItem> {
    const mode = this.modeAccessor.get();
    const dds = this.FoodSystemsDataSourceAccessor.get();
    const micronutrient = this.micronutrientAccessor.get();

    let foodItem: FoodDictionaryItem;
    if (null != _foodItem) {
      foodItem =
        typeof _foodItem === 'string' ? this.getFoodItemByIdFromDict(this.foodGroupsDict, _foodItem) : _foodItem;
    }

    switch (mode) {
      case DietaryChangeMode.COMPOSITION:
      case DietaryChangeMode.CONSUMPTION: {
        return (
          null == foodItem
            ? Promise.resolve(null)
            : this.scenarioDataService.getCurrentValue(dds, mode, foodItem, micronutrient)
        ).then((_currentValue: CurrentValue) => {
          // flag no data if we called out and didn't get a response
          const noData = null == _currentValue && null != foodItem;
          const currentValue = null == _currentValue ? null : _currentValue.value;
          return new NumberChangeItem(
            foodItem,
            currentValue,
            null == _scenarioValue ? currentValue : Number(_scenarioValue),
            noData,
          );
        });
      }
      case DietaryChangeMode.FOOD_ITEM: {
        const scenarioValue =
          _scenarioValue instanceof FoodDictionaryItem
            ? _scenarioValue
            : this.getFoodItemByIdFromDict(this.foodGroupsDict, String(_scenarioValue));
        return (
          null == foodItem
            ? Promise.resolve([null, null])
            : Promise.all([
                this.scenarioDataService.getCurrentComposition(foodItem, dds, micronutrient),
                null == scenarioValue
                  ? Promise.resolve(null)
                  : this.scenarioDataService.getCurrentComposition(scenarioValue, dds, micronutrient),
              ])
        ).then(
          (compositions: [CurrentComposition, CurrentComposition]) =>
            new FoodItemChangeItem(foodItem, compositions[0], scenarioValue, compositions[1]),
        );
      }
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
}
