import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
export class PremixTableRowComponent implements OnInit {
  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input() public micronutrient: FoodVehicleStandard;

  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];
  public selectedCompound: FoodVehicleCompound;

  public optionalUserEnteredAverageAtPointOfFortification = 0;

  constructor(public interventionDataService: InterventionDataService) {}

  public ngOnInit(): void {
    console.debug('call', this.micronutrient);
    this.selectedCompound = this.micronutrient.compounds[0];
    this.dataSource = new MatTableDataSource([this.micronutrient]);
  }

  public removeMn(element: FoodVehicleStandard): void {
    this.interventionDataService.removeMnFromCachedMnInPremix(element);
  }
}
