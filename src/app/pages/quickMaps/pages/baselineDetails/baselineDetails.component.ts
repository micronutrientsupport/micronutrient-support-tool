import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import {
  DisplayGrid,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType,
} from 'angular-gridster2';

@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BaselineDetailsComponent implements OnInit {
  public options: GridsterConfig;
  public dashboard: Array<GridsterItem>;
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  constructor(public quickmapsService: QuickMapsService) { }

  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.log('itemChanged', item, itemComponent);
  }
  static itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.log('itemResized', item, itemComponent);
  }
  static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    console.log('eventStart', item, itemComponent, event);
  }
  static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    console.log('eventStop', item, itemComponent, event);
  }
  static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent): void {
    console.log('overlap', source, target, grid);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      scrollToNewItems: false,
      disableWarnings: false,
      ignoreMarginInRow: false,
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
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
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
      { cols: 1, rows: 1, y: 0, x: 0, type: 'widgetChart' },
      { cols: 1, rows: 1, y: 0, x: 1, type: 'widgetMonthly' },
      { cols: 1, rows: 1, y: 1, x: 0, type: 'widgetTopFood' },
      { cols: 1, rows: 1, y: 1, x: 1, type: 'widgetMap' },
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
