/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
export interface ColourGradientObject {
  name: string;
  colourGradient: ColourGradientType;
}
@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss']
})
export class MapSettingsDialogComponent implements OnInit {

  public gradientList: Array<ColourGradientObject> = [
    {
      colourGradient: ColourGradientType.BLUEREDYELLOWGREEN,
      name: 'BlRdYlGn',
    },
    {
      colourGradient: ColourGradientType.PURPLEBLUEGREEN,
      name: 'PpBlGn',
    },
    {
      colourGradient: ColourGradientType.COLOURBLIND,
      name: 'Colour Blind',
    }
  ];

  public generalSelectionValue = new Array<ColourGradientType>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ColourGradientType, ColourGradientType>,
  ) {
    this.generalSelectionValue.push(data.dataIn);
    data.dataOut = this.generalSelectionValue[0];
  }

  ngOnInit(): void {
  }

  public applyChanges(): void {
    this.data.dataOut = this.generalSelectionValue[0];
    this.data.close();
  }

}
