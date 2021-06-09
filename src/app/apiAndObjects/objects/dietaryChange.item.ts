import { BehaviorSubject, Observable } from 'rxjs';

export abstract class DietaryChangeItem<T = any> {
  private readonly changeValuesSrc: BehaviorSubject<T>;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly changeValuesObs: Observable<T>;

  constructor(
    public readonly foodItem: unknown, // TODO: update with FoodItem type
    initialValue: T,
  ) {
    this.changeValuesSrc = new BehaviorSubject<T>(initialValue);
    this.changeValuesObs = this.changeValuesSrc.asObservable();
  }

  public get changeValue(): T {
    return this.changeValuesSrc.value;
  }

  public setChangeValue(val: T): void {
    this.changeValuesSrc.next(val);
  }
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<unknown> {} // TODO: update with FoodItem type
