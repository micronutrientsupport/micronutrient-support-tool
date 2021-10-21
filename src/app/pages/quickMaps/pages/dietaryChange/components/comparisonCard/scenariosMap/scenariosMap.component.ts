import { AfterViewInit, ElementRef, Input } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { DietaryChangeItem } from 'src/app/apiAndObjects/objects/dietaryChange.item';
import {
  FEATURE_TYPE,
  MnAvailibiltyItem,
  MnAvailibiltyItemFeatureProperties,
} from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradient, ColourGradientObject } from 'src/app/pages/quickMaps/components/colourObjects/colourGradient';
import { ColourPalette } from 'src/app/pages/quickMaps/components/colourObjects/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/components/colourObjects/colourPaletteType.enum';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { MapDownloadService } from 'src/app/services/mapDownload.service';
import { DietaryChangeService } from '../../../dietaryChange.service';

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
    if (null != data) {
      this.baselineMapData = data;
      this.areaFeatureCollection =
        // create featureCollection from data
        this.areaFeatureCollection = {
          type: 'FeatureCollection',
          features: data.map((item) => item.toFeature()),
        };
      this.initialiseMapBaseline(this.colourPalette);
    }
  }

  @Input() set scenarioData(data: SubRegionDataItem) {
    if (null != data) {
      this.scenarioMapData = data;
      this.initialiseMapScenario(this.colourPalette);
    }
  }

  @Input() set nutrient(nutrient: string) {
    if (null != nutrient) {
      this.downloadTitle = `${nutrient}-comparison-maps`;
    }
  }

  public baselineMapData: Array<MnAvailibiltyItem>;
  public scenarioMapData: SubRegionDataItem;

  public showSelectScenarioMessage = true;

  public downloadTitle = '';

  private baselineMap: L.Map;
  private scenarioMap: L.Map;
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry, MnAvailibiltyItemFeatureProperties>;

  private baselineDataLayer: L.GeoJSON;
  private scenarioDataLayer: L.GeoJSON;
  private legend: L.Control;

  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;
  private baselineRange = [10, 50, 100, 250, 500, 1000, 1500];
  private timeout: NodeJS.Timeout;

  private mapWrapperDiv: HTMLDivElement;

  constructor(
    private dialogService: DialogService,
    private dietaryChangeService: DietaryChangeService,
    private quickmapsService: QuickMapsService,
    private mapDownloadService: MapDownloadService,
  ) {
    this.colourPalette = ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
    this.dietaryChangeService.changeItemsObs.subscribe((items: Array<DietaryChangeItem>) => {
      this.showSelectScenarioMessage = items.length === 0 || null == items[0].scenarioValue ? true : false;
    });
  }

  public ngAfterViewInit(): void {
    this.baselineMap = this.initialiseBaselineMap(this.baselineMapElement.nativeElement);
    this.scenarioMap = this.initialiseScenarioMap(this.scenarioMapElement.nativeElement);
    this.initialiseListeners();
  }

  public openMapSettings(): void {
    void this.dialogService.openMapSettingsDialog(ScenariosMapComponent.COLOUR_PALETTE_ID).then(() => {
      this.colourPalette = ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID);
      if (null == this.colourPalette) {
        this.colourPalette = this.defaultPalette;
      }
      this.changeColourRamp(this.colourPalette);
    });
  }

  public exportMapAsImage(): void {
    this.mapWrapperDiv = document.getElementById('comparison-map-wrapper') as HTMLDivElement;
    this.mapDownloadService.captureElementAsImage(this.mapWrapperDiv, this.downloadTitle);
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

  private initialiseMapBaseline(colourPalette: ColourPalette): void {
    if (null != this.baselineDataLayer) {
      this.baselineMap.removeLayer(this.baselineDataLayer);
    }

    const gradient = new ColourGradient(this.baselineRange, colourPalette);

    this.baselineDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      gradient.getColour(feat.properties.dietarySupply),
    ).addTo(this.baselineMap);

    const bounds = this.baselineDataLayer.getBounds();
    if (bounds.isValid()) {
      this.baselineMap.fitBounds(this.baselineDataLayer.getBounds());
    }
  }

  private initialiseMapScenario(colourPalette: ColourPalette): void {
    if (null != this.scenarioDataLayer) {
      this.scenarioMap.removeLayer(this.scenarioDataLayer);
    }
    if (null != this.legend) {
      this.scenarioMap.removeControl(this.legend);
    }

    const gradient = new ColourGradient(this.baselineRange, colourPalette);

    this.scenarioDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      gradient.getColour(feat.properties.dietarySupply),
    ).addTo(this.scenarioMap);

    const bounds = this.scenarioDataLayer.getBounds();
    if (bounds.isValid()) {
      this.scenarioMap.fitBounds(this.scenarioDataLayer.getBounds());
    }
    this.refreshLegend(gradient);
  }

  private refreshLegend(colourGradient: ColourGradient): void {
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
      colourGradient.gradientObjects.forEach((gradObj: ColourGradientObject) => {
        let text = '';
        if (null == previousGradObj) {
          text = `0 - ${gradObj.lessThanTestValue}`;
        } else {
          text = `${previousGradObj.lessThanTestValue} - ${gradObj.lessThanTestValue}`;
        }
        addItemToHtml(gradObj.hexString, text);
        previousGradObj = gradObj;
      });
      addItemToHtml(colourGradient.moreThanHex, `>${previousGradObj.lessThanTestValue}mg`);

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

  private createGeoJsonLayer(featureColourFunc: (feature: FEATURE_TYPE) => string): L.GeoJSON {
    return L.geoJSON(this.areaFeatureCollection, {
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

  private changeColourRamp(colourPalette: ColourPalette): void {
    const colourGradient = new ColourGradient(this.baselineRange, colourPalette);

    this.baselineMap.removeLayer(this.baselineDataLayer);
    this.scenarioMap.removeLayer(this.scenarioDataLayer);

    if (null != this.legend) {
      this.scenarioMap.removeControl(this.legend);
    }

    this.baselineDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      colourGradient.getColour(feat.properties.dietarySupply),
    ).addTo(this.baselineMap);

    this.scenarioDataLayer = this.createGeoJsonLayer((feat: FEATURE_TYPE) =>
      colourGradient.getColour(feat.properties.dietarySupply),
    ).addTo(this.scenarioMap);

    this.refreshLegend(colourGradient);
  }
}
