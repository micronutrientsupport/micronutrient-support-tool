/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, EventEmitter, Input, OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { projectedAvailability } from 'src/app/apiAndObjects/objects/projectedAvailability';
import { projectedAvailabilities } from 'src/app/apiAndObjects/objects/projectedAvailabilities';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { ChangeDetectorRef } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-proj-avail',
  templateUrl: './projectionAvailability.component.html',
  styleUrls: ['./projectionAvailability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionAvailabilityComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;
  public dataSource: MatTableDataSource<projectedAvailability>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = [
  //   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  //   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  //   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  //   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  //   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  //   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  //   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  //   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  //   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  //   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  //   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  //   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  //   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  //   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  //   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  //   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  //   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  // ];
  headingText = 'Calcium';
  subtHeadingText = '';

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;
  public chartData: ChartJSObject;

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
      }
    });
    // this.http.get('./assets/exampleData/projection-total.json').subscribe((data: any) => {
    //   console.debug('data', data);
    //   this.initialiseGraph(data);
    //   this.dataSource = new MatTableDataSource(data);
    // });
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.loading = true;
      this.cdr.markForCheck();
      void this.currentDataService
        .getProjectedAvailabilities(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: projectedAvailabilities) => {
          console.debug('data', data);
          this.dataSource = new MatTableDataSource(data.all);
          this.error = false;
          this.chartData = null;
          // force change detection to:
          // remove chart before re-setting it to stop js error
          // show table and init paginator and sorter
          this.cdr.markForCheck();

          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.initialiseGraph(data.all);
        })
        .catch((err) => {
          this.error = true;
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public initialiseGraph(data: Array<projectedAvailability>): void {
    this.chartData = {
      type: 'line',
      data: {
        labels: ['2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'],
        datasets: [
          {
            label: 'ZincDiff',
            data: data.map((year) => year.ZnDiff),
          },
        ],
      },
    };
  }
}
