import { Component } from '@angular/core';
import { AirtableService } from '../../services/airtable.service';
import { ActivityCardComponent } from "../../components/activity-card/activity-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ActivityCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  constructor(private airtable: AirtableService) { }

  getActivityByOsm(osm_id: string) {
     return this.airtable.getActivitiesByOsmId(osm_id);
  }

  getBookmarked(osm_id: string | null | undefined) {
    const item = localStorage.getItem("savedLocations")
    if(item) {
      const savedLocations = JSON.parse(item)
      return savedLocations.includes(osm_id)
    }
  }

  getBookmarks() {
    const item = localStorage.getItem("savedLocations")
    if(item) {
      const savedLocations = JSON.parse(item)
      const bookmarks = [];
      for(const activity of this.airtable.activities) {
        if(savedLocations.includes(activity.osm_id)) bookmarks.push(activity)
      }
      console.log("Bookmarks:\n" + bookmarks)
      return bookmarks;
    } else {
      console.log("No bookmarks found!")
      return [];
    }
  }

}
