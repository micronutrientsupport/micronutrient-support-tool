/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { QuickMapsService } from '../../../quickMaps.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-base-desc',
  templateUrl: './baselineDescription.component.html',
  styleUrls: ['./baselineDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDescriptionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;
  public currentImpactScenario: ImpactScenario;

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private miscApiService: MiscApiService,
  ) { }

  ngOnInit(): void {
    void this.miscApiService.getImpactScenarios().then((result: Array<ImpactScenario>) => {
      this.currentImpactScenario = result.find((o) => o.isBaseline === true);
      this.cdr.markForCheck();
    });

  }

  public openScenarioTypeDialog(): void {
    void this.dialogService.openScenarioTypeDialog();
  }

  public setDataLevel(event: MatSelectChange): void {
    this.quickMapsService.setDataLevel(event.value);
  }
}
