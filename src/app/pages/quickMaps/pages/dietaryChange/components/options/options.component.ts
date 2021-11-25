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
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import {
  DietaryChangeItem,
  FoodItemChangeItem,
  NumberChangeItem,
} from 'src/app/apiAndObjects/objects/dietaryChangeItem';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DietaryChangeItemFactory } from 'src/app/apiAndObjects/objects/dietaryChangeItemFactory';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-dc-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  public readonly ROUTES = AppRoutes;
  public readonly MODE_ENUM = DietaryChangeMode;
  public readonly FoodItemChangeItem = FoodItemChangeItem;
  public readonly NumberChangeItem = NumberChangeItem;

  public loading: boolean;
  public foodGroupsDict: Dictionary;
  public filteredFoodGroups: Array<FoodGroupDictionaryItem>;
  public filteredFoodItems: Array<FoodDictionaryItem>;

  public units: string;
  public modeText: string;
  public locallySelectedMode: DietaryChangeMode;

  private dietaryChangeItemFactory: DietaryChangeItemFactory;
  private subscriptions = new Array<Subscription>();

  private scenarioValueChangeTimeout: NodeJS.Timeout;
  private refreshAllChangeItemsTimeout: NodeJS.Timeout;

  constructor(
    private cdr: ChangeDetectorRef,
    public quickMapsService: QuickMapsService,
    public dietaryChangeService: DietaryChangeService,
    public dictionaryService: DictionaryService,
    private scenarioDataService: ScenarioDataService,
    public dialogService: DialogService,
  ) {
    this.loading = true;

    this.subscriptions.push(
      quickMapsService.dietParameterChangedObs.subscribe(() => {
        // don't trigger when first subscribe as that will reset the loaded in values.
        // wait until data loaded before reacting
        if (dietaryChangeService.init.get()) {
          this.refreshAllChangeItems();
        }
      }),
    );

    void dictionaryService
      .getDictionary(DictionaryType.FOOD_GROUPS)
      .then((dict) => {
        this.foodGroupsDict = dict;

        this.dietaryChangeItemFactory = new DietaryChangeItemFactory(
          this.scenarioDataService,
          this.foodGroupsDict,
          this.dietaryChangeService.mode,
          this.quickMapsService.dietDataSource,
          this.quickMapsService.micronutrient,
        );
        // after service has loaded in query data etc
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = dietaryChangeService.init.obs.subscribe((init) => {
          if (init) {
            if (null != subs) {
              subs.unsubscribe();
            }
            this.subscriptions.push(
              dietaryChangeService.mode.obs.subscribe((mode) => {
                this.modeChanged(mode);
              }),
              dietaryChangeService.changeItems.obs.subscribe(() => {
                this.updateFilteredFoodItems();
              }),
            );
          }
        });
      })
      .finally(() => {
        this.loading = false;
        cdr.markForCheck();
      })
      .catch((err) => {
        throw err;
      });
  }

  public changeMode(event: MatRadioChange): void {
    // only show confirmation if anything will be lost
    const changeItems = this.dietaryChangeService.changeItems.get();
    const lastItem = changeItems[changeItems.length - 1];

    void (
      changeItems.length > 1 || lastItem.isComplete
        ? this.dialogService.openScenarioChangeWarningDialog().then((data: DialogData) => data.dataOut as boolean)
        : Promise.resolve(true)
    ).then((confirmed) => {
      if (confirmed) {
        this.setFoodItems([]);
        this.dietaryChangeService.mode.set(event.value);
      } else {
        // set the mode back
        setTimeout(() => {
          this.locallySelectedMode = this.dietaryChangeService.mode.get();
          this.cdr.markForCheck();
        }, 0);
      }
    });
  }

  public foodItemSelectChange(event: MatSelectChange, changeItem: DietaryChangeItem): void {
    // console.debug('foodItemSelectChange', event);
    changeItem.updatingCurrent = true;
    const selectedFoodItem = event.value as FoodDictionaryItem;
    void this.dietaryChangeItemFactory.makeItem(selectedFoodItem).then((newChangeItem) => {
      this.replaceFoodItem(changeItem, newChangeItem);
    });
  }

  public foodGroupSelectChange(event: MatSelectChange, changeItem: DietaryChangeItem): void {
    void this.dietaryChangeItemFactory.makeItem().then((newChangeItem) => {
      newChangeItem.foodGroup = event.value as FoodGroupDictionaryItem;
      this.replaceFoodItem(changeItem, newChangeItem);
    });
  }

  public changeScenarioValue(changeItem: DietaryChangeItem, newValue: string | number | FoodDictionaryItem): void {
    if (typeof newValue === 'string') {
      newValue = Number(newValue);
    }
    // round numbers to 3dp
    if (typeof newValue === 'number') {
      newValue = Math.max(0, newValue);
      newValue = Math.round(newValue * 1000) / 1000;
      // update the display value but delay triggering changes elsewhere
      changeItem.scenarioValue = newValue;
      // wait for inactivity before triggering update
      clearTimeout(this.scenarioValueChangeTimeout);
      this.scenarioValueChangeTimeout = setTimeout(() => {
        // slice to make a new array so will trigger a change
        this.setFoodItems(this.dietaryChangeService.changeItems.get().slice());
      }, 500);
    } else {
      changeItem.updatingScenario = true;
      // we're in food item comparison mode, so change it straight away
      void this.dietaryChangeItemFactory.makeItem(changeItem.foodItem, newValue).then((newChangeItem) => {
        this.replaceFoodItem(changeItem, newChangeItem);
      });
    }
  }
  public changeFoodChangeScenarioGroup(changeItem: DietaryChangeItem, group: FoodGroupDictionaryItem): void {
    void this.dietaryChangeItemFactory.makeItem(changeItem.foodItem).then((newChangeItem: FoodItemChangeItem) => {
      newChangeItem.scenarioFoodItemGroup = group;
      this.replaceFoodItem(changeItem, newChangeItem);
    });
  }

  public deleteChangeItem(changeItem: DietaryChangeItem): void {
    this.replaceFoodItem(changeItem);
  }

  public addChangeItem(): void {
    // doesn't need to trigger update as new item isn't fully formed
    void this.dietaryChangeItemFactory.makeItem().then((item) => {
      const newItems = this.dietaryChangeService.changeItems.get().slice();
      newItems.push(item);
      this.setFoodItems(newItems);
    });
  }

  private replaceFoodItem(oldChangeItem: DietaryChangeItem, newChangeItem?: DietaryChangeItem): void {
    const foodItemPos = this.dietaryChangeService.changeItems.get().indexOf(oldChangeItem);
    let newChangeItems = this.dietaryChangeService.changeItems.get().slice();
    newChangeItems.splice(foodItemPos, 1, newChangeItem);
    newChangeItems = newChangeItems.filter((item) => null != item);
    this.setFoodItems(newChangeItems);
  }

  private setFoodItems(items: Array<DietaryChangeItem>): void {
    this.dietaryChangeService.changeItems.set(items);
  }

  private refreshAllChangeItems(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.refreshAllChangeItemsTimeout);
    this.refreshAllChangeItemsTimeout = setTimeout(() => {
      const newChangeItemProms = this.dietaryChangeService.changeItems.get().map((item) => {
        // mark current items updating
        item.updatingCurrent = true;
        item.updatingScenario = true;
        return this.dietaryChangeItemFactory.makeItem(item.foodItem);
      });
      void Promise.all(newChangeItemProms).then((items) => this.setFoodItems(items));
    }, 200);
  }

  private updateFilteredFoodItems(): void {
    if (null != this.foodGroupsDict) {
      const editableChangeItem =
        this.dietaryChangeService.changeItems.get()[this.dietaryChangeService.changeItems.get().length - 1];
      const selectedGroup = null != editableChangeItem ? editableChangeItem.foodGroup : null;
      const usedFoodItems = this.dietaryChangeService.changeItems.get().map((item) => item.foodItem);
      // for these purposes the last change item isn't classed as used as the fooditem is still selectable
      usedFoodItems.pop();

      const availableFoodItems = this.foodGroupsDict
        .getItems()
        .map((group: FoodGroupDictionaryItem) => group.foodItems.getItems())
        .reduce((allItems, theseItems) => allItems.concat(theseItems))
        .filter((item: FoodDictionaryItem) => !usedFoodItems.includes(item)) as Array<FoodDictionaryItem>;

      this.filteredFoodGroups = availableFoodItems
        .map((item) => item.group)
        // unique
        .filter((group: FoodGroupDictionaryItem, index, array) => array.indexOf(group) === index);

      this.filteredFoodItems =
        null == selectedGroup ? [] : availableFoodItems.filter((item) => item.group === selectedGroup);
    }
  }

  private ensureAtLeastOneChangeItem(): void {
    if (this.dietaryChangeService.changeItems.get().length === 0) {
      this.addChangeItem();
    }
  }
  private modeChanged(newMode: DietaryChangeMode): void {
    // console.log('value:', newMode);
    this.locallySelectedMode = newMode;
    this.modeText = DietaryChangeMode[newMode];

    this.ensureAtLeastOneChangeItem();

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
}
