/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Component,
  AfterViewInit,
  Input,
  OnDestroy,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../../quickMaps.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<GridsterItem>;

  public boundaryGeojson: L.GeoJSON;
  public boundaryLayer: any;
  public countryName = '';
  private resizeSub: Subscription;
  private mapView1: L.Map;
  private mapView2: L.Map;

  constructor(
    private http: HttpClient,
    private modalService: DialogService,
    private dictionaryService: DictionaryService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log(widget);
        if (this.mapView1) {
          this.mapView1.invalidateSize();
        }
        if (this.mapView2) {
          this.mapView2.invalidateSize();
        }
      }
    });

    void this.dictionaryService
      .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS])
      .then((dicts: Array<Dictionary>) => {
        const countriesDict = dicts.shift();
        // const regionDictionary = dicts.shift();

        // temporarily feed country name form here, but when this component runs off live
        // data this will probably be re-worked.
        this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
          const country = countriesDict.getItem(countryId);
          this.countryName = (null != country) ? country.name : '';
          // seems to need kicking :-(
          this.cdr.detectChanges();
        });
      });
  }

  ngAfterViewInit(): void {
    // fails to find element if not taked out of flow
    setTimeout(() => {
      this.mapView1 = this.initialiseMap('mapView1');
    }, 0);
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // Map container doesn't exist until tab changed...
    if (tabChangeEvent.index === 1 && !this.mapView2) {
      this.mapView2 = this.initialiseMap('mapView2');
    } else {
      this.mapView2.invalidateSize();
      this.mapView1.invalidateSize();
    }
  }

  public initialiseMap(mapId: string): L.Map {
    let map: L.Map;
    map = L.map(mapId, {}).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    this.http.get('./assets/geoJSON/malawi-admin-boundaries.json').subscribe((data: any) => {
      const layerStyle = {
        color: '#703aa3',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.1,
      };

      const props = {
        style: layerStyle,
        onEachFeature: (feature: any, layer: any) => {
          // console.log(feature, layer);
          const layerName = feature.properties.NAME_1;
          const layerCentre = layer.getBounds().getCenter();

          const popup = L.popup().setLatLng(layerCentre).setContent(`<div>${layerName}</div>`);

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

  public openDialog(): void {
    void this.modalService.openMapDialog('Hello World');
  }
}
