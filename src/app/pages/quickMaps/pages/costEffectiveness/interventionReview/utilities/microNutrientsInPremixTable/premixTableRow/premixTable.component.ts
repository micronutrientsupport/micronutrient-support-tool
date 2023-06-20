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
  selector: 'app-premix-table',
  templateUrl: './premixTable.component.html',
  styleUrls: ['./premixTable.component.scss'],
})
export class PremixTableComponent {
  constructor(private interventionDataService: InterventionDataService, private dialogService: DialogService) {}

  private data = new Subject<FoodVehicleStandard[]>();
  public optionalUserEnteredAverageAtPointOfFortification = 0;
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];

  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public selectedCompound: FoodVehicleCompound;

  public mnCompoundMap = new Map<string, FoodVehicleCompound>();

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
    this.dataSource.data.splice(this.dataSource.data.indexOf(mn), 1);
    this.dataSource._updateChangeSubscription();
  }

  public handleSelectCompound(mn: FoodVehicleStandard, event: MatSelectChange): void {
    // Set Map with array of Mn and selected compound;
    const selectedCompound = event.value as FoodVehicleCompound;
    this.mnCompoundMap.set(mn.micronutrient, selectedCompound);

    // update localstorage with updated Mn and selected compound;
    const updated = mn;
    updated.selectedCompound = selectedCompound;
    this.interventionDataService.updateMnCachedInPremix(updated);
    console.debug(this.mnCompoundMap);
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }
}
