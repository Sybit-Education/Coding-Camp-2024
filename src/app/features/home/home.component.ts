import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {SearchComponent} from "../../components/search/search.component";
import {FilterComponent} from "../../components/filter/filter.component";
import {MapComponent} from "../../components/map/map.component";
import {RouterLink} from "@angular/router";
import {ListComponent} from "../../components/list/list.component";
import {AsyncPipe} from "@angular/common";
import {FooterComponent} from "../../components/footer/footer.component";
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchComponent,
    FilterComponent,
    MapComponent,
    RouterLink,
    ListComponent,
    AsyncPipe,
    FooterComponent,
    ActivityCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {

}
