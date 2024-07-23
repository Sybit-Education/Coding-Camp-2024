import {Component} from '@angular/core';
import {AngularOpenlayersModule} from "ng-openlayers";
import {AsyncPipe, NgIf} from "@angular/common";


@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [
    AngularOpenlayersModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent {

}
