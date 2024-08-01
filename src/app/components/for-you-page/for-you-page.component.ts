import { Component, OnInit } from '@angular/core';
import { Activity } from '../../types/activity.interface';
import { AirtableService } from '../../services/airtable.service';
import { ActivityCardComponent } from '../activity-card/activity-card.component';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-for-you-page',
  standalone: true,
  imports: [
    ActivityCardComponent,
    NgIf
  ],
  templateUrl: './for-you-page.component.html',
  styleUrl: './for-you-page.component.scss'
})
export class ForYouPageComponent implements OnInit{
  shuffledActivities: Activity[] = [];
  allActivities: Activity[] = [];
  isLoading = true;
  activities: Activity[] = [];

  constructor(
    private airtable: AirtableService, 
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.airtable.getActivityList().subscribe(
      {
        next: activities => {
          this.isLoading = false;
          this.allActivities = activities;
          this.shuffledActivities = this.shuffle(this.allActivities, 3);
        }
      }
    )
  }

  shuffle(activities: Activity[], count: number): Activity[] {
    let result: Activity[];
    // Prüfen, ob URL-Parameter vorhanden sind
    const osmIds = this.route.snapshot.queryParamMap.get('osm_ids');

    if (osmIds) {
      const idsArray: number[] = osmIds.split(',').map((id: string) => parseInt(id, 10));
      result = activities.filter((activity: Activity) => idsArray.includes(activity.osm_id));
    } else {
      const shuffledArray = activities.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      result = shuffledArray.slice(0, count);
      this.updateUrlWithIds(result);
    }
    return result
  }

  doReshuffle(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { osm_ids: null },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.shuffledActivities = this.shuffle(this.allActivities, 3);
    });
  }

  updateUrlWithIds(randomItems: Activity[]): void {
    const osmIds = randomItems.map((activity: Activity) => activity.osm_id).join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { osm_ids: osmIds },
      queryParamsHandling: 'merge'
    });
  }
}
