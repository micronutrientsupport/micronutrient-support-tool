import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { GridsterService, GridsterSource, GridsterWidgets } from 'src/app/services/gridster.service';

// eslint-disable-next-line no-shadow
enum GridsterLayoutOptions {
  DEFAULT_VIEW = 0,
  LIST_VIEW = 1,
}
@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDetailsComponent implements OnInit {
  public gridsterSource = GridsterSource;
  public WIDGETS = GridsterWidgets;
  public options: GridsterConfig;
  public dashboard = new Array<GridsterItem>();
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  private readonly defaultWidgetHeight = 4;
  private readonly defaultWidgetWidth = 6;
  private readonly defaultWidgetColumns = 2;

  private dataLevelWidgetTypesMap: Map<DataLevel, Array<GridsterWidgets>> = new Map([
    [DataLevel.COUNTRY, [GridsterWidgets.BASELINE_MAP, GridsterWidgets.BASELINE_TOP_FOOD]],
    [
      DataLevel.HOUSEHOLD,
      [
        GridsterWidgets.BASELINE_MAP,
        GridsterWidgets.BASELINE_MONTHLY,
        GridsterWidgets.BASELINE_TOP_FOOD,
        GridsterWidgets.BASELINE_CHART,
        GridsterWidgets.BASELINE_CHART,
      ],
    ],
  ]);

  constructor(public quickMapsService: QuickMapsService, private gridsterService: GridsterService) {}

  ngOnInit(): void {
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      scrollToNewItems: false,
      disableWarnings: false,
      ignoreMarginInRow: false,
      margin: 10,
      keepFixedHeightInMobile: false,
      pushItems: true,
      pushDirections: { north: true, east: true, south: true, west: true },
      itemResizeCallback: (item) => {
        this.resizeEvent.emit(item);
        // helps some components re-adjust size
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      },
      itemChangeCallback: (item) => {
        this.changeEvent.emit(item);
      },
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-no-drag',
        ignoreContent: true,
        dragHandleClass: 'drag-handle',
        stop: (item) => {
          this.stopEvent.emit(item);
        },
        start: (item) => {
          this.startEvent.emit(item);
        },
        dropOverItems: false,
        dropOverItemsCallback: (item) => {
          this.overlapEvent.emit(item);
        },
      },
      resizable: {
        delayStart: 0,
        enabled: true,
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true,
        },
      },
    };

    // When the quick maps params change trigger the boxes to reset
    this.quickMapsService.dietParameterChangedObs.subscribe(() => {
      this.layoutChange();
    });
  }

  public layoutChange(id?: string | number): void {
    console.debug(id);
    let widgetCols: number;
    switch (id) {
      default: {
        widgetCols = this.defaultWidgetColumns;
        break;
      }
      case GridsterLayoutOptions.LIST_VIEW: {
        widgetCols = 1;
        break;
      }
    }
    this.dashboard = this.gridsterService.resetGrid(
      this.gridsterSource.BASELINE,
      this.quickMapsService.FoodSystemsDataSource.get()?.dataLevel,
      this.dashboard.slice(),
      this.dataLevelWidgetTypesMap,
      this.defaultWidgetWidth,
      this.defaultWidgetHeight,
      widgetCols,
    );

    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
}
