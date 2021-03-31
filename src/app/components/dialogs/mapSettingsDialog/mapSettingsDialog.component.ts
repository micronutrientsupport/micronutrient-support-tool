/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
import chroma from 'chroma-js';
import { CustomGradientObject } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/customGradientObject';
import { CustomColourObject } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourObject';
import { ColourGradient } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradient';
import { ColourPalette } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPalette';
export interface ColourGradientObject {
  name: string;
  colourGradient: ColourGradientType;
}
@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss'],
})
export class MapSettingsDialogComponent implements OnInit {
  @ViewChild('colorOne') public colorOne: ElementRef;
  @ViewChild('colorTwo') public colorTwo: ElementRef;
  @ViewChild('colorThree') public colorThree: ElementRef;
  @ViewChild('container1') public colorContainer1: ElementRef;
  @ViewChild('container2') public colorContainer2: ElementRef;

  public customColourGradientColours = '';

  public customColourGradient: ColourGradient;
  public initialGradient: CustomColourObject;
  public generalSelectionValue = new Array<ColourGradientType>();
  public colourGradientType = ColourGradientType;
  public colourPalette: ColourPalette;
  public showCustomGradient = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<CustomColourObject, CustomColourObject>) {
    this.generalSelectionValue.push(data.dataIn.type);
    this.initialGradient = data.dataIn;
    this.data.dataOut.type = this.generalSelectionValue[0];
    // this.data.dataOut.customObject = this.customColourGradient;
    this.customColourGradient = this.data.dataIn.customColourGradient;
    if (this.customColourGradient) {
      // const customColourOne = this.data.dataIn.customObject.thresholdValues[0];
      // const customColourTwo = this.data.dataIn.customObject.thresholdValues[3];
      // const customColourThree = this.data.dataIn.customObject.thresholdValues[6];
      // this.customColourGradientColours = `linear-gradient(0.25turn, ${customColourOne}, ${customColourTwo}, ${customColourThree})`;
    }
  }

  ngOnInit(): void {
  }

  public cancel(): void {
    this.data.dataOut = this.initialGradient;
    this.data.close();
  }

  public applyChanges(): void {
    this.data.dataOut.type = this.generalSelectionValue[0];
    // if (null != this.customColourGradient) {
    // this.data.dataOut.type = ColourGradientType.CUSTOM;
    this.data.dataOut.customColourGradient = this.customColourGradient;
    // }
    this.data.close();
    // console.log(this.customColourGradient);
  }

  public callCustomColourInput(): void {
    this.colorContainer1.nativeElement.innerHTML = '';
    this.colourPalette = new ColourPalette('Custom',
      [
        this.colorOne.nativeElement.value,
        this.colorTwo.nativeElement.value,
        this.colorThree.nativeElement.value
      ]);

    this.colourPalette.generateColorsForDisplay().forEach((element: HTMLDivElement) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer1.nativeElement.appendChild(element);
    });

    this.customColourGradientColours = `linear-gradient(0.25turn,
      ${this.colorOne.nativeElement.value},${this.colorTwo.nativeElement.value},${this.colorThree.nativeElement.value})`;
    this.showCustomGradient = true;
  }

  public generateColors = (color1: string, color2: string, color3: string): void => {
    const thresholdValues = [];
    const absoluteValues = [];

    // remove any previous child nodes
    this.colorContainer1.nativeElement.innerHTML = '';
    this.colorContainer2.nativeElement.innerHTML = '';

    // get array of colors from chroma.js
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const colorPalette1: Array<string> = chroma.scale([color1, color2, color3]).colors(8);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const colorPalette2: Array<string> = chroma.scale([color1, color2, color3]).colors(7);

    colorPalette1.forEach((color: string) => {
      // create a div for each color
      const colourSample = document.createElement('div');

      //   // add a class to each div
      colourSample.classList.add('colourSample');

      //   // give each div a background color
      colourSample.style.background = color;
      colourSample.style.width = '100%';
      colourSample.style.height = '1.5em';

      //   // append the div to the container
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer1.nativeElement.appendChild(colourSample);
      absoluteValues.push(color);
    });

    colorPalette2.forEach((color: string) => {
      // create a div for each color
      const colourSample = document.createElement('div');

      //   // add a class to each div
      colourSample.classList.add('colourSample');

      //   // give each div a background color
      colourSample.style.background = color;
      colourSample.style.width = '100%';
      colourSample.style.height = '1.5em';

      //   // append the div to the container
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer2.nativeElement.appendChild(colourSample);
      thresholdValues.push(color);
    });
    // this.customColourGradient = customObject;
    // this.customColourGradient = {
    //   id: ColourGradientType.CUSTOM,
    //   name: 'Custom-Range',
    //   lessThanTestValues:
    // };
    // console.debug('custom object:', this.customColourGradient);
  };
}
