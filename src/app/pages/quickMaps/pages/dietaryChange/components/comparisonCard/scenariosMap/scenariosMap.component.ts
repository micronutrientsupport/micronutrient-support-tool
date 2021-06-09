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
  @ViewChild('baselineMap') baselineMapElement: ElementRef;
  @ViewChild('scenarioMap') scenarioMapElement: ElementRef;

  public baselineMap: L.Map;
  public scenarioMap: L.Map;

  public allowBaselineMapEvents: boolean;
  public allowScenarioMapEvents: boolean;

  private areaBounds: L.LatLngBounds;

  constructor() {}

  ngAfterViewInit(): void {
    this.baselineMap = this.initialiseBaselineMap(this.baselineMapElement.nativeElement);
    this.scenarioMap = this.initialiseScenarioMap(this.scenarioMapElement.nativeElement);
    this.initialiseListeners();
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
