import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { SimpleIntervention } from '../../intervention';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { NotificationsService } from 'src/app/components/notifications/notification.service';

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
        .then(() => {
          // this.selectedIntervention = claimedIntervention;
          this.notificationsService.sendPositive('Intervention successfully claimed!');
        })
        .catch(() => this.notificationsService.sendNegative('Unable to claim intervention'));
    } else {
      this.notificationsService.sendInformative('You must login to claim an intervention');
    }
  }
}
