import { Injectable } from '@angular/core';
import * as jsonLogic from 'json-logic-js';
import { IndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { CellIndex } from '../apiAndObjects/objects/cellIndex.interface';
import { MonitoringInformation } from '../apiAndObjects/objects/interventionMonitoringInformation';

@Injectable()
export class JSONLogicService {
  public allItems: Array<IndustryInformation | MonitoringInformation>;

  constructor() {
    jsonLogic.add_operation('roundup', (value, decimals = 0) => {
      const multiplier = Math.pow(10, decimals);
      return Math.ceil(value * multiplier) / multiplier;
    });
    jsonLogic.add_operation('PV', (rate, nper, pmt, fv = 0, type = 0) => {
      if (rate === 0) {
        return -pmt * nper - fv;
      }
      const pv = -((pmt * (1 + rate * type) * (Math.pow(1 + rate, nper) - 1)) / rate + fv) / Math.pow(1 + rate, nper);
      return pv;
    });

    jsonLogic.add_operation('var', (cellIndex: CellIndex) => {
      const formItems = this.getItems();
      const resAtRow = formItems.find(
        (item: IndustryInformation | MonitoringInformation) => item.rowIndex == cellIndex.rowIndex,
      );
      const colToFind = cellIndex.colIndex;
      const valueAtCol = resAtRow[colToFind];
      return valueAtCol;
    });
  }

  public calculateResult(
    item: IndustryInformation | MonitoringInformation,
    columnIndex: number,
    allItems: Array<IndustryInformation | MonitoringInformation>,
  ): number {
    this.setItems(allItems);
    return jsonLogic.apply(item['year' + columnIndex + 'Formula'], {});
  }

  public setItems(data: Array<IndustryInformation | MonitoringInformation>) {
    this.allItems = data;
  }

  public getItems() {
    return this.allItems;
  }
}
