import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { GridsterService, GridsterSource, GridsterWidgets } from 'src/app/services/gridster.service';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';

// eslint-disable-next-line no-shadow
enum GridsterLayoutOptions {
  DEFAULT_VIEW = 0,
  GRID_VIEW = 1,
}

@Component({
  selector: 'app-quickmaps-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionComponent implements OnInit {
  public gridsterSource = GridsterSource;
  public WIDGETS = GridsterWidgets;
  public options: GridsterConfig;
  public dashboard = new Array<GridsterItem>();
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  public layoutOptions: MatFabMenu[] = [
    {
      id: GridsterLayoutOptions.DEFAULT_VIEW,
      icon: 'view_agenda',
      tooltip: 'List View',
      tooltipPosition: 'before',
    },
    {
      id: GridsterLayoutOptions.GRID_VIEW,
      icon: 'grid_view',
      tooltip: 'Grid View',
      tooltipPosition: 'before',
    },
  ];

  private readonly defaultWidgetHeight = 3;
  private readonly defaultWidgetWidth = 8;
  private readonly defaultWidgetColumns = 1;

  private dataLevelWidgetTypesMap: Map<DataLevel, Array<GridsterWidgets>> = new Map([
    [DataLevel.COUNTRY, [GridsterWidgets.PROJ_AVAILABILITY, GridsterWidgets.PROJ_FOOD_SOURCE]],
    [DataLevel.HOUSEHOLD, [GridsterWidgets.PROJ_AVAILABILITY, GridsterWidgets.PROJ_FOOD_SOURCE]],
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
    this.quickMapsService.dataLevelObs.subscribe((level: DataLevel) => {
      this.dashboard = this.gridsterService.resetGrid(
        this.gridsterSource.PROJECTION,
        level,
        this.dashboard,
        this.dataLevelWidgetTypesMap,
        this.defaultWidgetWidth,
        this.defaultWidgetHeight,
        this.defaultWidgetColumns,
      );
      if (this.options.api && this.options.api.optionsChanged) {
        this.options.api.optionsChanged();
      }
    });
  }

  public layoutChange(id: number): void {
    switch (id) {
      case GridsterLayoutOptions.DEFAULT_VIEW: {
        this.dashboard = this.gridsterService.resetGrid(
          this.gridsterSource.BASELINE,
          this.quickMapsService.dataLevel,
          this.dashboard,
          this.dataLevelWidgetTypesMap,
          this.defaultWidgetWidth,
          this.defaultWidgetHeight,
          this.defaultWidgetColumns,
        );
        break;
      }
      case GridsterLayoutOptions.GRID_VIEW: {
        this.dashboard = this.gridsterService.resetGrid(
          this.gridsterSource.BASELINE,
          this.quickMapsService.dataLevel,
          this.dashboard,
          this.dataLevelWidgetTypesMap,
          6,
          4,
          2,
        );
        break;
      }
    }
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
}
