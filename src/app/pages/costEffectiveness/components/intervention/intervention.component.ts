import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { SimpleIntervention } from '../../intervention';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';

@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent {
  @Input() intervention: SimpleIntervention;
  public ROUTES = AppRoutes;
  public selectedSimpleInterventions: Array<SimpleIntervention> = [];

  constructor(
    private readonly interventionDataService: InterventionDataService,
    private readonly userLoginService: UserLoginService,
    private readonly notificationsService: NotificationsService,
    public route: ActivatedRoute,
    private dialogService: DialogService,
    private quickMapsService: QuickMapsService,
    private dictionariesService: DictionaryService,
    private router: Router,
  ) {}

  public toggleAssumptions = true;
  public toggleCosts = true;

  public assumptionsText = 'Confirmed';
  public costsText = 'Confirmed';
  public today: number = Date.now();

  public reviewIntervention(): void {
    this.interventionDataService.startReviewingIntervention(this.intervention.id.toString());
  }

  public removeIntervention(): void {
    this.interventionDataService.removeSimpleInterventionFromStorage(this.intervention);
  }

  public onConfirmAssumptions(): void {
    this.toggleAssumptions = !this.toggleAssumptions;
    this.assumptionsText = this.toggleAssumptions ? 'Confirmed' : 'Not confirmed';
  }

  public onConfirmCosts(): void {
    this.toggleCosts = !this.toggleCosts;
    this.costsText = this.toggleCosts ? 'Confirmed' : 'Not confirmed';
  }

  public handleClaimIntervention(): void {
    if (null != this.userLoginService.getActiveUser()) {
      this.interventionDataService
        .claimAnonymousIntervention(this.intervention.id.toString())
        .then((claimedIntervention: Intervention) => {
          this.interventionDataService.removeSimpleInterventionFromStorage(this.intervention);
          this.interventionDataService.setSimpleInterventionInStorage(claimedIntervention);
          this.notificationsService.sendPositive('Intervention successfully claimed!');
        })
        .catch(() => this.notificationsService.sendNegative('Unable to claim intervention'));
    } else {
      this.notificationsService.sendInformative('You must login to claim an intervention');
    }
  }

  public openCESCopyDialog(selectedInterventionId: number): void {
    void this.dictionariesService
      .getDictionaries([DictionaryType.INTERVENTIONS], false)
      .then((dicts: Array<Dictionary>) => {
        const interventionDictionaryItems = dicts.shift().getItems();
        this.dialogService
          .openCESelectionDialog(
            interventionDictionaryItems as InterventionsDictionaryItem[],
            this.route.snapshot.queryParams,
            true,
            selectedInterventionId,
          )
          .then((data: DialogData) => {
            if (data !== null && data.dataOut.id) {
              this.quickMapsService.getMicronutrientRefresh();
              const interventionIds = this.route.snapshot.queryParamMap.get('intIds')
                ? JSON.parse(this.route.snapshot.queryParamMap.get('intIds')).map(Number)
                : [];
              const filtered = interventionIds.filter((x: number) => x); // remove null & zero values
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                  intIds: JSON.stringify([...filtered, Number(data.dataOut.id)]),
                },
                queryParamsHandling: 'merge',
              });
              this.quickMapsService.updateQueryParams();
              // this.selectedInterventions.push(data.dataOut);
              // this.updateInterventionsFromAPI();
              // this.cdr.detectChanges();
            }
          });
      });
  }
}
