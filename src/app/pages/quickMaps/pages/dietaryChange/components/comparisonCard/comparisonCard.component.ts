import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Inject,
  Optional,
  AfterViewInit,
} from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DietaryChangeService } from '../../dietaryChange.service';
import { ChangeItemsType } from '../../dietaryChange.item';
import { DietaryChangeMode } from '../../dietaryChangeMode.enum';

@Unsubscriber(['subscriptions', 'changeItemSubscriptions'])
@Component({
  selector: 'app-dc-comparison-card',
  templateUrl: './comparisonCard.component.html',
  styleUrls: ['../../../expandableTabGroup.scss', './comparisonCard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonCardComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = '';
  public selectedTab: number;

  // temp set to the change items to display something
  public modeDisplay: DietaryChangeMode;
  public tempDisplay: ChangeItemsType;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private data: unknown; // TODO: update this type when we know it!

  private subscriptions = new Array<Subscription>();
  private changeItemSubscriptions = new Array<Subscription>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private quickMapsService: QuickMapsService,
    private dietaryChangeService: DietaryChangeService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<DietaryChangeComparisonCardDialogData>,
  ) {}

  ngAfterViewInit(): void {
    if (null != this.card) {
      // if displayed within a card component init interactions with the card
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
      this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.card.title = `${this.quickMapsService.micronutrient.name} comparison - ${this.quickMapsService.ageGenderGroup.name}`;
        }),
      );
      // respond to quickmaps parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.updateData();
        }),
      );
      // respond to dietary change parameters updates
      this.subscriptions.push(
        this.dietaryChangeService.changeItemsObs.subscribe(() => {
          this.refreshItemSubscriptions();
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  // subscribes to those minor value changes,
  // for if we don't need to call out for data, just update the display
  private refreshItemSubscriptions(): void {
    this.changeItemSubscriptions.forEach((subs) => {
      if (null != subs) {
        subs.unsubscribe();
      }
    });
    this.changeItemSubscriptions = new Array<Subscription>();
    this.dietaryChangeService.changeItems.forEach((item) => {
      this.changeItemSubscriptions.push(item.changeValuesObs.subscribe(() => this.updateDisplay()));
    });
    this.updateDisplay();
  }

  private init(dataPromise: Promise<unknown>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: unknown) => {
        this.data = data;
        this.updateDisplay();
      })
      .catch(() => this.errorSrc.next(true))
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  // does a callout for new data?
  private updateData(): void {
    // console.debug('update data');
    this.init(Promise.resolve(null));
  }

  // tweaks the display for new selected value?
  private updateDisplay(): void {
    this.modeDisplay = this.dietaryChangeService.mode;
    this.tempDisplay = this.dietaryChangeService.changeItems;
    // console.debug('updateDisplay', this.modeDisplay, this.tempDisplay);
    this.cdr.detectChanges();
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<unknown>(ComparisonCardComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface DietaryChangeComparisonCardDialogData {
  data: unknown;
  selectedTab: number;
}
