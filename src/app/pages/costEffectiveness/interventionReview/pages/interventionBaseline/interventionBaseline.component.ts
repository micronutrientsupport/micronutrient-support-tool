import { AfterViewInit, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
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
import { getRoute, AppRoute, AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { FormArray, FormGroup, NonNullableFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { MatTab } from '@angular/material/tabs';
import { MatSelectChange } from '@angular/material/select';
import { runInThisContext } from 'vm';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent implements AfterViewInit {
  public baseYear = 2021;
  public dirtyIndexes = [];
  public ROUTES = AppRoutes;

  public baselineAssumptions: BaselineAssumptions;

  public dataSource = new MatTableDataSource();

  public baselinedisplayedColumns = ['title', 'year0'];

  public FVdataSource = new MatTableDataSource();
  public baselineFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal' /*'avgVal', 'calcFort'*/];
  // public baselineFVdisplayedColumns = ['year0'];

  public optionalUserEnteredAverageAtPointOfFortification = '0';

  private subscriptions = new Array<Subscription>();
  public activeInterventionId: string;
  public newMnInPremix: MicronutrientDictionaryItem;
  public rawBaselineDataArray: Array<PotentiallyFortified | ActuallyFortified> = [];

  public formChanges: InterventionForm['formChanges'] = {};
  public compoundAvailable = true;
  public buttonOneEdited = false;
  public buttonTwoEdited = false;

  public dataLoaded = false;

  public loading = false;

  public focusDirtyIndexes = [];
  public allFoodVehicleStandards: Array<FoodVehicleStandard>;
  public focusVehicleStandards: Array<FoodVehicleStandard>;
  public focusMnDataSource = new MatTableDataSource();
  public focusMnForm: UntypedFormGroup;
  public focusMnData: Array<Record<string, unknown>> = [];
  public focusMnFormInitVals;

  public premixDirtyIndexes = [];
  public premixVehicleStandards: FoodVehicleStandard[];
  public premixMnDataSource = new MatTableDataSource();
  public premixMnForm: UntypedFormGroup;
  public premixMnData: Array<Record<string, unknown>> = [];
  public premixMnFormInitVals;

  public selectedCompounds: { [key: string]: { index: number; rowIndex: number; targetVal: number } } = {};

  public mnDictionary: Dictionary;

  public nextRoutes = [];
  public previousRoute;

  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    public intSideNavService: InterventionSideNavContentService,
    private readonly cdr: ChangeDetectorRef,
    private formBuilder: NonNullableFormBuilder,
    private notificationsService: NotificationsService,
    private readonly dictionariesService: DictionaryService,
    private router: Router,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
  }

  public ngOnInit(): void {
    this.dictionariesService.getDictionary(DictionaryType.MICRONUTRIENTS).then((dictionary) => {
      this.mnDictionary = dictionary;
    });
    this.initFocusMnTable();

    this.nextRoutes = this.intSideNavService.getNextRoutes();
    this.previousRoute = this.intSideNavService.getPreviousRoute();
  }

  public ngAfterViewInit(): void {
    this.subscriptions.push(
      void this.interventionDataService
        .getIntervention(this.activeInterventionId)
        .then((intervention: Intervention) => {
          if (null != intervention.focusMicronutrient) {
            this.interventionDataService.getInterventionFoodVehicleStandards(this.activeInterventionId).catch((err) => {
              console.error(err);
              this.compoundAvailable = false;
            });
          }
          this.cdr.detectChanges();
        }),
    );
  }

  private async initFocusMnTable() {
    void this.interventionDataService
      .getInterventionFoodVehicleStandards(this.activeInterventionId)
      .then(async (data: InterventionFoodVehicleStandards) => {
        this.cdr.detectChanges();

        const intervention = await this.interventionDataService.getIntervention(this.activeInterventionId);

        this.interventionDataService.clearMicronutrientInPremix();
        data.foodVehicleStandard.forEach((standard: FoodVehicleStandard, index: number) => {
          console.log(standard.micronutrient);

          standard.compounds.forEach((compound: FoodVehicleCompound, stdIndex: number) => {
            console.log(index, compound);
            if (compound.targetVal > 0 || standard.micronutrient == intervention.focusMicronutrient) {
              this.selectedCompounds[standard.micronutrient] = {
                index: stdIndex,
                rowIndex: standard.compounds[stdIndex].rowIndex,
                targetVal: standard.compounds[stdIndex].targetVal,
              };
              this.interventionDataService.addMicronutrientInPremix(standard.micronutrient);
            }
          });

          if (!Object.prototype.hasOwnProperty.call(this.selectedCompounds, standard.micronutrient)) {
            console.log('No value for ', standard.micronutrient);
            // this.selectedCompounds[standard.micronutrient] = {
            //   index: 0,
            //   rowIndex: standard.compounds[0].rowIndex,
            //   targetVal: standard.compounds[0].targetVal,
            // };
            //data.foodVehicleStandard.splice(index, 1);
          }
          console.log('SelCmpd', this.selectedCompounds);
        });

        this.allFoodVehicleStandards = data.foodVehicleStandard;

        this.focusVehicleStandards = data.foodVehicleStandard.filter((standard) => {
          return standard.micronutrient.includes(intervention.focusMicronutrient);
        });
        console.log({ focusVehicleStandards: this.focusVehicleStandards });
        this.focusMnDataSource = new MatTableDataSource(this.focusVehicleStandards);
        const focusMnGroupArray = this.focusVehicleStandards.map((item) => {
          return this.createPremixMnGroup(item);
        });
        console.log({ focusMnGroupArray });
        this.focusMnForm = this.formBuilder.group({
          items: this.formBuilder.array(focusMnGroupArray),
        });

        this.premixVehicleStandards = data.foodVehicleStandard.filter((standard) => {
          return (
            !standard.micronutrient.includes(intervention.focusMicronutrient) &&
            Object.prototype.hasOwnProperty.call(this.selectedCompounds, standard.micronutrient)
          );
        });
        this.premixMnDataSource = new MatTableDataSource(this.premixVehicleStandards);
        const premixMnGroupArray = this.premixVehicleStandards.map((item) => {
          return this.createPremixMnGroup(item);
        });
        this.premixMnForm = this.formBuilder.group({
          items: this.formBuilder.array(premixMnGroupArray),
        });

        // Mark fields as touched/dirty if they have been previously edited and stored via the API
        //this.interventionDataService.setFormFieldState(this.premixMnForm, this.premixDirtyIndexes, 'targetVal');
        this.interventionDataService.setFormFieldState(this.focusMnForm, this.focusDirtyIndexes, 'targetVal');

        // Setup watched to track changes made to form fields and store them to the intervention
        // data service to be synced to the API when needed
        this.interventionDataService.initFormChangeWatcher(this.focusMnForm, this.formChanges);
        this.interventionDataService.initFormChangeWatcher(this.premixMnForm, this.formChanges);
      });
  }

  public rowIndex(micronutrient: string) {
    const field = this.focusMnForm.controls.items['controls'].find((ele) => ele.value.micronutrient === micronutrient);

    return field?.value?.rowIndex;
  }

  private createPremixMnGroup(item: FoodVehicleStandard): UntypedFormGroup {
    return this.formBuilder.group({
      micronutrient: [item.micronutrient],
      rowIndex: [item.compounds[this.selectedCompounds[item.micronutrient].index].rowIndex, []],
      rowUnits: [item.compounds[this.selectedCompounds[item.micronutrient].index].rowUnits, []],
      isEditable: [item.compounds[this.selectedCompounds[item.micronutrient].index].isEditable, []],
      isCalculated: [false, []],
      targetVal: [Number(item.compounds[this.selectedCompounds[item.micronutrient].index].targetVal), []],
      targetValEdited: [Number(item.compounds[this.selectedCompounds[item.micronutrient].index].targetValEdited), []],
      targetValDefault: [Number(item.compounds[this.selectedCompounds[item.micronutrient].index].targetValDefault), []],
      // year0Overriden: item.year0Overriden,
      // year0Formula: item.year0Formula,
    });
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }

  public openfoodVehicleStandardInfoDialog(): void {
    void this.dialogService.openfoodVehicleStandardInfoDialog();
  }

  public resetForm() {
    // set fields to default values as delivered per api
    this.focusMnForm.reset(this.focusMnFormInitVals);

    this.premixMnForm.reset(this.premixMnFormInitVals);

    //remove dirty indexes to reset button to GFDx input
    this.dirtyIndexes.splice(0);
  }

  public handleAddMn(micronutrient: MicronutrientDictionaryItem): void {
    console.log('Add new MN!', micronutrient);

    const newStandard = this.allFoodVehicleStandards.filter((standard) => {
      return standard.micronutrient.includes(micronutrient.id);
    });

    this.premixVehicleStandards.push(newStandard[0]);

    this.selectedCompounds[micronutrient.id] = {
      index: 0,
      rowIndex: newStandard[0].compounds[0].rowIndex,
      targetVal: newStandard[0].compounds[0].targetVal,
    };
    const gp = this.createPremixMnGroup(newStandard[0]);

    const initialControls = this.premixMnForm.controls;
    (initialControls.items as FormArray).push(gp);
    this.premixMnForm.addControl('items', initialControls);

    this.premixMnDataSource = new MatTableDataSource(this.premixVehicleStandards);

    // Add Mn to premix list to disable from the Add micronutrient menu
    this.interventionDataService.addMicronutrientInPremix(micronutrient.id);
  }

  public updateButtonState(value: number): void {
    if (value === 1) {
      this.buttonOneEdited = true;
    } else if (value === 2) {
      this.buttonTwoEdited = true;
    }
    this.cdr.detectChanges();
  }

  public updateFVStandard(micronutrient: string) {
    return ($event: Event) => {
      this.selectedCompounds[micronutrient].targetVal = Number(($event.target as any).value);
    };
  }

  public updateCompoundSelection($event: MatSelectChange, element: FoodVehicleStandard) {
    const newIndex = $event.source.value;
    const newCompound = element.compounds[newIndex];
    this.focusMnForm.controls.items['controls'].forEach((control) => {
      if (control.value.micronutrient === element.micronutrient) {
        console.log(control.get('targetVal').value);
        control.get('targetVal').patchValue(0);
        control.get('rowIndex').patchValue(newCompound.rowIndex);
      }
    });
    this.premixMnForm.controls.items['controls'].forEach((control) => {
      if (control.value.micronutrient === element.micronutrient) {
        control.get('rowIndex').patchValue(newCompound.rowIndex);
      }
    });
    //this.form.controls.items['controls'][index].patchValue({ ['year' + i]: cellVal });

    this.selectedCompounds[element.micronutrient] = {
      index: newIndex,
      rowIndex: newCompound.rowIndex,
      targetVal: newCompound.targetVal,
    };
  }

  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
  }
}
