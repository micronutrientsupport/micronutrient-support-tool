import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import {
  UntypedFormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { InterventionFortificantLevel } from 'src/app/apiAndObjects/objects/interventionFortificantLevel';
@Component({
  selector: 'app-premix-cost-review',
  templateUrl: './premixCostReviewDialog.component.html',
  styleUrls: ['./premixCostReviewDialog.component.scss'],
})
export class PremixCostReviewDialogComponent {
  public FormGroup = FormGroup;
  public FormArray = FormArray;

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

  public fortificationLevel: any[];

  public displayExcipientDetails = false;

  //public additionRate = 250;
  public fillerPercentage = 25;
  public upcharge = 1;

  public isDataLoading = true;

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
    this.title = 'Premix Cost Calculator';
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
    this.isDataLoading = true;
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.fortificationLevel = await this.apiService.endpoints.intervention.getInterventionFortificationLevel.call({
      id: activeInterventionId,
    });
    console.log(this.fortificationLevel);
    if (null != activeInterventionId) {
      const excipient = this.fortificationLevel.find((fortificant) => fortificant.fortificantCompound === 'Excipient');

      if (excipient) {
        // Activity 100 / Overage 0 means
        // total amount = fortificationLevel

        excipient.fortificantActivity = 1;
        excipient.fortificantOverage = 0;
        excipient.fortificationLevel = this.filler;
      }

      this.dataSource = new MatTableDataSource(this.fortificationLevel);

      const startupGroupArr = this.fortificationLevel.map((item) => {
        return this.createPremixGroup(item);
      });

      startupGroupArr.push(
        this.formBuilder.group({
          rowIndex: 'global',
          rowUnits: 'number',
          fillerPercentage: [25, []],
          upcharge: [1, []],
        }),
      );
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(startupGroupArr),
      });
      //   // // Mark fields as touched/dirty if they have been previously edited and stored via the API
      //   // this.interventionDataService.setFormFieldState(this.form, this.dirtyIndexes);
      // Setup watched to track changes made to form fields and store them to the intervention
      // data service to be synced to the API when needed
      this.interventionDataService.initFormChangeWatcher(this.form, this.formChanges);

      this.isDataLoading = false;
    }
  }

  private createPremixGroup(item: InterventionFortificantLevel): UntypedFormGroup {
    console.log({ item });
    return this.formBuilder.group({
      fortificantId: [Number(item.fortificantId), []],
      fortificantAmount: [0, []],
      fortificantActivity: [Number(item.fortificantActivity / 100), []],
      fortificantActivityUnits: ['percent', []],
      fortificantProportion: [0, []],
      fortificantPrice: [Number(item.fortificantPrice), []],
      fortificantPriceUnits: ['US dollars', []],
      fortificantOverage: [Number(0), []],
      fortificantOverageUnits: ['percent', []],
      fortificationLevel: [Number(item.fortificationLevel), []],
      rowUnits: ['number', []],
      rowIndex: ['F' + Number(item.rowIndex), []],
      isCalculated: [false, []],
    });
  }

  public updateFortificantActivity(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantActivity = Number(($event.target as any).value) / 100;
    };
  }

  public updateFortificantOverage(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantOverage = Number(($event.target as any).value) / 100;
    };
  }

  public updateFortificantPrice(index: number) {
    return ($event: Event) => {
      this.fortificationLevel[index].fortificantPrice = Number(this.formatPlain(($event.target as any).value));
    };
  }

  private reverseFormatNumber(val, locale) {
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  }

  public formatPlain(value: string) {
    if (value.startsWith('$')) {
      const plainCurrency = this.reverseFormatNumber(value.substr(1), 'en-US');
      //console.log(`${value} -> ${plainCurrency}`);
      return plainCurrency;
    }
    return value;
  }

  get totalFortificantAmount(): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers
    return this.dataSource.data.reduce(
      // Omit the last row for
      (acc, value, index, arr) =>
        index != arr.length - 1
          ? acc + ((1 + value.fortificantOverage) * value.fortificationLevel) / value.fortificantActivity
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
        (((1 + value.fortificantOverage) * value.fortificationLevel) / value.fortificantActivity) *
          (1 / this.additionRate) *
          value.fortificantPrice,
      0,
    );
  }

  get additionRate(): number {
    return this.fillerPercentage == 0
      ? Number(this.totalFortificantAmount.toFixed(2))
      : this.ceiling((+(this.fillerPercentage / 100) + 1) * this.totalFortificantAmount, 50);
  }

  get totalNutrientsAndExcipient(): number {
    return (Number(this.fillerPercentage / 100) + 1) * this.totalFortificantAmount;
  }

  get filler(): number {
    const filler = this.additionRate - this.totalFortificantAmount;
    this.fortificationLevel[this.fortificationLevel.length - 1].fortificantCompound === 'Excipient'
      ? (this.fortificationLevel[this.fortificationLevel.length - 1].fortificationLevel = filler)
      : '';
    return filler;
  }

  get fillerControl(): FormControl {
    return ((this.form.controls.items as FormArray).controls[this.fortificationLevel.length] as FormGroup).controls
      .fillerPercentage as FormControl;
  }

  public ceiling(number: number, significance: number): number {
    return Math.ceil(number / significance) * significance;
  }

  public confirmChanges(): void {
    this.interventionDataService.interventionPageConfirmContinue().then(() => {
      this.interventionDataService.interventionPremixCostChanged(true); // trigger dialog source page to update content
      this.dialogData.close();
    });
  }

  public resetForm() {
    this.interventionDataService.resetForm(this.form, this.dirtyIndexes);
  }
}
