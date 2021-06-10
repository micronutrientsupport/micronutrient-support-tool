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

  public foodItemSelectChange(event: MatSelectChange): void {
    const foodItem = event.value as FoodDictionaryItem;
    void (null == foodItem
      ? Promise.resolve(null)
      : this.scenarioDataService
          .getCurrentValue(this.quickMapsService.dataSource, this.dietaryChangeService.mode, foodItem)
          .then((item: CurrentValue) => item.value)
    ).then((currentValue) => {
      this.changeableChangeItem = this.makeChangeItem(event.value, currentValue, currentValue);
      this.cdr.markForCheck();
    });
  }

  public changeScenarioValue(item: DietaryChangeItem, newValue: number | FoodDictionaryItem): void {
    item.scenarioValue = newValue;
    this.itemsChanged();
    // const newItem = this.makeChangeItem(item.foodItem, item.currentValue, newValue);
  }

  private itemsChanged(): void {
    // console.debug('itemsChanged');
    clearTimeout(this.itemsChangedTimeout);
    // wait for inactivity before triggering update
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

  private makeChangeItem(foodItem?: FoodDictionaryItem, currentValue?: any, scenarioValue?: any): DietaryChangeItem {
    switch (this.dietaryChangeService.mode) {
      case DietaryChangeMode.COMPOSITION:
        return new CompositionChangeItem(foodItem, currentValue, scenarioValue);
      case DietaryChangeMode.CONSUMPTION:
        return new ConsumptionChangeItem(foodItem, currentValue, scenarioValue);
      case DietaryChangeMode.FOOD_ITEM:
        return new FoodItemChangeItem(foodItem, currentValue, scenarioValue);
    }
  }

  private exampleValueChange(): void {
    // test
    setTimeout(() => {
      // COMPOSITION
      this.dietaryChangeService.setMode(DietaryChangeMode.COMPOSITION);
      this.dietaryChangeService.setChangeItems([
        new CompositionChangeItem(
          this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
          10,
        ),
      ]);
      // // CONSUMPTION
      // this.dietaryChangeService.setMode(DietaryChangeMode.CONSUMPTION);
      // this.dietaryChangeService.setChangeItems([
      //   new ConsumptionChangeItem(
      //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[3],
      //     22,
      //   ),
      //   new ConsumptionChangeItem(
      //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[2],
      //     55,
      //   ),
      // ]);
      // // FOOD_ITEM
      // this.dietaryChangeService.setMode(DietaryChangeMode.FOOD_ITEM);
      // this.dietaryChangeService.setChangeItems([
      //   new FoodItemChangeItem(
      //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
      //     this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[1].foodItems.getItems<FoodDictionaryItem>()[1],
      //   ),
      // ]);
    }, 3000);
  }

  private exampleCurrentConsumption(): void {
    void this.scenarioDataService
      .getCurrentConsumption(
        this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
        this.quickMapsService.dataSource,
      )
      .then((item: CurrentConsumption) => {
        console.log('CurrentConsumption item', item);
      });
  }

  private exampleCurrentComposition(): void {
    void this.scenarioDataService
      .getCurrentComposition(
        this.foodGroupsDict.getItems<FoodGroupDictionaryItem>()[0].foodItems.getItems<FoodDictionaryItem>()[0],
        this.quickMapsService.dataSource,
      )
      .then((item: CurrentComposition) => {
        console.log('CurrentComposition item', item);
      });
  }
}
