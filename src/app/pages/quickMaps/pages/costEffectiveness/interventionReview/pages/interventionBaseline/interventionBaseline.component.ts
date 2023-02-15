import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, pairwise, startWith, Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  ActuallyFortified,
  BaselineAssumptions,
  InterventionBaselineAssumptions,
  PotentiallyFortified,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { FormGroup, NonNullableFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/components/notifications/notification.service';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent implements AfterViewInit {
  public dirtyIndexes = [];
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

  public baselineAssumptions: BaselineAssumptions;
  public selectedCompound: FoodVehicleCompound;
  public activeNutrientFVS: Array<FoodVehicleStandard>;

  public dataSource = new MatTableDataSource();
  public baselinedisplayedColumns = ['title', 'year0'];

  public FVdataSource = new MatTableDataSource();
  public baselineFVdisplayedColumns = ['micronutrient', 'compound', 'targetVal', 'avgVal', 'optFort', 'calcFort'];

  public optionalUserEnteredAverageAtPointOfFortification = 0;

  private subscriptions = new Array<Subscription>();
  public activeInterventionId: string;
  public newMnInPremix: MicronutrientDictionaryItem;
  public rawBaselineDataArray: Array<PotentiallyFortified | ActuallyFortified> = [];

  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public compoundAvailable = true;
  public buttonOneEdited = false;
  public buttonTwoEdited = false;

  public dataLoaded = false;
  public focusMnForm: UntypedFormGroup;
  public focusMnData: Array<Record<string, unknown>> = [];

  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
    private readonly cdr: ChangeDetectorRef,
    private formBuilder: NonNullableFormBuilder,
    private notificationsService: NotificationsService,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public ngOnInit(): void {
    this.initFocusMicronutrientTable();
  }

  public ngAfterViewInit(): void {
    this.subscriptions.push(
      void this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        if (null != mn) {
          this.interventionDataService
            .getInterventionFoodVehicleStandards(this.activeInterventionId)
            .then((data: InterventionFoodVehicleStandards) => {
              if (null != data) {
                this.activeNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(mn.id);
                });
                this.createFVTableObject(this.activeNutrientFVS);
                this.compoundAvailable = true;
                this.initBaselineAssumptionTable();

                this.focusMnForm.get('targetVal').setValue(this.activeNutrientFVS[0].compounds[0].targetVal);
                // this.focusMnForm.get('optFort').setValue(this.optionalUserEnteredAverageAtPointOfFortification);
              }
            })
            .catch(() => {
              this.compoundAvailable = false;
            });
        }
        this.cdr.detectChanges();
      }),
    );
  }

  private initFocusMicronutrientTable(): void {
    this.focusMnForm = this.formBuilder.group({
      compound: ['', Validators.required],
      targetVal: [''],
      optFort: [''],
    });
    this.focusMnForm.valueChanges.pipe(startWith(this.focusMnForm.value)).subscribe((changes) => {
      if (changes.targetVal !== '') {
        this.selectedCompound = changes.compound;

        const changesArr = this.focusMnData.filter((item) => item.rowIndex === changes.compound.rowIndex);
        if (changesArr.length === 0) {
          this.focusMnData.push({
            rowIndex: changes.compound.rowIndex,
          });
        } else {
          changesArr[0].year0 = changes.targetVal;
        }

        const newInterventionChanges = {
          ...this.interventionDataService.getInterventionDataChanges(),
          ...changesArr,
        };
        this.interventionDataService.setInterventionDataChanges(newInterventionChanges);
      }
    });
  }

  private initBaselineAssumptionTable() {
    void this.interventionDataService
      .getInterventionBaselineAssumptions(this.activeInterventionId)
      .then((data: InterventionBaselineAssumptions) => {
        this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
        this.cdr.detectChanges();

        this.createBaselineTableObject();
        const baselineGroupArr = this.rawBaselineDataArray.map((item) => {
          return this.createBaselineDataGroup(item);
        });
        this.form = this.formBuilder.group({
          items: this.formBuilder.array(baselineGroupArr),
        });

        this.dataLoaded = true;

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
                const rowUnits = this.form.get('items')['controls'][key]['controls'].rowUnits.value;
                if (oldState.items[key] !== newState.items[key] && oldState.items[key] !== undefined) {
                  const diff = compareObjs(oldState.items[key], newState.items[key]);
                  if (Array.isArray(diff) && diff.length > 0) {
                    diff.forEach((item) => {
                      if (rowUnits === 'percent') {
                        if (changes[rowIndex]) {
                          changes[rowIndex] = {
                            ...changes[rowIndex],
                            [item[0]]: Number(item[1]) / 100,
                          };
                          changes[rowIndex]['rowIndex'] = rowIndex;
                        } else {
                          changes[rowIndex] = {
                            [item[0]]: Number(item[1]) / 100,
                          };
                          changes[rowIndex]['rowIndex'] = rowIndex;
                        }
                      } else {
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

  private createBaselineDataGroup(item: PotentiallyFortified | ActuallyFortified): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      rowUnits: [item.rowUnits, []],
      isEditable: [item.isEditable, []],
      year0: [Number(item.year0), [Validators.min(0), Validators.max(100)]],
      year0Edited: [Number(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
    });
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }

  public createBaselineTableObject(): void {
    this.rawBaselineDataArray.push(
      this.baselineAssumptions.actuallyFortified,
      this.baselineAssumptions.potentiallyFortified,
    );
    this.dataSource = new MatTableDataSource(this.rawBaselineDataArray);
  }

  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    this.selectedCompound = fvdata[0].compounds[0];
    this.FVdataSource = new MatTableDataSource(fvdata);

    this.focusMnForm.get('compound').setValue(this.selectedCompound);
    this.cdr.detectChanges();
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }

  public resetForm() {
    // set fields to default values as delivered per api
    this.form.controls.items['controls'].forEach((formRow: FormGroup) => {
      let yearIndex = 0;
      Object.keys(formRow.controls).forEach((key: string) => {
        if (key === 'year' + yearIndex) {
          if (formRow.controls['year' + yearIndex + 'Default'].value !== formRow.controls['year' + yearIndex].value) {
            formRow.controls[key].setValue(formRow.controls['year' + yearIndex + 'Default'].value); // set the default value
          }
          yearIndex++;
        }
      });
    });
    //on reset mark forma as pristine to remove blue highlights
    this.form.markAsPristine();
    //remove dirty indexes to reset button to GFDx input
    this.dirtyIndexes.splice(0);
  }

  public handleAddMn(micronutrient: MicronutrientDictionaryItem): void {
    this.newMnInPremix = micronutrient;
  }

  public udpateButtonState(value: number): void {
    if (value === 1) {
      this.buttonOneEdited = true;
    } else if (value === 2) {
      this.buttonTwoEdited = true;
    }
  }

  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
  }

  public validateUserInput(event: Event, rowIndex: number, year: string) {
    const userInput = Number((event.target as HTMLInputElement).value);
    if (userInput < 0) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 0 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    } else if (userInput > 100) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 100 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    }
  }
}
