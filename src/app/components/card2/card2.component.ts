import { Component, Input, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Observable, Subject, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/decorators/autoUnsubscribe.decorator';

@AutoUnsubscribe()
@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit {
  @Input() widget: GridsterItem;
  @Input() resizeEvent: EventEmitter<GridsterItem>;

  public title = '';
  public showSettings = false;
  public showExpand = false;

  public loading = false;
  public error = false;

  private onResizeSrc = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public onResizeObs = this.onResizeSrc.asObservable();

  private onExpandClickSrc = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public onExpandClickObs = this.onExpandClickSrc.asObservable();

  private onSettingsClickSrc = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public onSettingsClickObs = this.onSettingsClickSrc.asObservable();

  private subscriptions = new Array<Subscription>();

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.resizeEvent.subscribe((widget: GridsterItem) => {
        if (widget === this.widget) {
          this.onResizeSrc.next();
        }
      })
    );
  }

  public setLoadingObservable(obs: Observable<boolean>): this {
    this.subscriptions.push(
      obs.subscribe((loading: boolean) => {
        this.loading = loading;
        this.cdr.detectChanges();
      })
    );
    return this;
  }

  public setErrorObservable(obs: Observable<boolean>): this {
    this.subscriptions.push(
      obs.subscribe((error: boolean) => {
        this.error = error;
        this.cdr.detectChanges();
      })
    );
    return this;
  }

  public functionExpand(): void {
    this.onExpandClickSrc.next();
  }

  public functionSettings(): void {
    this.onSettingsClickSrc.next();
  }
  public detectChanges(): void {
    this.cdr.detectChanges();
  }

}
