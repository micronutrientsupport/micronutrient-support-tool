import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { ImpactScenarioDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';

@Component({
  selector: 'app-proj-desc',
  templateUrl: './projectionDescription.component.html',
  styleUrls: ['./projectionDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionDescriptionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;
  public currentImpactScenario: ImpactScenarioDictionaryItem;

  constructor(
    public quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dictionaryService: DictionaryService,
  ) {}

  ngOnInit(): void {
    void this.dictionaryService.getDictionary(DictionaryType.IMPACT_SCENARIOS).then((dict: Dictionary) => {
      this.currentImpactScenario = dict.getItems<ImpactScenarioDictionaryItem>().find((o) => o.isBaseline);
      this.cdr.markForCheck();
    });
  }

  public openScenarioTypeDialog(): void {
    void this.dialogService.openScenarioTypeDialog();
  }
}
