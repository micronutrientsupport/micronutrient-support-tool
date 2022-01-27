import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { InterventionBaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { InterventionStartupCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
@Component({
  selector: 'app-ce-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionComponent implements OnInit {
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
    this.InterventionDataService.getInterventionBaselineAssumptions(this.intervention.id).then(
      (data: InterventionBaselineAssumptions) => {
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
