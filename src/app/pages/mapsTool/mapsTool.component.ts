import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AppRoutes } from 'src/app/app-routes';

@Component({
  selector: 'app-maps-tool',
  templateUrl: './mapsTool.component.html',
  styleUrls: ['./mapsTool.component.scss'],
})
export class MapsToolComponent implements OnInit {
  public ROUTES = AppRoutes;

  ngOnInit(): void {
    const myMap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  }
}
