import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { BaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
} from 'src/app/apiAndObjects/objects/InterventionFoodVehicleStandards';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-premix-table-row',
  templateUrl: './premixTableRow.component.html',
  styleUrls: ['./premixTableRow.component.scss'],
})
export class PremixTableRowComponent {
  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrient(micronutrient: FoodVehicleStandard) {
    this.data.next(micronutrient);
  }
  private data = new BehaviorSubject<FoodVehicleStandard>(null);

  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];
  public selectedCompound: FoodVehicleCompound;

  public optionalUserEnteredAverageAtPointOfFortification = 0;

  constructor(public interventionDataService: InterventionDataService) {
    this.data.subscribe((mn: FoodVehicleStandard) => {
      if (null != mn) {
        this.initTable(mn);
      }
    });
  }

  public initTable(mn: FoodVehicleStandard): void {
    this.selectedCompound = mn.compounds[0];
    this.dataSource = new MatTableDataSource([mn]);
  }

  public removeMn(mn: FoodVehicleStandard): void {
    this.interventionDataService.removeMnFromCachedMnInPremix(mn);
    this.dataSource = new MatTableDataSource([]);
  }
}
