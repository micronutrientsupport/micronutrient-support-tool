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
import { NonNullableFormBuilder, UntypedFormGroup } from '@angular/forms';

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
  public compoundAvailable = false;
  public compoundUnavailable = true;
  public inputTwo = 2;
  public inputThree = 3;

  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
    private readonly cdr: ChangeDetectorRef,
    private formBuilder: NonNullableFormBuilder,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
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
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                this.createFVTableObject(this.activeNutrientFVS);

                this.initBaselineAssumptionTable();
              }
            });
        }
        this.cdr.detectChanges();
      }),
    );
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
            console.debug(value);
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
      year0: [Number(item.year0), []],
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
    console.debug('Compound', this.selectedCompound);
    this.compoundAvailable = true;
    this.compoundUnavailable = false;

    this.FVdataSource = new MatTableDataSource(fvdata);
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }

  public resetForm() {
    this.form.reset();
  }

  public handleAddMn(micronutrient: MicronutrientDictionaryItem): void {
    this.newMnInPremix = micronutrient;
  }
  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
    this.dirtyIndexes.push(this.inputTwo);
    this.dirtyIndexes.push(this.inputThree);
  }
}
