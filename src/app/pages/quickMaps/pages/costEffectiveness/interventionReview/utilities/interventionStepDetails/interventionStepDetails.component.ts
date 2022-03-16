import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-step-details',
  templateUrl: './interventionStepDetails.component.html',
  styleUrls: ['./interventionStepDetails.component.scss'],
})
export class InterventionStepDetailsComponent implements OnInit {
  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    //add content
  }

  public resetValues(): void {
    void this.dialogService.openCEResetDialog();
  }
}
