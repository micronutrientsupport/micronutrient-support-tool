/* eslint-disable @typescript-eslint/dot-notation */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
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
  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public loading = false;
  public error = false;
  public countryName = '';
  public vitaminName = '';
  public currentImpactScenario: ImpactScenario;

  constructor(
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private miscApiService: MiscApiService,
  ) { }

  ngOnInit(): void {
    void this.dictionaryService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
          const country = this.countriesDictionary.getItem(countryId);
          this.countryName = null != country ? country.name : '';
          this.cdr.markForCheck();
        });
        this.quickMapsService.micronutrientIdObs.subscribe((mndsId: string) => {
          const mnds = this.micronutrientsDictionary.getItem(mndsId);
          this.vitaminName = null != mnds ? mnds.name : '';
          this.cdr.markForCheck();
        });
      });
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
