import { Component } from '@angular/core';
import {MapComponent} from "../../components/map/map.component";

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    MapComponent
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent {

}
