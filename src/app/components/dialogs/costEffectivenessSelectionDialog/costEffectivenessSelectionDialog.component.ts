import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
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
import { CEFormBody, InterventionCERequest } from 'src/app/apiAndObjects/objects/interventionCE.interface';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';

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
  inteventionIDInput = new FormControl('');
  public interventions: Array<InterventionsDictionaryItem>;
  public queryParams: Params;
  public interventionsAllowedToUse: Array<InterventionsDictionaryItem>;
  public selectedInterventionEdit: Intervention;
  public selectedInterventionLoad: Intervention;
  public selectedInterventionIDLoad = '';
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
  public parameterFormObj: CEFormBody;
  public interventionRequestBody: InterventionCERequest;
  private onlyAllowInterventionsAboveID = 3;
  private countriesDictionary: Dictionary;
  private micronutrientsDictionary: Dictionary;
  public recentInterventions = '';

  public interventionPreview: InterventionsDictionaryItem | null;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
    private dictionariesService: DictionaryService,
    private readonly route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.interventions = dialogData.dataIn.interventions as Array<InterventionsDictionaryItem>;
    this.queryParams = dialogData.dataIn.params;

    this.route.queryParamMap.subscribe(async (queryParams) => {
      const currentlySelectedInterventionIDs: Array<string> = queryParams.get('intIds')
        ? JSON.parse(queryParams.get('intIds'))
        : [];

      // create a string array with 'real' strings as the above does not
      const currentlySelectedInterventionIDsAsStrings: string[] = [];
      currentlySelectedInterventionIDs.forEach((value) => {
        currentlySelectedInterventionIDsAsStrings.push(value.toString());
      });

      // Only allow interventions to be loaded directly which are above an ID.
      // This can be updated to check for an intervention parameter when API allows it.
      this.interventionsAllowedToUse = this.interventions.filter(
        (item: InterventionsDictionaryItem) => Number(item.id) > this.onlyAllowInterventionsAboveID,
      );

      // Remove interventions that are already selected
      this.interventionsAllowedToUse = this.interventionsAllowedToUse.filter(
        (i) => !currentlySelectedInterventionIDsAsStrings.includes(i.id),
      );
      this.createParameterForm();
    });
  }

  ngOnInit(): void {
    const recentInterventions = [];
    this.interventionDataService.getRecentInterventions().forEach((intervention: InterventionsDictionaryItem) => {
      recentInterventions.push(intervention.id.toString());
    });
    this.recentInterventions = `${'Recent Interventions: ' + recentInterventions}`;

    // this.recentInterventions = `${
    //   'Recent Interventions: ' +
    //   this.interventionDataService
    //     .getRecentInterventions()
    //     .find(
    //       (intervention: InterventionsDictionaryItem) => intervention.id.toString() === this.selectedInterventionIDLoad,
    //     )
    // }`;
    // console.log('RecentIDs ', this.selectedInterventionIDLoad);
    this.interventionRequestBody = {
      parentInterventionId: 0,
      newInterventionName: '',
      newInterventionDescription: '',
      newInterventionFocusMicronutrient: '',
      newInterventionNation: '',
      newInterventionFocusGeography: '',
    };
    this.initParamFormData();
    this.createInterventionForm();
    this.interventionForm.valueChanges.subscribe((fields) => {
      if (fields.newInterventionName !== '') {
        this.interventionRequestBody.newInterventionName = fields.newInterventionName;
        this.interventionRequestBody.newInterventionDescription = fields.newInterventionDesc;
        this.proceed.next(true);
      } else {
        this.proceed.next(false);
      }
    });
  }

  private toggleRegionDropdown(regions: Region[]): void {
    if (regions.length === 0) {
      this.parameterForm.get('focusGeography').disable();
    } else {
      this.parameterForm.get('focusGeography').enable();
    }
  }

  private initParamFormData(): void {
    this.regionOptionArray = [];
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
          this.toggleRegionDropdown(response);
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
    this.parameterForm.valueChanges
      .pipe(map(() => this.parameterForm.getRawValue()))
      .subscribe((changes: CEFormBody) => {
        this.parameterFormObj = changes;
        this.interventionRequestBody.newInterventionNation = changes.nation;
        this.interventionRequestBody.newInterventionFocusGeography = changes.focusGeography;
        this.interventionRequestBody.newInterventionFocusMicronutrient = changes.focusMicronutrient;
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

  private setUrlParams(param: string, value: string): void {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(param, value);
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
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

  // public getInterventionFromID()

  public createIntervention(): void {
    if (this.tabID === 'load') {
      console.log('interventionLoad :', this.selectedInterventionLoad);
      console.log('interventionLoad ID :', this.selectedInterventionIDLoad);

      this.interventionDataService
        .getIntervention(this.selectedInterventionIDLoad)
        .then((intervention: Intervention) => {
          this.selectedInterventionLoad = intervention;
          this.selectedInterventionIDLoad = intervention.id.toString();
          console.log('INTERVENTION', intervention);
          console.log('INTERVENTION-ID', this.selectedInterventionIDLoad);

          if (this.selectedInterventionLoad !== null) {
            this.dialogData.dataOut = this.selectedInterventionLoad;
            console.log('interventionID', this.selectedInterventionIDLoad);
            console.log('selectInterventionLoad', this.selectedInterventionLoad);
            this.closeDialog();
          }
        });
    } else if (this.tabID === 'copy') {
      // TODO: POST to endpoint with parameterFormObj as body
      this.interventionDataService
        .setIntervention(
          Number(this.interventionRequestBody.parentInterventionId),
          this.interventionRequestBody.newInterventionName,
          this.interventionRequestBody.newInterventionDescription,
          this.interventionRequestBody.newInterventionNation,
          this.interventionRequestBody.newInterventionFocusGeography,
          this.interventionRequestBody.newInterventionFocusMicronutrient,
        )
        .then((result) => {
          this.dialogData.dataOut = result;
          this.closeDialog();
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        });
    }
  }

  public updateForm() {
    this.interventionPreview = this.interventionDataService
      .getRecentInterventions()
      .find(
        (intervention: InterventionsDictionaryItem) => intervention.id.toString() === this.selectedInterventionIDLoad,
      );
    console.log('interventionPreview', this.interventionPreview ? this.interventionPreview.id : 'does not exist');
  }

  public handleNationChange(change: MatSelectChange): void {
    this.apiService.endpoints.region.getRegions
      .call({
        countryId: change.value,
      })
      .then((response: Region[]) => {
        this.toggleRegionDropdown(response);
        this.regionOptionArray = response.sort(this.sort);
        this.setUrlParams('country-id', change.value);
      });
  }

  public handleInterventionChange(change: MatSelectChange): void {
    this.interventionRequestBody.parentInterventionId = this.selectedInterventionEdit.id;
    this.interventionTypeOptionArray.push({
      fortificationTypeId: change.value.fortificationTypeId,
      fortificationTypeName: change.value.fortificationTypeName,
    });
    this.foodVehicleOptionArray.push({
      foodVehicleId: change.value.foodVehicleId,
      foodVehicleName: change.value.foodVehicleName,
    });
  }

  public handleMnChange(mnId: string): void {
    const copy = [...this.micronutrientsOptionArray];
    const filtered = copy.filter((item) => item.id === mnId);
    if (filtered.length > 0) {
      const micronutrient = filtered.shift() as MicronutrientDictionaryItem;
      this.setUrlParams('mnd-id', micronutrient.id);
    }
  }
}
