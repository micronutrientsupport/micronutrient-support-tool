/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/apiAndObjects/objects/enums/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
export interface ColourDialogData {
  colourGradient: ColourGradientType;
}
export interface ColourGradientObject {
  name: string;
  colourGradient: ColourGradientType;
}

@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss'],
})
export class MapSettingsDialogComponent implements OnInit {
  public gradientList: Array<ColourGradientObject> = [
    {
      colourGradient: ColourGradientType.REDYELLOWGREEN,
      name: 'RdYGn',
    },
    {
      colourGradient: ColourGradientType.PURPLEBLUEGREEN,
      name: 'PpBlGn',
    },
    {
      colourGradient: ColourGradientType.COLOURBLIND,
      name: 'Colour Blind',
    },
  ];

  public settingsForm = new FormGroup({
    generalColourSelection: new FormControl('', [Validators.required]),
  });

  public generalSelectionValue = new Array<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>) {
    this.generalSelectionValue.push(data.dataIn.colourGradient);
    data.dataOut = this.generalSelectionValue[0];
  }

  ngOnInit(): void {
    // console.debug(this.createNewArray());
  }

  public applyChanges(): void {
    this.data.dataOut = this.generalSelectionValue[0];
    this.settingsForm.markAsPristine();
  }

  public hue: string;
  public color: string;
}
