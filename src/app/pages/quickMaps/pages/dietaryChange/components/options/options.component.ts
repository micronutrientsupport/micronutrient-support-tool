/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { DietaryChangeService } from '../../dietaryChange.service';
import { DietaryChangeMode } from '../../dietaryChangeMode.enum';
import { CompositionChangeItem, ConsumptionChangeItem, FoodItemChangeItem } from '../../dietaryChange.item';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { CurrentConsumption } from 'src/app/apiAndObjects/objects/currentConsumption';
import { CurrentComposition } from 'src/app/apiAndObjects/objects/currentComposition';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-dc-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  public ROUTES = AppRoutes;
  public dietaryChangeMode = DietaryChangeMode;
  public loading: boolean;
  public foodGroupsDict: Dictionary;

  private subscriptions = new Array<Subscription>();

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
        this.exampleValueChange();
        this.exampleCurrentComposition();
        this.exampleCurrentConsumption();
      });
    dietaryChangeService.modeObs.subscribe((value) => {
      console.log('value:', value);
    });
  }

  private exampleValueChange(): void {
    // test
    setTimeout(() => {
      // change mode
      this.dietaryChangeService.setMode(DietaryChangeMode.CONSUMPTION);

      // change food items
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const compositionChangeItem1 = new CompositionChangeItem('Some food item object here - potato', 10);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const FoodItemChangeItem1 = new FoodItemChangeItem(
        'Some food item object here - potato',
        'Some food item object here - chips',
      );

      const consumptionChangeItem1 = new ConsumptionChangeItem('Some food item object here - potato', 55);
      const consumptionChangeItem2 = new ConsumptionChangeItem('Some food item object here - pizza', 22);
      this.dietaryChangeService.setChangeItems([consumptionChangeItem1, consumptionChangeItem2]);

      setInterval(() => {
        // change value on a change item
        consumptionChangeItem1.setChangeValue(consumptionChangeItem1.changeValue + 1);
        consumptionChangeItem2.setChangeValue(consumptionChangeItem1.changeValue + 1);
      }, 500);
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
