import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { DataModel } from '../shared/data.model';
import { Spol } from '../shared/models/po-osobama';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  // TODO add data interfaces to models, fill app wide static model with structured data
  private deck = undefined;
  private INITIAL_VIEW_STATE = {
    latitude: 37.8,
    longitude: -122.45,
    zoom: 15
  };
  private M = [0, 0, 255];
  private Ž = [255, 0, 0];
  constructor(
      public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getAllData().subscribe(res => {
      DataModel.fillModel(res);
      console.log(DataModel.data);
    });

    this.deck = new Deck({
      canvas: 'deck-canvas',
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true
    });
    this.renderLayers();
  }

  public renderLayers() {
    const layers = [];
    const scatterplotLayer = new ScatterplotLayer({
      data: DataModel.data.po_osobama,
      getPosition: d => {
        return d.Zupanija
      },
      getFillColor: d => {
        if (d.spol === Spol.M) {
          return this.M;
        } else { return this.Ž; }
      },
      getRadius: d => d.radius
    });
    layers.push(scatterplotLayer);
    this.deck.setProps({layers});
  }

}
