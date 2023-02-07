import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, NonNullableFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  InterventionMonitoringInformation,
  MonitoringInformation,
} from 'src/app/apiAndObjects/objects/interventionMonitoringInformation';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-intervention-monitoring-information',
  templateUrl: './interventionMonitoringInformation.component.html',
  styleUrls: ['./interventionMonitoringInformation.component.scss'],
})
export class InterventionMonitoringInformationComponent implements OnInit {
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
  public pageStepperPosition = 4;
  public interventionName = 'IntName';
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: NonNullableFormBuilder,
  ) {}

  /**
   * Create a table data source from API response, then construct into a FormArray.
   *
   * The .valueChanges() method then tracks any updates to the form and retrieves
   * only the values that have changed.
   *
   * Finally, the data is returned in the subscription
   * at the end of the chain for processing.
   *
   */
  private initFormWatcher(): void {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionMonitoringInformation(activeInterventionId)
        .then((data: InterventionMonitoringInformation) => {
          console.debug(data);
          this.dataSource = new MatTableDataSource(data.monitoringInformation);
          const monitoringGroupArr = data.monitoringInformation.map((item) => {
            return this.createMonitoringGroup(item);
          });
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(monitoringGroupArr),
          });
          const compareObjs = (a: Record<string, unknown>, b: Record<string, unknown>) => {
            return Object.entries(b).filter(([key, value]) => value !== a[key]);
          };
          const changes = {};

          this.form.valueChanges
            .pipe(
              startWith(this.form.value),
              pairwise(),
              map(([oldState, newState]) => {
                for (const key in newState.items) {
                  const rowIndex = this.form.get('items')['controls'][key]['controls'].rowIndex.value;

                  if (oldState.items[key] !== newState.items[key] && oldState.items[key] !== undefined) {
                    const diff = compareObjs(oldState.items[key], newState.items[key]);
                    if (Array.isArray(diff) && diff.length > 0) {
                      diff.forEach((item) => {
                        if (changes[rowIndex]) {
                          changes[rowIndex] = {
                            ...changes[rowIndex],
                            [item[0]]: Number(item[1]),
                          };
                          changes[rowIndex]['rowIndex'] = rowIndex;
                        } else {
                          changes[rowIndex] = {
                            [item[0]]: Number(item[1]),
                          };
                          changes[rowIndex]['rowIndex'] = rowIndex;
                        }
                      });
                    }
                  }
                }
                return changes;
              }),
              filter((changes) => Object.keys(changes).length !== 0 && !this.form.invalid),
            )
            .subscribe((value) => {
              this.formChanges = value;
              const newInterventionChanges = {
                ...this.interventionDataService.getInterventionDataChanges(),
                ...this.formChanges,
              };
              this.interventionDataService.setInterventionDataChanges(newInterventionChanges);
            });
        });
    }
  }

  get monitoringArray(): UntypedFormArray {
    return this.form.get('items')['controls'] as UntypedFormArray;
  }

  private createMonitoringGroup(item: MonitoringInformation): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [Number(item.year0), []],
      year1: [Number(item.year1), []],
      year2: [Number(item.year2), []],
      year3: [Number(item.year3), []],
      year4: [Number(item.year4), []],
      year5: [Number(item.year5), []],
      year6: [Number(item.year6), []],
      year7: [Number(item.year7), []],
      year8: [Number(item.year8), []],
      year9: [Number(item.year9), []],
    });
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    this.initFormWatcher();
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }

  public resetForm() {
    this.form.reset();
  }
}
