import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Activity} from "../../types/activity.interface";

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        RouterLink,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent {

    @Input()
    activities!: Activity[]

}
