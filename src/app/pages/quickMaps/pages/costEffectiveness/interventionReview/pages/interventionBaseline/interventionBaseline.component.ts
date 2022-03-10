import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent {
  constructor(
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
  ) {}
  public dataSource = new MatTableDataSource();
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);

    void this.interventionDataService
      .getInterventionBaselineAssumptions('1')
      .then((data: InterventionBaselineAssumptions) => {
        this.createTableObject(data);
      });
  }
  public createTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];

    const rawData = data.baselineAssumptions as BaselineAssumptions;

    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);

    console.debug(rawData);

    this.dataSource = new MatTableDataSource(dataArray);

    // this.createAvNutrientLevelTable(rawData);
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
