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
  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  static itemChange(item, itemComponent): void {
    // console.log('itemChanged', item, itemComponent);
  }
  static itemResize(item, itemComponent): void {
    // console.log('itemResized', item, itemComponent);
  }
  static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    // tslint:disable-next-line:no-console
    // console.info('eventStart', item, itemComponent, event);
  }

  static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    // tslint:disable-next-line:no-console
    // console.info('eventStop', item, itemComponent, event);
  }

  static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent): void {
    // console.log('overlap', source, target, grid);
  }
  constructor(public quickmapsService: QuickMapsService) {}
  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      scrollToNewItems: false,
      disableWarnings: false,
      ignoreMarginInRow: false,
      itemResizeCallback: (item) => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      },
      itemChangeCallback: BaselineDetailsComponent.itemChange,
      // itemResizeCallback: BaselineDetailsComponent.itemResize,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-no-drag',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: BaselineDetailsComponent.eventStop,
        start: BaselineDetailsComponent.eventStart,
        dropOverItems: false,
        dropOverItemsCallback: BaselineDetailsComponent.overlapEvent,
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
      { cols: 1, rows: 1, y: 0, x: 1, type: 'widgetFoodComp' },
      { cols: 1, rows: 1, y: 1, x: 0, type: 'widgetTopFood' },
      { cols: 1, rows: 1, y: 1, x: 1, type: 'widgetMap' },
    ];
  }

  changedOptions(): void {
    this.options.api.optionsChanged();
  }

  removeItem(item): void {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push();
  }
}
