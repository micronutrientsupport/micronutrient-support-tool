import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';

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
    private readonly router: Router,
    public route: ActivatedRoute,
  ) {}

  public toggleAssumptions = true;
  public toggleCosts = true;

  public assumptionsText = 'Confirmed';
  public costsText = 'Confirmed';
  public today: number = Date.now();

  public reviewIntervention(): void {
    console.debug('id to be set from component:', this.intervention.id);
    this.interventionDataService.setActiveInterventionId(this.intervention.id);
    const route = this.ROUTES.INTERVENTION_REVIEW_BASELINE.getRoute();
    const params = this.route.snapshot.queryParams;
    void this.router.navigate(route, { queryParams: params });
  }

  onConfirmAssumptions(): void {
    this.toggleAssumptions = !this.toggleAssumptions;
    this.assumptionsText = this.toggleAssumptions ? 'Confirmed' : 'Not confirmed';
  }

  onConfirmCosts(): void {
    this.toggleCosts = !this.toggleCosts;
    this.costsText = this.toggleCosts ? 'Confirmed' : 'Not confirmed';
  }
}
