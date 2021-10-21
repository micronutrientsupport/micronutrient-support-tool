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
import { DietaryChangeMode } from '../../dietaryChangeMode.enum';
import { MatMenu } from '@angular/material/menu';
import { ScenariosMapComponent } from './scenariosMap/scenariosMap.component';
import { ScenarioDataService } from 'src/app/services/scenarioData.service';
import { DietDataService } from 'src/app/services/dietData.service';
import { MnAvailibiltyItem } from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';

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

  @ViewChild(ScenariosMapComponent) scenariosMapComponent: ScenariosMapComponent;
  @Input() card: CardComponent;
  @ViewChild('settingsMenu', { static: true }) menu: MatMenu;

  public title = '';
  public selectedTab: number;
  public mnUnit = '';

  // temp set to the change items to display something
  public modeDisplay: DietaryChangeMode;
  // public tempDisplay: ChangeItemsType;
  public baselineData: Array<MnAvailibiltyItem>;
  public scenarioData: Array<MnAvailibiltyItem>;

  private loadingCount = 0;
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private quickMapsService: QuickMapsService,
    private dietaryChangeService: DietaryChangeService,
    private dietDataService: DietDataService,
    private scenarioDataService: ScenarioDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<DietaryChangeComparisonCardDialogData>,
  ) {}

  ngAfterViewInit(): void {
    if (null != this.card) {
      // if displayed within a card component init interactions with the card
      this.card.showExpand = true;
      this.card.showSettingsMenu = true;
      this.card.matMenu = this.menu;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        ...[
          this.card.onExpandClickObs.subscribe(() => this.openDialog()),
          this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
          this.quickMapsService.dietParameterChangedObs.subscribe(() => {
            // respond to quickmaps parameter updates
            this.title = `${this.quickMapsService.micronutrient.get()?.name} comparison`;
            this.card.title = this.title;
            this.updateBaselineData();
            this.updateScenarioData();
          }),
          // respond to dietary change parameters updates
          this.dietaryChangeService.changeItemsObs.subscribe(() => {
            this.updateScenarioData();
          }),
        ],
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.baselineData = this.dialogData.dataIn.baselineData;
      this.scenarioData = this.dialogData.dataIn.scenarioData;
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.title = this.dialogData.dataIn.title;
      this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  public openMapSettings(): void {
    this.scenariosMapComponent.openMapSettings();
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
    const country = this.quickMapsService.country.get();
    const micronutrient = this.quickMapsService.micronutrient.get();
    const dietDataSource = this.quickMapsService.dietDataSource.get();

    if (null != country && null != micronutrient && null != dietDataSource) {
      this.startLoading();
      this.dietDataService
        .getMicronutrientAvailability(country, micronutrient, dietDataSource)
        .then((data: Array<MnAvailibiltyItem>) => {
          this.baselineData = data;
        })
        .finally(() => {
          this.endLoading();
        })
        .catch((e) => {
          this.errorSrc.next(true);
          throw e;
        });
    }
  }
  private updateScenarioData(): void {
    const micronutrient = this.quickMapsService.micronutrient.get();
    const dietDataSource = this.quickMapsService.dietDataSource.get();
    const useableChangeItems = this.dietaryChangeService.changeItems.filter((item) => item.isUseable());

    if (null != micronutrient && null != dietDataSource && useableChangeItems.length > 0) {
      this.startLoading();
      this.scenarioDataService
        .getDietChange(dietDataSource, micronutrient, this.dietaryChangeService.mode, useableChangeItems)
        .then((data: Array<MnAvailibiltyItem>) => {
          this.scenarioData = data;
        })
        .finally(() => {
          this.endLoading();
        })
        .catch((e) => {
          this.errorSrc.next(true);
          throw e;
        });
    }
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<DietaryChangeComparisonCardDialogData>(ComparisonCardComponent, {
      baselineData: this.baselineData,
      scenarioData: this.scenarioData,
      selectedTab: this.tabGroup.selectedIndex,
      title: this.title,
    });
  }
}

export interface DietaryChangeComparisonCardDialogData {
  baselineData: Array<MnAvailibiltyItem>;
  scenarioData: Array<MnAvailibiltyItem>;
  selectedTab: number;
  title: string;
}
