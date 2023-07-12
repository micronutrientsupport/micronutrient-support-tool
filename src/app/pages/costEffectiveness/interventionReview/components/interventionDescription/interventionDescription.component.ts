import { Component } from '@angular/core';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';

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
  ) {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => (this.selectedIntervention = selectedIntervention));
  }
}
