import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-mn-excess',
  templateUrl: './mnExcess.component.html',
  styleUrls: ['./mnExcess.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MnExcessComponent implements OnInit {
  @Input() card: CardComponent;

  public title = 'Prevalence of {{INSERT MN}} EXCESS per participants characteristics';

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<null>, // TODO: ADD DIALOG DAATA TYPE
  ) { }

  ngOnInit(): void {
  }

}
