import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
export interface ColourDialogData {
  colour: string;
}
@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss']
})
export class MapSettingsDialogComponent implements OnInit {

  public settingsForm = new FormGroup({
    generalColourSelection: new FormControl('', [Validators.required]),
  })

  public colour: string;
  public generalSelectionValue: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>,
  ) {
    this.colour = this.data.dataIn.colour;
  }

  ngOnInit(): void {
  }

  applyChanges() {
    this.data.dataOut = this.generalSelectionValue[0];
  }

}
