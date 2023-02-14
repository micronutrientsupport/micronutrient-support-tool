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
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];
  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public selectedCompounds: Array<FoodVehicleCompound> = [];
  public tableIndex: number;

  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrients(micronutrients: FoodVehicleStandard[]) {
    this.data.next(micronutrients);
    if (micronutrients.length > 0) {
      micronutrients.forEach((micronutrient: FoodVehicleStandard, index: number) => {
        console.log(micronutrient.compounds[0]);
        this.selectedCompounds.push(micronutrient.compounds[0]);
        this.selectedCompounds = this.selectedCompounds.filter((x) => x);
        console.log(this.selectedCompounds);
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

  public removeMn(element: any, rowIndex?: number): void {
    //
  }
}
