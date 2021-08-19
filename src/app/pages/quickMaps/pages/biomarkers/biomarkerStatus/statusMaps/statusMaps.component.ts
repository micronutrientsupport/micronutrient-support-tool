import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { SubRegionDataItemFeatureProperties } from 'src/app/apiAndObjects/objects/subRegionDataItemFeatureProperties.interface';
import { LeafletMapHelper } from 'src/app/other/leafletMapHelper';
import { UnknownLeafletFeatureLayerClass } from 'src/app/other/unknownLeafletFeatureLayerClass.interface';
import { ColourGradient, ColourGradientObject } from 'src/app/pages/quickMaps/components/colourObjects/colourGradient';
import { ColourPalette } from 'src/app/pages/quickMaps/components/colourObjects/colourPalette';
import { ColourPaletteType } from 'src/app/pages/quickMaps/components/colourObjects/colourPaletteType.enum';
import { BiomarkerService } from '../../biomarker.service';
import { BiomarkerDataType } from '../biomarkerStatus.component';

@Component({
  selector: 'app-status-maps',
  templateUrl: './statusMaps.component.html',
  styleUrls: ['./statusMaps.component.scss'],
})
export class StatusMapsComponent implements AfterViewInit {
  public static readonly COLOUR_PALETTE_ID = 'biomarker-map-view';
  @ViewChild('map') mapElement: ElementRef;

  @Input() set biomarkerData(data: SubRegionDataItem) {
    if (null != data) {
      this.biomarkerMapData = data;
      this.areaFeatureCollection = data.geoJson;
      this.initialiseMapLayers(this.colourPalette);
    }
  }

  @Input() set selectedDataType(dataType: BiomarkerDataType) {
    if (null != dataType) {
      // set map with new data type.
    }
  }

  public biomarkerMapData: SubRegionDataItem;

  private biomakerMap: L.Map;
  private biomarkerDataLayer: L.GeoJSON;
  private range = [10, 50, 100, 250, 500, 1000, 1500];
  private legend: L.Control;
  private areaBounds: L.LatLngBounds;
  private areaFeatureCollection: GeoJSON.FeatureCollection;

  private defaultPalette = ColourPalette.PALETTES.find(
    (value: ColourPalette) => value.name === ColourPaletteType.BLUEREDYELLOWGREEN,
  );
  private colourPalette: ColourPalette;

  constructor(private biomarkerService: BiomarkerService) {
    this.colourPalette = ColourPalette.getSelectedPalette(StatusMapsComponent.COLOUR_PALETTE_ID);
    if (null == this.colourPalette) {
      ColourPalette.setSelectedPalette(StatusMapsComponent.COLOUR_PALETTE_ID, this.defaultPalette);
      this.colourPalette = this.defaultPalette;
    }
    this.biomarkerService.changeColourRampObservable.subscribe(() => {
      this.colourPalette = ColourPalette.getSelectedPalette(StatusMapsComponent.COLOUR_PALETTE_ID);
      if (null == this.colourPalette) {
        this.colourPalette = this.defaultPalette;
      }
      this.changeColourRamp(this.colourPalette);
    });
  }

  ngAfterViewInit(): void {
    this.biomakerMap = this.initialiseMap(this.mapElement.nativeElement);
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    return new LeafletMapHelper()
      .createMap(mapElement)
      .setDefaultBaseLayer()
      .setDefaultControls(() => this.areaBounds)
      .getMap();
  }

  private initialiseMapLayers(colourPalette: ColourPalette): void {
    if (null != this.biomarkerDataLayer) {
      this.biomakerMap.removeLayer(this.biomarkerDataLayer);
    }

    const gradient = new ColourGradient(this.range, colourPalette);

    this.biomarkerDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      gradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.biomakerMap);

    // Take it out of the loop, map fits bounds of target country on refresh.
    setTimeout(() => {
      this.biomakerMap.fitBounds(this.biomarkerDataLayer.getBounds());
    }, 200);

    this.refreshLegend(gradient);
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

  private refreshLegend(colourGradient: ColourGradient): void {
    if (null != this.legend) {
      this.biomakerMap.removeControl(this.legend);
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
    // this.setBounds();
    this.legend.addTo(this.biomakerMap);
  }

  private changeColourRamp(colourPalette: ColourPalette): void {
    const colourGradient = new ColourGradient(this.range, colourPalette);

    this.biomakerMap.removeLayer(this.biomarkerDataLayer);

    if (null != this.legend) {
      this.biomakerMap.removeControl(this.legend);
    }

    this.biomarkerDataLayer = this.createGeoJsonLayer((feat: GeoJSON.Feature) =>
      colourGradient.getColour(this.getFeatProps(feat).mn_absolute),
    ).addTo(this.biomakerMap);

    this.refreshLegend(colourGradient);
  }
}
