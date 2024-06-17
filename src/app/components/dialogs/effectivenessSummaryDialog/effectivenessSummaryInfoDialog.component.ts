import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-effectivenessSummaryInfoDialog',
  templateUrl: './effectivenessSummaryInfoDialog.component.html',
  styleUrls: ['./effectivenessSummaryInfoDialog.component.scss'],
})
export class EffectivenessSummaryDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
}
