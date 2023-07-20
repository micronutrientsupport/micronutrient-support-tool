import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { UserLoginService } from 'src/app/services/userLogin.service';

@Component({
  selector: 'app-intervention-description',
  templateUrl: './interventionDescription.component.html',
  styleUrls: ['./interventionDescription.component.scss'],
})
export class InterventionDescriptionComponent {
  public ROUTES = AppRoutes;
  public selectedIntervention: Intervention;
  public activeMn = '';
  public activeCountry = '';

  constructor(
    public quickMapsService: QuickMapsService,
    private readonly interventionDataService: InterventionDataService,
    private readonly notificationsService: NotificationsService,
    private readonly userLoginService: UserLoginService,
    private readonly dialogService: DialogService,
    private router: Router,
    private dictionaryService: DictionaryService,
  ) {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => {
        this.selectedIntervention = selectedIntervention;
        /** Undefined response means that session token is invalid. */
        if (undefined != this.selectedIntervention) {
          this.getSelectedCountryMnValues();
        } else if (undefined == this.selectedIntervention) {
          /** If a user is logged in with an invalid session token then log them out */
          this.userLoginService.setActiveUser(null);
          /** Ask user to login */
          this.dialogService.openLoginDialog().then((data: DialogData) => {
            /** If they successfully log back in then repeat the call with a valid session token */
            if (data.dataOut) {
              this.interventionDataService
                .getIntervention(this.interventionDataService.getActiveInterventionId())
                .then((selectedInterventionSecondAttempt: Intervention) => {
                  this.selectedIntervention = selectedInterventionSecondAttempt;
                  this.getSelectedCountryMnValues();
                });
            } else {
              this.router.navigate(this.ROUTES.COST_EFFECTIVENESS.getRoute());
            }
          });
        }
      });
  }

  public getSelectedCountryMnValues(): void {
    this.dictionaryService
      .getDictionaries([DictionaryType.MICRONUTRIENTS, DictionaryType.COUNTRIES], true)
      .then((dictionary: Array<Dictionary>) => {
        this.activeMn = dictionary.shift().getItem(this.selectedIntervention.focusMicronutrient).name;
        this.activeCountry = dictionary.pop().getItem(this.selectedIntervention.countryId).name;
      });
  }

  public handleClaimIntervention(): void {
    if (null != this.userLoginService.getActiveUser()) {
      this.interventionDataService
        .claimAnonymousIntervention(this.selectedIntervention.id.toString())
        .then((claimedIntervention: Intervention) => {
          this.selectedIntervention = claimedIntervention;
          this.notificationsService.sendPositive('Intervention successfully claimed!');
        })
        .catch(() => this.notificationsService.sendNegative('Unable to claim intervention'));
    } else {
      this.notificationsService.sendInformative('You must login to claim an intervention');
    }
  }
}
