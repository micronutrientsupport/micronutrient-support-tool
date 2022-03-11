import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-ce-calculated-fortification-info-dialog',
  templateUrl: './ceCalculatedFortificationInfoDialog.component.html',
  styleUrls: ['./ceCalculatedFortificationInfoDialog.component.scss'],
})
export class CeCalculatedFortificationInfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {}

  ngOnInit(): void {
    //add data
  }
}
