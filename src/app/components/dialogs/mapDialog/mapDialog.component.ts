import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

export interface MapDialogData {
  content: string;
}

@Component({
  selector: 'app-map-dialog',
  templateUrl: './mapDialog.component.html',
  styleUrls: ['./mapDialog.component.scss'],
})
export class MapDialogComponent implements OnInit {
  public content = '';
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<MapDialogData>) {}

  ngOnInit(): void {
    this.content = this.dialogData.dataIn.content;
  }
}
