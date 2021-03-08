/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
import chroma from 'chroma-js';
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
  @ViewChild('container') public colorContainer: ElementRef;
  title = 'angular-color-picker';

  public gradientList: Array<ColourGradientObject> = [
    {
      colourGradient: ColourGradientType.BLUEREDYELLOWGREEN,
      name: 'BlRdYlGn',
    },
    {
      colourGradient: ColourGradientType.PURPLEBLUEGREEN,
      name: 'PpBlGn',
    },
    {
      colourGradient: ColourGradientType.COLOURBLIND,
      name: 'Colour Blind',
    },
  ];
  public hue: string;
  public color: string;
  public generalSelectionValue = new Array<ColourGradientType>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<ColourGradientType, ColourGradientType>) {
    this.generalSelectionValue.push(data.dataIn);
    data.dataOut = this.generalSelectionValue[0];
  }

  ngOnInit(): void {}

  public applyChanges(): void {
    this.data.dataOut = this.generalSelectionValue[0];
    this.data.close();
  }

  public callFunctionOne(): void {
    // console.debug('change detected');

    this.generateColors(this.colorOne.nativeElement.value, this.colorTwo.nativeElement.value);
  }

  public callFunctionTwo(): void {
    // console.debug('change detected');

    this.generateColors(this.colorOne.nativeElement.value, this.colorTwo.nativeElement.value);
    //  console.debug('change detected');
  }

  public generateColors = (color1: string, color2: string): void => {
    // remove any previous child nodes
    this.colorContainer.nativeElement.innerHTML = '';

    // get array of colors from chroma.js
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const colorPalette: Array<string> = chroma.scale([color1, color2]).colors(6);

    colorPalette.forEach((color: string) => {
      //      console.debug('colour:', color);
      // create a div for each color
      // let colourSample = document.createElement(`<span class="colourSample" style="background-color:${color};"></span>`);
      const colourSample = document.createElement('div');

      //   // add a class to each div
      colourSample.classList.add('colourSample');

      //   // give each div a background color
      colourSample.style.background = color;
      colourSample.style.width = '3em';
      colourSample.style.height = '1.5em';

      //   // append the div to the container
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer.nativeElement.appendChild(colourSample);
    });
  };
}
