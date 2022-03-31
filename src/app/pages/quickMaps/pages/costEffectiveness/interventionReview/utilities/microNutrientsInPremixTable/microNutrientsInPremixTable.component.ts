import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/FIXinterventionFoodVehicleStandards';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-micro-nutrients-in-premix-table',
  templateUrl: './microNutrientsInPremixTable.component.html',
  styleUrls: ['./microNutrientsInPremixTable.component.scss'],
})
export class MicroNutrientsInPremixTableComponent {
  @Input() public editable = false;
  public baselineAssumptions: BaselineAssumptions;
  public micronutrients: Array<FoodVehicleStandard>;
  public updateTrigger = new Subject<null>();

  constructor(
    public readonly interventionDataService: InterventionDataService,
    private readonly dialogService: DialogService,
  ) {
    void this.interventionDataService
      .getInterventionBaselineAssumptions('1')
      .then((data: InterventionBaselineAssumptions) => {
        this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
        this.micronutrients = this.interventionDataService.getCachedMnInPremix();
      });
  }

  public addMN(): void {
    void this.dialogService
      .openMnAdditionDialog()
      .then((dialogData: DialogData<Array<MicronutrientDictionaryItem>, Array<MicronutrientDictionaryItem>>) => {
        const mnArray = dialogData.dataOut;
        mnArray.forEach((mn: MicronutrientDictionaryItem) => {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              if (null != data) {
                const addedNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                this.interventionDataService.addMnToCachedMnInPremix(addedNutrientFVS);
                this.micronutrients = this.interventionDataService.getCachedMnInPremix();
              }
            });
        });
      });
  }
}
