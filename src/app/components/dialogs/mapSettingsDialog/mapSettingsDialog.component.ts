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
      this.setCustomGradientColours(data.dataIn.colourHex);
    }
    this.retrieveCustomGradient()
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
    } else {
      this.colourPalette = this.retrieveCustomGradient();
    }

    this.data.dataOut = this.colourPalette;
    localStorage.setItem('colourPalette', JSON.stringify(this.data.dataOut));
    // console.debug('apply changes', this.colourPalette);
    this.data.close();
  }

  public callCustomColourInput(colours: Array<string>): void {
    if (null != this.colorContainer1) {
      this.colorContainer1.nativeElement.innerHTML = '';
    }
    this.colourPalette = new ColourPalette(ColourGradientType.CUSTOM, colours);

    this.colourPalette.generateColorsForDisplay().forEach((element: HTMLDivElement) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer1.nativeElement.appendChild(element);
    });

    this.setCustomGradientColours(colours)
    this.showCustomGradient = true;
    localStorage.setItem('customPalette', JSON.stringify(this.colourPalette));
  }

  private setCustomGradientColours(colours: Array<string>): void {
    this.customColourGradientColours = `linear-gradient(0.25turn,
      ${colours[0]},${colours[1]},${colours[2]})`;
    this.customGradientDefined = true;
  }

  private retrieveCustomGradient(): ColourPalette {
    const retievedPalette = JSON.parse(localStorage.getItem('customPalette')) as ColourPalette;
    if (null != retievedPalette) {
      const customPalette = new ColourPalette(retievedPalette.name, retievedPalette.colourHex);
      this.setCustomGradientColours(customPalette.colourHex);
      return customPalette;
    }
  }
}
