import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  toggle = true;
  status1 = 'Confirmed';
  status2 = 'Confirmed';

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;

  constructor(public quickMapsService: QuickMapsService) {
    //to be continued
  }

  ngOnInit(): void {
    //to be continued
  }
  onConfirmAssumptions(): void {
    this.toggle = !this.toggle;
    this.status1 = this.toggle ? 'Confirmed' : 'Not confirmed';
  }
  onConfirmCosts(): void {
    this.toggle = !this.toggle;
    this.status2 = this.toggle ? 'Confirmed' : 'Not confirmed';
  }
}
