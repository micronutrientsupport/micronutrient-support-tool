import { Component, OnInit } from '@angular/core';
import { CostEffectivenessService } from '../../costEffectiveness.service';
import { SimpleInterventions } from '../../intervention';

@Component({
  selector: 'app-intervention-comparison',
  templateUrl: './interventionComparison.component.html',
  styleUrls: ['./interventionComparison.component.scss'],
})
export class InterventionComparisonComponent implements OnInit {
  public interventions = SimpleInterventions;

  constructor(private costEffectivenessService: CostEffectivenessService) {}

  ngOnInit(): void {
    //
  }

  public compareScenario(): void {
    this.costEffectivenessService.setInterventionComparisonStatus(true);
  }
}
