import { Component } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';

@Component({
  selector: 'app-quickmaps-no-results',
  templateUrl: './noResults.component.html',
  styleUrls: ['./noResults.component.scss'],
})
export class NoResultsComponent {
  constructor(public quickMapsService: QuickMapsService) {}
}
