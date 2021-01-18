/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpClient } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import * as L from 'leaflet';
import { features } from 'process';
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

  public selectedCountry;

  constructor(
    private http: HttpClient,
    public quickMapsService: QuickMapsService,
    public dictionaryService: DictionaryService,
  ) {
    quickMapsService.countryIdObs.subscribe((countryId: string) => {
      this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
        const country = dict.getItem<CountryDictionaryItem>(countryId);
        if (null != country && null != country.geoFeature) {
          // this.map.fitBounds(country.geoFeature.geometry);
          this.selectFeature(country.geoFeature);
        }
      });
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initialiseMap();
  }

  private initialiseMap(): void {
    this.map = L.map('map').setView([6.6194073, 20.9367017], 3).setMaxZoom(8).setMinZoom(3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.addCountriesMapLayer();
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
        color: '#666',
        dashArray: '',
        fillOpacity: 0.3,
      });

      if (!L.Browser.ie && !L.Browser.edge) {
        layer.bringToFront();
      }
    }
  }
  private selectFeature(country: any): void {
    if (null != this.geojson) {
      this.geojson.eachLayer((layer: L.Layer) => {
        if (layer['feature']['geometry'] === country) {
          // layer.setStyle({
          //   weight: 5,
          //   color: '#008000',
          //   dashArray: '',
          //   fillOpacity: 0.3,
          // });
        }
      });
    }
    // if (null != layer['feature'] && null != feature) {
    //   if (layer['feature']['geometry']['properties']['countryId'] === countryId) {
    //     if (null != this.selectedCountry) {
    //       this.selectedCountry.setStyle({
    //         fillColor: '#8a66ad',
    //         fillOpacity: 0.1,
    //         color: '#3a1d54',
    //         opacity: 0.8,
    //       });
    //     }

    //     this.selectedCountry = feature;
    //     feature.setStyle({
    //       weight: 5,
    //       color: '#008000',
    //       dashArray: '',
    //       fillOpacity: 0.3,
    //     });

    //     if (!L.Browser.ie && !L.Browser.edge) {
    //       feature.bringToFront();
    //     }
    //   }
    // }

    // console.debug(feature);
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
            color: '#3a1d54',
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
              // this.selectFeature(e.target);
            },
          });
        },
      }).addTo(this.map);
      // L.map('map').setView(filterCountries(featureCollection))
    });
  }
}
