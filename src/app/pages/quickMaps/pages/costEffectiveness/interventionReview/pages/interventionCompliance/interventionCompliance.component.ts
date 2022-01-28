import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-compliance',
  templateUrl: './interventionCompliance.component.html',
  styleUrls: ['./interventionCompliance.component.scss'],
})
export class InterventionComplianceComponent {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 1;
  public interventionName = 'IntName';

  public assumptionsDisplayedColumns = [
    'title',
    'standard',
    'year0',
    'year1',
    'year2',
    'year3',
    'year4',
    'year5',
    'year6',
    'year7',
    'year8',
    'year9',
  ];
  public dataSource = new MatTableDataSource();

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    this.interventionDataService
      .getInterventionBaselineAssumptions('1')
      .then((data: InterventionBaselineAssumptions) => {
        this.createTableObject(data);
      });
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    console.debug(dataArray);
    this.dataSource = new MatTableDataSource(dataArray);
  }
}
