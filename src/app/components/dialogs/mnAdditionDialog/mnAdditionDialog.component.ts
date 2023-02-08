import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { InterventionFoodVehicleStandards } from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogData<Array<MicronutrientDictionaryItem>, MicronutrientDictionaryItem>,
    private readonly dictionariesService: DictionaryService,
    private readonly interventionDataService: InterventionDataService,
  ) {}

  ngOnInit(): void {
    this.dictionariesService.getDictionaries([DictionaryType.MICRONUTRIENTS]).then((dicts: Array<Dictionary>) => {
      this.micronutrientsDictionary = dicts.shift();
      this.filterSortMicronutrients();
    });
  }

  public handleCloseDialog(): void {
    this.dialogData.close();
  }

  public handleAddMicronutrient(): void {
    this.dialogData.dataOut = this.micronutrientsSelected;
    this.dialogData.close();
  }

  public filterSortMicronutrients(): void {
    this.interventionDataService
      .getInterventionFoodVehicleStandards('1')
      .then((data: InterventionFoodVehicleStandards) => {
        if (data != null) {
          const available = data.foodVehicleStandard.map((item) => item.micronutrient.trim());
          const dict = this.micronutrientsDictionary
            .getItems()
            .sort((a, b) => (a.name < b.name ? -1 : 1)) as Array<MicronutrientDictionaryItem>;

          this.micronutrientsFiltered = dict.filter((item) => available.includes(item.name.toLocaleLowerCase()));
          this.micronutrientsSelected = this.micronutrientsFiltered[0];
        }
      });
  }

  public handleSelectionChange(event: MatSelectChange): void {
    this.micronutrientsSelected = event.value;
  }
}
