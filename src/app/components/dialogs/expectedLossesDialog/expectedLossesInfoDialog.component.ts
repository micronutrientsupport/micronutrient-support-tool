import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-expectedLossesInfoDialog',
  templateUrl: './expectedLossesInfoDialog.component.html',
  styleUrls: ['./expectedLossesInfoDialog.component.scss'],
})
export class ExpectedLossesInfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
}
