/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColourPaletteType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPaletteType.enum';
import { DialogData } from '../baseDialogService.abstract';
import { ColourPalette } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPalette';
export interface ColourGradientObject {
  name: string;
  colourGradient: ColourPaletteType;
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

  public generalSelectionValue = new Array<ColourPaletteType>();
  public colourGradientType = ColourPaletteType;
  public selectedPalette: ColourPalette;
  public initialPalette: ColourPalette;
  public showCustomGradient = false;
  public customGradientDefined = false;
  private colourPaletteId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<string>) {
    this.colourPaletteId = data.dataIn;
    this.selectedPalette = ColourPalette.getSelectedPalette(this.colourPaletteId);
    this.generalSelectionValue.push(this.selectedPalette.name);
    this.initialPalette = this.selectedPalette;

    const customPalette = ColourPalette.getCustomPalette(this.colourPaletteId);
    if (null != customPalette) {
      this.setCustomGradientColours(customPalette.colourHexArray);
    }
  }

  ngOnInit(): void {
  }

  public cancel(): void {
    this.data.dataOut = this.initialPalette;
    this.data.close();
  }

  public applyChanges(): void {
    if (this.generalSelectionValue[0] !== ColourPaletteType.CUSTOM) {
      this.selectedPalette = ColourPalette.PALETTES.find((palette: ColourPalette) => palette.name === this.generalSelectionValue[0]);
    } else {
      this.selectedPalette = ColourPalette.getCustomPalette(this.colourPaletteId);
    }

    ColourPalette.setSelectedPalette(this.colourPaletteId, this.selectedPalette);
    this.data.close();
  }

  public callCustomColourInput(colours: Array<string>): void {
    if (null != this.colorContainer1) {
      this.colorContainer1.nativeElement.innerHTML = '';
    }
    this.selectedPalette = new ColourPalette(ColourPaletteType.CUSTOM, colours);

    this.selectedPalette.generateColorsForDisplay().forEach((element: HTMLDivElement) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer1.nativeElement.appendChild(element);
    });

    this.setCustomGradientColours(colours);
    this.showCustomGradient = true;
    ColourPalette.setCustomPalette(this.colourPaletteId, this.selectedPalette);
  }

  private setCustomGradientColours(colours: Array<string>): void {
    this.customColourGradientColours = `linear-gradient(0.25turn,
      ${colours[0]},${colours[1]},${colours[2]})`;
    this.customGradientDefined = true;
  }

}
