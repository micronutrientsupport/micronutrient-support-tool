import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-mn-addition-dialog',
  templateUrl: './mnAdditionDialog.component.html',
  styleUrls: ['./mnAdditionDialog.component.scss'],
})
export class MnAdditionDialogComponent {
  public micronutrientsDictionary: Dictionary;
  public micronutrientsFiltered = new Array<MicronutrientDictionaryItem>();
  public micronutrientsSelected: MicronutrientDictionaryItem;
  public existing: Array<FoodVehicleStandard> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogData<Array<FoodVehicleStandard>, MicronutrientDictionaryItem>,
    private readonly dictionariesService: DictionaryService,
    private readonly interventionDataService: InterventionDataService,
    private readonly dialogRef: MatDialogRef<MnAdditionDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.existing = this.dialogData.dataIn;

    this.dictionariesService.getDictionaries([DictionaryType.MICRONUTRIENTS]).then((dicts: Array<Dictionary>) => {
      this.micronutrientsDictionary = dicts.shift();
      this.filterSortMicronutrients();
    });
  }

  public handleClose(): void {
    this.dialogRef.close();
  }

  public handleAddMicronutrient(): void {
    this.dialogData.dataOut = this.micronutrientsSelected;
    this.dialogRef.close();
  }

  public filterSortMicronutrients(): void {
    this.interventionDataService
      .getInterventionFoodVehicleStandards(this.interventionDataService.getActiveInterventionId())
      .then((data: InterventionFoodVehicleStandards) => {
        if (data != null) {
          const available = data.foodVehicleStandard.map((item) => item.micronutrient.trim());
          const dict = this.micronutrientsDictionary
            .getItems()
            .sort((a, b) => (a.name < b.name ? -1 : 1)) as Array<MicronutrientDictionaryItem>;

          this.micronutrientsFiltered = dict.filter((item) => available.includes(item.id));
          this.micronutrientsSelected = this.micronutrientsFiltered[0];
        }
      });
  }

  public handleSelectionChange(event: MatSelectChange): void {
    this.micronutrientsSelected = event.value;
  }

  public alreadyAdded(micronutrientId: MicronutrientDictionaryItem['id']): boolean {
    const cached = this.interventionDataService.getCachedMnInPremix();
    if (cached && cached.length > 0) {
      return cached.filter((item) => item.micronutrient === micronutrientId).length > 0;
    }
    return false;
  }
}
