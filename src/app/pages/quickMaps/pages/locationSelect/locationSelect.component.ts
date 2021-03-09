import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import * as L from 'leaflet';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
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

  public selectedFeatureLayer: UnknownLeafletFeatureLayerClass;
  public hoverFeatureLayer: UnknownLeafletFeatureLayerClass;

  constructor(
    public quickMapsService: QuickMapsService,
    public dictionaryService: DictionaryService,
  ) {
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // fails to find element if not taked out of flow
    setTimeout(() => {
      void this.initialiseMap().then(() => {
        this.quickMapsService.countryObs.subscribe(country => this.selectFeature(this.getLayer(country)));
      });
    }, 0);
  }

  public getLayer(country: CountryDictionaryItem): UnknownLeafletFeatureLayerClass {
    let countryLayer: UnknownLeafletFeatureLayerClass;
    if ((null != this.geojson) && (null != country)) {
      this.geojson.eachLayer((layer: UnknownLeafletFeatureLayerClass) => {
        // tslint:disable-next-line: no-string-literal
        if ((null == countryLayer) && (layer.feature.id === country.id)) {
          countryLayer = layer;
        }
      });
    }
    return countryLayer;
  }

  private initialiseMap(): Promise<void> {
    this.map = L.map('map').setView([6.6194073, 20.9367017], 3).setMaxZoom(8).setMinZoom(3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    return this.addCountriesMapLayer().then(() => this.selectFeature(this.selectedFeatureLayer));

  }

  private resetHighlight(layer: L.Layer): void {
    if (layer !== this.selectedFeatureLayer) {
      this.geojson.resetStyle(layer);
    }
  }

  private hoverHighlightFeature(layer: UnknownLeafletFeatureLayerClass): void {
    // const layer = this.getLayer(country.id);
    if (layer !== this.selectedFeatureLayer) {
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

  private selectFeature(layer: UnknownLeafletFeatureLayerClass): void {
    // resets previous selected feature's style
    if (null != this.selectedFeatureLayer) {
      this.geojson.resetStyle(this.selectedFeatureLayer);
    }

    this.selectedFeatureLayer = layer;
    if (null != this.selectedFeatureLayer) {
      console.log('layer type', this.selectedFeatureLayer);
      this.selectedFeatureLayer.setStyle({
        weight: 5,
        color: '#703AA3',
        dashArray: '',
        fillOpacity: 0.3,
      });

      if (!L.Browser.ie && !L.Browser.edge) {
        this.selectedFeatureLayer.bringToFront();
      }
    }
  }

  private addCountriesMapLayer(): Promise<void> {
    return this.dictionaryService.getDictionary(DictionaryType.COUNTRIES).then((dict: Dictionary) => {
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: dict
          .getItems<CountryDictionaryItem>()
          .map((item) => item.geoFeature)
          .filter((item) => null != item),
      };
      this.geojson = L.geoJSON(featureCollection, {
        style: () => ({
          fillColor: '#8a66ad',
          fillOpacity: 0.1,
          color: '#1D3557',
          opacity: 0.8,
        }),
        onEachFeature: (feature: GeoJSON.Feature, singleFeatureLayer: UnknownLeafletFeatureLayerClass) => {
          singleFeatureLayer.on({
            mouseover: () => {
              this.hoverHighlightFeature(singleFeatureLayer);
            },
            mouseout: () => {
              this.resetHighlight(singleFeatureLayer);
            },
            click: () => {
              this.quickMapsService.setCountry(dict.getItem(String(feature.id).valueOf()));
            },
          });
        },
      }).addTo(this.map);
    });
  }
}
