import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

interface NameValue {
  name?: string;
  value?: string;
}

@Component({
  selector: 'app-costEffectivenessSelectionDialog',
  templateUrl: './costEffectivenessSelectionDialog.component.html',
  styleUrls: ['./costEffectivenessSelectionDialog.component.scss'],
})
export class CostEffectivenessSelectionDialogComponent implements OnInit {
  public readonly interventionArray: NameValue[] = [
    { name: 'Wheat fortification', value: 'Lorem Ipsum Paragraph1' },
    { name: 'Supplementation', value: 'Lorem Ipsum Paragraph2' },
    { name: 'Salt fortification', value: 'Lorem Ipsum Paragraph3' },
  ];
  public interventionNameValue: NameValue = {};
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    // add content
  }

  ngOnInit(): void {
    // add content
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
