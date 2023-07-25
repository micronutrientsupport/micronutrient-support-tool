import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionCreationService } from '../interventionCreation/interventionCreation.service';
import { SimpleIntervention } from '../../intervention';

@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent {
  @Input() intervention: SimpleIntervention;

  public ROUTES = AppRoutes;

  constructor(
    private readonly interventionDataService: InterventionDataService,
    private interventionCreationService: InterventionCreationService,
    public route: ActivatedRoute,
  ) {}

  public toggleAssumptions = true;
  public toggleCosts = true;

  public assumptionsText = 'Confirmed';
  public costsText = 'Confirmed';
  public today: number = Date.now();

  public reviewIntervention(): void {
    this.interventionDataService.startReviewingIntervention(this.intervention.id.toString());
    // this.interventionDataService.updateRecentInterventions(this.intervention);
  }

  public removeIntervention(): void {
    this.interventionCreationService.interventionRemove(this.intervention.id.toString());
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
}
