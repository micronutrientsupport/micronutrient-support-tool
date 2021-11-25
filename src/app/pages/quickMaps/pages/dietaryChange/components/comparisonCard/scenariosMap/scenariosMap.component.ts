import { AfterViewInit, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import {
  FEATURE_TYPE,
  MnAvailibiltyItem,
  MnAvailibiltyItemFeatureProperties,
} from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradient, ColourGradientObject } from 'src/app/pages/quickMaps/components/colourObjects/colourGradient';
import { ColourPalette } from 'src/app/pages/quickMaps/components/colourObjects/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/components/colourObjects/colourPaletteType.enum';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { MapDownloadService } from 'src/app/services/mapDownload.service';
import { DietaryChangeService } from '../../../dietaryChange.service';

type FEATURE_COLLECTION_TYPE = GeoJSON.FeatureCollection<GeoJSON.Geometry, MnAvailibiltyItemFeatureProperties>;

@Component({
  selector: 'app-scenarios-map',
  templateUrl: './scenariosMap.component.html',
  styleUrls: ['./scenariosMap.component.scss'],
})
export class ScenariosMapComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'scenarios-map-view';
  @ViewChild('baselineMap') baselineMapElement: ElementRef;
  @ViewChild('scenarioMap') scenarioMapElement: ElementRef;

  @Input() set baselineData(data: Array<MnAvailibiltyItem>) {
    // create featureCollection from data
    this.baselineFeatureCollection =
      null == data
        ? null
        : {
            type: 'FeatureCollection',
            features: data.map((item) => item.toFeature()),
          };
    this.refreshBaselineLayer(true);
  }

  @Input() set binRange(range: number[]) {
    this.baselineRange = range;
    this.setColorGradient(ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID));
    this.refreshLegend();
  }

  @Input() set scenarioData(data: Array<MnAvailibiltyItem>) {
    // create featureCollection from data
    this.scenarioFeatureCollection =
      null == data
        ? null
        : {
            type: 'FeatureCollection',
            features: data.map((item) => item.toFeature()),
          };
    this.refreshScenarioLayer(false);
  }
  public baselineMapData: Array<MnAvailibiltyItem>;

  public scenarioFeatureCollection: FEATURE_COLLECTION_TYPE;
  private baselineFeatureCollection: FEATURE_COLLECTION_TYPE;

  private baselineMap: L.Map;
  private scenarioMap: L.Map;
  private areaBounds: L.LatLngBounds;

  private baselineDataLayer: L.GeoJSON;
  private scenarioDataLayer: L.GeoJSON;
  private legend: L.Control;

  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourGradient: ColourGradient;
  private baselineRange = [10, 50, 100, 250, 500, 1000, 1500];
  private mapWrapperDiv: HTMLDivElement;
  private timeout: NodeJS.Timeout;
  private subscriptions = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private mapDownloadService: MapDownloadService,
    private quickMapsService: QuickMapsService,
    private dietaryChangeService: DietaryChangeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.setColorGradient(ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID));
  }

  public ngAfterViewInit(): void {
    // Subscribes to scenario mode change event and resets scenario map.
    this.subscriptions.push(
      this.dietaryChangeService.mode.obs.subscribe(() => {
        this.scenarioFeatureCollection = null;
        this.refreshScenarioLayer(false);
        this.cdr.markForCheck();
      }),
    );
    this.baselineMap = this.initialiseBaselineMap(this.baselineMapElement.nativeElement);
    this.scenarioMap = this.initialiseScenarioMap(this.scenarioMapElement.nativeElement);
    // give the map a moment, otherwise the bounds setting doesn't work
    setTimeout(() => {
      this.refreshAllMapContent(true);
    }, 1000);
    this.initialiseListeners();
  }

  public openMapSettings(): void {
    void this.dialogService.openMapSettingsDialog(ScenariosMapComponent.COLOUR_PALETTE_ID).then(() => {
      this.setColorGradient(ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID));
      this.refreshAllMapContent(false);
    });
  }

  public exportMapAsImage(): void {
    this.mapWrapperDiv = document.getElementById('comparison-map-wrapper') as HTMLDivElement;
    this.mapDownloadService.captureElementAsImage(
      this.mapWrapperDiv,
      `${this.quickMapsService.micronutrient.get()?.name}-comparison-maps`,
    );
  }

  private initialiseBaselineMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private initialiseScenarioMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper().createMap(mapElement).setDefaultBaseLayer().getMap();
  }

  private initialiseListeners(): void {
    this.baselineMap.on({
      move: () => {
        this.alignMaps(this.baselineMap, this.scenarioMap);
      },
    });
    this.scenarioMap.on({
      move: () => {
        this.alignMaps(this.scenarioMap, this.baselineMap);
      },
    });
  }

  private alignMaps(activatedMap: L.Map, mirroredMap: L.Map): void {
    mirroredMap.setView(activatedMap.getCenter(), activatedMap.getZoom(), { animate: false });
    // wait for inactivity before triggering map check to assure they are aligned
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (activatedMap.getBounds() !== mirroredMap.getBounds() || activatedMap.getZoom() !== mirroredMap.getZoom()) {
        mirroredMap.setView(activatedMap.getCenter(), activatedMap.getZoom(), { animate: false });
      }
    }, 50);
  }

  private refreshAllMapContent(resetBounds: boolean): void {
    this.refreshLegend();
    this.refreshBaselineLayer(resetBounds);
    this.refreshScenarioLayer(resetBounds);
  }

  private refreshBaselineLayer(resetBounds: boolean): void {
    this.refreshLayer(this.baselineMap, this.baselineDataLayer, this.baselineFeatureCollection, resetBounds, 'base');
  }

  private refreshScenarioLayer(resetBounds: boolean): void {
    this.refreshLayer(
      this.scenarioMap,
      this.scenarioDataLayer,
      this.scenarioFeatureCollection,
      resetBounds,
      'scenario',
    );
  }

  private refreshLayer(
    map: L.Map,
    previousLayer: L.GeoJSON,
    featureCollection: FEATURE_COLLECTION_TYPE,
    resetBounds: boolean,
    type: string,
  ): void {
    let newLayer: L.GeoJSON;
    if (null != map) {
      if (null != previousLayer) {
        map.removeLayer(previousLayer);
      }
      newLayer = this.createGeoJsonLayer(featureCollection, (feat: FEATURE_TYPE) =>
        this.colourGradient.getColour(feat.properties.dietarySupply),
      ).addTo(map);

      if (type === 'base') {
        this.baselineDataLayer = newLayer;
      } else {
        this.scenarioDataLayer = newLayer;
      }

      if (resetBounds) {
        const bounds = newLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(newLayer.getBounds());
        }
      }
    }
  }

  private refreshLegend(): void {
    if (null != this.legend) {
      this.scenarioMap.removeControl(this.legend);
    }

    this.legend = new L.Control({ position: 'bottomright' });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our intervals and generate a label with a colored square for each interval
      const addItemToHtml = (colourHex: string, text: string) => {
        div.innerHTML += `<span style="display: flex; align-items: center;">
        <span style="background-color:
        ${colourHex};
        height:10px; width:10px; display:block; margin-right:5px;">
        </span><span>${text}</span>`;
      };

      let previousGradObj: ColourGradientObject;
      this.colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject) => {
        let text = '';
        if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }
        addItemToHtml(gradObj.hexString, text);
        previousGradObj = gradObj;
      });
      addItemToHtml(this.colourGradient.moreThanHex, `>${previousGradObj.lessThanTestValue}mg`);

      return div;
    };
    this.legend.addTo(this.scenarioMap);
  }

  private getTooltip(feature: FEATURE_TYPE): string {
    const props = feature.properties;
    return `
    <div>
      ${props.areaType}:<b>${props.areaName}</b><br/>
      Absolute value: ${props.dietarySupply}${props.unit}<br/>
      Threshold: ${props.deficientPercentage}%<br/>
    </div>`;
  }

  private createGeoJsonLayer(featureCollection, featureColourFunc: (feature: FEATURE_TYPE) => string): L.GeoJSON {
    return L.geoJSON(featureCollection, {
      style: (feature) => ({
        fillColor: featureColourFunc(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }),
      onEachFeature: (feature: FEATURE_TYPE, layer: UnknownLeafletFeatureLayerClass) => {
        layer.bindTooltip(this.getTooltip(feature));
      },
    });
  }

  private setColorGradient(colourPalette: ColourPalette): void {
    this.colourGradient = new ColourGradient(this.baselineRange, colourPalette ?? this.defaultPalette);
  }
}
