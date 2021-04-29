import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { QuickMapsService } from '../../quickMaps.service';

// eslint-disable-next-line no-shadow
enum BiomarkerWidgets {
  STATUS = 'widgetStatus',
  INFO = 'widgetInfo',
}
@Component({
  selector: 'app-biomarker',
  templateUrl: './biomarker.component.html',
  styleUrls: ['./biomarker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiomarkerComponent implements OnInit {
  public WIDGETS = BiomarkerWidgets;
  public options: GridsterConfig;
  public dashboard = new Array<GridsterItem>();
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  private readonly defaultWidgetHeight = 4;
  private readonly defaultWidgetWidth = 10;

  constructor(public quickMapsService: QuickMapsService) {}

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
    this.dashboard.push({
      type: BiomarkerWidgets.STATUS,
      cols: this.defaultWidgetWidth,
      rows: this.defaultWidgetHeight,
      x: 0,
      y: 0,
    });
    this.dashboard.push({
      type: BiomarkerWidgets.INFO,
      cols: this.defaultWidgetWidth,
      rows: this.defaultWidgetHeight,
      x: 0,
      y: this.defaultWidgetHeight,
    });
    this.changedOptions();
  }
  private changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
}
