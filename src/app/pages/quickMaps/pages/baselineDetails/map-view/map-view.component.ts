/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements AfterViewInit {
  public boundaryGeojson: L.GeoJSON;
  // public map: L.Map;
  public boundaryLayer: any;
  public title: 'Map View';
  private mapView1: L.Map;
  private mapView2: L.Map;

  constructor(private http: HttpClient, private modalService: DialogService) {}

  ngAfterViewInit(): void {
    // fails to find element if not taked out of flow
    setTimeout(() => {
      this.mapView1 = this.initialiseMapAbsolute('mapView1');
    }, 0);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // Map container doesn't exist until tab changed...
    if (tabChangeEvent.index === 1 && !this.mapView2) {
      this.mapView2 = this.initialiseMapThreshold('mapView2');
    } else {
      this.mapView2.invalidateSize();
      this.mapView1.invalidateSize();
    }
  }

  public initialiseMapAbsolute(mapId: string): L.Map {
    let map: L.Map;
    map = L.map(mapId, {}).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    this.http.get('./assets/exampleData/sub-region-results_copy.json').subscribe((data: any) => {
      // const layerStyle = {
      //   color: '#703aa3',
      //   weight: 1,
      //   opacity: 0.9,
      //   fillOpacity: 0.1,
      // };

      const style = (feature) => ({
        fillColor: this.getColourAbsolute(feature.properties.mn_absolute),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      });

      L.geoJSON(data, { style: style }).addTo(map);

      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const range = [0, 10, 50, 100, 250, 500, 1000, 1500];

        // loop through our  intervals and generate a label with a colored square for each interval
        for (let i = 0; i < range.length; i++) {
          div.innerHTML +=
            `<span style="display: flex; align-items: center;
            ">
            <span style="background-color:${this.getColourAbsolute(
              range[i] + 1,
            )}; height:10px; width:10px; display:block; margin-right:5px;"> </span>` +
            '<span>' +
            range[i] +
            (range[i + 1] ? `&ndash;${range[i + 1]} mg` : ' mg+') +
            '</span>' +
            '</span>';
        }

        return div;
      };

      legend.addTo(map);

      const props = {
        // style: layerStyle,
        onEachFeature: (feature: any, layer: any) => {
          // console.log(feature, layer);
          const layerName = feature.properties.subregion_name;
          const layerValueAbsolute = feature.properties.mn_absolute;
          const layerValueThreshold = feature.properties.mn_threshold;

          const layerCentre = layer.getBounds().getCenter();

          const popup = L.popup()
            .setLatLng(layerCentre)
            .setContent(
              `<div>Region:<b>${layerName}</b><br>Absolute value:${layerValueAbsolute}mg<br>Threshold: ${layerValueThreshold}%</div>`,
            );

          layer.bindPopup(popup);

          layer.on({
            mouseover: () => layer.openPopup(),
            mouseout: () => layer.closePopup(),
            click: (e: any) => console.log('clicked', e),
          });
        },
      };

      this.boundaryLayer = L.geoJSON(data, props);
      map.addLayer(this.boundaryLayer);
      map.fitBounds(this.boundaryLayer.getBounds());
    });
    return map;
  }

  public initialiseMapThreshold(mapId: string): L.Map {
    let map: L.Map;
    map = L.map(mapId, {}).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    this.http.get('./assets/exampleData/sub-region-results_copy.json').subscribe((data: any) => {
      // const layerStyle = {
      //   color: '#703aa3',
      //   weight: 1,
      //   opacity: 0.9,
      //   fillOpacity: 0.1,
      // };

      const style = (feature) => ({
        fillColor: this.getColourThreshold(feature.properties.mn_threshold),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      });

      L.geoJSON(data, { style: style }).addTo(map);

      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const range = [0, 20, 40, 60, 80, 99];

        // loop through our  intervals and generate a label with a colored square for each interval
        for (let i = 0; i < range.length; i++) {
          div.innerHTML +=
            `<span style="display: flex; align-items: center;
            ">
            <span style="background-color:${this.getColourThreshold(
              range[i] + 1,
            )}; height:10px; width:10px; display:block; margin-right:5px;"> </span>` +
            '<span>' +
            range[i] +
            (range[i + 1] ? `&ndash;${range[i + 1]}%<br>` : '%+') +
            '</span>' +
            '</span>';
        }

        return div;
      };

      legend.addTo(map);

      const props = {
        // style: layerStyle,
        onEachFeature: (feature: any, layer: any) => {
          // console.log(feature, layer);
          const layerName = feature.properties.subregion_name;
          const layerValueAbsolute = feature.properties.mn_absolute;
          const layerValueThreshold = feature.properties.mn_threshold;

          const layerCentre = layer.getBounds().getCenter();

          const popup = L.popup()
            .setLatLng(layerCentre)
            .setContent(
              `<div>Region:<b>${layerName}</b><br>Absolute value:${layerValueAbsolute}mg<br>Threshold: ${layerValueThreshold}%</div>`,
            );

          layer.bindPopup(popup);

          layer.on({
            mouseover: () => layer.openPopup(),
            mouseout: () => layer.closePopup(),
            click: (e: any) => console.log('clicked', e),
          });
        },
      };

      this.boundaryLayer = L.geoJSON(data, props);
      map.addLayer(this.boundaryLayer);
      map.fitBounds(this.boundaryLayer.getBounds());
    });
    return map;
  }

  public getColourAbsolute(absoluteValue: number): string {
    return absoluteValue > 1500
      ? '#2ca25f'
      : absoluteValue > 1000
      ? '#addd8e'
      : absoluteValue > 500
      ? '#ffeda0'
      : absoluteValue > 250
      ? '#feb24c'
      : absoluteValue > 100
      ? '#f03b20'
      : absoluteValue > 50
      ? '#bd0026'
      : absoluteValue > 10
      ? '#7a0177'
      : '#354969';
  }
  public getColourThreshold(thresholdValue: number): string {
    return thresholdValue > 99
      ? '#187026'
      : thresholdValue > 80
      ? '#22f243'
      : thresholdValue > 60
      ? '#f0f01d'
      : thresholdValue > 40
      ? '#f08f11'
      : thresholdValue > 20
      ? '#e0071c'
      : thresholdValue > 0
      ? '#5e1d5c'
      : '#0f0e0f';
  }
  public openDialog(): void {
    void this.modalService.openMapDialog('Hello World');
  }
}
