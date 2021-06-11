import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';

@Component({
  selector: 'app-status-maps',
  templateUrl: './statusMaps.component.html',
  styleUrls: ['./statusMaps.component.scss'],
})
export class StatusMapsComponent implements AfterViewInit {
  @ViewChild('map') mapElement: ElementRef;

  private biomakerMap: L.Map;
  private biomarkerDataLayer: L.GeoJSON;
  private range = [10, 50, 100, 250, 500, 1000, 1500];
  private legend: L.Control;
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection;

  constructor() {}

  ngAfterViewInit(): void {
    this.biomakerMap = this.initialiseMap(this.mapElement.nativeElement);
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }
}
