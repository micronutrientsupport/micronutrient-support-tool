import { BehaviorSubject, Observable } from 'rxjs';

export class Accessor<T = unknown> {
  public readonly obs: Observable<T>;
  private readonly src: BehaviorSubject<T>;

  constructor(value: T) {
    this.src = new BehaviorSubject<T>(value);
    this.obs = this.src.asObservable();
  }

  public get(): T {
    return this.src.value;
  }
  public set(value: T, force = false): T {
    if (force || this.src.value !== value) {
      this.src.next(value);
    }
    return this.get();
  }
}

export class NullableAccessor<T = unknown> extends Accessor<null | T> {}
