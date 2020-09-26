import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  // TODO add data interfaces to models, fill app wide static model with structured data
  public data = undefined;
  public dataStringified = '';
  constructor(
      public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getAllData().subscribe(res => {
      this.data = res;
      this.dataStringified = JSON.stringify(res);
    });
  }

}
