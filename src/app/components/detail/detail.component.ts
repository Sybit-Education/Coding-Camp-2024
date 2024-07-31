import {Component, OnInit} from '@angular/core';
import {AirtableService} from "../../services/airtable.service";
import {AsyncPipe, NgStyle} from "@angular/common";
import {Activity} from "../../types/activity.interface";
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        AsyncPipe,
        RouterLink,
        NgStyle
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
        const osmId = this.route.snapshot.paramMap.get('osm_id');
        if (osmId) {
            this.activityService.getActivitiesByOsmId(osmId).subscribe((activities) => {
                this.activity = activities[0];
            });
        }
    }
}
