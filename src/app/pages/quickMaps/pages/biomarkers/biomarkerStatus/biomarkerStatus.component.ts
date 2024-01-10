import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  Optional,
  Inject,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CardComponent } from 'src/app/components/card/card.component';
import { UntypedFormControl } from '@angular/forms';
import { Chart } from 'chart.js';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { MatMenu } from '@angular/material/menu';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { BiomarkerService } from '../biomarker.service';
import { StatusMapsComponent } from './statusMaps/statusMaps.component';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomaker';

export interface BiomarkerStatusDialogData {
  data: unknown;
  selectedTab: number;
}

export interface BiomarkerStatusData {
  areaName: string;
  ageGenderGroup: string;
  mineralLevelOne: string;
  mineralOutlier: string;
}

// interface simpleDataObject {
//   AreaName: string;
//   DemoGpN: string;
//   ZnAdj_gdL: string;
//   Zn_gdL_Outlier: string;
// }

export interface BiomarkerDataType {
  name: string;
  value: string;
}
export interface BiomarkerMediaType {
  name: string;
  value: string;
}

export interface BiomarkerCharacteristicType {
  name: string;
  value: string;
}

@Component({
  selector: 'app-biomarker-status',
  templateUrl: './biomarkerStatus.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerStatus.component.scss'],
})
export class BiomarkerStatusComponent implements OnInit, AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'biomarker-map-view';
  @Input() card: CardComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('boxplot') boxPlot: Chart;
  @ViewChild('settingsMenu', { static: true }) menu: MatMenu;

  public title: string;
  public selectedTab: number;
  public showOutliers = true;
  public outlierControl = new UntypedFormControl(true);
  public dataTypes = new UntypedFormControl();
  public characteristics = new UntypedFormControl();
  public activeBiomarker: Biomarker;

  public dataList: Array<BiomarkerDataType> = [
    { name: 'Prevalence of Deficiency', value: 'pod' },
    { name: 'Prevalence of Excess', value: 'poe' },
    { name: 'Combined deficiency and excess', value: 'cde' },
    { name: 'Concentration Data', value: 'cda' },
  ];

  public mediaList: Array<BiomarkerMediaType> = [
    { name: 'Map', value: 'map' },
    { name: 'Table', value: 'table' },
    { name: 'Chart', value: 'chart' },
  ];

  public characteristicList: Array<BiomarkerCharacteristicType> = [
    { name: 'Regions', value: 'reg' },
    { name: 'Residence', value: 'res' },
    { name: 'Age group', value: 'age' },
    { name: 'Wealth Quintiles', value: 'qui' },
    { name: 'All characteristics', value: 'all' },
    { name: 'Total', value: 'tot' },
  ];

  public selectedOption: unknown;
  public selectedCharacteristic: unknown;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';
  public mineralData: Array<BiomarkerStatusData>;
  public selectedDataType: BiomarkerDataType;
  public selectedCharacteristicType: BiomarkerCharacteristicType;
  public selectedMediaType: BiomarkerMediaType;
  public temporaryData: SubRegionDataItem; // Temporary until new data coming in from API
  private subscriptions = new Array<Subscription>();
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);
  private tabVisited = new Map<number, boolean>();
  public bData!: Biomarker;
  public biomarkerDataUpdating = false;

  constructor(
    public quickMapsService: QuickMapsService,
    private http: HttpClient,
    private papa: Papa,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private biomarkerService: BiomarkerService,

    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<BiomarkerStatusDialogData>,
  ) {}

  public ngOnInit(): void {
    this.initSubs();
  }

  public initSubs(): void {
    this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
      if (data) {
        this.bData = data;
        this.cdr.detectChanges();
      }
    });
    this.quickMapsService.biomarkerDataUpdatingObs.subscribe((updating: boolean) => {
      this.biomarkerDataUpdating = updating;
      this.cdr.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(
      this.card.onExpandClickObs.subscribe(() => this.openDialog()),
      this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
      this.quickMapsService.micronutrient.obs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
      this.quickMapsService.ageGenderGroup.obs.subscribe((ageGenderGroup: AgeGenderDictionaryItem) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
      this.quickMapsService.biomarkerParameterChangedObs.subscribe(() => {
        // Perhaps this can be used to trigger messgage to show tell user to refresh model
        this.init();
      }),
      // this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
      //   console.debug('data in status', data);
      // }),
    );

    this.card.showExpand = true;
    this.card.showSettingsMenu = true;
    this.card.matMenu = this.menu;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      // this.absoluteMap.invalidateSize();
    }
  }

  public openMapSettings(): void {
    void this.dialogService.openMapSettingsDialog(StatusMapsComponent.COLOUR_PALETTE_ID).then(() => {
      this.biomarkerService.changeColourRamp();
    });
  }

  // Capture value from data select dropdown.
  public dataSelected(value: string, origin: string): void {
    this.selectedOption = value;
    switch (origin) {
      case 'map':
        break;
      case 'table':
        if (this.selectedCharacteristic) {
          console.log('dataSelected');
        }
        break;
      case 'chart':
        // this.chartTypeValue = value;
        break;
    }
  }
  public setCharacteristicSelection(charateristicType: BiomarkerCharacteristicType): void {
    this.selectedCharacteristicType = charateristicType;
  }

  public setDataSelection(dataType: BiomarkerDataType): void {
    this.selectedDataType = dataType;
  }
  public setMediaSelection(mediaType: BiomarkerMediaType): void {
    this.selectedMediaType = mediaType;
  }
  private init(): void {
    const mnName = this.quickMapsService.micronutrient.get()?.name;
    const agName = this.quickMapsService.ageGenderGroup.get().name;
    const titlePrefix = (null == mnName ? '' : `${mnName}`) + ' Status';
    const titleSuffix = ' in ' + (null == agName ? '' : `${agName}`);
    this.title = titlePrefix + titleSuffix;
    if (null != this.card) {
      this.card.title = this.title;
    }

    // this.biomarkerDataService
    //   .getBiomarkerData('2', this.quickMapsService.ageGenderGroup.get().groupId, this.quickMapsService.biomarkerSelect.get().id, 'wealth_quintile')
    //   .then((data: Array<Biomarker>) => {
    //     this.biomarker = data.pop();
    //     console.debug(data);
    //   });

    // void lastValueFrom(this.http.get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' })).then(
    //   (data: string) => {
    //     const blob = this.papa.parse(data, { header: true }).data;
    //     const dataArray = new Array<BiomarkerStatusData>();
    //     blob.forEach((simpleData: simpleDataObject) => {
    //       const statusData: BiomarkerStatusData = {
    //         areaName: simpleData.AreaName,
    //         ageGenderGroup: simpleData.DemoGpN,
    //         mineralLevelOne: simpleData.ZnAdj_gdL,
    //         mineralOutlier: simpleData.Zn_gdL_Outlier,
    //       };
    //       dataArray.push(statusData);
    //     });

    //     const filterByParamatersArray = dataArray.filter(
    //       (value) => value.areaName === 'Area6' && value.ageGenderGroup === 'WRA',
    //     );

    //     this.mineralData = filterByParamatersArray;
    //   },
    // );
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<BiomarkerStatusDialogData>(BiomarkerStatusComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}
