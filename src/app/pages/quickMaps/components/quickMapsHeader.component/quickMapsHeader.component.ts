/* eslint-disable @typescript-eslint/dot-notation */
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from '../../quickMaps.service';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';

@Component({
  selector: 'app-quick-maps-header',
  templateUrl: './quickMapsHeader.component.html',
  styleUrls: ['./quickMapsHeader.component.scss'],
})
export class QuickMapsHeaderComponent implements OnInit {
  public ROUTES = AppRoutes;
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
    public route: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private miscApiService: MiscApiService,
  ) {}

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
      console.log(result);
      this.currentImpactScenario = result.find((o) => o.isBaseline === true);
      console.log(this.currentImpactScenario);
    });
  }

  public openScenarioTypeDialog(): void {
    void this.dialogService.openScenarioTypeDialog();
  }
}
