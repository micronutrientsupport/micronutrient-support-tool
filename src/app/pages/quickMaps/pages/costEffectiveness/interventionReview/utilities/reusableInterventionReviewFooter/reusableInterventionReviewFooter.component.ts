import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-reusable-intervention-review-footer',
  templateUrl: './reusableInterventionReviewFooter.component.html',
  styleUrls: ['./reusableInterventionReviewFooter.component.scss'],
})
export class InterventionFooterDetailsComponent implements OnInit {
  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    //add content
  }

  public resetValues(): void {
    void this.dialogService.openCEResetDialog();
  }
}
