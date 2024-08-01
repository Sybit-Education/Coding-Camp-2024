import { Component, OnInit } from '@angular/core';
import { Activity } from '../../types/activity.interface';
import { AirtableService } from '../../services/airtable.service';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  selector: 'app-for-you-page',
  standalone: true,
  imports: [
    ActivityCardComponent
  ],
  templateUrl: './for-you-page.component.html',
  styleUrl: './for-you-page.component.scss'
})
export class ForYouPageComponent implements OnInit{
  shuffledActivities: Activity[] = [];
  allActivities: Activity[] = [];

  constructor(private airtable: AirtableService){}

  ngOnInit(): void {
    this.airtable.getActivityList().subscribe(
      {
        next: activities => {
          this.allActivities = activities;
          this.shuffledActivities = this.shuffle(this.allActivities, 3);
        }
      }
    )
  }

  shuffle(activities: Activity[], count: number): Activity[] {
    const shuffledArray = activities.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray.slice(0, count);
  }

  doReshuffle(): void {
    this.shuffledActivities = this.shuffle(this.allActivities, 3);
  }
}
