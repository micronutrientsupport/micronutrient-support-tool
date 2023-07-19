import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
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
  constructor(
    public quickMapsService: QuickMapsService,
    private readonly interventionDataService: InterventionDataService,
    private readonly notificationsService: NotificationsService,
    private readonly userLoginService: UserLoginService,
    private readonly dialogService: DialogService,
    private router: Router,
  ) {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => {
        this.selectedIntervention = selectedIntervention;
        /** Undefined response means that session token is invalid. */
        if (undefined == this.selectedIntervention) {
          /** If a user is logged in with an invalid session token then log them out */
          this.userLoginService.setActiveUser(null);
          /** Ask user to login */
          this.dialogService.openLoginDialog().then((data: DialogData) => {
            console.debug('data', data);
            /** If they successfully log back in then repeat the call with a valid session token */
            if (data.dataOut) {
              this.interventionDataService
                .getIntervention(this.interventionDataService.getActiveInterventionId())
                .then(
                  (selectedInterventionSecondAttempt: Intervention) =>
                    (this.selectedIntervention = selectedInterventionSecondAttempt),
                );
            } else {
              console.debug('call');
              this.router.navigate(this.ROUTES.STANDALONE_COST_EFFECTIVENESS.getRoute());
            }
          });
        }
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
