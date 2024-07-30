import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "./components/footer/footer.component";
import {MapComponent} from "./components/map/map.component";
import {HeaderComponent} from "./components/header/header.component";
import { ActivityCardComponent } from "./components/activity-card/activity-card.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, MapComponent, HeaderComponent, ActivityCardComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{}
