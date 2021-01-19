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
  styleUrls: ['./locationSelect.component.scss'],
})
export class LocationSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') public sidenav: MatSidenav;

  public geojson: L.GeoJSON;
  public map: L.Map;

  public selectedCountry;
  public activeCountry;

  constructor(
    private http: HttpClient,
    public quickMapsService: QuickMapsService,
    public dictionaryService: DictionaryService,
  ) {

    quickMapsService.countryIdObs.subscribe((countryId: string) => {
      this.activeCountry = this.getselectedLayer(countryId);
      if (this.activeCountry) {
        this.selectFeature(this.activeCountry);
      }
    });


  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // fails to find element if not taked out of flow
    setTimeout(() => {
      this.initialiseMap();
    }, 0);
  }

  public goToCountry(id: string): void {
    this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
      const country = dict.getItem<CountryDictionaryItem>(id);
      if (null != country && null != country.geoFeature) {
        // this.map.fitBounds(country.geoFeature.geometry);
        this.hoverHighlightFeature(country.geoFeature);
      }
    });
  }

  public getGeoJsonData(): void {
    this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: dict
          .getItems<CountryDictionaryItem>()
          .map((item) => item.geoFeature)
          .filter((item) => null != item),
      };
      this.geojson = L.geoJSON(featureCollection, {
        style: () => {
          return {
            fillColor: '#8a66ad',
            fillOpacity: 0.1,
            color: '#3a1d54',
            opacity: 0.8,
          };
        }
      });
    });
  }

  public getselectedLayer(countryId: string): any {
    let country;
    if (this.geojson) {
      this.geojson.eachLayer((layer: any) => {
        if ((layer.feature.geometry.properties.countryId === countryId)) {
          country = layer;
        }
      });
      return country;
    }
  }

  private initialiseMap(): void {
    this.map = L.map('map').setView([6.6194073, 20.9367017], 3).setMaxZoom(8).setMinZoom(3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.addCountriesMapLayer();

    if (this.activeCountry) {
      this.selectFeature(this.activeCountry);
    }
  }

  private resetHighlight(layer: L.Layer): void {
    if (layer !== this.selectedCountry) {
      this.geojson.resetStyle(layer);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private hoverHighlightFeature(layer: any): void {
    if (layer !== this.selectedCountry) {
      layer.setStyle({
        weight: 5,
        color: '#9B51E0',
        dashArray: '',
        fillOpacity: 0.3,
      });

      if (!L.Browser.ie && !L.Browser.edge) {
        layer.bringToFront();
      }
    }
  }

  private selectFeature(layer: any): void {
    if (null != this.selectedCountry) {
      this.selectedCountry.setStyle({
        fillColor: '#8a66ad',
        fillOpacity: 0.1,
        color: '#1D3557',
        opacity: 0.8,
      });
    }

    this.selectedCountry = layer;
    layer.setStyle({
      weight: 5,
      color: '#703AA3',
      dashArray: '',
      fillOpacity: 0.3,
    });

    if (!L.Browser.ie && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  private addCountriesMapLayer(): void {
    this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: dict
          .getItems<CountryDictionaryItem>()
          .map((item) => item.geoFeature)
          .filter((item) => null != item),
      };
      this.geojson = L.geoJSON(featureCollection, {
        style: () => {
          return {
            fillColor: '#8a66ad',
            fillOpacity: 0.1,
            color: '#1D3557',
            opacity: 0.8,
          };
        },
        onEachFeature: (feature, singleFeatureLayer: L.Layer) => {
          singleFeatureLayer.on({
            mouseover: () => {
              this.hoverHighlightFeature(singleFeatureLayer);
            },
            mouseout: () => {
              this.resetHighlight(singleFeatureLayer);
            },
            click: (e) => {
              this.quickMapsService.setCountryId(`${feature.properties.countryId}`);
              this.selectFeature(e.target);
              // console.debug('click event', e.target['feature']);
            },
          });
        },
      }).addTo(this.map);
      // L.map('map').setView(filterCountries(featureCollection))
    });
  }
}
