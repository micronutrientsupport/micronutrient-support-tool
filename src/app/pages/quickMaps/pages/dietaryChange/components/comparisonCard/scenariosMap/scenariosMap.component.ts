import { AfterViewInit, ElementRef, Input } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import { ColourPalette } from 'src/app/pages/quickMaps/components/colourObjects/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/components/colourObjects/colourPaletteType.enum';

@Component({
  selector: 'app-scenarios-map',
  templateUrl: './scenariosMap.component.html',
  styleUrls: ['./scenariosMap.component.scss'],
})
export class ScenariosMapComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'scenarios-map-view';
  @ViewChild('baselineMap') baselineMapElement: ElementRef;
  @ViewChild('scenarioMap') scenarioMapElement: ElementRef;

  @Input() set data(data: SubRegionDataItem) {
    this.baselineMapData = data;
  }

  public baselineMapData: SubRegionDataItem;

  private baselineMap: L.Map;
  private scenarioMap: L.Map;
  private areaBounds: L.LatLngBounds;

  private allowBaselineMapEvents: boolean;
  private allowScenarioMapEvents: boolean;

  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;

  constructor() {
    this.colourPalette = ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }

  ngAfterViewInit(): void {
    this.baselineMap = this.initialiseBaselineMap(this.baselineMapElement.nativeElement);
    this.scenarioMap = this.initialiseScenarioMap(this.scenarioMapElement.nativeElement);
    this.initialiseListeners();
    // console.debug('data', this.data);
  }

  private initialiseBaselineMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private initialiseScenarioMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper().createMap(mapElement).setDefaultBaseLayer().getMap();
  }

  private initialiseListeners(): void {
    this.baselineMap.on({
      mousedown: () => {
        this.allowBaselineMapEvents = true;
        this.allowScenarioMapEvents = false;
      },
      move: () => {
        if (this.allowBaselineMapEvents) {
          this.setMapPosition(this.baselineMap, this.scenarioMap);
        }
      },
      zoom: () => {
        this.setMapZoom(this.baselineMap, this.scenarioMap);
      },
    });
    this.scenarioMap.on({
      mousedown: () => {
        this.allowScenarioMapEvents = true;
        this.allowBaselineMapEvents = false;
      },
      move: () => {
        if (this.allowScenarioMapEvents) {
          this.setMapPosition(this.scenarioMap, this.baselineMap);
        }
      },
      zoom: () => {
        this.setMapZoom(this.scenarioMap, this.baselineMap);
      },
    });
  }

  private setMapPosition(baseMap: L.Map, targetMap: L.Map): void {
    if (targetMap.getCenter() !== baseMap.getCenter()) {
      targetMap.panTo(baseMap.getCenter());
    }
  }

  private setMapZoom(baseMap: L.Map, targetMap: L.Map): void {
    if (targetMap.getZoom() !== baseMap.getZoom()) {
      targetMap.setZoom(baseMap.getZoom());
    }
  }
}
