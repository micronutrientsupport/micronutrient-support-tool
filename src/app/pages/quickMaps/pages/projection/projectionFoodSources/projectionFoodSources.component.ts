import {
  ChangeDetectionStrategy,
  Input,
  Component,
  ChangeDetectorRef,
  Optional,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuickMapsService } from '../../../quickMaps.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';

@Component({
  selector: 'app-proj-food-sources ',
  templateUrl: './projectionFoodSources.component.html',
  styleUrls: [
    '../../expandableTabGroup.scss',
    './projectionFoodSources.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionFoodSourcesComponent implements AfterViewInit {
  @Input() card: CardComponent;

  public title = 'Projection Food Sources';

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData) { }

  ngAfterViewInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card
        .setLoadingObservable(this.loadingSrc.asObservable())
        .setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog())
      );

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          // this.init(this.currentDataService.getMonthlyFoodGroups(
          //   this.quickMapsService.countryId,
          //   [this.quickMapsService.micronutrientId],
          //   this.quickMapsService.popGroupId,
          //   this.quickMapsService.mndDataId,
          // ));
        })
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      // this.init(Promise.resolve(this.dialogData.dataIn.data));
      // this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      // this.cdr.detectChanges();
    }
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<ProjectionFoodSourcesDialogData>(ProjectionFoodSourcesComponent, {
      // data: this.data,
      // selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectionFoodSourcesDialogData {
  // data: Array<TopFoodSource>;
  // selectedTab: number;
}
