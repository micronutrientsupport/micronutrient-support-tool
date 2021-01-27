/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnDestroy,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-proj-food-sources ',
  templateUrl: './projectionFoodSources.component.html',
  styleUrls: ['./projectionFoodSources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionFoodSourcesComponent implements OnInit, OnDestroy {
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
  public countryName = '';
  public vitaminName = '';

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
  ) {}

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
