import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { QuickMapsService } from '../../quickMaps.service';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-quickmaps-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionComponent implements OnInit {
  public options: GridsterConfig;
  public dashboard: Array<GridsterItem>;
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  constructor(public quickMapsService: QuickMapsService) {}

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
      { cols: 2, rows: 1, y: 0, x: 0, type: 'widgetProjDesc' },
      { cols: 2, rows: 1, y: 1, x: 0, type: 'widgetProjCurrentEst' },
      { cols: 2, rows: 1, y: 2, x: 0, type: 'widgetProjAvail' },
      { cols: 2, rows: 1, y: 3, x: 0, type: 'widgetProjFoodSources' },
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
