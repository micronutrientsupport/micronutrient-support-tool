/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-quick-maps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit {
  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupsDictionary: Dictionary;

  public micronutrientDataOptions = new Array<MicronutrientDataOption>();

  public searchByCountry = true;
  public selectedCountry: DictionaryItem;
  public selectedRegion: DictionaryItem;
  public selectedMicronutrient: DictionaryItem;
  public selectedPopulateionGroup: DictionaryItem;

  public geojson: L.GeoJSON;
  public map: L.Map;

  constructor(
    public dictionariesService: DictionaryService,
    private currentDataService: CurrentDataService,
    private http: HttpClient,
  ) {
    void dictionariesService
      .getDictionaries([
        DictionaryType.COUNTRIES,
        DictionaryType.REGIONS,
        DictionaryType.MICRONUTRIENTS,
        DictionaryType.POPULATION_GROUPS,
      ])
      .then((dicts: Array<Dictionary>) => {
        this.countriesDictionary = dicts.shift();
        this.regionDictionary = dicts.shift();
        this.micronutrientsDictionary = dicts.shift();
        this.popGroupsDictionary = dicts.shift();

        // test
        this.selectedCountry = this.countriesDictionary.getItems()[0];
        this.selectedRegion = this.regionDictionary.getItems()[0];
        this.selectedMicronutrient = this.micronutrientsDictionary.getItems()[0];
        this.selectedPopulateionGroup = this.popGroupsDictionary.getItems()[0];

        this.updateMicronutrientDataOptions();
      });
  }

  ngOnInit(): void {
    this.initialiseMap();
  }

  public initialiseMap(): void {
    this.map = L.map('map').setView([6.6194073, 20.9367017], 3);
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

  public updateMicronutrientDataOptions(): void {
    void this.currentDataService
      .getMicronutrientDataOptions(
        this.searchByCountry ? this.selectedCountry : this.selectedRegion,
        this.selectedMicronutrient,
        this.selectedPopulateionGroup,
      )
      .then((options: Array<MicronutrientDataOption>) => {
        this.micronutrientDataOptions = options;
        console.log('MicronutrientDataOption', options);
      });
  }
}
