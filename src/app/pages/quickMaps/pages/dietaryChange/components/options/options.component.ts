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

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-dc-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  public ROUTES = AppRoutes;

  public loading: boolean;
  public foodGroupsDict: Dictionary;

  private subscriptions = new Array<Subscription>();

  constructor(
    private cdr: ChangeDetectorRef,
    public dietaryChangeService: DietaryChangeService,
    dictionaryService: DictionaryService,
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
      });
    this.exampleValueChange();
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
}
