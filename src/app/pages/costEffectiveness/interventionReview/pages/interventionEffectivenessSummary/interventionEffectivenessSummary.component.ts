import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { InterventionProjectedHouseholds } from 'src/app/apiAndObjects/objects/interventionProjectedHouseholds';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { Router } from '@angular/router';
import { InterventionLsffEffectivenessSummary } from 'src/app/apiAndObjects/objects/interventionLsffEffectivenessSummary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';

@Component({
  selector: 'app-intervention-effectiveness-summary',
  templateUrl: './interventionEffectivenessSummary.component.html',
  styleUrls: ['./interventionEffectivenessSummary.component.scss'],
})
export class InterventionEffectivenessSummaryComponent implements OnInit {
  public displayedColumnsCoverage: string[] = [
    'geographicArea',
    'householdCount',
    'coverage2021',
    'coverage2022',
    'coverage2023',
    'coverage2024',
    'coverage2025',
    'coverage2026',
    'coverage2027',
    'coverage2028',
    'coverage2029',
  ];

  public displayedColumnsInadequacy: string[] = [
    'geographicArea',
    'householdCount',
    'baseline',
    'excess2021',
    'excess2022',
    'excess2023',
    'excess2024',
    'excess2025',
    'excess2026',
    'excess2027',
    'excess2028',
    'excess2029',
  ];

  public displayedColumnsExcess: string[] = [
    'geographicArea',
    'householdCount',
    'baseline',
    'excess2021',
    'excess2022',
    'excess2023',
    'excess2024',
    'excess2025',
    'excess2026',
    'excess2027',
    'excess2028',
    'excess2029',
  ];

  public displayedColumnsReach: string[] = [
    'geographicArea',
    'householdCount',
    'householdReachPercentage',
    'meanFortificantConsumption',
    'medianFortificantConsumption',
  ];

  public loading = false;
  public dataLoaded = false;
  public baseYear = 2021;
  public dataSource = new MatTableDataSource();

  public selectedTab: number;
  public selectedTabSummary: number;

  public ROUTES = AppRoutes;

  public readonly effectivenessMetricOptions = {
    ear: 'Apparent intake per AFE',
    cnd: 'Household Nutrient Density',
  };

  public readonly effectivenesAggregations = {
    admin0: 'Level 0 Administrative Region',
    admin1: 'Level 1 Administrative Region',
  };

  public selectedEffectivenessMetric = 'ear';
  public selectedEffectivenessAggregation = 'admin1';

  private subscriptions = new Array<Subscription>();

  public countryDictionary: Dictionary;
  public selectedIntervention: Intervention;

  constructor(
    public quickMapsService: QuickMapsService,
    public intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
    private router: Router,
    private dictionaryService: DictionaryService,
  ) {}

  public ngOnInit(): void {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => {
        this.selectedIntervention = selectedIntervention;
      });
    this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dictionary) => {
      this.countryDictionary = dictionary;
    });
    this.refreshEffectivenessData();
  }

  public refreshEffectivenessData(): void {
    console.log(
      `Fetching effectiveness data for ${this.selectedEffectivenessMetric} at ${this.selectedEffectivenessAggregation} level`,
    );
    this.dataLoaded = false;
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionLsffEffectivenessSummary(
          activeInterventionId,
          this.selectedEffectivenessAggregation,
          this.selectedEffectivenessMetric,
        )
        .then(async (data: InterventionLsffEffectivenessSummary[]) => {
          if (this.selectedEffectivenessAggregation === 'admin0') {
            const nation = this.countryDictionary.getItem(this.selectedIntervention?.countryId).name;
            data = data.filter((val) => val.admin0Name === nation);
          }

          this.dataSource = new MatTableDataSource(data);
          this.dataLoaded = true;
        });
    }
  }

  public openEffectivenessInfoDialog(): void {
    void this.dialogService.openEffectivenessInfoDialog();
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    console.log('Confirm and continue', route);
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }
}
