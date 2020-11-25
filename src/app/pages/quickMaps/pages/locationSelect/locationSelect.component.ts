/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import * as L from 'leaflet';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../quickMaps.service';

@Component({
  selector: 'app-quickmaps-location-select',
  templateUrl: './locationSelect.component.html',
  styleUrls: ['./locationSelect.component.scss', '../../components/sideNavContent/sideNavParent.scss'],
})
export class LocationSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') public sidenav: MatSidenav;

  public geojson: L.GeoJSON;
  public map: L.Map;
  public slim: boolean;

  public countriesDictionary: Dictionary;

  public countryId: string;
  public geoFeatures = new Array();

  constructor(
    private http: HttpClient,
    public quickMapsService: QuickMapsService,
    public dictionaryService: DictionaryService,
  ) {
    void dictionaryService.getDictionaries([DictionaryType.COUNTRIES]).then((dicts: Array<Dictionary>) => {
      this.countriesDictionary = dicts.shift();
      this.geoFeatures = this.countriesDictionary.getItems().map((feature) => {
        // tslint:disable-next-line: no-unused-expression
      });
      console.log(this.geoFeatures);
    });

    quickMapsService.slimObservable.subscribe((slim: boolean) => {
      this.slim = slim;
    });
    quickMapsService.countryIdObs.subscribe((countryId: string) => {
      this.countryId = countryId;
    });
    // console.log('countryId', this.countriesDictionary.getItem(this.quickMapsService.countryId));
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initialiseMap();
  }

  public log(): void {
    console.log('countryId');
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
