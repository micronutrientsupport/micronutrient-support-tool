/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { MatSelectChange } from '@angular/material/select';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-dc-description',
  templateUrl: './dietaryChangeDescription.component.html',
  styleUrls: ['./dietaryChangeDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;
  public currentImpactScenario: ImpactScenario;

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private miscApiService: MiscApiService,
  ) {}

  ngOnInit(): void {
    void this.miscApiService.getImpactScenarios().then((result: Array<ImpactScenario>) => {
      this.currentImpactScenario = result.find((o) => o.isBaseline === true);
      this.cdr.markForCheck();
    });
  }

  public setDataLevel(event: MatSelectChange): void {
    this.quickMapsService.setDataLevel(event.value);
  }
}
