import { Component } from '@angular/core';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { UserLoginService } from 'src/app/services/userLogin.service';

@Component({
  selector: 'app-intervention-description',
  templateUrl: './interventionDescription.component.html',
  styleUrls: ['./interventionDescription.component.scss'],
})
export class InterventionDescriptionComponent {
  public selectedIntervention: Intervention;
  constructor(
    public quickMapsService: QuickMapsService,
    private readonly interventionDataService: InterventionDataService,
    private readonly notificationsService: NotificationsService,
    private readonly userLoginService: UserLoginService,
  ) {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => (this.selectedIntervention = selectedIntervention));
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
