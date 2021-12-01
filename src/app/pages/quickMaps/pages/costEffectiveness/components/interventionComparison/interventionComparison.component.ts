import { Component, OnInit } from '@angular/core';
import { CostEffectivenessService } from '../../costEffectiveness.service';
import { Interventions } from '../../intervention';

@Component({
  selector: 'app-intervention-comparison',
  templateUrl: './interventionComparison.component.html',
  styleUrls: ['./interventionComparison.component.scss'],
})
export class InterventionComparisonComponent implements OnInit {
  public interventions = Interventions;
  public comparisonVisable = false;

  constructor(private costEffectivenessService: CostEffectivenessService) {}

  ngOnInit(): void {
    //
  }

  public compareScenario(): void {
    this.comparisonVisable = !this.comparisonVisable;
    this.costEffectivenessService.setInterventionComparisonStatus(this.comparisonVisable);
    console.debug(this.comparisonVisable);
  }
}
