import {Component, OnInit} from '@angular/core';
import {AirtableService} from "../../services/airtable.service";
import {AsyncPipe, NgStyle} from "@angular/common";
import {Activity} from "../../types/activity.interface";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        AsyncPipe,
        RouterLink,
        NgStyle,
        NavbarComponent
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    activity: Activity | null = null;

    constructor(
        private route: ActivatedRoute,
        private activityService: AirtableService
    ) {
    }

    ngOnInit(): void {
        const osmIdString = this.route.snapshot.paramMap.get('osm_id');
        if (osmIdString) {
            const osmId = parseInt(osmIdString, 10);
            this.activityService.getActivitiesByOsmId(osmId).subscribe((activities) => {
                this.activity = activities[0];
            });
        }
    }
}
