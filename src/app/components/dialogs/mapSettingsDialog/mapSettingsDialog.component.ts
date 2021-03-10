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

  title = 'angular-color-picker';

  public gradientList: Array<ColourGradientObject> = [
    {
      colourGradient: ColourGradientType.BLUEREDYELLOWGREEN,
      name: 'Blue-Red-Yellow-Green',
    },
    {
      colourGradient: ColourGradientType.DIVERGINGCOLORS,
      name: 'Red-Light-Green',
    },
    {
      colourGradient: ColourGradientType.COLOURBLIND,
      name: 'Colour Blind',
    },
  ];

  public customColourGradient: CustomGradientObject;
  public initialGradient: CustomColourObject;
  public generalSelectionValue = new Array<ColourGradientType>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<CustomColourObject, CustomColourObject>) {
    this.generalSelectionValue.push(data.dataIn.type);
    this.initialGradient = data.dataIn;
    data.dataOut.type = this.generalSelectionValue[0];
  }

  ngOnInit(): void {}
  public cancel(): void {
    this.data.dataOut = this.initialGradient;
    this.data.close();
  }

  public applyChanges(): void {
    this.data.dataOut.type = this.generalSelectionValue[0];
    if (null != this.customColourGradient) {
      this.data.dataOut.type = ColourGradientType.CUSTOM;
      this.data.dataOut.customObject = this.customColourGradient;
    }
    this.data.close();
    console.log(this.customColourGradient);
  }

  public callCustomColourInput(): void {
    // console.debug('change detected');

    this.generateColors(
      this.colorOne.nativeElement.value,
      this.colorTwo.nativeElement.value,
      this.colorThree.nativeElement.value,
    );
    //  console.debug('change detected');
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
    this.customColourGradient = {
      thresholdValues: thresholdValues,
      absoluteValues: absoluteValues,
    };
    // console.debug('custom object:', this.customColourGradient);
  };
}
