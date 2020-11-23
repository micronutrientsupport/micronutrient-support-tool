/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {

  public boundaryGeojson: L.GeoJSON;
  public map: L.Map;
  public boundaryLayer: any;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initialiseMap();
  }

  public initialiseMap(): void {
    this.map = L.map('mapView', {

    }).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.http.get('./assets/geoJSON/malawi-admin-boundaries.json').subscribe((data: any) => {
      const layerStyle = {
        color: '#703aa3',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.1
      };

      const props = {
        style: layerStyle,
        onEachFeature: (feature: any, layer: any) => {
          console.log(feature, layer);
          const layerName = feature.properties.NAME_1;

          const layerCentre = layer.getBounds().getCenter();

          const popup = L.popup()
            .setLatLng(layerCentre)
            .setContent(
              `<div>${layerName}</div>`
            );

          layer.bindPopup(popup);

          layer.on({
            mouseover: () => (layer.openPopup()),
            mouseout: () => (layer.closePopup()),
            click: (e: any) => (console.log('clicked', e))
          });
        }
      };

      this.boundaryLayer = L.geoJSON(data, props);
      this.map.addLayer(this.boundaryLayer);
      this.map.fitBounds(this.boundaryLayer.getBounds());
    });
  }

}
