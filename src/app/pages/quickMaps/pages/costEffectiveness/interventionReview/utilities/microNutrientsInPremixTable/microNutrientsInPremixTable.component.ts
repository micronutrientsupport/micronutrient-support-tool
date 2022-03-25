import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/InterventionFoodVehicleStandards';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-micro-nutrients-in-premix-table',
  templateUrl: './microNutrientsInPremixTable.component.html',
  styleUrls: ['./microNutrientsInPremixTable.component.scss'],
})
export class MicroNutrientsInPremixTableComponent implements OnInit {
  public dataSource = new MatTableDataSource<FoodVehicleStandard>();
  public addedFVdisplayedColumns = ['micronutrient', 'compound', 'targetVal'];

  constructor(
    private readonly interventionDataService: InterventionDataService,
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.createTable();
  }

  public addMN(): void {
    void this.dialogService
      .openMnAdditionDialog()
      .then((dialogData: DialogData<Array<MicronutrientDictionaryItem>, Array<MicronutrientDictionaryItem>>) => {
        const mnArray = dialogData.dataOut;
        mnArray.forEach((mn: MicronutrientDictionaryItem) => {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              if (null != data) {
                const addedNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                this.interventionDataService.addMnToCachedMnInPremix(addedNutrientFVS);
                this.createTable();
              }
            });
        });
      });
  }

  public createTable(): void {
    this.dataSource = new MatTableDataSource(this.interventionDataService.getCachedMnInPremix());
  }
}
