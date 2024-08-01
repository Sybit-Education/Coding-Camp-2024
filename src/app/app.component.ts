import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "./components/footer/footer.component";
import {MapComponent} from "./components/map/map.component";
import {ActivityCardComponent} from "./components/activity-card/activity-card.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import {BackToTopComponent} from "./components/back-to-top/back-to-top.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, MapComponent, ActivityCardComponent, NavbarComponent, BackToTopComponent],
    providers: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
}
