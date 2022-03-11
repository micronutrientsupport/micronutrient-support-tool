import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-ce-fortification-info-dialog',
  templateUrl: './ceFortificationInfoDialog.component.html',
  styleUrls: ['./ceFortificationInfoDialog.component.scss'],
})
export class CeFortificationInfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {}

  ngOnInit(): void {
    //add content
  }
}
