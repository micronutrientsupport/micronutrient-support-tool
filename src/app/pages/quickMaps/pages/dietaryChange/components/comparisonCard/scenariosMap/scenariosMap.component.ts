import { AfterViewInit, ElementRef } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { type } from 'os';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';

@Component({
  selector: 'app-scenarios-map',
  templateUrl: './scenariosMap.component.html',
  styleUrls: ['./scenariosMap.component.scss'],
})
export class ScenariosMapComponent implements AfterViewInit {
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;

  public baselineMap: L.Map;
  public scenarioMap: L.Map;

  public allowBaselineMapEvents: boolean;
  public allowScenarioMapEvents: boolean;

  private areaBounds: L.LatLngBounds;

  constructor() {}

  ngAfterViewInit(): void {
    this.baselineMap = this.initialiseMap(this.map1Element.nativeElement);
    this.scenarioMap = this.initialiseMap(this.map2Element.nativeElement);
    this.initialiseListeners();
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private initialiseListeners(): void {
    this.baselineMap.on({
      mousedown: () => {
        this.allowBaselineMapEvents = true;
        this.allowScenarioMapEvents = false;
      },
      move: () => {
        if (this.allowBaselineMapEvents) {
          this.setMap(this.baselineMap, this.scenarioMap);
        }
      },
    });
    this.scenarioMap.on({
      mousedown: () => {
        this.allowScenarioMapEvents = true;
        this.allowBaselineMapEvents = false;
      },
      move: () => {
        if (this.allowScenarioMapEvents) {
          this.setMap(this.scenarioMap, this.baselineMap);
        }
      },
    });
  }

  private setMap(baseMap: L.Map, targetMap: L.Map): void {
    if (targetMap.getCenter() !== baseMap.getCenter()) {
      targetMap.panTo(baseMap.getCenter());
    }
    if (targetMap.getZoom() !== baseMap.getZoom()) {
      targetMap.setZoom(baseMap.getZoom());
    }
  }
}
