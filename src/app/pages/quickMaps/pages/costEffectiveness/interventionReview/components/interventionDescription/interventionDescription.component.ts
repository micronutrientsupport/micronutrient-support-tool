import { Component } from '@angular/core';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';

@Component({
  selector: 'app-intervention-description',
  templateUrl: './interventionDescription.component.html',
  styleUrls: ['./interventionDescription.component.scss'],
})
export class InterventionDescriptionComponent {
  public interventionName = '';
  constructor(
    public quickMapsService: QuickMapsService,
    private readonly interventionDataService: InterventionDataService,
  ) {
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((value: InterventionsDictionaryItem) => (this.interventionName = value.name));
  }
}
