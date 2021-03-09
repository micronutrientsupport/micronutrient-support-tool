import { Component, Input, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Observable, Subject, Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
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

}
