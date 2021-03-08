/* eslint-disable @typescript-eslint/unbound-method */
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/apiAndObjects/objects/enums/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
import chroma from 'chroma-js';
export interface ColourDialogData {
  colourGradient: ColourGradientType;
}
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
      colourGradient: ColourGradientType.REDYELLOWGREEN,
      name: 'RdYGn',
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

  public settingsForm = new FormGroup({
    generalColourSelection: new FormControl('', [Validators.required]),
  });

  public generalSelectionValue = new Array<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<ColourDialogData>) {
    this.generalSelectionValue.push(data.dataIn.colourGradient);
    data.dataOut = this.generalSelectionValue[0];
  }

  ngOnInit(): void {
    // console.debug(this.createNewArray());
  }

  public applyChanges(): void {
    this.data.dataOut = this.generalSelectionValue[0];
    this.settingsForm.markAsPristine();
  }

  public callFunctionOne(): void {
    // console.debug('change detected');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.generateColors(this.colorOne.nativeElement.value, this.colorTwo.nativeElement.value);
  }

  public callFunctionTwo(): void {
    // console.debug('change detected');

    this.generateColors(this.colorOne.nativeElement.value, this.colorTwo.nativeElement.value);
    //  console.debug('change detected');
  }

  public generateColors = (color1, color2) => {
    // remove any previous child nodes
    this.colorContainer.nativeElement.innerHTML = '';

    // get array of colors from chroma.js
    const colorPalette = chroma.scale([color1, color2]).colors(6);

    colorPalette.forEach((color: string) => {
      //      console.debug('colour:', color);
      // create a div for each color
      // let colourSample = document.createElement(`<span class="colourSample" style="background-color:${color};"></span>`);
      const colourSample = <HTMLDivElement>document.createElement('div');

      //   // add a class to each div
      (<Element>colourSample).classList.add('colourSample');

      //   // give each div a background color
      colourSample.style.background = color;
      colourSample.style.width = '3em';
      colourSample.style.height = '1.5em';

      //   // append the div to the container
      this.colorContainer.nativeElement.appendChild(colourSample);
    });
  };
}
