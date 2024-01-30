import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { InterventionFortificantLevel } from 'src/app/apiAndObjects/objects/interventionFortificantLevel';
@Component({
  selector: 'app-premix-cost-review',
  templateUrl: './premixCostReviewDialog.component.html',
  styleUrls: ['./premixCostReviewDialog.component.scss'],
})
export class PremixCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<InterventionFortificantLevel>();
  public title = '';
  public dirtyIndexes = [];
  public displayedColumns: string[] = [
    'fortificantMicronutrient',
    'fortificantCompound',
    'fortificantActivity',
    'fortificationLevel',
    'fortificantOverage',
    'fortificantAmount',
    'fortificantProportion',
    'fortificantPrice',
    'fortificantCost',
  ];
  public upchargeColumns: string[] = [
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'upchargeLabel',
    'upcharge',
  ];
  public totalColumns: string[] = [
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'totalLabel',
    'total',
  ];
  public finalColumns: string[] = [
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'finalLabel',
    'finalTotal',
  ];
  public baseYear = 2021;
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public year0Total = 0;
  public year1Total = 0;

  public fortificationLevel: InterventionFortificantLevel[];

  public displayExcipientDetails = false;

  //public additionRate = 250;
  public fillerPercentage = 0.25;
  public upcharge = 1;

  public state: {
    fortificantActivity: number;
  }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
  ) {}

  public async ngOnInit() {
    // this.dictionariesService.getDictionary(DictionaryType.MICRONUTRIENTS).then((dictionary) => {
    //   this.mnDictionary = dictionary;
    // });

    this.initFormWatcher();
    this.title = 'Premix Calculator';
  }

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
  private async initFormWatcher(): Promise<void> {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.fortificationLevel = await this.apiService.endpoints.intervention.getInterventionFortificationLevel.call({
      id: activeInterventionId,
    });
    console.log(this.fortificationLevel);
    if (null != activeInterventionId) {
      this.fortificationLevel.push(
        InterventionFortificantLevel.makeExcipient({
          interventionId: activeInterventionId,
          fortificantMicronutrient: '',
          fortificantCompound: 'Excipient',
          fortificantId: 0,

          // Activity 100 / Overage 0 means
          // total amount = fortificationLevel
          fortificantActivity: '100',
          fortificationOverage: 0,

          fortificationLevel: this.filler,

          fortificantPrice: '1.5',
          fortificantAmount: '0',
          fortificantProportion: '0',
        }),
      );

      this.dataSource = new MatTableDataSource(this.fortificationLevel);

      const startupGroupArr = this.fortificationLevel.map((item) => {
        return this.createPremixGroup(item);
      });

      console.log(startupGroupArr);
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(startupGroupArr),
      });
      //   // // Mark fields as touched/dirty if they have been previously edited and stored via the API
      //   // this.interventionDataService.setFormFieldState(this.form, this.dirtyIndexes);

      // Setup watched to track changes made to form fields and store them to the intervention
      // data service to be synced to the API when needed
      this.interventionDataService.initFormChangeWatcher(this.form, this.formChanges);
    }
  }

  private createPremixGroup(item: InterventionFortificantLevel): UntypedFormGroup {
    console.log({ item });
    return this.formBuilder.group({
      fortificantId: [Number(item.fortificantId), []],
      fortificantAmount: [0, []],
      fortificantActivity: [Number(item.fortificantActivity), []],
      fortificantProportion: [0, []],
      fortificantPrice: [Number(item.fortificantPrice), []],
      fortificantOverage: [Number(0), []],
      fortificationLevel: [Number(item.fortificationLevel), []],
      rowUnits: ['number', []],
      rowIndex: [Number(item.fortificantId), []],
      isCalculated: [false, []],
    });
  }

  public updateFortificantActivity(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantActivity = Number(($event.target as any).value);
    };
  }

  public updateFortificantOverage(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantOverage = Number(($event.target as any).value);
    };
  }

  public updateFortificantPrice(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantPrice = Number(($event.target as any).value);
    };
  }

  get totalFortificantAmount(): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers
    return this.dataSource.data.reduce(
      // Omit the last row for
      (acc, value, index, arr) =>
        index != arr.length - 1
          ? acc + ((1 + value.fortificantOverage) * value.fortificationLevel) / (value.fortificantActivity / 100)
          : acc,
      0,
    );
  }

  get totalCost(): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers
    return this.dataSource.data.reduce(
      (acc, value) =>
        acc +
        (((1 + value.fortificantOverage) * value.fortificationLevel) / (value.fortificantActivity / 100)) *
          (1 / this.additionRate) *
          value.fortificantPrice,
      0,
    );
  }

  get additionRate(): number {
    return this.fillerPercentage == 0
      ? Number(this.totalFortificantAmount.toFixed(2))
      : this.ceiling((+this.fillerPercentage + 1) * this.totalFortificantAmount, 50);
  }

  get totalNutrientsAndExcipient(): number {
    return (Number(this.fillerPercentage) + 1) * this.totalFortificantAmount;
  }

  get filler(): number {
    const filler = this.additionRate - this.totalFortificantAmount;
    this.fortificationLevel[this.fortificationLevel.length - 1].fortificantCompound === 'Excipient'
      ? (this.fortificationLevel[this.fortificationLevel.length - 1].fortificationLevel = filler)
      : '';
    return filler;
  }

  public ceiling(number: number, significance: number): number {
    return Math.ceil(number / significance) * significance;
  }

  public confirmChanges(): void {
    if (Object.keys(this.formChanges).length !== 0) {
      this.interventionDataService.interventionPageConfirmContinue().then(() => {
        this.interventionDataService.interventionStartupCostChanged(true); // trigger dialog source page to update content
        this.dialogData.close();
      });
    } else {
      this.dialogData.close();
    }
  }

  public resetForm() {
    this.interventionDataService.resetForm(this.form, this.dirtyIndexes);
  }
}
