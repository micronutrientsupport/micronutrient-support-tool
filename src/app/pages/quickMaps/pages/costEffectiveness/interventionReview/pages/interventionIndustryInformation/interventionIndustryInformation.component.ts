import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, pairwise } from 'rxjs/operators';
import {
  IndustryInformation,
  InterventionIndustryInformation,
} from 'src/app/apiAndObjects/objects/interventionIndustryInformation';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-industry-information',
  templateUrl: './interventionIndustryInformation.component.html',
  styleUrls: ['./interventionIndustryInformation.component.scss'],
})
export class InterventionIndustryInformationComponent implements OnInit, OnDestroy {
  publiciIndustryInformation: IndustryInformation;
  public testInput: number;

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionIndustryInformation(activeInterventionId)
        .then((data: InterventionIndustryInformation) => {
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
    'source',
  ];
  public dataSource = new MatTableDataSource();

  public ROUTES = AppRoutes;
  public pageStepperPosition = 3;
  public interventionName = 'IntName';
  public form: FormGroup;
  public formChanges: Record<string, unknown> = {};

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    this.form = new FormGroup({
      year0: new FormControl(0),
      year1: new FormControl(0),
      year2: new FormControl(0),
    });
    this.watchFormChanges();
  }

  private watchFormChanges(): void {
    this.form.valueChanges.pipe(
      pairwise(),
      map(([oldState, newState]) => {
        const changes = {};
        for (const key in newState) {
          if (oldState[key] !== newState[key] && oldState[key] !== undefined) {
            changes[key] = newState[key];
          }
        }
        return changes;
      }),
      filter(changes => Object.keys(changes).length !== 0 && !this.form.invalid)
    ).subscribe(value => {
      console.log('Form has changed: ', value);
      // this.formChanges.push(value);
      this.formChanges[Object.keys(value).shift()] = Object.values(value).shift();
      console.log(this.formChanges);
    });
  }

  public ngOnDestroy(): void {
    console.debug('call');
  }

  private init(data: InterventionIndustryInformation): void {
    this.dataSource = new MatTableDataSource(data.industryInformation);
  }
}
