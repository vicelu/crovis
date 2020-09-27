import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Deck, FlyToInterpolator } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { DataModel } from '../shared/data.model';
import { Spol } from '../shared/models/po-osobama';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
mapboxgl.accessToken = environment.mapbox.accessToken;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements AfterViewInit {

  private deck = undefined;
  private map = undefined;
  private INITIAL_VIEW_STATE = {
    latitude: 44.830871,  // Oštra Luka BiH, centar Hrvatske
    longitude:	16.693624,
    zoom: 6
  };
  private M = [0, 0, 255];
  private Ž = [255, 0, 0];

  constructor(
      public dataService: DataService
  ) {}

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
      interactive: false,
    });

    this.map.once('data', () => {
        this.sexySmoothEaseInMap();
      });

    this.dataService.getAllData().subscribe(res => {
        DataModel.fillModel(res);
        console.log(DataModel.data);
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
      opacity: 0.05,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [200, 200, 200],
      getLineWidth: 1,
      getElevation: 30,
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
            pitch: 10,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator()
          }});
      });
  }
}
