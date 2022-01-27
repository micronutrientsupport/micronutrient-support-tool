import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { InterventionFoodVehicleStandards } from 'src/app/apiAndObjects/objects/InterventionFoodVehicleStandards';

import { InterventionMonitoringInformation } from 'src/app/apiAndObjects/objects/interventionMonitoringInformation';

import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent {
  @Input() intervention: InterventionsDictionaryItem;

  public ROUTES = AppRoutes;
  toggle = true;
  status1 = 'Confirmed';
  status2 = 'Confirmed';

  public readonly DATA_LEVEL = DataLevel;
  public loading = false;
  public error = false;

  constructor(private InterventionDataService: InterventionDataService) {}
  ngOnInit(): void {
    this.InterventionDataService.getInterventionFoodVehicleStandards(this.intervention.id).then(
      (data: InterventionFoodVehicleStandards) => {
        console.debug(data);
      },
    );
  }

  onConfirmAssumptions(): void {
    this.toggle = !this.toggle;
    this.status1 = this.toggle ? 'Confirmed' : 'Not confirmed';
  }
  onConfirmCosts(): void {
    this.toggle = !this.toggle;
    this.status2 = this.toggle ? 'Confirmed' : 'Not confirmed';
  }
}
