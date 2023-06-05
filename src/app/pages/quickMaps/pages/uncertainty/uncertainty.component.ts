// import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { GridsterService, GridsterSource, GridsterWidgets } from 'src/app/services/gridster.service';
import { QuickMapsService } from '../../quickMaps.service';

// eslint-disable-next-line no-shadow
enum GridsterLayoutOptions {
  DEFAULT_VIEW = 0,
  GRID_VIEW = 1,
}
@Component({
  selector: 'app-uncertainty',
  templateUrl: './uncertainty.component.html',
  styleUrls: ['./uncertainty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncertaintyComponent implements OnInit {
  public gridsterSource = GridsterSource;
  public WIDGETS = GridsterWidgets;
  public options: GridsterConfig;
  public dashboard = new Array<GridsterItem>();
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  // public layoutOptions: MatFabMenu[] = [
  //   {
  //     id: GridsterLayoutOptions.DEFAULT_VIEW,
  //     icon: 'view_agenda',
  //     tooltip: 'List View',
  //     tooltipPosition: 'before',
  //   },
  //   {
  //     id: GridsterLayoutOptions.GRID_VIEW,
  //     icon: 'grid_view',
  //     tooltip: 'Grid View',
  //     tooltipPosition: 'before',
  //   },
  // ];

  private readonly defaultWidgetHeight = 3;
  private readonly defaultWidgetWidth = 8;
  private readonly defaultWidgetColumns = 1;

  private dataLevelWidgetTypesMap: Map<DataLevel, Array<GridsterWidgets>> = new Map([
    [
      DataLevel.COUNTRY,
      [GridsterWidgets.UNCERTAINTY_NUTRIENT_AVAILABILITY, GridsterWidgets.UNCERTAINTY_FOOD_AVAILABILITY],
    ],
    [
      DataLevel.HOUSEHOLD,
      [GridsterWidgets.UNCERTAINTY_NUTRIENT_AVAILABILITY, GridsterWidgets.UNCERTAINTY_FOOD_AVAILABILITY],
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
    let width: number;
    let height: number;
    let widgetCols: number;
    switch (id) {
      default: {
        width = this.defaultWidgetWidth;
        height = this.defaultWidgetHeight;
        widgetCols = this.defaultWidgetColumns;
        break;
      }
      case GridsterLayoutOptions.GRID_VIEW: {
        width = 6;
        height = 4;
        widgetCols = 2;
        break;
      }
    }

    this.dashboard = this.gridsterService.resetGrid(
      this.gridsterSource.BASELINE,
      this.quickMapsService.FoodSystemsDataSource.get()?.dataLevel,
      this.dashboard.slice(),
      this.dataLevelWidgetTypesMap,
      width,
      height,
      widgetCols,
    );

    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
}
