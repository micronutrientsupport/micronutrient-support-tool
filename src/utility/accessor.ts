import { BehaviorSubject, Observable } from 'rxjs';

export class Accessor<T = unknown> {
  public readonly observable: Observable<T>;
  private readonly src: BehaviorSubject<T>;

  constructor(value: T) {
    this.src = new BehaviorSubject<T>(value);
    this.observable = this.src.asObservable();
  }

  public get(): T {
    return this.src.value;
  }
  public set(value: T, force = false): void {
    if (force || this.src.value !== value) {
      this.src.next(value);
    }
  }
}

export class NullableAccessor<T = unknown> extends Accessor<null | T> {}
