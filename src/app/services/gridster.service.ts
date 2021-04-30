/* eslint-disable no-shadow */
import { Injectable } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';

export enum GridsterSource {
  BASELINE,
  PROJECTION,
}

export enum GridsterWidgets {
  BASELINE_MAP = 'widgetMap',
  BASELINE_MONTHLY = 'widgetMonthly',
  BASELINE_TOP_FOOD = 'widgetTopFood',
  BASELINE_CHART = 'widgetChart',
  PROJ_AVAILABILITY = 'widgetProjAvail',
  PROJ_FOOD_SOURCE = 'widgetProjFoodSources',
}

@Injectable()
export class GridsterService {
  public gridsterReset = new BehaviorSubject<GridsterSource>(null);
  public gridsterResetObs = this.gridsterReset.asObservable();

  constructor() {}

  public setGridsterReset(page: GridsterSource): void {
    this.gridsterReset.next(page);
  }

  public resetGrid(
    source: GridsterSource,
    level: DataLevel,
    dashboard: Array<GridsterItem>,
    typesMap: Map<DataLevel, Array<GridsterWidgets>>,
    defaultWidth: number,
    defaultHeight: number,
    defaultColumns: number,
  ): Array<GridsterItem> {
    if (null != level) {
      const newWidgetsTypes = typesMap.get(level);

      // remove any not needed
      dashboard.slice().forEach((thisWidget) => {
        if (null == newWidgetsTypes.find((widgetType) => widgetType === thisWidget.type)) {
          dashboard.splice(dashboard.indexOf(thisWidget), 1);
        }
      });
      // reset size and position of currrent items
      dashboard.forEach((thisWidget: GridsterItem, index: number) => {
        this.resetItemPositionAndSize(thisWidget, index, defaultWidth, defaultHeight, defaultColumns);
      });

      // add any new widgets
      newWidgetsTypes.forEach((widgetType) => {
        if (null == dashboard.find((testWidget) => testWidget.type === widgetType)) {
          dashboard.push(
            this.resetItemPositionAndSize(
              ({ type: widgetType } as unknown) as GridsterItem,
              dashboard.length,
              defaultWidth,
              defaultHeight,
              defaultColumns,
            ),
          );
        }
      });

      return dashboard;
    }
  }

  public resetItemPositionAndSize(
    item: GridsterItem,
    index: number,
    defaultWidth: number,
    defaultHeight: number,
    defaultColumns: number,
  ): GridsterItem {
    item.cols = defaultWidth;
    item.rows = defaultHeight;
    item.x = (index % defaultColumns) * defaultWidth;
    item.y = Math.floor(index / defaultColumns) * defaultHeight;
    return item;
  }
}
