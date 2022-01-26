import { Component } from '@angular/core';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-intervention-description',
  templateUrl: './interventionDescription.component.html',
  styleUrls: ['./interventionDescription.component.scss'],
})
export class InterventionDescriptionComponent {
  public interventionName = 'IntName';
  constructor(public quickMapsService: QuickMapsService) {}
}
