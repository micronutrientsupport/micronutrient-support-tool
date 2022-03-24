import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-mn-addition-dialog',
  templateUrl: './mnAdditionDialog.component.html',
  styleUrls: ['./mnAdditionDialog.component.scss'],
})
export class MnAdditionDialogComponent implements OnInit {
  public micronutrientsDictionary: Dictionary;
  public selectMNDsFiltered = new Array<DictionaryItem>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private readonly dictionariesService: DictionaryService,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.MICRONUTRIENTS]).then((dicts: Array<Dictionary>) => {
      this.micronutrientsDictionary = dicts.shift();
      this.filterSortMn();
      console.debug(this.micronutrientsDictionary);
    });
  }

  ngOnInit(): void {
    //add content
  }

  public closeDialog(): void {
    this.dialogData.close();
  }

  public addMN(): void {
    //add additional micronutrient
    //
    this.dialogData.close();
  }

  public filterSortMn(): void {
    this.selectMNDsFiltered = this.micronutrientsDictionary.getItems().sort((a, b) => (a.name < b.name ? -1 : 1));
  }
}
