import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-quick-maps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {
  public geojson: L.GeoJSON;
  public map: L.Map;


  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.initialiseMap();
  }

  public initialiseMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    void this.http.get('./assets/geoJSON/africanNations.json').toPromise()
      .then((json: any) => {
        this.geojson = L.geoJSON(json, {

        }).addTo(this.map);
      });
  }
}

