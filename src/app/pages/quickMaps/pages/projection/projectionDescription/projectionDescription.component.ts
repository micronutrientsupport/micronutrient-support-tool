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
import { NotificationsService } from 'src/app/components/notifications/notification.service';

@Component({
  selector: 'app-proj-desc',
  templateUrl: './projectionDescription.component.html',
  styleUrls: ['./projectionDescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionDescriptionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
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
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
    void this.dictionaryService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS, DictionaryType.MICRONUTRIENTS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.quickMapsService.countryObs.subscribe(country => {
          this.countryName = country.name;
          this.cdr.markForCheck();
        });
      }).catch(() => {
        this.notificationService.sendNegative('An error occured', 'data could not be loaded');
      });
    void this.miscApiService.getImpactScenarios().then((result: Array<ImpactScenario>) => {
      this.currentImpactScenario = result.find((o) => o.isBaseline === true);
      this.cdr.markForCheck();
    });
  }

  public openScenarioTypeDialog(): void {
    void this.dialogService.openScenarioTypeDialog();
  }
}
