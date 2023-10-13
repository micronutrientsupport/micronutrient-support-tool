import { Component, Input } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DictionaryService } from 'src/app/services/dictionary.service';
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
  @Input() baselineAssumptions: BaselineAssumptions;

  public micronutrients: Array<FoodVehicleStandard> = [];
  public updateTrigger = new Subject<null>();
  public displayPremixTable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public premixCount = 0;
  public subscription: Subscription;
  private activeInterventionId: string;
  private mnDictionary: Dictionary;

  constructor(
    public readonly interventionDataService: InterventionDataService,
    private readonly dictionariesService: DictionaryService,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
  }

  ngOnInit(): void {
    this.dictionariesService.getDictionary(DictionaryType.MICRONUTRIENTS).then((dictionary) => {
      this.mnDictionary = dictionary;
    });

    this.interventionDataService
      .getInterventionBaselineAssumptions(this.activeInterventionId)
      .then((data: InterventionBaselineAssumptions) => {
        this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
        if (this.interventionDataService.getCachedMnInPremix()) {
          this.micronutrients = this.interventionDataService.getCachedMnInPremix();
        }
      });

    this.interventionDataService
      .getInterventionFoodVehicleStandards(this.activeInterventionId)
      .then((standards: InterventionFoodVehicleStandards) => {
        console.log(standards);

        standards.foodVehicleStandard.forEach((standard) => {
          const nonZeroCompound = standard.compounds.find((compound) => compound.targetVal > 0);
          if (nonZeroCompound) {
            console.log(standard.micronutrient, nonZeroCompound);
            const cache = this.interventionDataService.getCachedMnInPremix();
            console.log('The Cache', cache);

            if (!cache || !cache.find((element) => element.micronutrient === standard.micronutrient)) {
              console.log('Not found');
            }

            if (!cache || !cache.find((element) => element.micronutrient === standard.micronutrient)) {
              // Prepopulate table with food vehicle standards where target value not 0
              this.addMnToTable(this.mnDictionary.getItem(standard.micronutrient));
            }
          }
        });
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
