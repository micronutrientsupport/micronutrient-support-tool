import { ChangeDetectorRef, Component } from '@angular/core';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-biomarker-description',
  templateUrl: './biomarkerDescription.component.html',
  styleUrls: ['./biomarkerDescription.component.scss'],
})
export class BiomarkerDescriptionComponent {
  constructor(public quickMapsService: QuickMapsService, private cdr: ChangeDetectorRef) {}
}
