import { Component } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';

@Component({
  selector: 'app-quickmaps-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss'],
})
export class ProjectionComponent {

  constructor(
    public quickMapsService: QuickMapsService,
  ) { }


}
