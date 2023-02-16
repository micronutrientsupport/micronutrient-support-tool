import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, NonNullableFormBuilder, FormGroup } from '@angular/forms';
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
  public dirtyIndexes = [];
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
  public userInput = false;
  public dataLoaded = false;

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
          this.dataSource = new MatTableDataSource(data.monitoringInformation);
          const monitoringGroupArr = data.monitoringInformation.map((item) => {
            return this.createMonitoringGroup(item);
          });
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(monitoringGroupArr),
          });
          this.dataLoaded = true;
          // Mark fields as touched/dirty if they have been previously edited and stored via the API
          this.form.controls.items['controls'].forEach((formRow: FormGroup, rowIndex: number) => {
            let yearIndex = 0;
            Object.keys(formRow.controls).forEach((key: string) => {
              if (key === 'year' + yearIndex) {
                if (formRow.controls['year' + yearIndex + 'Edited'].value === true) {
                  formRow.controls[key].markAsDirty(); // mark field as ng-dirty i.e. user edited
                  this.storeIndex(rowIndex); // mark row as containing user info
                }
                yearIndex++;
              }
            });
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

              // if (this.userInput.valueOf()) {
              //   return (this.userInput = true);
              // }
              // console.log('user Input? ', this.userInput);
              // console.log('userinput value of? ', this.userInput.valueOf());
            });
        });
    }
  }

  private createMonitoringGroup(item: MonitoringInformation): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year2: [Number(item.year2), []],
      year2Edited: [Boolean(item.year2Edited), []],
      year3: [Number(item.year3), []],
      year3Edited: [Boolean(item.year3Edited), []],
      year4: [Number(item.year4), []],
      year4Edited: [Boolean(item.year4Edited), []],
      year5: [Number(item.year5), []],
      year5Edited: [Boolean(item.year5Edited), []],
      year6: [Number(item.year6), []],
      year6Edited: [Boolean(item.year6Edited), []],
      year7: [Number(item.year7), []],
      year7Edited: [Boolean(item.year7Edited), []],
      year8: [Number(item.year8), []],
      year8Edited: [Boolean(item.year8Edited), []],
      year9: [Number(item.year9), []],
      year9Edited: [Boolean(item.year9Edited), []],
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

  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
  }
}
