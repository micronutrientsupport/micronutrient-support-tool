import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionCreationService } from '../interventionCreation/interventionCreation.service';

@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent {
  @Input() intervention: InterventionsDictionaryItem;

  public ROUTES = AppRoutes;

  constructor(
    private readonly interventionDataService: InterventionDataService,
    private interventionCreationService: InterventionCreationService,
    private readonly router: Router,
    public route: ActivatedRoute,
  ) {}
  public toggleAssumptions = true;
  public toggleCosts = true;

  public assumptionsText = 'Confirmed';
  public costsText = 'Confirmed';
  public today: number = Date.now();

  public reviewIntervention(): void {
    this.interventionDataService.startReviewingIntervention(this.intervention.id);
    this.interventionDataService.updateRecentInterventions(this.intervention);
  }

  public removeIntervention() {
    this.interventionCreationService.interventionRemove(this.intervention.id);
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
