import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-quick-maps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {

  ngOnInit(): void {
    const myMap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  }

}
