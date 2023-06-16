import { Injectable } from '@angular/core';
import * as jsonLogic from 'json-logic-js';
import { IndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { CellIndex } from '../apiAndObjects/objects/cellIndex.interface';

@Injectable()
export class JSONLogicService {
  public allItems: any;

  constructor() {
    jsonLogic.add_operation('roundup', (value, decimals = 0) => {
      // console.debug('roundup value | decimals: ', value, ' | ', decimals);
      const multiplier = Math.pow(10, decimals);
      return Math.ceil(value * multiplier) / multiplier;
    });
    jsonLogic.add_operation('PV', (rate, nper, pmt, fv = 0, type = 0) => {
      // console.debug('rate = ', rate);
      // console.debug('nper = ', nper);
      // console.debug('pmt = ', pmt);
      // console.debug('fv = ', fv);
      // console.debug('type = ', type);
      if (rate === 0) {
        return -pmt * nper - fv;
      }
      const pv = -((pmt * (1 + rate * type) * (Math.pow(1 + rate, nper) - 1)) / rate + fv) / Math.pow(1 + rate, nper);
      return pv;
    });

    jsonLogic.add_operation('var', (cellIndex: CellIndex) => {
      const formItems = this.getItems();
      const resAtRow = formItems.find((item: IndustryInformation) => item.rowIndex == cellIndex.rowIndex);
      type ObjectKey = keyof typeof resAtRow;
      const colToFind = cellIndex.colIndex as ObjectKey;
      const valueAtCol = resAtRow[colToFind];
      // console.table(cellIndex);
      // console.debug('value at col: ', valueAtCol);
      return valueAtCol;
    });
  }

  public calculateResult(item: IndustryInformation, columnIndex: number, allItems: any): number {
    this.setItems(allItems);
    return jsonLogic.apply(item['year' + columnIndex + 'Formula'], {});
  }

  public setItems(data: any) {
    this.allItems = data;
  }

  public getItems() {
    return this.allItems;
  }
}
