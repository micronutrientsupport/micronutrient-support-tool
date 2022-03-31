import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-step-details',
  templateUrl: './interventionStepDetails.component.html',
  styleUrls: ['./interventionStepDetails.component.scss'],
})
export class InterventionStepDetailsComponent implements OnInit {
  @Input('resetDefaultValues') public resetDefaultValues = false;
  @Input('showFocusMn') public showFocusMn = false;
  @Input('showUserValues') public showUserValues = false;
  @Input('showMnUnits') public showMnUnits = false;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    //add content
  }

  public resetValues(): void {
    void this.dialogService.openCEResetDialog();
  }
}
