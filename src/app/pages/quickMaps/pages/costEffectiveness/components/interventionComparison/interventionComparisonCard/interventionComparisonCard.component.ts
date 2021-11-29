import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-comparison-card',
  templateUrl: './interventionComparisonCard.component.html',
  styleUrls: ['./interventionComparisonCard.component.scss'],
})
export class InterventionComparisonCardComponent implements AfterViewInit {
  @Input() card: CardComponent;

  public title = 'Comparison';
  public selectedTab: number;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);
  private subscriptions = Array<Subscription>();
  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData,
  ) {}

  ngAfterViewInit(): void {
    if (null != this.card) {
      // if displayed within a card component init interactions with the card
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
      this.card.title = this.title;

      this.subscriptions.push(...[this.card.onExpandClickObs.subscribe(() => this.openDialog())]);
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.title = this.dialogData.dataIn.title;
      this.cdr.detectChanges();
    }
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent(InterventionComparisonCardComponent, {
      title: this.title,
    });
  }
}
