import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './baseDialog.component.html',
  styleUrls: ['./baseDialog.component.scss'],
})
export class BaseDialogComponent implements OnInit {
  @Input() title?: string;

  constructor() {}

  ngOnInit(): void {}
}
