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
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { CurrentDataService } from 'src/app/services/currentData.service';

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

  public baselineData: SubRegionDataItem;
  public scenarioData: SubRegionDataItem;
  public displayedColumns = ['Region', 'BaselineSupply', 'ScenarioSupply'];
  private loadingCount = 0;
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  private changeItemSubscriptions = new Array<Subscription>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private quickMapsService: QuickMapsService,
    private dietaryChangeService: DietaryChangeService,
    private currentDataService: CurrentDataService,
    private scenarioDataService: ScenarioDataService,
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
          this.updateBaselineData();
          this.updateScenarioData();
        }),
      );

      // respond to dietary change parameters updates
      this.subscriptions.push(
        this.dietaryChangeService.changeItemsObs.subscribe(() => {
          this.updateScenarioData();
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.baselineData = this.dialogData.dataIn.baselineData;
      this.scenarioData = this.dialogData.dataIn.scenarioData;
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  private startLoading(): void {
    this.loadingSrc.next(++this.loadingCount > 0);
    this.cdr.detectChanges();
  }
  private endLoading(): void {
    this.loadingSrc.next(--this.loadingCount > 0);
    this.cdr.detectChanges();
  }

  private updateBaselineData(): void {
    this.startLoading();
    this.currentDataService
      .getSubRegionData(
        this.quickMapsService.country,
        this.quickMapsService.micronutrient,
        this.quickMapsService.dataSource,
        this.quickMapsService.dataLevel,
      )
      .then((data: SubRegionDataItem) => {
        this.baselineData = data;
      })
      .catch((e) => {
        console.error(e);
        this.errorSrc.next(true);
      })
      .finally(() => {
        this.endLoading();
      });
  }
  private updateScenarioData(): void {
    this.startLoading();
    this.scenarioDataService
      .getDietChange(
        this.quickMapsService.dataSource,
        this.dietaryChangeService.mode,
        this.dietaryChangeService.changeItems,
      )
      .then((data: SubRegionDataItem) => {
        this.scenarioData = data;
        // console.debug('scenarioData', this.scenarioData);
      })
      .catch((e) => {
        console.error(e);
        this.errorSrc.next(true);
      })
      .finally(() => {
        this.endLoading();
      });
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<unknown>(ComparisonCardComponent, {
      data: this.scenarioData,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface DietaryChangeComparisonCardDialogData {
  baselineData: SubRegionDataItem;
  scenarioData: SubRegionDataItem;
  selectedTab: number;
}
