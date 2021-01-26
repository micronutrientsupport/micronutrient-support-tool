/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, EventEmitter, Input, OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
@Component({
  selector: 'app-proj-est',
  templateUrl: './projectionCurrentEstimate.component.html',
  styleUrls: ['./projectionCurrentEstimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionCurrentEstimateComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;

  constructor() {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }
}
