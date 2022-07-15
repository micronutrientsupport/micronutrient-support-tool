import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { DietDataService } from 'src/app/services/dietData.service';
import { MatchedTotals } from 'src/app/apiAndObjects/objects/matchedTotals';
import { Subscription } from 'rxjs';
import { CurrencyExtendedPipe } from 'src/app/pipes/currency-extended.pipe';

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
  public matches: MatchedTotals[];
  public matchedTotals: { matchedCount: number; matchedWeight: number };
  private subscriptions = new Array<Subscription>();

  public matchesTableColumns: string[] = [
    'name',
    'matchedCount',
    'matchedCountPerc',
    'matchedWeight',
    'matchedWeightPerc',
  ];

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dietDataService: DietDataService,
  ) {}

  ngOnInit(): void {
    const dietDataSource = this.quickMapsService.dietDataSource.get();
    const micronutrient = this.quickMapsService.micronutrient.get();
    // console.log('Init, dataSource=', dietDataSource);
    if (null != dietDataSource) {
      this.init(this.dietDataService.getMatchedTotals(dietDataSource, micronutrient));
    }
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.quickMapsService.dietParameterChangedObs.subscribe(() => {
        const dietDataSource = this.quickMapsService.dietDataSource.get();
        const micronutrient = this.quickMapsService.micronutrient.get();
        // console.log('Refresh, dataSource=', dietDataSource);
        //  only if all set
        if (null != dietDataSource) {
          this.init(this.dietDataService.getMatchedTotals(dietDataSource, micronutrient));
        }
      }),
    );
  }

  public openBaselineDescriptionDialog(): void {
    void this.dialogService.openBaselineDescriptionDialog();
  }

  private init(dataPromise: Promise<MatchedTotals[]>): void {
    void dataPromise.then((data) => {
      this.matches = data;

      this.matchedTotals = this.matches.reduce(
        (prev, curr) => {
          prev.matchedCount += curr.matchedCountPerc;
          prev.matchedWeight += curr.matchedWeightPerc;
          return prev;
        },
        { matchedCount: 0, matchedWeight: 0 },
      );

      // console.log(this.matchedTotals);
      this.cdr.detectChanges();
    });
  }
}
