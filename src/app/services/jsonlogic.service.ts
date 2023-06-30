import { Injectable } from '@angular/core';
import * as jsonLogic from 'json-logic-js';
import { IndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { CellIndex } from '../apiAndObjects/objects/cellIndex.interface';
import { MonitoringInformation } from '../apiAndObjects/objects/interventionMonitoringInformation';
import { StartUpCostBreakdown } from '../apiAndObjects/objects/interventionStartupCosts';
import { RecurringCostBreakdown } from '../apiAndObjects/objects/interventionRecurringCosts';

@Injectable()
export class JSONLogicService {
  public allItems: Array<IndustryInformation | MonitoringInformation | StartUpCostBreakdown | RecurringCostBreakdown>;

  constructor() {
    /**
     * Rounds up a numeric value to a specified number of decimal places.
     *
     * @param {number} value - The value to be rounded up.
     * @param {number} [decimals=0] - The number of decimal places to round up to. Defaults to 0 if not provided.
     * @returns {number} - The rounded-up value.
     */
    jsonLogic.add_operation('roundup', (value, decimals = 0) => {
      const multiplier = Math.pow(10, decimals);
      return Math.ceil(value * multiplier) / multiplier;
    });

    /**
     *  Calculate the total or cumulative value obtained by adding together individual values
     *
     * @param {Array<number>} value - An array of values to be summed up.
     * @returns {number} - The total value of all input values.
     */
    jsonLogic.add_operation('sum', (...values) => {
      return Number(values.reduce((acc, curr) => acc + curr, 0));
    });

    /**
     *
     * Calculates the present value (PV) of a series of cash flows.
     *
     * @param {number} rate - The interest rate per period.
     * @param {number} nper - The number of periods.
     * @param {number} pmt - The payment amount per period.
     * @param {number} [fv=0] - The future value at the end of the series of cash flows (optional, default is 0).
     * @param {number} [type=0] - The timing of the payment: 0 for the end of the period, 1 for the beginning of the period (optional, default is 0).
     * @returns {number} The present value (PV) of the series of cash flows.
     */
    jsonLogic.add_operation('PV', (rate, nper, pmt, fv = 0, type = 0) => {
      if (rate === 0) {
        return -pmt * nper - fv;
      }
      const pv = -((pmt * (1 + rate * type) * (Math.pow(1 + rate, nper) - 1)) / rate + fv) / Math.pow(1 + rate, nper);
      return pv;
    });

    /**
     * Navigates the row and column to retrieve a given value
     * @param {CellIndex} cellIndex - row and column to find
     */
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
    item: IndustryInformation | MonitoringInformation | StartUpCostBreakdown | RecurringCostBreakdown,
    columnIndex: number,
    allItems: Array<IndustryInformation | MonitoringInformation | StartUpCostBreakdown | RecurringCostBreakdown>,
  ): number {
    this.setItems(allItems);
    return jsonLogic.apply(item['year' + columnIndex + 'Formula'], {});
  }

  public setItems(
    data: Array<IndustryInformation | MonitoringInformation | StartUpCostBreakdown | RecurringCostBreakdown>,
  ) {
    this.allItems = data;
  }

  public getItems() {
    return this.allItems;
  }
}
