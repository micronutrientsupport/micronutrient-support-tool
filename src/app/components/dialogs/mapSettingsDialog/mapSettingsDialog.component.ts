/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
import { ColourPalette } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/pages/baselineDetails/mapView/colourPaletteType.enum';
import { MatSelectionList } from '@angular/material/list';
@Component({
  selector: 'app-map-settings-dialog',
  templateUrl: './mapSettingsDialog.component.html',
  styleUrls: ['./mapSettingsDialog.component.scss'],
})
export class MapSettingsDialogComponent implements AfterViewInit {
  @ViewChild('container1') public colorContainer: ElementRef;
  @ViewChild('selectionList') public selectionList: MatSelectionList;

  public customColourGradientColours = '';

  public colourPaletteType = ColourPaletteType;
  public selectedPalette: ColourPalette;
  public initialPalette: ColourPalette;
  public showCustomGradient = false;
  public customGradientDefined = false;
  private colourPaletteId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<string>) {
    this.colourPaletteId = data.dataIn;
    this.selectedPalette = ColourPalette.getSelectedPalette(this.colourPaletteId);
    this.initialPalette = this.selectedPalette;

    const customPalette = ColourPalette.getCustomPalette(this.colourPaletteId);
    if (null != customPalette) {
      this.setCustomGradientColours(customPalette.colourHexArray);
    }
  }

  ngAfterViewInit(): void {
    const preSelectItem = this.selectionList.options.find((item) => item.value === this.selectedPalette.name);
    if ((null != preSelectItem) && (!preSelectItem.selected)) {
      // fixes ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        preSelectItem.toggle();
      }, 0);
    }
  }

  public cancel(): void {
    this.data.dataOut = this.initialPalette;
    this.data.close();
  }

  public applyChanges(): void {
    const selectedName = this.selectionList.selectedOptions.selected[0].value as string;
    if (selectedName !== ColourPaletteType.CUSTOM) {
      this.selectedPalette = ColourPalette.PALETTES.find((palette: ColourPalette) => palette.name === selectedName);
    } else {
      this.selectedPalette = ColourPalette.getCustomPalette(this.colourPaletteId);
    }

    ColourPalette.setSelectedPalette(this.colourPaletteId, this.selectedPalette);
    this.data.close();
  }

  public callCustomColourInput(colours: Array<string>): void {
    if (null != this.colorContainer) {
      this.colorContainer.nativeElement.innerHTML = '';
    }
    this.selectedPalette = new ColourPalette(ColourPaletteType.CUSTOM, colours);

    this.selectedPalette.generateColorsForDisplay().forEach((element: HTMLDivElement) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.colorContainer.nativeElement.appendChild(element);
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
