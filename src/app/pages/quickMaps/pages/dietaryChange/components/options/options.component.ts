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
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { CurrentComposition } from 'src/app/apiAndObjects/objects/currentComposition';
import { DietaryChangeItem, FoodItemChangeItem } from 'src/app/apiAndObjects/objects/dietaryChangeItem';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { CurrentValue } from 'src/app/apiAndObjects/objects/currentValue.interface';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DietaryChangeItemFactory } from 'src/app/apiAndObjects/objects/dietaryChangeItemFactory';

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
  public filteredFoodGroups: Array<FoodGroupDictionaryItem>;
  public filteredFoodItems: Array<FoodDictionaryItem>;

  public units: string;
  public modeText: string;
  public locallySelectedMode: DietaryChangeMode;

  private dietaryChangeItemFactory: DietaryChangeItemFactory;
  private subscriptions = new Array<Subscription>();

  private itemsChangedTimeout: NodeJS.Timeout;
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
            // this.ensureAtLeastOneChangeItem();
            // this.updateFilteredFoodItems();
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
    let confirmed = true;
    // only show confirmation if anything will be lost
    const changeItems = this.dietaryChangeService.changeItems.get();
    const lastItem = changeItems[changeItems.length - 1];
    if (changeItems.length > 1 || lastItem.isUseable) {
      void this.dialogService.openScenarioChangeWarningDialog(confirmed).then((data: DialogData<boolean>) => {
        confirmed = data.dataOut as boolean;
        if (confirmed) {
          this.dietaryChangeService.changeItems.set([]);
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
  }

  public foodItemSelectChange(event: MatSelectChange, changeItem: DietaryChangeItem): void {
    // console.debug('foodItemSelectChange', event);
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

  public changeScenarioValue(item: DietaryChangeItem, newValue: number | FoodDictionaryItem): void {
    // round numbers to 3dp
    if (typeof newValue === 'number') {
      newValue = Math.round(newValue * 1000) / 1000;
    }
    item.scenarioValue = newValue;
    item.isUseable = true;
    if (item instanceof FoodItemChangeItem) {
      this.setChangeItemComposition(item);
    } else {
    }
    this.itemsChanged();
  }
  public changeScenarioValueFromEvent(item: DietaryChangeItem, event: Event): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = event.target['value'];
    this.changeScenarioValue(item, typeof value === 'string' ? Number(value) : value);
  }

  public changeFoodChangeScenarioGroup(item: FoodItemChangeItem, group: FoodGroupDictionaryItem): void {
    item.scenarioFoodItemGroup = group;
    item.scenarioValue = null;
    item.scenarioComposition = null;
    this.itemsChanged();
  }

  public deleteChangeItem(changeItem: DietaryChangeItem): void {
    const newItems = this.dietaryChangeService.changeItems.get().filter((item) => item !== changeItem);
    this.dietaryChangeService.changeItems.set(newItems);
    this.itemsChanged();
  }

  public addChangeItem(): void {
    // doesn't need to trigger update as new item isn't fully formed
    void this.dietaryChangeItemFactory.makeItem().then((item) => {
      this.dietaryChangeService.changeItems.get().push(item);
      this.updateFilteredFoodItems();
    });
  }

  private replaceFoodItem(oldChangeItem: DietaryChangeItem, newChangeItem: DietaryChangeItem): void {
    const foodItemPos = this.dietaryChangeService.changeItems.get().indexOf(oldChangeItem);
    const newChangeItems = this.dietaryChangeService.changeItems.get().slice();
    newChangeItems.splice(foodItemPos, 1, newChangeItem);
    this.dietaryChangeService.changeItems.set(newChangeItems);
  }

  private refreshAllChangeItems(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.refreshAllChangeItemsTimeout);
    this.refreshAllChangeItemsTimeout = setTimeout(() => {
      // call for all change items to trigger updates
      this.dietaryChangeService.changeItems.get().forEach((item) => this.applyChangeItemChange(item));
    }, 200);
  }

  private applyChangeItemChange(changeItem: DietaryChangeItem): void {
    //Use this, if the func is even needed!!
    void this.dietaryChangeItemFactory.makeItem(changeItem.foodItem, changeItem.scenarioValue).then((item) => {});
    switch (this.dietaryChangeService.mode.get()) {
      case DietaryChangeMode.FOOD_ITEM:
        this.changeScenarioValue(changeItem, changeItem.foodItem);
        break;
      default:
        changeItem.updatingScenarioValue = true;
        void this.scenarioDataService
          .getCurrentValue(
            this.quickMapsService.dietDataSource.get(),
            this.dietaryChangeService.mode.get(),
            changeItem.foodItem,
            this.quickMapsService.micronutrient.get(),
          )
          .then((currentValue: CurrentValue) => {
            changeItem.currentValue = currentValue.value;
            this.changeScenarioValue(changeItem, currentValue.value);
          })
          .finally(() => (changeItem.updatingScenarioValue = false));
    }
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

  private setChangeItemComposition(foodChangeItem: FoodItemChangeItem): void {
    if (null != foodChangeItem.foodItem) {
      if (null == foodChangeItem.currentComposition) {
        foodChangeItem.currentComposition = null;
        foodChangeItem.updatingComposition = true;
        void this.scenarioDataService
          .getCurrentComposition(
            foodChangeItem.foodItem,
            this.quickMapsService.dietDataSource.get(),
            this.quickMapsService.micronutrient.get(),
          )
          .then((currentComposition: CurrentComposition) => {
            foodChangeItem.currentComposition = currentComposition;
            this.cdr.markForCheck();
          })
          .finally(() => (foodChangeItem.updatingComposition = false));
      }
      if (foodChangeItem instanceof FoodItemChangeItem && null != foodChangeItem.scenarioValue) {
        foodChangeItem.scenarioComposition = null;
        foodChangeItem.updatingScenarioComposition = true;
        void this.scenarioDataService
          .getCurrentComposition(
            foodChangeItem.scenarioValue,
            this.quickMapsService.dietDataSource.get(),
            this.quickMapsService.micronutrient.get(),
          )
          .then((currentComposition: CurrentComposition) => {
            foodChangeItem.scenarioComposition = currentComposition;
            this.cdr.markForCheck();
          })
          .finally(() => (foodChangeItem.updatingScenarioComposition = false));
      }
    }
  }

  private itemsChanged(): void {
    // console.debug('itemsChanged');
    // wait for inactivity before triggering update
    clearTimeout(this.itemsChangedTimeout);
    this.itemsChangedTimeout = setTimeout(() => {
      // force as array is the same ref
      this.dietaryChangeService.changeItems.set(this.dietaryChangeService.changeItems.get(), true);
    }, 500);
  }

  private ensureAtLeastOneChangeItem(): void {
    if (this.dietaryChangeService.changeItems.get().length === 0) {
      this.addChangeItem();
    }
  }
  private modeChanged(newMode: DietaryChangeMode): void {
    console.log('value:', newMode);
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
