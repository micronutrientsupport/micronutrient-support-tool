import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { GridsterService, GridsterSource, GridsterWidgets } from 'src/app/services/gridster.service';
import { QuickMapsService } from '../../quickMaps.service';
import { CostEffectivenessService } from './costEffectiveness.service';
// eslint-disable-next-line no-shadow
enum GridsterLayoutOptions {
  DEFAULT_VIEW = 0,
  GRID_VIEW = 1,
}
@Component({
  selector: 'app-costEffectiveness',
  templateUrl: './costEffectiveness.component.html',
  styleUrls: ['./costEffectiveness.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostEffectivenessComponent implements OnInit {
  public gridsterSource = GridsterSource;
  public readonly WIDGETS = GridsterWidgets;
  public options: GridsterConfig;
  public dashboard = new Array<GridsterItem>();
  public resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public startEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public stopEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  public overlapEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  public enableComparisonCard: boolean;

  private readonly defaultWidgetHeight = 3;
  private readonly defaultWidgetWidth = 8;
  private readonly defaultWidgetColumns = 1;

  private dataLevelWidgetTypesMap: Map<DataLevel, Array<GridsterWidgets>> = new Map([
    [DataLevel.COUNTRY, [this.WIDGETS.COST_EFFECTIVENESS_COMPARISION]],
    [DataLevel.HOUSEHOLD, [this.WIDGETS.COST_EFFECTIVENESS_COMPARISION]],
  ]);

  constructor(
    private quickMapsService: QuickMapsService,
    public gridsterService: GridsterService,
    private costEffectivenessService: CostEffectivenessService,
    private cdr: ChangeDetectorRef,
  ) {
    this.costEffectivenessService.interventionComparisonActiveObs.subscribe((showCard: boolean) => {
      this.enableComparisonCard = showCard;
      this.cdr.markForCheck();
    });
  }

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
