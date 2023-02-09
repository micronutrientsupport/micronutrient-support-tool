import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-step-details',
  templateUrl: './interventionStepDetails.component.html',
  styleUrls: ['./interventionStepDetails.component.scss'],
})
export class InterventionStepDetailsComponent {
  constructor(private dialogService: DialogService) {}

  @Input('resetDefaultValues') public resetDefaultValues = false;
  @Input('showFocusMn') public showFocusMn = false;
  @Input('showUserValues') public showUserValues = false;
  @Input('showMnUnits') public showMnUnits = false;
  @Input('showAddMicronutrient') public showAddMicronutrient = false;

  @Output('resetValues') reset: EventEmitter<void> = new EventEmitter();
  @Output() onAddMn: EventEmitter<MicronutrientDictionaryItem> = new EventEmitter();

  public resetValues(): void {
    void this.dialogService.openCEResetDialog().then((data: DialogData) => {
      if (data.dataOut === true) {
        this.reset.next();
      }
    });
  }

  public handleAddMn(micronutrient: MicronutrientDictionaryItem): void {
    this.onAddMn.emit(micronutrient);
  }
}
