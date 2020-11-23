/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-quickmaps-location-select',
  templateUrl: './locationSelect.component.html',
  styleUrls: ['./locationSelect.component.scss', '../../components/sideNavContent/sideNavParent.scss'],
})
export class LocationSelectComponent implements AfterViewInit {
  public geojson: L.GeoJSON;
  public map: L.Map;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initialiseMap();
  }

  public initialiseMap(): void {
    this.map = L.map('map').setView([6.6194073, 20.9367017], 3).setMaxZoom(8).setMinZoom(3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    void this.http
      .get('./assets/geoJSON/africanNations.json')
      .toPromise()
      .then((json: any) => {
        this.geojson = L.geoJSON(json, {
          style: (feature) => {
            if (feature.properties.sovereignt === 'Malawi') {
              return {
                fillColor: 'green',
                fillOpacity: 0.5,
              };
            }
          },
          onEachFeature: (feature, layer: L.Layer) => {
            layer.on({
              mouseover: () => {
                this.highlightFeature(layer);
              },
              mouseout: () => {
                this.resetHighlight(layer);
              },
              click: (e) => {
                this.map.fitBounds(e.target.getBounds());
                window.alert(`you clicked on ${feature.properties.sovereignt}`);
              },
            });
          },
        }).addTo(this.map);
      });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public highlightFeature(layer: any): void {
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.2,
    });

    if (!L.Browser.ie && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  public resetHighlight(layer: L.Layer): void {
    this.geojson.resetStyle(layer);
  }
}
