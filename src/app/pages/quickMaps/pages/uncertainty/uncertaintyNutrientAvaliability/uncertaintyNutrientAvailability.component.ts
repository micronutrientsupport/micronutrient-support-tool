import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-uncertainty-nutrient-availability',
  templateUrl: './uncertaintyNutrientAvailability.component.html',
  styleUrls: ['./uncertaintyNutrientAvailability.component.scss'],
})
export class UncertaintyNutrientAvailabilityComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @Input() card: CardComponent;

  public title = 'Nutrient availability per person';
  public selectedTab: number;

  // TODO: from API??

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  constructor(
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData?: DialogData<UncertaintyNutrientAvailabilityDialogData>,
  ) {}

  ngAfterViewInit(): void {
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(
      this.card.onExpandClickObs.subscribe(() => this.openDialog()),
      this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
    );
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<UncertaintyNutrientAvailabilityDialogData>(
      UncertaintyNutrientAvailabilityComponent,
      {
        data: null,
        selectedTab: this.tabGroup.selectedIndex,
      },
    );
  }
}

export interface UncertaintyNutrientAvailabilityDialogData {
  data: unknown;
  selectedTab: number;
}
