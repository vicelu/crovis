import { AfterViewInit, Component } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Deck, FlyToInterpolator } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';
import { DataModel } from '../shared/data.model';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

mapboxgl.accessToken = environment.mapbox.accessToken;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements AfterViewInit {

  constructor(
      public dataService: DataService
  ) {}

  private deck = undefined;
  private map = undefined;
  private INITIAL_VIEW_STATE = {
    latitude: 44.604127,  // Drnić, Bosanski petrovac, BiH, centar Hrvatske
    longitude:	16.246978,
    zoom: 6.2
  };
  private M = [0, 0, 255];
  private Ž = [255, 0, 0];
  private MAX_CASES = 0;
  private MIN_CASES = Infinity;

  private static generateColorFromActiveCases(high, low, activeCases) {
    const range = high - low;
    const r = 255 * (activeCases / range);
    const b = 255 * (1 - (activeCases / range));
    return [r, 0, b];
  }

  ngAfterViewInit(): void {
    // DeckGL canvas
    this.deck = new Deck({
      canvas: 'deck-canvas',
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true, // Flick this to true to add interactivity
      onViewStateChange: ({viewState}) => {
        this.map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch
        });
      },
    });

    // Mapbox map canvas
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/pericakeksic/ckflml7nj0e4k19nt2b2oxsiy',
      center: [this.INITIAL_VIEW_STATE.longitude, this.INITIAL_VIEW_STATE.latitude],
      zoom: this.INITIAL_VIEW_STATE.zoom,
      interactive: true,
    });

    this.map.once('data', () => {
        this.sexySmoothEaseInMap();
      });

    this.dataService.getAllData().subscribe(res => {
        DataModel.fillModel(res);
        DataModel.data.po_danima_zupanijama_zadnji[0].PodaciDetaljno.forEach(zupanija => {
          if (zupanija.broj_aktivni > this.MAX_CASES) {
            this.MAX_CASES = zupanija.broj_aktivni;
          } else if (zupanija.broj_aktivni < this.MIN_CASES) {
            this.MIN_CASES = zupanija.broj_aktivni;
          }
        });
        DataModel.data.zupanije_geo_json.features.forEach(feature => {
          const zadnjiPodaciZupanija = DataModel.data.po_danima_zupanijama_zadnji[0].PodaciDetaljno
              .find(podaci => podaci.Zupanija === feature.properties.name);
          if (!!zadnjiPodaciZupanija) {
            feature.properties[`color`] = VisualizationComponent.generateColorFromActiveCases(
                this.MAX_CASES, this.MIN_CASES, zadnjiPodaciZupanija.broj_aktivni);
          }
      });
        setTimeout(this.renderLayers.bind(this), 1500);
      });
  }

  public renderLayers() {
    const layers = [];
    // const scatterplotLayer = new ScatterplotLayer({
    //   data: DataModel.data.po_osobama,
    //   // getPosition: d => {
    //   //   return d.Zupanija
    //   // },
    //   getFillColor: d => {
    //     if (d.spol === Spol.M) {
    //       return this.M;
    //     } else { return this.Ž; }
    //   },
    //   getRadius: d => d.radius
    // });
    // layers.push(scatterplotLayer);

    const zupanijeGeoJsonLayer = new GeoJsonLayer({
      id: 'geojson-layer',
      data: DataModel.data.zupanije_geo_json,
      pickable: true,
      filled: true,
      opacity: 0.8,
      getFillColor: d => d.properties.color,
      autoHighlight: true
    });
    layers.push(zupanijeGeoJsonLayer);
    this.deck.setProps({layers});
  }

  private sexySmoothEaseInMap() {
      requestAnimationFrame(() => {
          this.deck.setProps({viewState: {
            longitude: this.INITIAL_VIEW_STATE.longitude,
            latitude: this.INITIAL_VIEW_STATE.latitude,
            zoom: this.INITIAL_VIEW_STATE.zoom + 0.5,
            pitch: 15,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator()
          }});
      });
  }
}
