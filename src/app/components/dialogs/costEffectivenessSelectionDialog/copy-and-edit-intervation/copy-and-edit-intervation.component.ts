import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-copy-and-edit-intervation',
  templateUrl: './copy-and-edit-intervation.component.html',
  styleUrls: ['./copy-and-edit-intervation.component.scss']
})
export class CopyAndEditIntervationComponent {
  @Output() selectedInterventionEvent = new EventEmitter<InterventionsDictionaryItem>();
  @Input() interventions: Array<InterventionsDictionaryItem>;
  public selectedIntervention: InterventionsDictionaryItem;

  setIntervention(event: MatSelectChange): void {
    this.selectedIntervention = event.value;
    this.selectedInterventionEvent.emit(this.selectedIntervention);
  }

  changeSelectedInterventionName(event: Event): void {
    console.log(event.target['value'])
  }

  changeSelectedInterventionDesc(event: Event): void {
    console.log(event.target['value'])
  }
}
