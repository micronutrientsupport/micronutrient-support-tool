import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-costEffectivenessInfoDialog',
  templateUrl: './costEffectivenessInfoDialog.component.html',
  styleUrls: ['./costEffectivenessInfoDialog.component.scss'],
})
export class CostEffectivenessInfoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
}
