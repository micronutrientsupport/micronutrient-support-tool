import { Component } from '@angular/core';
import { QuickMapsService } from '../../pages/quickMaps/quickMaps.service';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';

@Component({
  selector: 'app-quickmaps-no-results',
  templateUrl: './noResults.component.html',
  styleUrls: ['./noResults.component.scss'],
})
export class NoResultsComponent {
  public MeasureType = MicronutrientMeasureType;

  constructor(public quickMapsService: QuickMapsService) {}
}
