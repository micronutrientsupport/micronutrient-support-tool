import { Component, Inject, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-mn-addition-dialog',
  templateUrl: './mnAdditionDialog.component.html',
  styleUrls: ['./mnAdditionDialog.component.scss'],
})
export class MnAdditionDialogComponent {
  public micronutrientsDictionary: Dictionary;
  public mNsFiltered = new Array<MicronutrientDictionaryItem>();
  public mNsSelected = new Array<MicronutrientDictionaryItem>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogData<Array<MicronutrientDictionaryItem>, Array<MicronutrientDictionaryItem>>,
    private readonly dictionariesService: DictionaryService,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.MICRONUTRIENTS]).then((dicts: Array<Dictionary>) => {
      this.micronutrientsDictionary = dicts.shift();
      this.filterSortMn();
    });
  }

  public closeDialog(): void {
    this.dialogData.close();
  }

  public addMN(): void {
    this.dialogData.dataOut = this.mNsSelected;
    this.dialogData.close();
  }

  public filterSortMn(): void {
    this.mNsFiltered = this.micronutrientsDictionary
      .getItems()
      .sort((a, b) => (a.name < b.name ? -1 : 1)) as Array<MicronutrientDictionaryItem>;
  }

  public mnSelectionChange(event: MatOptionSelectionChange): void {
    this.mNsSelected.push(event.source.value);
  }
}
