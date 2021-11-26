import { Component, OnInit } from '@angular/core';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './interventionCreation.component.html',
  styleUrls: ['./interventionCreation.component.scss'],
})
export class InterventionCreationComponent implements OnInit {
  constructor(public quickMapsService: QuickMapsService) {
    // add content
  }

  ngOnInit(): void {
    // add content
  }
}
