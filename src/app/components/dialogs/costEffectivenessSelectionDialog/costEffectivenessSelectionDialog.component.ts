import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
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
import { NotificationsService } from '../../notifications/notification.service';
import { DialogService } from '../dialog.service';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

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
  public isCopyMode: boolean;
  public preselectedInterventionId: number;
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
  public foodVehicleArray = [];
  public interventionTypeArray = [];
  public interventionStatusArray = ['Existing intervention program', 'Hypothetical intervention program'];
  public interventionNatureArray = ['Status Quo', 'Scale-up', 'Improved Complicance', 'Revision of existing standards'];
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
  public selectedInterventionId = '';
  public selectedIntervention: InterventionsDictionaryItem = undefined;
  public selectedFoodVehicle = '';
  public selectedInterventionType = '';
  public selectedInterventionStatus = '';
  public selectedInterventionNature = '';
  public parameterFormObj: CEFormBody;
  public interventionRequestBody: InterventionCERequest;
  public recentInterventions = '';
  public interventionPreview: InterventionsDictionaryItem | null;
  public activeUser: LoginRegisterResponseDataSource | null;
  private onlyAllowInterventionsAboveID = 3;
  private countriesDictionary: Dictionary;
  private micronutrientsDictionary: Dictionary;

  private interventionMapping = {
    ETH: {
      A: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'refined oil': '1',
            sugar: '4',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B1: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B2: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B3: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B6: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B9: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B12: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      D: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'refined oil': '1',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      E: {
        LSFF: {
          'Existing intervention program': {
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      I: {
        LSFF: {
          'Existing intervention program': {
            'salt, iodine': '5',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Fe: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Zn: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            'salt, iodine': '5',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Ca: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Se: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '2',
            'maize flour': '3',
            rice: '8',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
    },
    MWI: {
      A: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'refined oil': '11',
            sugar: '14',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B1: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B2: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B3: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B6: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B9: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      B12: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      D: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'refined oil': '11',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      E: {
        LSFF: {
          'Existing intervention program': {
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      I: {
        LSFF: {
          'Existing intervention program': {
            'salt, iodine': '15',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Fe: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Zn: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            'salt, iodine': '15',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Ca: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
      Se: {
        LSFF: {
          'Existing intervention program': {
            'wheat flour': '12',
            'maize flour': '13',
            rice: '16',
          },
          'Hypothetical intervention program': {},
        },
        BF: {
          'Existing intervention program': {},
          'Hypothetical intervention program': {},
        },
      },
    },
  };

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
    private dictionariesService: DictionaryService,
    private readonly route: ActivatedRoute,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
    private dialogService: DialogService,
    private userLoginService: UserLoginService,
  ) {
    this.interventions = dialogData.dataIn.interventions as Array<InterventionsDictionaryItem>;
    this.queryParams = dialogData.dataIn.params;
    this.isCopyMode = dialogData.dataIn.isCopyMode;
    this.preselectedInterventionId = dialogData.dataIn.preselectedInterventionId;

    if (this.preselectedInterventionId) {
      console.log(this.preselectedInterventionId);
      console.log(this.interventions);

      this.selectedInterventionId = '' + this.preselectedInterventionId;
      this.selectedIntervention = this.interventions.find((intervention) => {
        return intervention.id == this.selectedInterventionId;
      });
    }

    this.activeUser = userLoginService.getActiveUser();

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
      // this.interventionsAllowedToUse = this.interventions.filter(
      //   (item: InterventionsDictionaryItem) => Number(item.id) > this.onlyAllowInterventionsAboveID,
      // );

      // // Remove interventions that are already selected
      // this.interventionsAllowedToUse = this.interventionsAllowedToUse.filter(
      //   (i) => !currentlySelectedInterventionIDsAsStrings.includes(i.id),
      // );
      this.createParameterForm();
    });
  }

  ngOnInit(): void {
    // const recentInterventions = [];
    // this.interventionDataService.getRecentInterventions().forEach((intervention: InterventionsDictionaryItem) => {
    //   recentInterventions.push(intervention.id.toString());
    // });
    // this.recentInterventions = `${'Recent Interventions: ' + recentInterventions}`;

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

  private getDictionaryItems(type: DictionaryType, countryId?: string): void {
    console.log('GetDictionary', countryId);
    const tempMns = ['A', 'B1', 'B2', 'B3', 'B6', 'B9', 'B12', 'D', 'E', 'I', 'Fe', 'Zn', 'Ca', 'Se'];
    switch (true) {
      case type === DictionaryType.COUNTRIES:
        //this.countryOptionArray = this.countriesDictionary.getItems().sort(this.sort);
        this.countryOptionArray = this.countriesDictionary
          .getItems()
          .sort(this.sort)

          // Temporarily limit to ETH/MWI
          // TODO: Remove this
          .filter((country) => country.id === 'ETH' || country.id === 'MWI');
        this.setPreselected(DictionaryType.COUNTRIES);
        break;
      case type === DictionaryType.MICRONUTRIENTS:
        //this.micronutrientsOptionArray = this.micronutrientsDictionary.getItems().sort(this.sort);
        this.micronutrientsOptionArray = this.micronutrientsDictionary
          .getItems()
          .sort(this.sort)
          // Temporarily limit to ETH/MWI
          // TODO: Remove this
          .filter((micronutrient) => {
            if (countryId) {
              console.log(`${countryId} MN list: ${Object.keys(this.interventionMapping[countryId])}`);
              return Object.keys(this.interventionMapping[countryId]).includes(micronutrient.id);
            } else {
              console.log(`Default MN list: ${tempMns}`);
              return tempMns.includes(micronutrient.id);
            }
          });
        this.setPreselected(DictionaryType.MICRONUTRIENTS);
        break;
    }
  }

  private createParameterForm(): void {
    this.parameterForm = this.formBuilder.group({
      foodVehicle: new UntypedFormControl('', [Validators.required]),
      interventionType: new UntypedFormControl('', [Validators.required]),
      focusMicronutrient: new UntypedFormControl('', [Validators.required]),
      nation: new UntypedFormControl('', [Validators.required]),
      focusGeography: new UntypedFormControl('', []),
      interventionStatus: new UntypedFormControl('', [Validators.required]),
      interventionNature: new UntypedFormControl('', [Validators.required]),

      // interventionType: new UntypedFormControl(
      //   {
      //     value: this.interventionTypeOptionArray,
      //     disabled: true,
      //   },
      //   [],
      // ),
      // foodVehicle: new UntypedFormControl({ value: '', disabled: true }, []),
      // interventionStatus: new UntypedFormControl({ value: '', disabled: true }, []),
    });
    this.parameterForm.valueChanges
      .pipe(map(() => this.parameterForm.getRawValue()))
      .subscribe((changes: CEFormBody) => {
        this.parameterFormObj = changes;
        this.interventionRequestBody.newInterventionNation = changes.nation;
        this.interventionRequestBody.newInterventionFocusGeography = changes.focusGeography;
        this.interventionRequestBody.newInterventionFocusMicronutrient = changes.focusMicronutrient;
      });

    setTimeout(() => {
      this.getDictionaryItems(DictionaryType.COUNTRIES);
      this.getDictionaryItems(DictionaryType.MICRONUTRIENTS);
    }, 100);
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

  public handleLogin(): void {
    this.dialogService.dialog.closeAll();
    setTimeout(() => {
      this.dialogService.openLoginDialog();
    }, 100);
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

  public createID(): void {
    if (this.tabID === 'copy') {
      this.interventionDataService
        .getIntervention(this.selectedInterventionIDLoad)
        .then((intervention: Intervention) => {
          this.selectedInterventionLoad = intervention;
          this.selectedInterventionIDLoad = intervention.id.toString();
          console.log('returned ID: ', this.selectedInterventionIDLoad);
          return this.selectedInterventionIDLoad;
        });
    } else {
      return;
    }
  }

  public createIntervention(): void {
    if (this.tabID === 'load') {
      this.interventionDataService
        .getIntervention(this.selectedInterventionIDLoad)
        .then((intervention: Intervention) => {
          this.interventionDataService.setSimpleInterventionInStorage(intervention);
          this.selectedInterventionLoad = intervention;
          this.selectedInterventionIDLoad = intervention.id.toString();

          if (this.selectedInterventionLoad !== null) {
            this.dialogData.dataOut = this.selectedInterventionLoad;
            this.closeDialog();
          }
        })
        .catch(() => {
          if (null != this.userLoginService.getActiveUser()) {
            this.notificationsService.sendNegative(
              `Warning - Intervention with ID:${this.selectedInterventionIDLoad} does not exist.`,
            );
          } else {
            this.notificationsService.sendInformative('Make sure you are logged in to load your interventions.');
          }
        });
    } else if (this.tabID === 'copy') {
      // TODO: POST to endpoint with parameterFormObj as body
      this.interventionDataService
        .setIntervention(
          Number(this.selectedInterventionId),
          this.interventionRequestBody.newInterventionName,
          this.interventionRequestBody.newInterventionDescription,
          this.selectedCountry,
          this.selectedCountry,
          this.selectedMn,
        )
        .then((result: Intervention) => {
          this.interventionDataService.setSimpleInterventionInStorage(result);
          this.selectedInterventionIDLoad = result.id.toString();
          this.dialogData.dataOut = result;
          this.closeDialog();
        })
        .catch((err) => {
          console.error(err);
          throw new Error(err);
        });
    }
  }

  // public updateForm() {
  //   this.interventionPreview = this.interventionDataService
  //     .getRecentInterventions()
  //     .find(
  //       (intervention: InterventionsDictionaryItem) => intervention.id.toString() === this.selectedInterventionIDLoad,
  //     );
  //   console.log('interventionPreview', this.interventionPreview ? this.interventionPreview.id : 'does not exist');
  // }

  public handleInterventionChange(change: MatSelectChange): void {
    setTimeout(() => {
      this.getDictionaryItems(DictionaryType.COUNTRIES);
      this.getDictionaryItems(DictionaryType.MICRONUTRIENTS);
    }, 100);

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

  public handleNationChange(change: MatSelectChange): void {
    console.log('Handle Nation change', change.value);
    this.getDictionaryItems(DictionaryType.MICRONUTRIENTS, change.value);

    this.parameterForm.controls['focusMicronutrient'].reset();
    this.selectedMn = '';
    this.parameterForm.controls['foodVehicle'].reset();
    this.selectedFoodVehicle = '';
    this.parameterForm.controls['interventionType'].reset();
    this.selectedInterventionType = '';
    this.parameterForm.controls['interventionStatus'].reset();
    this.selectedInterventionStatus = '';
    this.parameterForm.controls['interventionNature'].reset();
    this.selectedInterventionNature = '';

    // this.apiService.endpoints.region.getRegions
    //   .call({
    //     countryId: change.value,
    //   })
    //   .then((response: Region[]) => {
    //     this.toggleRegionDropdown(response);
    //     this.regionOptionArray = response.sort(this.sort);
    //     this.setUrlParams('country-id', change.value);
    //   });
  }

  public handleMnChange(mnId: string): void {
    console.log('Handle MN change', this.selectedCountry, mnId);

    this.interventionTypeArray = Object.keys(this.interventionMapping[this.selectedCountry][mnId]);

    this.parameterForm.controls['foodVehicle'].reset();
    this.selectedFoodVehicle = '';
    this.parameterForm.controls['interventionType'].reset();
    this.selectedInterventionType = '';
    this.parameterForm.controls['interventionStatus'].reset();
    this.selectedInterventionStatus = '';
    this.parameterForm.controls['interventionNature'].reset();
    this.selectedInterventionNature = '';
    //
    // return Object.keys(this.interventionMapping[this.countryOptionArray.]).includes(micronutrient.id);

    const copy = [...this.micronutrientsOptionArray];
    const filtered = copy.filter((item) => item.id === mnId);
    if (filtered.length > 0) {
      const micronutrient = filtered.shift() as MicronutrientDictionaryItem;
      this.setUrlParams('mnd-id', micronutrient.id);
    }
  }

  public handleInterventionTypeChange(interventionType: string): void {
    console.log('Handle intervention type change', this.selectedCountry, this.selectedMn, interventionType);

    this.parameterForm.controls['foodVehicle'].reset();
    this.selectedFoodVehicle = '';
    this.parameterForm.controls['interventionStatus'].reset();
    this.selectedInterventionStatus = '';
    this.parameterForm.controls['interventionNature'].reset();
    this.selectedInterventionNature = '';

    // this.foodVehicleArray = Object.keys(this.interventionMapping[this.selectedCountry][mnId]['LSFF']['Existing intervention program']);
    this.foodVehicleArray = Object.keys(
      this.interventionMapping[this.selectedCountry][this.selectedMn][interventionType][
        'Existing intervention program'
      ],
    );

    // return Object.keys(this.interventionMapping[this.countryOptionArray.]).includes(micronutrient.id);
  }

  public handleFoodVehicleChange(foodVehicle: string): void {
    console.log(
      'Handle food vehicle type change',
      this.selectedCountry,
      this.selectedMn,
      this.selectedInterventionType,
      this.selectedInterventionStatus,
    );

    this.parameterForm.controls['interventionStatus'].reset();
    this.selectedInterventionStatus = '';
    this.parameterForm.controls['interventionNature'].reset();
    this.selectedInterventionNature = '';
  }

  public handleStatusChange(interventionStatus: string): void {
    console.log(
      'Handle intervention type change',
      this.selectedCountry,
      this.selectedMn,
      this.selectedInterventionType,
      interventionStatus,
    );

    // Select the intervention id from the mapping object
    this.selectedInterventionId =
      this.interventionMapping[this.selectedCountry][this.selectedMn][this.selectedInterventionType][
        interventionStatus
      ][this.selectedFoodVehicle];

    console.log('Loading intervention', this.selectedInterventionId);
    // Grab the associated intervention from the list
    this.selectedIntervention = this.interventions.find((intervention) => {
      return intervention.id == this.selectedInterventionId;
    });

    console.log(this.selectedIntervention);
  }
}
