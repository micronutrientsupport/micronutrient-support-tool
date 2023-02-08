import { Component, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { CostEffectivenessService } from '../../../costEffectiveness.service';

@Component({
  selector: 'app-micro-nutrients-in-premix-table-static',
  templateUrl: './microNutrientsInPremixTableStatic.component.html',
  styleUrls: ['./microNutrientsInPremixTableStatic.component.scss'],
})
export class MicroNutrientsInPremixTableStaticComponent {
  @Input() public editable = false;

  public baselineAssumptions: BaselineAssumptions;
  public micronutrients: Array<FoodVehicleStandard> = [];
  public updateTrigger = new Subject<null>();
  public displayPremixTable: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public readonly interventionDataService: InterventionDataService,
    private readonly dialogService: DialogService,
    private readonly ceService: CostEffectivenessService,
  ) {}

  ngOnInit(): void {
    this.interventionDataService
      .getInterventionBaselineAssumptions('1')
      .then((data: InterventionBaselineAssumptions) => {
        this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
        if (this.interventionDataService.getCachedMnInPremix()) {
          this.micronutrients = this.interventionDataService.getCachedMnInPremix();
        }
      });

    this.ceService.addMicronutrientObs.subscribe((shouldAddMicronutrient: boolean) => {
      if (shouldAddMicronutrient) {
        this.addMN();
      }
    });
  }

  public addMN(): void {
    void this.dialogService
      .openMnAdditionDialog()
      .then((dialogData: DialogData<Array<MicronutrientDictionaryItem>, MicronutrientDictionaryItem>) => {
        const micronutrient = dialogData.dataOut;
        if (micronutrient) {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              if (data != null) {
                const addedNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(micronutrient.name.toLocaleLowerCase());
                });
                this.interventionDataService.addMnToCachedMnInPremix(addedNutrientFVS);
                this.micronutrients = addedNutrientFVS;

                if (this.micronutrients.length > 0) {
                  this.displayPremixTable.next(true);
                }
              }
            });
        }
      });
  }
}
