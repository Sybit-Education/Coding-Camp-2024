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
  activities: Activity[] = [];

  constructor(private airtable: AirtableService){


  }
  ngOnInit(): void {
    this.airtable.getActivityList().subscribe(
      {
        next: activities => {
          this.activities = this.shuffle(activities);
        }
      }
    )
  }

  shuffle(activities: Activity[]): Activity[] {
    let currentIndex = activities.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [activities[currentIndex], activities[randomIndex]] = [
        activities[randomIndex], activities[currentIndex]];
    }
    return activities;
  }
}
