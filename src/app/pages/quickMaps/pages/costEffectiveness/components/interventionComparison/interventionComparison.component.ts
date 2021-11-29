import { Component, OnInit } from '@angular/core';
import { Interventions } from '../../intervention';

@Component({
  selector: 'app-intervention-comparison',
  templateUrl: './interventionComparison.component.html',
  styleUrls: ['./interventionComparison.component.scss'],
})
export class InterventionComparisonComponent implements OnInit {
  public interventions = Interventions;

  constructor() {
    // add content
  }

  ngOnInit(): void {
    // add content
  }
}
