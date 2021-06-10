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
import { CompositionChangeItem } from 'src/app/apiAndObjects/objects/dietaryChange.item';

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
