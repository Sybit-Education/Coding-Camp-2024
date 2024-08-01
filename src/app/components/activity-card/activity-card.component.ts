import { Component, Input, OnInit } from "@angular/core";
import { Activity } from "../../types/activity.interface";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-activity-card",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./activity-card.component.html",
	styleUrl: "./activity-card.component.scss",
})
export class ActivityCardComponent implements OnInit {
	image = "/images/logo.png";

	@Input() activity: Activity | null = null;

	isBookmarked = false;

  ngOnInit(): void {
    this.getBookmarked(this.activity?.osm_id)
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
