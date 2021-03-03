import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  public colour: string;
  // public generalSelectionList: MatSelectionList;
  public generalSelectionValue: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>,
  ) {
    this.colour = this.data.dataIn.colour;
  }

  ngOnInit(): void {
  }

  onGroupsChange(event) {
    console.debug(event);
  }

  applyChanges() {
    this.data.dataOut = this.generalSelectionValue[0];
  }

}
