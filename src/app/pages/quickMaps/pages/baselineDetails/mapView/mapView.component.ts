/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Component,
  Input,
  Optional,
  Inject,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import * as L from 'leaflet';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-map-view',
  templateUrl: './mapView.component.html',
  styleUrls: [
    '../../expandableTabGroup.scss',
    './mapView.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('map1') map1Element: ElementRef;
  @ViewChild('map2') map2Element: ElementRef;
  @Input() card: CardComponent;

  public menuTrigger: MatMenuTrigger;
  public title = '';
  private data: Array<SubRegionDataItem>;

  private absoluteMap: L.Map;
  private absoluteDataLayer: L.GeoJSON;
  private absoluteLegend: L.Control;
  private absoluteLegendTwo: L.Control;

  private thresholdMap: L.Map;
  private thresholdDataLayer: L.GeoJSON;
  private thresholdLegend: L.Control;

  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  private tabVisited = new Map<number, boolean>();

  constructor(
    private dialogService: DialogService,
    private dictionaryService: DictionaryService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private currentDataService: CurrentDataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MapViewDialogData>,
  ) { }

  ngAfterViewInit(): void {
    this.absoluteMap = this.initialiseMap(this.map1Element.nativeElement);
    this.thresholdMap = this.initialiseMap(this.map2Element.nativeElement);

    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.showExpand = true;
      this.card.showSettings = true;
      this.card
        .setLoadingObservable(this.loadingSrc.asObservable())
        .setErrorObservable(this.errorSrc.asObservable());

      this.card.onSettingsClickObs.subscribe(() => {
        this.dialogService.openMapSettingsDialog('#354969')
          .then((data: DialogData) => {
            // this.
            console.debug('dataout', data.dataOut);
          })
      });

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog())
      );
      this.subscriptions.push(
        this.card.onResizeObs.subscribe(() => {
          this.absoluteMap.invalidateSize();
          this.thresholdMap.invalidateSize();
        }),
      );

      void this.dictionaryService
        .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.REGIONS])
        .then((dicts: Array<Dictionary>) => {
          const countriesDict = dicts.shift();
          // const regionDictionary = dicts.shift();

          this.quickMapsService.countryIdObs.subscribe((countryId: string) => {
            const country = countriesDict.getItem(countryId);
            this.title = 'Map View' + (null == country ? '' : ` - ${country.name}`);
            if (null != this.card) {
              this.card.title = this.title;
            }
            // this.cdr.detectChanges();
          });
        });

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(
            this.currentDataService.getSubRegionData(
              this.quickMapsService.countryId,
              [this.quickMapsService.micronutrientId],
              this.quickMapsService.popGroupId,
              this.quickMapsService.mndDataId,
            ),
          );
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.title = this.dialogData.dataIn.title;
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.absoluteMap.invalidateSize();
        break;
      case 1:
        this.thresholdMap.invalidateSize();
        break;
    }
    if (!this.tabVisited.has(tabChangeEvent.index)) {
      this.triggerFitBounds(tabChangeEvent.index);
    }
  }

  private init(dataPromise: Promise<Array<SubRegionDataItem>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<SubRegionDataItem>) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.errorSrc.next(false);
        this.populateFeatureCollection(data);
        this.initialiseMapAbsolute();
        this.initialiseMapThreshold();
        this.areaBounds = this.absoluteDataLayer.getBounds();
        // reset visited
        this.tabVisited.clear();
        // trigger current fit bounds
        // seems to need a small delay after page navigation to projections and back to baseline
        setTimeout(() => {
          this.triggerFitBounds(this.tabGroup.selectedIndex);
        }, 0);
      })
      .catch((err) => {
        this.errorSrc.next(true);
        console.error(err);
      })
      .finally(() => {
        this.loadingSrc.next(false);
        // this.cdr.detectChanges();
      });
  }

  clickEvent() {
    this.absoluteMap.removeLayer(this.absoluteDataLayer);
    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) => {
      return this.getColourAbsoluteTwo(feat.properties.mnAbsolute);
    }).addTo(this.absoluteMap);
    const absoluteLegendTwo = new L.Control({ position: 'bottomright' });
  }

  clickEvent2() {
    this.absoluteMap.removeLayer(this.absoluteDataLayer);
    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) => {
      return this.getColourAbsolute(feat.properties.mnAbsolute);
    }).addTo(this.absoluteMap);
  }
  private triggerFitBounds(index: number): void {
    this.tabVisited.set(index, true);
    switch (index) {
      case 0:
        this.absoluteMap.fitBounds(this.areaBounds);
        break;
      case 1:
        this.thresholdMap.fitBounds(this.areaBounds);
        break;
    }
  }

  private getTooltip(feature: GeoJSON.Feature): string {
    return `
    <div>
      Region:<b>${feature.properties.subRegionName}</b><br/>
      Absolute value:${feature.properties.mnAbsolute}mg<br/>
      Threshold: ${feature.properties.mnThreshold}%<br/>
    </div>`;
  }

  private createGeoJsonLayer(featureColourFunc: (feature: GeoJSON.Feature) => string): L.GeoJSON {
    return L.geoJSON(this.areaFeatureCollection, {
      style: (feature) => ({
        fillColor: featureColourFunc(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }),
      onEachFeature: (feature: GeoJSON.Feature, layer: UnknownLeafletFeatureLayerClass) => {
        layer.bindTooltip(this.getTooltip(feature));
      },
    });
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    const map = L.map(mapElement, {}).setView([6.6194073, 20.9367017], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  }

  private initialiseMapAbsolute(): void {
    if (null != this.absoluteDataLayer) {
      this.absoluteMap.removeLayer(this.absoluteDataLayer);
    }
    if (null != this.absoluteLegend) {
      this.absoluteMap.removeControl(this.absoluteLegend);
    }

    // eslint-disable-next-line arrow-body-style

    this.absoluteDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) => {
      return this.getColourAbsolute(feat.properties.mnAbsolute);
    }).addTo(this.absoluteMap);

    this.absoluteLegend = new L.Control({ position: 'bottomright' });

    this.absoluteLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const range = [0, 10, 50, 100, 250, 500, 1000, 1500];

      // loop through our  intervals and generate a label with a colored square for each interval
      range.forEach((value: number, i) => {
        div.innerHTML +=
          `<span style="display: flex; align-items: center;">
          <span style="background-color:${this.getColourAbsolute(
            value + 1,
          )}; height:10px; width:10px; display:block; margin-right:5px;">
          </span>` +
          `<span>${range[i + 1] ? value : '>1500'}${range[i + 1] ? ' - ' + range[i + 1].toString() : ''}</span>` +
          '</span>';
      });

      return div;
    };

    this.absoluteLegend.addTo(this.absoluteMap);
  }

  private initialiseMapThreshold(): void {
    if (null != this.thresholdDataLayer) {
      this.thresholdMap.removeLayer(this.thresholdDataLayer);
    }
    if (null != this.thresholdLegend) {
      this.thresholdMap.removeControl(this.thresholdLegend);
    }

    // eslint-disable-next-line arrow-body-style
    this.thresholdDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) => {
      return this.getColourThreshold(feat.properties.mnThreshold);
    }).addTo(this.thresholdMap);

    this.thresholdLegend = new L.Control({ position: 'bottomright' });

    this.thresholdLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const range = [0, 20, 40, 60, 80, 99];

      // loop through our  intervals and generate a label with a colored square for each interval
      range.forEach((value: number, i) => {
        div.innerHTML +=
          `<span style="display: flex; align-items: center;">
            <span style="background-color:${this.getColourThreshold(
            value + 1,
          )}; height:10px; width:10px; display:block; margin-right:5px;">
            </span>` +
          `<span>${range[i + 1] ? value : '>99%'}${range[i + 1] ? ' - ' + range[i + 1].toString() : ''}</span>` +
          '</span>';
      });

      return div;
    };

    this.thresholdLegend.addTo(this.thresholdMap);
  }

  private populateFeatureCollection(data: Array<SubRegionDataItem>): void {
    this.areaFeatureCollection = {
      type: 'FeatureCollection',
      features: data.map((item: SubRegionDataItem) => item.geoFeature).filter((item) => null != item),
    };
  }

  private getColourAbsolute(absoluteValue: number): string {
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
  private getColourAbsoluteTwo(absoluteValue: number): string {
    return absoluteValue > 1500
      ? '#845EF9'
      : absoluteValue > 1000
        ? '#845EC2'
        : absoluteValue > 500
          ? '#0081CF'
          : absoluteValue > 250
            ? '#0089BA'
            : absoluteValue > 100
              ? '#008E9B'
              : absoluteValue > 50
                ? '#008F7A'
                : absoluteValue > 10
                  ? '#00C9A7'
                  : '#C4FCEF';
  }
  private getColourThreshold(thresholdValue: number): string {
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

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<MapViewDialogData>(MapViewComponent, {
      title: this.title,
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface MapViewDialogData {
  title: string;
  data: Array<SubRegionDataItem>;
  selectedTab: number;
}
