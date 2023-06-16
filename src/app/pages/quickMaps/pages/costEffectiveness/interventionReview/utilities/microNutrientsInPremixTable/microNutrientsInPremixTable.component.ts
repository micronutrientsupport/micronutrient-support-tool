import { Component, Input } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-micro-nutrients-in-premix-table',
  templateUrl: './microNutrientsInPremixTable.component.html',
  styleUrls: ['./microNutrientsInPremixTable.component.scss'],
})
export class MicroNutrientsInPremixTableComponent {
  @Input() public editable = false;
  @Input() set micronutrient(micronutrient: MicronutrientDictionaryItem) {
    if (micronutrient) {
      this.addMnToTable(micronutrient);
    }
  }

  public baselineAssumptions: BaselineAssumptions;
  public micronutrients: Array<FoodVehicleStandard> = [];
  public updateTrigger = new Subject<null>();
  public displayPremixTable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public premixCount = 0;
  public subscription: Subscription;
  private activeInterventionId: string;

  constructor(public readonly interventionDataService: InterventionDataService) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
  }

  ngOnInit(): void {
    this.interventionDataService
      .getInterventionBaselineAssumptions(this.activeInterventionId)
      .then((data: InterventionBaselineAssumptions) => {
        this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
        if (this.interventionDataService.getCachedMnInPremix()) {
          this.micronutrients = this.interventionDataService.getCachedMnInPremix();
        }
      });
  }

  private addMnToTable(micronutrient: MicronutrientDictionaryItem): void {
    if (micronutrient && Object.keys(micronutrient).length !== 0) {
      this.interventionDataService
        .getInterventionFoodVehicleStandards(this.activeInterventionId)
        .then((data: InterventionFoodVehicleStandards) => {
          if (data != null) {
            const addedNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
              return standard.micronutrient.includes(micronutrient.id);
            });
            this.interventionDataService.addMnToCachedMnInPremix(addedNutrientFVS);
            this.micronutrients = addedNutrientFVS;
            this.displayPremixTable.next(true);
          }
        });
    }
  }
}
