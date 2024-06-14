import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-projectedHouseholdsInfoDialog',
  templateUrl: './projectedHouseholdsInfoDialog.component.html',
  styleUrls: ['./projectedHouseholdsInfoDialog.component.scss'],
})
export class ProjectedHouseholdsInfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
}
