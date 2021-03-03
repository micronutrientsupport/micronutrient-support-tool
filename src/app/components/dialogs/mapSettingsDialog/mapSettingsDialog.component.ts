import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { DialogData } from '../baseDialogService.abstract';
export interface ColourDialogData {
  colour: string;
}
export interface ColourGradientObject {

}

@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss']
})
export class MapSettingsDialogComponent implements OnInit {

  @ViewChild('colourGradientList') public colourList: MatSelectionList;

  public settingsForm = new FormGroup({
    generalColourSelection: new FormControl('', [Validators.required]),
  })

  public selectedValue;
  public generalSelectionValue: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>,
  ) {

  }

  ngOnInit(): void {
  }

  applyChanges() {
    this.data.dataOut = this.generalSelectionValue[0];
  }

}
