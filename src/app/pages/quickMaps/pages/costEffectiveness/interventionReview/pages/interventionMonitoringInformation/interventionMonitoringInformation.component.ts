import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionMonitoringInformation } from 'src/app/apiAndObjects/objects/interventionMonitoringInformation';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-monitoring-information',
  templateUrl: './interventionMonitoringInformation.component.html',
  styleUrls: ['./interventionMonitoringInformation.component.scss'],
})
export class InterventionMonitoringInformationComponent implements OnInit {
  constructor(
    public quickMapsService: QuickMapsService,

    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      this.interventionDataService
        .getInterventionMonitoringInformation(activeInterventionId)
        .then((data: InterventionMonitoringInformation) => {
          this.init(data);
        });
    }
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
