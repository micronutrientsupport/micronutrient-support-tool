import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionBaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent {
  constructor(private dialogService: DialogService, private intSideNavService: InterventionSideNavContentService) {}
  public dataSource = new MatTableDataSource();
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public resetValues(): void {
    void this.dialogService.openCEResetDialog();
    // .then((data: DialogData) => {
    // this.selectedInterventions.push(data.dataOut);
    // });
  }
  public addMN(): void {
    void this.dialogService.openMnAdditionDialog();
    // .then((data: DialogData) => {
    // this.selectedInterventions.push(data.dataOut);
    // });
  }
}
