import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';

// eslint-disable-next-line no-shadow
enum BaselineWidgets {
  MAP = 'widgetMap',
  MONTHLY = 'widgetMonthly',
  TOP_FOOD = 'widgetTopFood',
  CHART = 'widgetChart',
}

@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDetailsComponent implements OnInit {

  public WIDGETS = BaselineWidgets;
  public options: GridsterConfig;
  public dashboard: Array<GridsterItem>;
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  private readonly defaultWidgetHeight = 4;
  private readonly defaultWidgetWidth = 6;

  private dataLevelWidgetsMap: Map<DataLevel, Array<GridsterItem>> = new Map([
    [DataLevel.COUNTRY, [
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: 0, x: 0, type: BaselineWidgets.MAP
      },
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: this.defaultWidgetHeight, x: 0, type: BaselineWidgets.TOP_FOOD
      },
    ]],
    [DataLevel.HOUSEHOLD, [
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: 0, x: 0, type: BaselineWidgets.MAP
      },
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: 0, x: this.defaultWidgetHeight, type: BaselineWidgets.MONTHLY
      },
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: this.defaultWidgetHeight, x: 0, type: BaselineWidgets.TOP_FOOD
      },
      {
        cols: this.defaultWidgetWidth, rows: this.defaultWidgetHeight,
        y: this.defaultWidgetHeight, x: this.defaultWidgetWidth, type: BaselineWidgets.CHART
      },
    ]],
  ]);

  constructor(public quickmapsService: QuickMapsService) { }

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

    this.quickmapsService.dataLevelObs.subscribe((level: DataLevel) => {
      this.setDataLevel(level);
    });
  }

  private setDataLevel(level: DataLevel): void {
    if (null != level) {
      this.dashboard = this.dataLevelWidgetsMap.get(level);
    }
  }
}
