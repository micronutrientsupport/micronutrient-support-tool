import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Intervention } from 'src/app/pages/quickMaps/pages/costEffectiveness/intervention';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-load-intervention',
  templateUrl: './load-intervention.component.html',
  styleUrls: ['./load-intervention.component.scss']
})
export class LoadInterventionComponent {
  @Output() selectedInterventionEvent = new EventEmitter<InterventionsDictionaryItem>();
  @Input() interventions: Array<InterventionsDictionaryItem>;
  public selectedIntervention: InterventionsDictionaryItem;

  constructor(private interventionService: InterventionDataService) { }

  getIntervention(event: Event): void {
    const intervention_id = event.target['value'];
    if (intervention_id) {
      this.interventionService.getIntervention(event.target['value']).then(
        (data: any) => {
          console.log(data)
          this.selectedIntervention = data as InterventionsDictionaryItem;
          this.selectedInterventionEvent.emit(data);
        }
      );
    }
  }

  setIntervention(event: Event): void {
    this.selectedIntervention = event.target['value'];
    this.selectedInterventionEvent.emit(this.selectedIntervention);
  }
}
