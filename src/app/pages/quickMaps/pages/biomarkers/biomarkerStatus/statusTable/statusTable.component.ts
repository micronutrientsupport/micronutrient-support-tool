import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-table',
  templateUrl: './statusTable.component.html',
  styleUrls: ['./statusTable.component.scss'],
})
export class StatusTableComponent implements OnInit {
  public displayedColumns = ['region', 'n', 'deficient', 'confidence'];

  constructor() {}

  ngOnInit(): void {}
}
