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
import { FormControl } from '@angular/forms';
import { ChartjsComponent } from '@ctrl/ngx-chartjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { MatMenu } from '@angular/material/menu';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { BiomarkerService } from '../biomarker.service';
import { StatusMapsComponent } from './statusMaps/statusMaps.component';
import { BiomarkerStatusService } from './biomarkerStatus.service';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { DietDataService } from 'src/app/services/dietData.service';

export interface BiomarkerStatusDialogData {
  data: any;
  selectedTab: number;
}

export interface BiomarkerStatusData {
  areaName: string;
  ageGenderGroup: string;
  mineralLevelOne: string;
  mineralOutlier: string;
}

interface simpleDataObject {
  AreaName: string;
  DemoGpN: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ZnAdj_gdL: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Zn_gdL_Outlier: string;
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiomarkerStatusComponent implements OnInit, AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'biomarker-map-view';
  @Input() card: CardComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('boxplot') boxPlot: ChartjsComponent;
  @ViewChild('settingsMenu', { static: true }) menu: MatMenu;
  message: string;
  public title: string;
  public selectedTab: number;

  public showOutliers = true;
  public outlierControl = new FormControl(true);
  public dataTypes = new FormControl();
  public characteristics = new FormControl();

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

  public selectedOption: any;
  public selectedCharacteristic: any;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';
  public mineralData: Array<BiomarkerStatusData>;
  public selectedDataType: BiomarkerDataType;
  public selectedCharacteristicType: BiomarkerCharacteristicType;
  public selectedMediaType: BiomarkerMediaType;

  // Copied in from MapView, structure will be similar but will however may change
  public temporaryData: SubRegionDataItem; // Temporary until new data coming in from API
  private subscriptions = new Array<Subscription>();

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private tabVisited = new Map<number, boolean>();

  constructor(
    public quickMapsService: QuickMapsService,
    private http: HttpClient,
    private papa: Papa,
    private dietDataService: DietDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private biomarkerService: BiomarkerService,
    private data: BiomarkerStatusService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<BiomarkerStatusDialogData>,
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.data.currentMessage.subscribe((message) => (this.message = message));
  }
  newMessage(): void {
    this.data.changeMessage('new message sent from biomarker status');

    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
    this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

    this.subscriptions.push(
      this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
    );

    this.subscriptions.push(
      this.quickMapsService.ageGenderObs.subscribe((ageGenderGroup: AgeGenderDictionaryItem) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
    );

    this.card.showExpand = true;
    this.card.showSettingsMenu = true;
    this.card.matMenu = this.menu;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(
      this.quickMapsService.biomarkerParameterChangedObs.subscribe(() => {
        this.init();
        // this.initMapData(
        //   this.dietDataService.getDietaryAvailability(
        //     this.quickMapsService.country,
        //     this.quickMapsService.micronutrient,
        //     this.quickMapsService.biomarkerDataSource,
        //   ),
        // );
      }),
    );
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
    const mnName = this.quickMapsService.micronutrient.name;
    const agName = this.quickMapsService.ageGenderGroup.name;
    const titlePrefix = (null == mnName ? '' : `${mnName}`) + ' Status';
    const titleSuffix = ' in ' + (null == agName ? '' : `${agName}`);
    this.title = titlePrefix + titleSuffix;
    if (null != this.card) {
      this.card.title = this.title;
    }
    void this.http
      .get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' })
      .toPromise()
      .then((data: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const blob = this.papa.parse(data, { header: true }).data;
        const dataArray = new Array<BiomarkerStatusData>();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        blob.forEach((simpleData: simpleDataObject) => {
          const statusData: BiomarkerStatusData = {
            areaName: simpleData.AreaName,
            ageGenderGroup: simpleData.DemoGpN,
            mineralLevelOne: simpleData.ZnAdj_gdL,
            mineralOutlier: simpleData.Zn_gdL_Outlier,
          };
          dataArray.push(statusData);
        });

        const filterByParamatersArray = dataArray.filter(
          (value) => value.areaName === 'Area6' && value.ageGenderGroup === 'WRA',
        );

        this.mineralData = filterByParamatersArray;
      });
  }

  private initMapData(dataPromise: Promise<SubRegionDataItem>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: SubRegionDataItem) => {
        this.temporaryData = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.errorSrc.next(false);
      })
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      })
      .catch((e) => {
        this.errorSrc.next(true);
        throw e;
      });
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<BiomarkerStatusDialogData>(BiomarkerStatusComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}
