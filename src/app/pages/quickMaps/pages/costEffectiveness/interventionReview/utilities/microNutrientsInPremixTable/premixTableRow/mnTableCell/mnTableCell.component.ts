import { Component, Input } from '@angular/core';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';

@Component({
  selector: 'app-mn-table-cell',
  templateUrl: './mnTableCell.component.html',
  styleUrls: ['./mnTableCell.component.scss'],
})
export class MnTableCellComponent {
  @Input('compounds') compounds: FoodVehicleStandard;
  public selectedCompound: FoodVehicleCompound;
}
