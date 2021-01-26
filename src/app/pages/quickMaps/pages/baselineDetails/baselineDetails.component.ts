import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaselineDetailsComponent implements OnInit {
  public options: GridsterConfig;
  public dashboard: Array<GridsterItem>;
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  constructor(public quickmapsService: QuickMapsService) {}

  ngOnInit(): void {
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      scrollToNewItems: false,
      disableWarnings: false,
      ignoreMarginInRow: false,
      margin: 10,
      itemResizeCallback: (item) => {
        this.resizeEvent.emit(item);
        // helps some components re-adjust size
        window.dispatchEvent(new Event('resize'));
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

    this.dashboard = [
      { cols: 2, rows: 2, y: 0, x: 0, type: 'widgetChart' },
      { cols: 2, rows: 2, y: 0, x: 2, type: 'widgetMonthly' },
      { cols: 2, rows: 2, y: 2, x: 0, type: 'widgetTopFood' },
      { cols: 2, rows: 2, y: 2, x: 2, type: 'widgetMap' },
    ];
  }

  public changedOptions(): void {
    this.options.api.optionsChanged();
  }

  public removeItem(item: GridsterItem): void {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  public addItem(): void {
    this.dashboard.push();
  }
}
