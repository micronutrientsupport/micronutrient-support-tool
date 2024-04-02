import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';

@Component({
  selector: 'app-intervention-effectiveness-households',
  templateUrl: './interventionEffectivenessHouseholds.component.html',
  styleUrls: ['./interventionEffectivenessHouseholds.component.scss'],
})
export class InterventionEffectivenessHouseholdsComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 6;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      void this.interventionDataService.getIntervention(activeInterventionId).then((intervention: Intervention) => {
        console.log('Do something with the intervention', intervention);
      }),
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }
}
