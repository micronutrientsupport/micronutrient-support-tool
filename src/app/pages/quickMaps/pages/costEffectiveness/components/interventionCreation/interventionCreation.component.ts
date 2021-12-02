import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './interventionCreation.component.html',
  styleUrls: ['./interventionCreation.component.scss'],
})
export class InterventionCreationComponent implements OnInit {
  constructor(public quickMapsService: QuickMapsService, private dialogService: DialogService) {
    // add content
  }

  ngOnInit(): void {
    // add content
  }

  public openCESelectionDialog(): void {
    void this.dialogService.openCESelectionDialog();
  }
}
