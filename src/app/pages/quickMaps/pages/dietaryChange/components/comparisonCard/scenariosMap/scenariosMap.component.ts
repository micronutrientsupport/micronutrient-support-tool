import { AfterViewInit, ElementRef, Input } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradient, ColourGradientObject } from 'src/app/pages/quickMaps/components/colourObjects/colourGradient';
import { ColourPalette } from 'src/app/pages/quickMaps/components/colourObjects/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/components/colourObjects/colourPaletteType.enum';

@Component({
  selector: 'app-scenarios-map',
  templateUrl: './scenariosMap.component.html',
  styleUrls: ['./scenariosMap.component.scss'],
})
export class ScenariosMapComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'scenarios-map-view';
  @ViewChild('baselineMap') baselineMapElement: ElementRef;
  @ViewChild('scenarioMap') scenarioMapElement: ElementRef;

  @Input() set data(data: SubRegionDataItem) {
    if (null != data) {
      this.baselineMapData = data;
      this.areaFeatureCollection = data.geoJson;
      this.initialiseMapBaseline(this.colourPalette);
    }
  }

  public baselineMapData: SubRegionDataItem;

  private baselineMap: L.Map;
  private scenarioMap: L.Map;
  private areaBounds: L.LatLngBounds;

  private baselineDataLayer: L.GeoJSON;
  private legend: L.Control;

  private areaFeatureCollection: GeoJSON.FeatureCollection;

  private allowBaselineMapEvents: boolean;
  private allowScenarioMapEvents: boolean;

  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;
  private baselineRange = [10, 50, 100, 250, 500, 1000, 1500];

  constructor() {
    this.colourPalette = ColourPalette.getSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(ScenariosMapComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
  }

  ngAfterViewInit(): void {
    this.baselineMap = this.initialiseBaselineMap(this.baselineMapElement.nativeElement);
    this.scenarioMap = this.initialiseScenarioMap(this.scenarioMapElement.nativeElement);
    this.initialiseListeners();
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
      mousedown: () => {
        this.allowBaselineMapEvents = true;
        this.allowScenarioMapEvents = false;
      },
      move: () => {
        if (this.allowBaselineMapEvents) {
          this.setMapPosition(this.baselineMap, this.scenarioMap);
        }
      },
      zoom: () => {
        this.setMapZoom(this.baselineMap, this.scenarioMap);
      },
    });
    this.scenarioMap.on({
      mousedown: () => {
        this.allowScenarioMapEvents = true;
        this.allowBaselineMapEvents = false;
      },
      move: () => {
        if (this.allowScenarioMapEvents) {
          this.setMapPosition(this.scenarioMap, this.baselineMap);
        }
      },
      zoom: () => {
        this.setMapZoom(this.scenarioMap, this.baselineMap);
      },
    });
  }

  private setMapPosition(baseMap: L.Map, targetMap: L.Map): void {
    if (targetMap.getCenter() !== baseMap.getCenter()) {
      targetMap.panTo(baseMap.getCenter());
    }
  }

  private setMapZoom(baseMap: L.Map, targetMap: L.Map): void {
    if (targetMap.getZoom() !== baseMap.getZoom()) {
      targetMap.setZoom(baseMap.getZoom());
    }
  }

  private initialiseMapBaseline(colourPalette: ColourPalette): void {
    if (null != this.baselineDataLayer) {
      this.baselineMap.removeLayer(this.baselineDataLayer);
    }
    if (null != this.legend) {
      this.baselineMap.removeControl(this.legend);
    }

    const baselineGradient = new ColourGradient(this.baselineRange, colourPalette);

    this.baselineDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      baselineGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.baselineMap);
    // console.debug('baseline', this.baselineDataLayer);

    this.refreshLegend(baselineGradient);
  }

  private refreshLegend(colourGradient: ColourGradient): void {
    if (null != this.legend) {
      this.scenarioMap.removeControl(this.legend);
    }

    this.legend = new L.Control({ position: 'bottomright' });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // loop through our  intervals and generate a label with a colored square for each interval
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

  private getTooltip(feature: GeoJSON.Feature): string {
    const props = this.getFeatProps(feature);
    return `
    <div>
      Region:<b>${props.subregion_name}</b><br/>
      Absolute value: ${props.mn_absolute}${props.mn_absolute_unit}<br/>
      Threshold: ${props.mn_threshold}${props.mn_threshold_unit}<br/>
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

  private getFeatProps(feat: GeoJSON.Feature): SubRegionDataItemFeatureProperties {
    return feat.properties as SubRegionDataItemFeatureProperties;
  }
}
