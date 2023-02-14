import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  public selectedCompounds: Record<number, FoodVehicleCompound | Record<string, unknown>> = {};
  public compound: FormGroup;

  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrients(micronutrients: FoodVehicleStandard[]) {
    this.data.next(micronutrients);
    if (micronutrients.length > 0) {
      const compound = micronutrients[0].compounds;
      const index = compound[0].rowIndex;

      this.selectedCompounds[index] = compound[0];
    }
  }

  // private checkForDuplicates(micronutrients: Array<FoodVehicleStandard>): Array<FoodVehicleStandard> {
  //   if (this.dataSource.data.length > 1) {
  //     const duplicates = this.dataSource.data.filter(
  //       (item) => item.micronutrient.trim() === micronutrients[0].micronutrient.trim(),
  //     );
  //     return duplicates;
  //   }
  //   return [];
  // }

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

  public removeMn(mn: FoodVehicleStandard): void {
    this.interventionDataService.removeMnFromCachedMnInPremix(mn);
    this.dataSource.data.splice(this.dataSource.data.indexOf(mn), 1);
    this.dataSource._updateChangeSubscription();
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

  public compareObjects(o1: FoodVehicleCompound, o2: FoodVehicleCompound): boolean {
    return o1.compound === o2.compound;
  }
}
