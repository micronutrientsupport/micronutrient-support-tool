import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { data } from 'cypress/types/jquery';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-uncertainty-nutrient-availability',
  templateUrl: './uncertaintyNutrientAvailability.component.html',
  styleUrls: ['./uncertaintyNutrientAvailability.component.scss'],
})
export class UncertaintyNutrientAvailabilityComponent implements AfterViewInit {
  data = [
    {
      scenario: 'SSP1',
      value: 'Min',
      year1: 0.875,
      year2: 0.297,
      year3: 0.451,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
    {
      scenario: 'SSP1',
      value: 'Max',
      year1: 0.297,
      year2: 0.624,
      year3: 0.541,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
    {
      scenario: 'SSP2',
      value: 'Min',
      year1: 0.515,
      year2: 0.578,
      year3: 0.695,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
    {
      scenario: 'SSP2',
      value: 'Max',
      year1: 0.669,
      year2: 0.556,
      year3: 0.985,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
    {
      scenario: 'SSP3',
      value: 'Min',
      year1: 0.585,
      year2: 0.412,
      year3: 0.698,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
    {
      scenario: 'SSP3',
      value: 'Max',
      year1: 0.657,
      year2: 0.857,
      year3: 0.523,
      year4: 0.875,
      year5: 0.297,
      year6: 0.451,
      year7: 0.875,
      year8: 0.297,
      year9: 0.451,
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataExt: any[] = [];
  displayedColumns: string[] = [
    'scenario',
    'value',
    'year1',
    'year2',
    'year3',
    'year4',
    'year5',
    'year6',
    'year7',
    'year8',
    'year9',
  ];
  dataSource: TableData[] = [];

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @Input() card: CardComponent;

  public title = 'Nutrient availability per person';
  public selectedTab: number;

  // TODO: from API??

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  constructor(
    public quickMapsService: QuickMapsService,
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData?: DialogData<UncertaintyNutrientAvailabilityDialogData>,
  ) {
    this.processData();
  }
  private processData() {
    const scenariosSeen = {};
    const valuesSeen = {};

    this.dataExt = this.data
      .sort((a, b) => {
        const scenarioComp = a.scenario.localeCompare(b.scenario);
        return scenarioComp ? scenarioComp : a.value.localeCompare(b.value);
      })
      .map((x) => {
        const scenarioSpan = scenariosSeen[x.scenario] ? 0 : this.data.filter((y) => y.scenario === x.scenario).length;

        scenariosSeen[x.scenario] = true;

        const valueSpan =
          valuesSeen[x.scenario] && valuesSeen[x.scenario][x.value]
            ? 0
            : this.data.filter((y) => y.scenario === x.scenario && y.value === x.value).length;

        valuesSeen[x.scenario] = valuesSeen[x.scenario] || {};
        valuesSeen[x.scenario][x.value] = true;

        return { ...x, scenarioSpan, valueSpan };
      });
  }

  ngAfterViewInit(): void {
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(
      this.card.onExpandClickObs.subscribe(() => this.openDialog()),
      this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
    );

    this.dataSource = [
      {
        scenario: 'SSP1',
        value: 'Min',
        year1: 0.875,
        year2: 0.297,
        year3: 0.451,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
      {
        scenario: 'SSP1',
        value: 'Max',
        year1: 0.297,
        year2: 0.624,
        year3: 0.541,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
      {
        scenario: 'SSP2',
        value: 'Min',
        year1: 0.515,
        year2: 0.578,
        year3: 0.695,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
      {
        scenario: 'SSP2',
        value: 'Max',
        year1: 0.669,
        year2: 0.556,
        year3: 0.985,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
      {
        scenario: 'SSP3',
        value: 'Min',
        year1: 0.585,
        year2: 0.412,
        year3: 0.698,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
      {
        scenario: 'SSP3',
        value: 'Max',
        year1: 0.657,
        year2: 0.857,
        year3: 0.523,
        year4: 0.875,
        year5: 0.297,
        year6: 0.451,
        year7: 0.875,
        year8: 0.297,
        year9: 0.451,
      },
    ];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onScenario1Selected(event: any): void {
    console.log(event); // look in the console to get the properties
    event.target.value; // you can access them like that
  }
  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<UncertaintyNutrientAvailabilityDialogData>(
      UncertaintyNutrientAvailabilityComponent,
      {
        data: null,
        selectedTab: this.tabGroup.selectedIndex,
      },
    );
  }
}

export interface UncertaintyNutrientAvailabilityDialogData {
  data: unknown;
  selectedTab: number;
}
export interface TableData {
  scenario: string;
  value: string;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  year6: number;
  year7: number;
  year8: number;
  year9: number;
}
