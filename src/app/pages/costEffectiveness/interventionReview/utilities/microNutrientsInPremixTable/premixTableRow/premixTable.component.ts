import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-premix-table',
  templateUrl: './premixTable.component.html',
  styleUrls: ['./premixTable.component.scss'],
})
export class PremixTableComponent {
  constructor(private interventionDataService: InterventionDataService, private dialogService: DialogService) {}

  private data = new Subject<FoodVehicleStandard[]>();
  public optionalAverages: Record<number, number> = {};
  public addedFVdisplayedColumns = ['actions', 'micronutrient', 'compounds', 'targetVal', 'avgVal', 'calcFort'];
  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public selectedCompounds: Array<FoodVehicleCompound> = [];
  public tableIndex: number;
  public buttonsEdited: Array<Record<string, number | boolean>> = [];

  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrients(micronutrients: FoodVehicleStandard[]) {
    this.data.next(micronutrients);
    if (micronutrients.length > 0) {
      micronutrients.forEach((micronutrient: FoodVehicleStandard, index: number) => {
        console.log(micronutrient.compounds);

        console.log(micronutrient.compounds.find((compound) => compound.targetVal > 0));

        this.selectedCompounds.push(micronutrient.compounds[0]);
        this.selectedCompounds = this.selectedCompounds.filter((x) => x);
        this.optionalAverages[index] = 0;
      });
    }
  }

  ngOnInit(): void {
    this.data.subscribe((micronutrients: FoodVehicleStandard[]) => {
      if (this.dataSource.data.length === 0) {
        if (micronutrients.length > 0) {
          this.initTable(micronutrients);
        }
      } else {
        this.dataSource.data = this.dataSource.data.concat(micronutrients);
      }
    });
  }

  public initTable(mnArr: FoodVehicleStandard[]): void {
    this.dataSource = new MatTableDataSource(mnArr);
  }

  public compareObjects(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
    return obj1.compound === obj2.compound && obj1.rowIndex === obj2.rowIndex;
  }

  public handleSelectCompound(mn: FoodVehicleStandard): void {
    // update localstorage with updated Mn and selected compound;
    this.interventionDataService.updateMnCachedInPremix(mn);
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }

  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }

  public removeMn(element: FoodVehicleStandard, clickedIndex: number): void {
    this.dataSource.data = this.dataSource.data.filter((item, index) => index !== clickedIndex);
    this.interventionDataService.removeMnFromCachedMnInPremix(element);
  }

  public setButtonEdited(index: number, buttonValue: number) {
    const row = this.buttonsEdited.filter((item) => item.index === index);

    if (row && row.length > 0) {
      const rowVal = row.shift();
      if (buttonValue === 1) {
        rowVal.button1Edited = true;
      } else if (buttonValue === 2) {
        rowVal.button2Edited = true;
      }
      this.buttonsEdited.splice(this.buttonsEdited.indexOf(rowVal), 1, rowVal);
    } else {
      this.buttonsEdited.push({
        index: index,
        button1Edited: buttonValue === 1,
        button2Edited: buttonValue === 2,
      });
    }
  }

  public userEdited(index: number, buttonValue: number) {
    const row = this.buttonsEdited.filter((item) => item.index === index);
    if (row && row.length > 0) {
      const rowVal = row.shift();
      if (buttonValue === 1) {
        return rowVal.button1Edited;
      } else if (buttonValue === 2) {
        return rowVal.button2Edited;
      }
    }
  }
}
