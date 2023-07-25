import { Component, EventEmitter, Output } from '@angular/core';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { FoodVehicleStandard } from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-add-micronutrient',
  templateUrl: './add-micronutrient.component.html',
  styleUrls: ['./add-micronutrient.component.scss'],
})
export class AddMicronutrientComponent {
  constructor(private dialogService: DialogService) {}

  @Output() onAddMicronutrient = new EventEmitter<MicronutrientDictionaryItem>();

  public handleAdd(): void {
    const dialogClose = this.dialogService.openMnAdditionDialog();
    dialogClose.then((dialogData: DialogData<FoodVehicleStandard[], MicronutrientDictionaryItem>) => {
      if (dialogData) {
        this.onAddMicronutrient.emit(dialogData.dataOut);
      }
    });
  }
}
