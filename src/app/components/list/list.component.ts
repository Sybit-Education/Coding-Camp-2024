import {Component, Input} from '@angular/core';

import {MarkerComponent} from "../marker/marker.component";
import {RouterLink} from "@angular/router";
import {Activity} from "../../types/activity.interface";
import { ScrollNearEndDirective } from '../../scroll-near-end.directive';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        MarkerComponent,
        RouterLink,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent {

    @Input()
    activities!: Activity[]

}
