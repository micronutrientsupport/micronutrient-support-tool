import * as L from 'leaflet';
import { LeafletZoomToExtentControl } from './leafletZoomToExtentControl';

export class LeafletMapHelper {
  private map: L.Map;

  public createMap(mapElement: HTMLElement): this {
    this.map = L.map(mapElement, { zoomControl: false }).setView([6.6194073, 20.9367017], 3);
    return this;
  }

  public setDefaultBaseLayer(map?: L.Map): this {
    this.setMap(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    return this;
  }

  public setDefaultControls(getBoundsExtent: () => L.LatLngBoundsExpression, map?: L.Map): this {
    this.setMap(map);
    new LeafletZoomToExtentControl({
      position: 'topleft',
      getBoundsExtent: () => getBoundsExtent(),
    }).addTo(this.map);

    L.control.zoom({ position: 'topleft' }).addTo(this.map);
    return this;
  }

  public getMap(): L.Map {
    return this.map;
  }

  private setMap(map: L.Map): void {
    if (null != map) {
      this.map = map;
    }
    if (null == this.map) {
      throw new Error('No Leaflet Map object set.');
    }
  }
}
