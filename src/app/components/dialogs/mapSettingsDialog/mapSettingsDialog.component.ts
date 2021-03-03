import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { ColourGradientType } from 'src/app/apiAndObjects/objects/enums/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
export interface ColourDialogData {
  colour: string;
}
export interface ColourGradientObject {
  colourGradient: ColourGradientType;
  selected: boolean;
}

@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss']
})
export class MapSettingsDialogComponent implements OnInit {

  public gradientList: Array<ColourGradientObject>

  @ViewChild('colourGradientList') public colourList: MatSelectionList;

  public settingsForm = new FormGroup({
    generalColourSelection: new FormControl('', [Validators.required]),
  })

  public selectedValue;
  public generalSelectionValue: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>,
  ) {
    this.gradientList = [
      {
        colourGradient: ColourGradientType.REDYELLOWGREEN,
        selected: true,
      },
      {
        colourGradient: ColourGradientType.PURPLEBLUEGREEN,
        selected: false,
      },
      {
        colourGradient: ColourGradientType.COLOURBLIND,
        selected: false,
      }
    ]
  }

  ngOnInit(): void {
  }

  public applyChanges() {
    this.data.dataOut = this.generalSelectionValue[0];
  }

}
