import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { DietDataService } from 'src/app/services/dietData.service';
import { UnmatchedTotals } from 'src/app/apiAndObjects/objects/unmatchedTotals';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-base-desc',
  templateUrl: './baselineDescription.component.html',
  styleUrls: ['./baselineDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDescriptionComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;
  public unmatchedTotals: UnmatchedTotals;
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dietDataService: DietDataService,
  ) {}

  ngOnInit(): void {
    const dietDataSource = this.quickMapsService.dietDataSource.get();
    // console.log('Init, dataSource=', dietDataSource);
    if (null != dietDataSource) {
      this.init(this.dietDataService.getUnmatchedTotals(dietDataSource));
    }
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.quickMapsService.dietParameterChangedObs.subscribe(() => {
        const dietDataSource = this.quickMapsService.dietDataSource.get();
        // console.log('Refresh, dataSource=', dietDataSource);
        //  only if all set
        if (null != dietDataSource) {
          this.init(this.dietDataService.getUnmatchedTotals(dietDataSource));
        }
      }),
    );
  }

  public openBaselineDescriptionDialog(): void {
    void this.dialogService.openBaselineDescriptionDialog();
  }

  private init(dataPromise: Promise<UnmatchedTotals[]>): void {
    void dataPromise.then((data) => {
      this.unmatchedTotals = data[0];

      // console.log(this.unmatchedTotals);
      this.cdr.detectChanges();
    });
  }
}
