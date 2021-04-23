import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { QuickMapsService } from '../../quickMaps.service';

// eslint-disable-next-line no-shadow
enum BiomarkerWidgets {
  STATUS = 'widgetStatus'
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
  private readonly defaultWidgetWidth = 6;

  private dataLevelWidgetTypesMap: Map<DataLevel, Array<BiomarkerWidgets>> = new Map([
    [DataLevel.COUNTRY, [
      BiomarkerWidgets.STATUS
    ]],
    [DataLevel.HOUSEHOLD, [
      BiomarkerWidgets.STATUS
    ]],
  ]);

  constructor(public quickMapsService: QuickMapsService) { }

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

    this.quickMapsService.dataLevelObs.subscribe((level: DataLevel) => {
      this.setDataLevel(level);
    });
  }

  private setDataLevel(level: DataLevel): void {
    if (null != level) {
      const newWidgetsTypes = this.dataLevelWidgetTypesMap.get(level);

      // remove any not needed
      this.dashboard.slice().forEach(thisWidget => {
        if (null == newWidgetsTypes.find(widgetType => (widgetType === thisWidget.type))) {
          this.dashboard.splice(this.dashboard.indexOf(thisWidget), 1);
        }
      });
      // reset size and position of currrent items
      // Maybe not ideal how this alters the user set size and position of widgets
      // that have persisted, but what's the alternative?
      // It does ensure a uniform view at init/data level change.
      this.dashboard.forEach((thisWidget: GridsterItem, index: number) => {
        this.resetItemPositionAndSize(thisWidget, index);
      });

      // add any new widgets
      newWidgetsTypes.forEach(widgetType => {
        if (null == this.dashboard.find(testWidget => (testWidget.type === widgetType))) {
          this.dashboard.push(
            this.resetItemPositionAndSize({ type: widgetType } as unknown as GridsterItem, this.dashboard.length)
          );
        }
      });
      this.changedOptions();
    }
  }

  private resetItemPositionAndSize(item: GridsterItem, index: number): GridsterItem {
    item.cols = this.defaultWidgetWidth;
    item.rows = this.defaultWidgetHeight;
    item.x = (index % 2) * this.defaultWidgetWidth;
    item.y = Math.floor(index / 2) * this.defaultWidgetHeight;
    return item;
  }

  private changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

}
