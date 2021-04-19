/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradientType.enum';
import { DialogData } from '../baseDialogService.abstract';
import { ColourPalette } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPalette';
import { PALETTES } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourGradients';
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

  public generalSelectionValue = new Array<ColourGradientType>();
  public colourGradientType = ColourGradientType;
  public colourPalette: ColourPalette;
  public initialPalette: ColourPalette;
  public showCustomGradient = false;
  public customGradientDefined = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<ColourPalette, ColourPalette>) {
    this.generalSelectionValue.push(data.dataIn.name);
    this.colourPalette = data.dataIn;
    this.initialPalette = data.dataIn;
    if (data.dataIn.name === ColourGradientType.CUSTOM) {
      this.customGradientDefined = true;
    }
  }

  ngOnInit(): void {
  }

  public cancel(): void {
    this.data.dataOut = this.initialPalette;
    this.data.close();
  }

  public applyChanges(): void {

    if (this.generalSelectionValue[0] !== ColourGradientType.CUSTOM) {
      this.colourPalette = PALETTES.find((palette: ColourPalette) => palette.name === this.generalSelectionValue[0]);
    }

    this.data.dataOut = this.colourPalette;
    this.data.close();
  }

  public callCustomColourInput(): void {
    this.customGradientDefined = true;
    this.colorContainer1.nativeElement.innerHTML = '';
    this.colourPalette = new ColourPalette(ColourGradientType.CUSTOM,
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
}
