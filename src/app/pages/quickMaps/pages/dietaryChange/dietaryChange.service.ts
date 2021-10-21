import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DietaryChangeItem } from 'src/app/apiAndObjects/objects/dietaryChange.item';
import { Accessor } from 'src/utility/accessor';
import { QuickMapsQueryParams } from '../../queryParams/quickMapsQueryParams';
import { QuickMapsQueryParamKey } from '../../queryParams/quickMapsQueryParamKey.enum';
import { DietaryChangeMode } from './dietaryChangeMode.enum';
import { NumberConverter } from '../../queryParams/converters/converter.abstract';

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

  constructor(injector: Injector) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);

    // set from query params etc. on init
    void Promise.all([this.quickMapsParameters.getScenarioMode().then((mode) => this.mode.set(mode))]).then(() => {
      this.initSubscriptions();
      this.init.set(true);
    });
  }

  public updateQueryParams(): void {
    this.quickMapsParameters.setQueryParams([
      new NumberConverter(QuickMapsQueryParamKey.SCENARIO_MODE).setItem(this.mode.get()),
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
}
