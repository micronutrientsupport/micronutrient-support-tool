import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-mn-addition-dialog',
  templateUrl: './mnAdditionDialog.component.html',
  styleUrls: ['./mnAdditionDialog.component.scss'],
})
export class MnAdditionDialogComponent implements OnInit {
  public micronutrientsDictionary: Dictionary;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private readonly dictionariesService: DictionaryService,
  ) {
    void dictionariesService.getDictionaries([DictionaryType.MICRONUTRIENTS]).then((dicts: Array<Dictionary>) => {
      this.micronutrientsDictionary = dicts.shift();
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
}
