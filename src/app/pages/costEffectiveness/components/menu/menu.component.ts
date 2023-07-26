import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { SimpleIntervention } from '../../intervention';

@Component({
  selector: 'app-ce-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public interventionCount: number;
  constructor(
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
    private cdr: ChangeDetectorRef,
  ) {
    this.interventionDataService.simpleInterventionArrChangedObs.subscribe(
      (interventions: Array<SimpleIntervention>) => {
        this.updateInterventionCount(interventions.length);
      },
    );
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  public updateInterventionCount(count: number) {
    this.interventionCount = count;
    this.cdr.markForCheck();
  }

  public openCEInfoDialog(): void {
    void this.dialogService.openCEInfoDialog();
  }
}
