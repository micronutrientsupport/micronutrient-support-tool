/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, Optional, Inject, Component } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { Card2Component } from 'src/app/components/card2/card2.component';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
@Component({
  selector: 'app-proj-avail',
  templateUrl: './projectionAvailability.component.html',
  styleUrls: ['./projectionAvailability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionAvailabilityComponent implements OnInit {
  @Input() card: Card2Component;

  public title = 'Projection Availability';

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: DialogData) { }

  ngOnInit(): void {
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
    }

    // respond to parameter updates
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.loadingSrc.next(true);
      // do stuff here

      // TODO: remove when stuff added
      setTimeout(() => {
        this.loadingSrc.next(false);
      }, 500);
    });
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent(ProjectionAvailabilityComponent);
  }

}
