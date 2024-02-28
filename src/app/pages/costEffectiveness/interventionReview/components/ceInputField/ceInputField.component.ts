import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { JSONLogicService } from 'src/app/services/jsonlogic.service';

@Component({
  selector: 'app-ce-input-field',
  templateUrl: './ceInputField.component.html',
  styleUrls: ['./ceInputField.component.scss'],
})
export class InterventionInputFieldComponent implements OnInit {
  @Input() index: number;
  @Input() year?: number;
  @Input() field: string;
  @Input() element;
  @Input() form: UntypedFormGroup;
  @Input() tableData: MatTableDataSource<any>;
  @Input() includeCopyRightButton = true;
  @Input() dirtyIndexes?: number[];
  @Input() fieldType?: string;
  @Input() omitStyling = false;
  @Input() changeFunction?: ($event: Event) => void;

  constructor(
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private jsonLogicService: JSONLogicService,
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
    if (!this.changeFunction) {
      this.changeFunction = ($event: Event) => console.log('Nope');
    }
    console.log(this.changeFunction);
  }

  public copyAcross(index: number, year: number) {
    console.log('Copy across from ', index);
    console.log(this.form.getRawValue().items);

    const cellVal = this.form.getRawValue().items[index]['year' + year];

    const isCalculated = this.form.getRawValue().items[index]['isCalculated'];

    // Set values for all cells to the right, and dirty if neccesary
    let rowDirtied = false;
    for (let i = year; i < 10; i++) {
      const currentValue = this.form.controls.items['controls'][index].getRawValue()['year' + i];
      this.form.controls.items['controls'][index].patchValue({ ['year' + i]: cellVal });
      if (currentValue != cellVal) {
        setTimeout(() => {
          if (isCalculated) {
            this.form.controls.items['controls'][index]['controls']['year' + i].markAsTouched();
            this.form.controls.items['controls'][index]['controls']['year' + i].markAsDirty();
            this.form.controls.items['controls'][index].patchValue({ ['year' + i + 'Overriden']: true });
            rowDirtied = true;
          } else {
            this.form.controls.items['controls'][index]['controls']['year' + i].markAsDirty();
            rowDirtied = true;
          }
        }, 0);
      }
    }

    if (rowDirtied) {
      this.storeIndex(index);
    }
    //this.recalculateChanges();
  }

  public modelChange(event: any, index: number, year: number, fieldName = 'year' + year) {
    console.log('Change, row', index, 'year', year, 'to', event);

    console.log({
      touched: this.form.controls.items['controls'][index].controls[fieldName].touched,
      pristine: this.form.controls.items['controls'][index].controls[fieldName].pristine,
      dirty: this.form.controls.items['controls'][index].controls[fieldName].dirty,
    });

    console.log(
      this.form.controls.items['controls'][index].controls[fieldName].touched &&
        !this.form.controls.items['controls'][index].controls[fieldName].pristine,
    );
    // Model change from user input returns new value as a string in event
    // Model change from formula recalculation returns 'new' (even if unchanged) value as an array
    if (!Array.isArray(event)) {
      // setTimeout(() => {
      const isCalculated = this.form.controls.items['controls'][index].controls['isCalculated'].value;
      const isOverriden =
        //!this.form.controls.items['controls'][index].controls['year' + year].touched &&
        !this.form.controls.items['controls'][index].controls[fieldName].pristine &&
        this.form.controls.items['controls'][index].controls[fieldName].dirty;

      // console.log(`Row ${index}, Year ${year}, Val ${event}, Calculated ${isCalculated}, Overriden ${isOverriden}`);

      if (isCalculated) {
        this.form.controls.items['controls'][index].patchValue({ [fieldName + 'Overriden']: isOverriden });
      }
      // }, 0);
    }
  }

  public storeIndex(index: number) {
    console.log('StoreIndx', index);
    if (this.dirtyIndexes) {
      this.dirtyIndexes.push(index);
    }
  }

