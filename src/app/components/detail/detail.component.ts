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
    isBookmarked = false;

    constructor(
        private route: ActivatedRoute,
        private activityService: AirtableService
    ) {
    }

    ngOnInit(): void {
        this.scrollToTop();
        const osmIdString = this.route.snapshot.paramMap.get('osm_id');
        if (osmIdString) {
            const osmId = parseInt(osmIdString, 10);
            this.activityService.getActivitiesByOsmId(osmId).subscribe((activities) => {
                this.activity = activities[0];
            });
        }
    }

    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    onBookmark(osm_id: number | null | undefined) {
        this.isBookmarked = !this.isBookmarked
        const item = localStorage.getItem("savedLocations")
        if (item) {
            const savedLocations = JSON.parse(item)
            if (this.isBookmarked) {
                savedLocations.push(osm_id)
            } else {
                const index = savedLocations.indexOf(osm_id)
                savedLocations.splice(index, 1)
            }
            localStorage.setItem("savedLocations", JSON.stringify(savedLocations))
        } else {
            localStorage.setItem("savedLocations", JSON.stringify([osm_id]))
        }

    }

    getBookmarked(osm_id: number | null | undefined) {
        const item = localStorage.getItem("savedLocations")
        if(item) {
            const savedLocations = JSON.parse(item)
            this.isBookmarked = savedLocations.includes(osm_id)
        }
    }
}
