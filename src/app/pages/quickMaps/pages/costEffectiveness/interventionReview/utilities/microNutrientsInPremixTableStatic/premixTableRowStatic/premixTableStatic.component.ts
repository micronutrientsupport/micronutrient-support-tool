import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
  selector: 'app-premix-table-static',
  templateUrl: './premixTableStatic.component.html',
  styleUrls: ['./premixTableStatic.component.scss'],
})
export class PremixTableStaticComponent {
  constructor(private interventionDataService: InterventionDataService, private dialogService: DialogService) {}

  private data = new Subject<FoodVehicleStandard[]>();
  public optionalUserEnteredAverageAtPointOfFortification = 0;
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];

  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public selectedCompound: FoodVehicleCompound;

  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrients(micronutrients: FoodVehicleStandard[]) {
    this.data.next(micronutrients);
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

  public initTable(mn: FoodVehicleStandard[]): void {
    this.selectedCompound = mn[0].compounds[0];
    this.dataSource = new MatTableDataSource(mn);
  }

  public removeMn(mn: FoodVehicleStandard): void {
    this.interventionDataService.removeMnFromCachedMnInPremix(mn);
    this.dataSource = new MatTableDataSource([]);
  }

  public handleSelectCompound(event: MatSelectChange): void {
    console.log(event);
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }
}
