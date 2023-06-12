import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DietaryChangeItem } from 'src/app/apiAndObjects/objects/dietaryChangeItem';
import { Accessor } from 'src/utility/accessor';
import { QuickMapsQueryParams } from '../../queryParams/quickMapsQueryParams';
import { QuickMapsQueryParamKey } from '../../queryParams/quickMapsQueryParamKey.enum';
import { DietaryChangeMode } from './dietaryChangeMode.enum';
import { NumberConverter } from '../../queryParams/converters/numberConverter';
import { DietaryChangeItemsConverter } from '../../queryParams/converters/dietaryChangeItemConverter';
import { QuickMapsService } from '../../quickMaps.service';
import { ParamMap } from '@angular/router';
import { DietaryChangeItemFactory } from 'src/app/apiAndObjects/objects/dietaryChangeItemFactory';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';

@Injectable()
export class DietaryChangeService {
  public readonly init = new Accessor<boolean>(false);
  public readonly mode = new Accessor<DietaryChangeMode>(DietaryChangeMode.COMPOSITION);
  public readonly changeItems = new Accessor<Array<DietaryChangeItem>>([]);

  /**
   * subject to provide a single observable that can be subscribed to, to be notified if anything
   * changes, so that an observer doesn't need to subscribe to many.
   */
  private readonly parameterChangedSrc = new BehaviorSubject<void>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly parameterChangedObs = this.parameterChangedSrc.asObservable();

  private parameterChangeTimeout: NodeJS.Timeout;

  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    private injector: Injector,
    private quickMapsService: QuickMapsService,
    private scenarioDataService: ScenarioDataService,
    private dictionaryService: DictionaryService,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // wait until quickmaps service is ready
    let subs: Subscription;
    // eslint-disable-next-line prefer-const
    subs = quickMapsService.init.obs.subscribe((inited) => {
      if (inited) {
        if (null != subs) {
          subs.unsubscribe();
        }

        // set from query params etc. on init
        void Promise.all([
          this.quickMapsParameters.getScenarioMode().then((mode) => this.mode.set(mode)),
          this.getScenarioItems().then((items) => this.changeItems.set(items)),
        ]).then(() => {
          this.initSubscriptions();
          this.init.set(true);
        });
      }
    });
  }

  public updateQueryParams(): void {
    this.quickMapsParameters.setQueryParams([
      new NumberConverter(QuickMapsQueryParamKey.SCENARIO_MODE).setItem(this.mode.get()),
      new DietaryChangeItemsConverter(QuickMapsQueryParamKey.SCENARIO_ITEMS).setItem(this.changeItems.get()),
    ]);
  }

  private initSubscriptions(): void {
    // set up the parameter changed triggers on param changes
    this.mode.obs.subscribe(() => this.parameterChanged());
    this.changeItems.obs.subscribe(() => this.parameterChanged());
  }

  private parameterChanged(): void {
    // ensure not triggered too many times in quick succession
    clearTimeout(this.parameterChangeTimeout);
    this.parameterChangeTimeout = setTimeout(() => {
      this.updateQueryParams();
      this.parameterChangedSrc.next();
    }, 100);
  }

  private getScenarioItems(queryParamMap?: ParamMap): Promise<Array<DietaryChangeItem>> {
    return this.dictionaryService
      .getDictionary(DictionaryType.FOOD_GROUPS)
      .then((foodGroupsDict) =>
        this.quickMapsParameters
          .get(new DietaryChangeItemsConverter(QuickMapsQueryParamKey.SCENARIO_ITEMS), queryParamMap)
          .getItem(
            new DietaryChangeItemFactory(
              this.scenarioDataService,
              foodGroupsDict,
              this.mode,
              this.quickMapsService.FoodSystemsDataSource,
              this.quickMapsService.micronutrient,
            ),
            this.injector,
            this.quickMapsParameters.getScenarioMode(),
            Promise.resolve(this.quickMapsService.FoodSystemsDataSource.get()),
            this.quickMapsParameters.getMicronutrient(),
          ),
      );
  }
}