  public recalculateChanges(): void {
    console.log('Recalc');

    // find all the rows which have formulas to calculate their new value
    const allItemsWithRowFormulas = this.tableData.data.filter(
      (item: any) => item.isEditable === false || item.isCalculated === true,
    );

    console.log({ allItemsWithRowFormulas });

    // loop through all the rows with formulas to calculate their new values
    allItemsWithRowFormulas.forEach((item: any) => {
      const rowWantToUpdate = item.rowIndex;

      for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
        if (!item['year' + columnIndex + 'Formula']) {
          // if isEditable = true AND no yearXFormula exists, calculated value by vars outside this endpoint
          continue;
        }
        if (Object.keys(item['year' + columnIndex + 'Formula']).length === 0) {
          // Check to see if the formula is present as expected, otherwise display static value
          console.debug('missing year' + columnIndex + 'Formula');
          continue;
        }

        // console.log('Calculate row ' + item.rowIndex + '/ year ' + columnIndex);

        // getRawValue returns values even if cell is marked as disabled
        let allItems: Array<any> = this.form.getRawValue().items;

        // Convert currencies back to numbers for calculation
        allItems = allItems.map((item) => {
          switch (item.rowUnits) {
            case 'US dollars':
              for (let i = 0; i < 10; i++) {
                item['year' + i] = this.formatPlain(item['year' + i]);
              }
              break;
            case 'percent':
              for (let i = 0; i < 10; i++) {
                item['year' + i] = item['year' + i] / 100;
              }
              break;
          }
          return item;
        });

        // calculate the result of the formula using the inputs describes in jsonlogic
        const theResult = this.jsonLogicService.calculateResult(item, columnIndex, allItems);

        // Loop through each row of the table
        this.form.controls.items['controls'].forEach((formRow: FormGroup, rowIndex: number) => {
          // Find the row which contains the column we want to update with the new value
          if (formRow.value['rowIndex'] == rowWantToUpdate) {
            // Loop through all the columns in this row to find the cell we want to update
            Object.keys(formRow.controls).forEach((key: string) => {
              // Once find the cell, update its value with the newly calculated on
              if (key === 'year' + columnIndex) {
                const dynamicYearColumn = 'year' + columnIndex;

                // Update the value stored in the form with the new value
                //  setTimeout(() => {
                if (
                  !(
                    this.form.controls.items['controls'][rowIndex].controls[dynamicYearColumn].touched &&
                    !this.form.controls.items['controls'][rowIndex].controls[dynamicYearColumn].pristine
                  )
                ) {
                  // Set calculated value appropriately for the rowUnits
                  console.log(this.form.controls.items['controls'][rowIndex].value['rowUnits']);
                  switch (this.form.controls.items['controls'][rowIndex].value['rowUnits']) {
                    case 'US dollars':
                      this.form.controls.items['controls'][rowIndex].patchValue({
                        [dynamicYearColumn]: this.formatDollar(theResult),
                      });
                      break;
                    case 'percent':
                      this.form.controls.items['controls'][rowIndex].patchValue({
                        [dynamicYearColumn]: theResult * 100,
                      });
                      break;

                    default:
                      this.form.controls.items['controls'][rowIndex].patchValue({ [dynamicYearColumn]: theResult });
                  }

                  console.log('Set var', dynamicYearColumn, rowIndex, 'val', theResult);

                  // this.form.controls.items['controls'][rowIndex].patchValue({
                  //   [dynamicYearColumn + 'Overriden']: true,
                  // });
                  this.form.controls.items['controls'][rowIndex].controls[dynamicYearColumn].markAsPristine();
                }
                //   }, 0);
              }
            });
          }
        });
      }
    });
  }

  public refreshMe(index: number, year: number) {
    console.log('Reset the thing');

    const allItems: Array<unknown> = this.form.getRawValue().items;

    let defaultVal = allItems[index]['year' + year + 'Default'];

    console.log(defaultVal);

    switch (this.form.controls.items['controls'][index].value['rowUnits']) {
      case 'US dollars':
        defaultVal = this.formatDollar(defaultVal);
        break;
      case 'percent':
        defaultVal = defaultVal * 100;
        break;
    }
    console.log(defaultVal);
    this.form.controls.items['controls'][index].patchValue({ ['year' + year]: defaultVal });

    this.form.controls.items['controls'][index].patchValue({ ['year' + year + 'Overriden']: false });
    this.form.controls.items['controls'][index]['controls']['year' + year].markAsPristine();
    this.form.controls.items['controls'][index]['controls']['year' + year].markAsUntouched();

    this.recalculateChanges();
  }

  public validateUserInput(event: Event, rowIndex: number, year: string) {
    const userInput = Number((event.target as HTMLInputElement).value);
    if (userInput < 0) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 0 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    } else if (userInput > 100) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 100 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    }
  }

  private reverseFormatNumber(val, locale) {
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  }

  public formatPlain(value: string) {
    if (value.startsWith('$')) {
      const plainCurrency = this.reverseFormatNumber(value.substr(1), 'en-US');
      //console.log(`${value} -> ${plainCurrency}`);
      return plainCurrency;
    }
    return value;
  }

  public updatePlainCurrencyField(event, index: number, field: string) {
    const value = String(event.target.value);
    const plainCurrency = this.formatPlain(value);
    this.form.controls.items['controls'][index].get(field).patchValue(plainCurrency);
  }

  public updatePlainCurrencyIdx(event, index: number, row: number) {
    const value = String(event.target.value);
    const plainCurrency = this.formatPlain(value);
    this.form.controls.items['controls'][index].patchValue({ ['year' + row]: plainCurrency });
  }

  public formatDollar(value: string | number) {
    if (typeof value === 'number' || !value.startsWith('$')) {
      const formattedCurrency = '$' + new Intl.NumberFormat('en-US').format(Number(value));
      //console.log(`${value} -> ${formattedCurrency}`);
      return formattedCurrency;
    }
    return value;
  }

  public updateDollarCurrencyField(event, index: number, field: string) {
    const value = String(event.target.value);
    const formattedCurrency = this.formatDollar(value);
    this.form.controls.items['controls'][index].get(field).patchValue(formattedCurrency);
  }

  public updateDollarCurrencyIdx(event, index: number, row: number) {
    const value = String(event.target.value);
    const formattedCurrency = this.formatDollar(value);
    this.form.controls.items['controls'][index].patchValue({ ['year' + row]: formattedCurrency });
  }
}
