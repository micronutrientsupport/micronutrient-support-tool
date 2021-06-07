import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';

@Component({
  selector: 'app-scenarios-map',
  templateUrl: './scenariosMap.component.html',
  styleUrls: ['./scenariosMap.component.scss'],
})
export class ScenariosMapComponent implements OnInit {
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;

  public baselineMap: L.Map;
  public scenarioMap: L.Map;
  private areaBounds: L.LatLngBounds;

  constructor() {}

  ngOnInit(): void {
    this.baselineMap = this.initialiseMap(this.map1Element.nativeElement);
    this.scenarioMap = this.initialiseMap(this.map2Element.nativeElement);
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }
}
