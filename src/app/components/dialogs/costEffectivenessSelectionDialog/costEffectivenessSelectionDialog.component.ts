import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { DialogData } from '../baseDialogService.abstract';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { Params } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { Region } from 'src/app/apiAndObjects/objects/region';
import { HttpClient } from '@angular/common/http';

interface InterventionType {
  fortificationTypeId?: string;
  fortificationTypeName?: string;
}

interface FoodVehicle {
  foodVehicleId?: number;
  foodVehicleName?: string;
}

@Component({
  selector: 'app-costEffectivenessSelectionDialog',
  templateUrl: './costEffectivenessSelectionDialog.component.html',
  styleUrls: ['./costEffectivenessSelectionDialog.component.scss'],
})
export class CostEffectivenessSelectionDialogComponent implements OnInit {
  public interventions: Array<InterventionsDictionaryItem>;
  public queryParams: Params;
  public interventionsAllowedToUse: Array<InterventionsDictionaryItem>;
  public selectedInterventionEdit: Intervention;
  public selectedInterventionLoad: Intervention;
  public interventionId = '';
  public tabID = 'copy';
  public err = new BehaviorSubject<boolean>(false);
  public interventionForm: UntypedFormGroup;
  public proceed = new BehaviorSubject<boolean>(false);
  public showResults = new BehaviorSubject<boolean>(false);
  public parameterForm: UntypedFormGroup;
  public countryOptionArray: DictionaryItem[] = [];
  public regionOptionArray: Region[] = [];
  public micronutrientsOptionArray: DictionaryItem[] = [];
  public interventionTypeOptionArray: InterventionType[] = [];
  public foodVehicleOptionArray: FoodVehicle[] = [];
  public selectedCountry = '';
  public selectedMn = '';
  private onlyAllowInterventionsAboveID = 3;
  private countriesDictionary: Dictionary;
  private micronutrientsDictionary: Dictionary;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
    private dictionariesService: DictionaryService,
    private http: HttpClient,
    private readonly route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.route.queryParamMap.subscribe(async (queryParams) => {
      const currentlySelectedInterventionIDs: Array<string> = queryParams.get('intIds')
        ? JSON.parse(queryParams.get('intIds'))
        : [];

      // create a string array with 'real' strings as the above does not
      const currentlySelectedInterventionIDsAsStrings: string[] = [];
      currentlySelectedInterventionIDs.forEach((value) => {
        currentlySelectedInterventionIDsAsStrings.push(value.toString());
      });

      this.interventions = dialogData.dataIn as Array<InterventionsDictionaryItem>;
      // Only allow interventions to be loaded directly which are above an ID.
      // This can be updated to check for an intervention parameter when API allows it.
      this.interventionsAllowedToUse = this.interventions.filter(
        (item: InterventionsDictionaryItem) => Number(item.id) > this.onlyAllowInterventionsAboveID,
      );

      // Remove interventions that are already selected
      this.interventionsAllowedToUse = this.interventionsAllowedToUse.filter(
        (i) => !currentlySelectedInterventionIDsAsStrings.includes(i.id),
      );
    });
    this.interventions = this.dialogData.dataIn.interventions as Array<InterventionsDictionaryItem>;
    this.queryParams = this.dialogData.dataIn.params;
    /**
     * Only allow interventions to be loaded directly which are above an ID.
     * This can be updated to check for an intervention parameter when API allows it.
     */
    this.interventionsAllowedToUse = this.interventions.filter(
      (item: InterventionsDictionaryItem) => Number(item.id) > this.onlyAllowInterventionsAboveID,
    );
    this.createParameterForm();
  }

  ngOnInit(): void {
    this.initParamFormData();
    this.createInterventionForm();
    this.interventionForm.valueChanges.subscribe((fields) => {
      if (fields.newInterventionName !== '') {
        this.proceed.next(true);
      } else {
        this.proceed.next(false);
      }
    });
  }

  private initParamFormData(): void {
    this.dictionariesService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.MICRONUTRIENTS, DictionaryType.AGE_GENDER_GROUPS])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();

        this.getDictionaryItems(DictionaryType.COUNTRIES);
        this.getDictionaryItems(DictionaryType.MICRONUTRIENTS);
      });
    if (this.queryParams['country-id']) {
      this.apiService.endpoints.region.getRegions
        .call({
          countryId: this.queryParams['country-id'],
        })
        .then((response: Region[]) => {
          this.regionOptionArray = response.sort(this.sort);
        });
    }
  }

  private sort(a: DictionaryItem | Region, b: DictionaryItem | Region) {
    return a.name < b.name ? -1 : 1;
  }

  private setPreselected(type: DictionaryType): void {
    if (type === DictionaryType.COUNTRIES) {
      const filtered = this.countryOptionArray.filter((item) => item.id === this.queryParams['country-id']);
      if (filtered.length > 0) {
        this.selectedCountry = filtered.shift().id;
      }
    } else if (type === DictionaryType.MICRONUTRIENTS) {
      const filtered = this.micronutrientsOptionArray.filter((item) => item.id === this.queryParams['mnd-id']);
      if (filtered.length > 0) {
        this.selectedMn = filtered.shift().id;
      }
    }
  }

  private getDictionaryItems(type: DictionaryType): void {
    switch (true) {
      case type === DictionaryType.COUNTRIES:
        this.countryOptionArray = this.countriesDictionary.getItems().sort(this.sort);
        this.setPreselected(DictionaryType.COUNTRIES);
        break;
      case type === DictionaryType.MICRONUTRIENTS:
        this.micronutrientsOptionArray = this.micronutrientsDictionary.getItems().sort(this.sort);
        this.setPreselected(DictionaryType.MICRONUTRIENTS);
        break;
    }
  }

  private createParameterForm(): void {
    this.parameterForm = this.formBuilder.group({
      nation: new UntypedFormControl('', [Validators.required]),
      focusGeography: new UntypedFormControl('', []),
      focusMicronutrient: new UntypedFormControl('', []),
      interventionType: new UntypedFormControl({ value: '', disabled: true }, []),
      foodVehicle: new UntypedFormControl({ value: '', disabled: true }, []),
      interventionStatus: new UntypedFormControl({ value: '', disabled: true }, []),
    });
    this.parameterForm.valueChanges.subscribe((changes) => {
      console.log(changes);
    });
  }

  private createInterventionForm(): void {
    this.interventionForm = this.formBuilder.group({
      newInterventionName: new UntypedFormControl('', [Validators.required]),
      newInterventionDesc: new UntypedFormControl(''),
    });
  }

  private createInterventionCopy(newName: string, newDesc: string): void {
    this.interventionDataService
      .setIntervention(Number(this.selectedInterventionEdit.id), newName, newDesc)
      .then((result) => {
        this.dialogData.dataOut = result;
        this.closeDialog();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  public handleTabChange(event: MatTabChangeEvent): void {
    this.interventionForm.reset();
    this.proceed.next(false);
    this.showResults.next(false);
    this.interventionId = '';

    switch (true) {
      case event.index === 0:
        this.tabID = 'copy';
        break;
      case event.index === 1:
        this.tabID = 'load';
        break;
    }
    this.proceed.next(false);
  }

  public handleChange(): void {
    this.proceed.next(false);
    this.showResults.next(false);
    this.err.next(false);
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public handleSubmit(): void {
    const formData = this.interventionForm.value;
    if (this.interventionForm.valid) {
      this.createInterventionCopy(formData.newInterventionName, formData.newInterventionDesc);
    }
  }

  public createIntervention(): void {
    if (this.tabID === 'load') {
      if (this.selectedInterventionLoad !== null) {
        this.dialogData.dataOut = this.selectedInterventionLoad;
        this.closeDialog();
      }
    }
  }

  public handleNationChange(change: MatSelectChange): void {
    this.apiService.endpoints.region.getRegions
      .call({
        countryId: change.value,
      })
      .then((response: Region[]) => {
        this.regionOptionArray = response.sort(this.sort);
      });
  }

  public handleInterventionChange(change: MatSelectChange): void {
    this.interventionTypeOptionArray.push({
      fortificationTypeId: change.value.fortificationTypeId,
      fortificationTypeName: change.value.fortificationTypeName,
    });
    this.foodVehicleOptionArray.push({
      foodVehicleId: change.value.foodVehicleId,
      foodVehicleName: change.value.foodVehicleName,
    });
  }
}
