import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionIndustryInformation } from 'src/app/apiAndObjects/objects/interventionIndustryInformation';
import { InterventionMonitoringInformation } from 'src/app/apiAndObjects/objects/interventionMonitoringInformation';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-monitoring-information',
  templateUrl: './interventionMonitoringInformation.component.html',
  styleUrls: ['./interventionMonitoringInformation.component.scss'],
})
export class InterventionMonitoringInformationComponent {
  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    this.interventionDataService
      .getInterventionMonitoringInformation('1')
      .then((data: InterventionMonitoringInformation) => {
        this.init(data);
      });
  }

  displayedColumns: string[] = [
    'labelText',
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
  public ROUTES = AppRoutes;
  public pageStepperPosition = 5;
  public interventionName = 'IntName';
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
  private init(data: InterventionMonitoringInformation): void {
    // console.debug(data);
    this.dataSource = new MatTableDataSource(data.monitoringInformation);
  }
}
