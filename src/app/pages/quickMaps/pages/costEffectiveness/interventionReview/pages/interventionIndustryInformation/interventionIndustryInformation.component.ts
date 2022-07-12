import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  InterventionIndustryInformation,
} from 'src/app/apiAndObjects/objects/interventionIndustryInformation';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Unsubscriber } from 'src/app/decorators/unsubscriber.decorator';
import { Subscription } from 'rxjs';
import { pairwise, map } from 'rxjs/operators';

@Unsubscriber('subscriptions')
@Component({
  selector: 'app-intervention-industry-information',
  templateUrl: './interventionIndustryInformation.component.html',
  styleUrls: ['./interventionIndustryInformation.component.scss'],
})
export class InterventionIndustryInformationComponent implements OnInit {
  public displayedColumns: string[] = [
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
  public industryInformationInitialState = [];
  public industryInformationFormChanges: { [row: number]: { [col: string]: string }; } = {};
  private subscriptions = new Array<Subscription>();

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: FormBuilder
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      this.interventionDataService.interventionDataChangesObs.subscribe(data => {
        console.log(data)
      });

      void this.interventionDataService
        .getInterventionIndustryInformation(activeInterventionId)
        .then((data: InterventionIndustryInformation) => {
          this.dataSource = new MatTableDataSource(data.industryInformation);

          const industryGroupArr = data.industryInformation.map(item => {
            this.industryInformationInitialState.push(item)
            return this.createIndustryGroup(item)
          });
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(industryGroupArr)
          });

          for (const key of Object.keys(this.industryArray)) {
            const subscription = this.form.get('items')['controls'][key].valueChanges.pipe(pairwise(), map(([prev, next]) => {
              const changes = {};
              for (const idx in next) {
                if (prev[idx] !== next[idx] && prev[idx] !== undefined) {
                  changes[idx] = next[idx];
                }
              }
              return changes;
            })).subscribe(value => {
              const interventionDataRowIndex = this.form.get('items')['controls'][key]['controls'].rowIndex.value

              this.industryInformationFormChanges[interventionDataRowIndex] = {
                ...this.industryInformationFormChanges[interventionDataRowIndex], ...{
                  [Object.keys(value).shift()]: Object.values(value).shift(),
                  'rowIndex': interventionDataRowIndex
                }
              };

              const newInterventionChanges = {
                ...this.interventionDataService.getInterventionDataChanges(), ...this.industryInformationFormChanges
              };
              this.interventionDataService.setInterventionDataChanges(newInterventionChanges);
            });
            this.subscriptions.push(subscription);
          }
        });
    }
  }

  get industryArray() {
    return this.form.get("items")["controls"] as FormArray;
  }

  createIndustryGroup(item) {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [item.year0, []],
      year1: [item.year1, []],
      year2: [item.year2, []],
      year3: [item.year3, []],
      year4: [item.year4, []],
      year5: [item.year5, []],
      year6: [item.year6, []],
      year7: [item.year7, []],
      year8: [item.year8, []],
      year9: [item.year9, []],
    });
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
