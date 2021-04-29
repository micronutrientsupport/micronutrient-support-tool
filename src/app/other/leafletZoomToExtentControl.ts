import * as L from 'leaflet';

export interface ZoomToExtentOptions extends L.ControlOptions {
  getBoundsExtent: () => L.LatLngBoundsExpression;
  getBoundsOptions?: () => L.FitBoundsOptions;
  title?: string;
  className?: string;
}

export class LeafletZoomToExtentControl extends L.Control {
  public options: ZoomToExtentOptions;
  protected _map: L.Map;

  private defaultOptions: ZoomToExtentOptions = {
    position: 'topleft',
    title: 'Zoom to extent',
    className: 'leaflet-control-zoom-to-extent',
    getBoundsExtent: () => null,
    getBoundsOptions: () => null,
  };

  constructor(options: ZoomToExtentOptions) {
    super(options);
    L.Util.setOptions(this, this.defaultOptions);
    L.Util.setOptions(this, options);
  }

  public onAdd(map: L.Map): HTMLElement {
    this._map = map;
    const container = L.DomUtil.create('div');
    container.classList.add(this.options.className, 'leaflet-bar', 'leaflet-control');
    container.style.display = 'grid';
    container.style.placeItems = 'center';
    L.DomEvent.disableClickPropagation(container);

    const button = L.DomUtil.create('a');
    button.innerHTML = '<i class="fas fa-home"></i>';
    button.style.fontSize = '18px';
    button.classList.add('leaflet-control-zoom-to-extent');
    button.title = 'Zoom to extent';
    button.setAttribute('href', '#');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Zoom to extent');
    L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', () => this.zoomToExtent());

    container.append(button);

    return container;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onRemove(map: L.Map): void {
    // Nothing to do here
  }

  private zoomToExtent() {
    const bounds = this.options.getBoundsExtent();
    const options = this.options.getBoundsOptions();
    if (null != this._map && null != bounds) {
      this._map.fitBounds(bounds, options);
    }
  }
}
