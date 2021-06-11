/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { DietaryChangeService } from '../../dietaryChange.service';
import { DietaryChangeMode } from '../../dietaryChangeMode.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { CurrentConsumption } from 'src/app/apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from 'src/app/apiAndObjects/objects/currentComposition';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from 'src/app/apiAndObjects/objects/dietaryChange.item';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { CurrentValue } from 'src/app/apiAndObjects/objects/currentValue.interface';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-dc-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  public ROUTES = AppRoutes;
  public MODE_ENUM = DietaryChangeMode;

  public loading: boolean;
  public foodGroupsDict: Dictionary;

  public units: string;
  public modeText: string;
  public locallySelectedMode: DietaryChangeMode;

  public addItemDisabled = true;

  public changeableChangeItem: DietaryChangeItem;

  private subscriptions = new Array<Subscription>();

  private itemsChangedTimeout: NodeJS.Timeout;

  constructor(
    private cdr: ChangeDetectorRef,
    public quickMapsService: QuickMapsService,
    public dietaryChangeService: DietaryChangeService,
    dictionaryService: DictionaryService,
    private scenarioDataService: ScenarioDataService,
  ) {
    this.loading = true;
    void dictionaryService
      .getDictionary(DictionaryType.FOOD_GROUPS)
      .then((dict) => {
        this.foodGroupsDict = dict;
      })
      .finally(() => {
        this.loading = false;
        cdr.markForCheck();
        // this.exampleValueChange();
        // this.exampleCurrentComposition();
        // this.exampleCurrentConsumption();
      });
    this.subscriptions.push(
      dietaryChangeService.modeObs.subscribe((mode) => {
        this.modeChanged(mode);
      }),
    );
  }

  public init(): void {}

  public changeMode(event: MatRadioChange): void {
    let confirmed = true;
    // TODO: only show confirmation if anything will be lost
    if (true) {
      confirmed = confirm('ARE YOU SURE');
    }
    if (confirmed) {
      this.dietaryChangeService.setChangeItems([]);
      this.dietaryChangeService.setMode(event.value);
    } else {
      // set the mode back
      setTimeout(() => {
        this.locallySelectedMode = this.dietaryChangeService.mode;
        this.cdr.markForCheck();
      }, 0);
    }
  }

  public foodItemSelectChange(event: MatSelectChange, changeItem: DietaryChangeItem): void {
    // console.debug('foodItemSelectChange', event);
    const selectedFoodItem = event.value as FoodDictionaryItem;
    changeItem.clear();
    changeItem.foodItem = selectedFoodItem;

    switch (this.dietaryChangeService.mode) {
      case DietaryChangeMode.FOOD_ITEM:
        this.changeScenarioValue(changeItem, changeItem.currentValue);
        this.setChangeItemComposition(changeItem);
        break;
      default:
        void this.scenarioDataService
          .getCurrentValue(this.quickMapsService.dataSource, this.dietaryChangeService.mode, selectedFoodItem)
          .then((currentValue: CurrentValue) => {
            changeItem.currentValue = currentValue.value;
            this.changeScenarioValue(changeItem, currentValue.value);
          });
    }
  }
  public changeScenarioValue(item: DietaryChangeItem, newValue: number | FoodDictionaryItem): void {
    item.scenarioValue = newValue;
    if (item instanceof FoodItemChangeItem) {
      this.setChangeItemComposition(item);
    } else {
    }
    this.itemsChanged();
    // const newItem = this.makeChangeItem(item.foodItem, item.currentValue, newValue);
  }

  public resetChangeItem(changeItem: DietaryChangeItem): void {
    const initiallyUseable = changeItem.isUseable();
    changeItem.clear();
    if (initiallyUseable) {
      this.itemsChanged();
    }
    this.cdr.markForCheck();
  }

  public addChangeItem(): void {
    const changeItems = this.dietaryChangeService.changeItems.slice();
    changeItems.push(this.makeChangeItem());
    this.dietaryChangeService.setChangeItems(changeItems);
  }

  private setChangeItemComposition(foodChangeItem: DietaryChangeItem): void {
    if (null != foodChangeItem.foodItem) {
      if (null == foodChangeItem.currentComposition) {
        foodChangeItem.currentComposition = null;
        void this.scenarioDataService
          .getCurrentComposition(foodChangeItem.foodItem, this.quickMapsService.dataSource)
          .then((currentComposition: CurrentComposition) => {
            foodChangeItem.currentComposition = currentComposition;
            this.cdr.markForCheck();
          });
      }
      if (foodChangeItem instanceof FoodItemChangeItem && null != foodChangeItem.scenarioValue) {
        foodChangeItem.scenarioComposition = null;
        void this.scenarioDataService
          .getCurrentComposition(foodChangeItem.scenarioValue, this.quickMapsService.dataSource)
          .then((currentComposition: CurrentComposition) => {
            foodChangeItem.scenarioComposition = currentComposition;
            this.cdr.markForCheck();
          });
      }
    }
  }

  private itemsChanged(): void {
    const lastItem = this.dietaryChangeService.changeItems[this.dietaryChangeService.changeItems.length - 1];

    if (null != lastItem) {
      this.addItemDisabled = !lastItem.isUseable();
    }

    // console.debug('itemsChanged');
    // wait for inactivity before triggering update
    clearTimeout(this.itemsChangedTimeout);
    this.itemsChangedTimeout = setTimeout(() => {
      // force as array is the same ref
      this.dietaryChangeService.setChangeItems(this.dietaryChangeService.changeItems, true);
    }, 500);
  }

  private modeChanged(newMode: DietaryChangeMode): void {
    console.log('value:', newMode);
    this.locallySelectedMode = newMode;
    this.modeText = DietaryChangeMode[newMode];

    this.changeableChangeItem = this.makeChangeItem();
    if (this.dietaryChangeService.changeItems.length === 0) {
      this.addChangeItem();
    }
    switch (newMode) {
      case DietaryChangeMode.COMPOSITION:
        this.units = 'mg/kg';
        break;
      case DietaryChangeMode.CONSUMPTION:
        this.units = 'ml/AME/day';
        break;
      case DietaryChangeMode.FOOD_ITEM:
        this.units = '';
        break;
    }
  }

  private makeChangeItem(): DietaryChangeItem {
    switch (this.dietaryChangeService.mode) {
      case DietaryChangeMode.COMPOSITION:
        return new CompositionChangeItem();
      case DietaryChangeMode.CONSUMPTION:
        return new ConsumptionChangeItem();
      case DietaryChangeMode.FOOD_ITEM:
        return new FoodItemChangeItem();
    }
  }

  // private exampleValueChange(): void {
  //   // test
  //   setTimeout(() => {
  //     // COMPOSITION
  //     this.dietaryChangeService.setMode(DietaryChangeMode.COMPOSITION);
  //     this.dietaryChangeService.setChangeItems([
  //       new CompositionChangeItem()
  //         this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
  //         10,
  //       ),
  //     ]);
  //     // // CONSUMPTION
  //     // this.dietaryChangeService.setMode(DietaryChangeMode.CONSUMPTION);
  //     // this.dietaryChangeService.setChangeItems([
  //     //   new ConsumptionChangeItem(
  //     //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[3],
  //     //     22,
  //     //   ),
  //     //   new ConsumptionChangeItem(
  //     //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[2],
  //     //     55,
  //     //   ),
  //     // ]);
  //     // // FOOD_ITEM
  //     // this.dietaryChangeService.setMode(DietaryChangeMode.FOOD_ITEM);
  //     // this.dietaryChangeService.setChangeItems([
  //     //   new FoodItemChangeItem(
  //     //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
  //     //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[1].foodItems.getItems<FoodDictionaryItem>()[1],
  //     //   ),
  //     // ]);
  //   }, 3000);
  // }

  // private exampleCurrentConsumption(): void {
  //   void this.scenarioDataService
  //     .getCurrentConsumption(
  //       this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
  //       this.quickMapsService.dataSource,
  //     )
  //     .then((item: CurrentConsumption) => {
  //       console.log('CurrentConsumption item', item);
  //     });
  // }

  // private exampleCurrentComposition(): void {
  //   void this.scenarioDataService
  //     .getCurrentComposition(
  //       this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
  //       this.quickMapsService.dataSource,
  //     )
  //     .then((item: CurrentComposition) => {
  //       console.log('CurrentComposition item', item);
  //     });
  // }
}
