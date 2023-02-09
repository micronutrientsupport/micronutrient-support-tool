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
  public optionalUserEnteredAverageAtPointOfFortification = 0;
  public addedFVdisplayedColumns = ['micronutrient', 'compounds', 'targetVal', 'avgVal', 'optFort', 'calcFort'];
  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public selectedCompound: FoodVehicleCompound;
  // public selectedCompound: Record<number, FoodVehicleStandard> = {};
  // public selectedCompounds: Array<FoodVehicleStandard> = [];

  @Input() public editable = false;
  @Input() public baselineAssumptions: BaselineAssumptions;
  @Input()
  set micronutrients(micronutrients: FoodVehicleStandard[]) {
    this.data.next(micronutrients);
    if (micronutrients.length > 0) {
      // const index = this.dataSource.data.length - 1;
      // this.selectedCompounds.push(micronutrients[0]);
      // console.log('selectedCompound', this.selectedCompounds);
    }
  }

  ngOnInit(): void {
    this.data.subscribe((micronutrients: FoodVehicleStandard[]) => {
      console.log('data.subscribe', micronutrients);

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
