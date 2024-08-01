import { Component, OnInit } from '@angular/core';
import { Activity } from '../../types/activity.interface';
import { AirtableService } from '../../services/airtable.service';
import { ActivityCardComponent } from '../activity-card/activity-card.component';
import { NgIf } from '@angular/common';

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
  isLoading = true;
  activities: Activity[] = [];

  constructor(private airtable: AirtableService){


  }
  ngOnInit(): void {
    this.airtable.getActivityList().subscribe(
      {
        next: activities => {
          this.activities = this.shuffle(activities);
          this.isLoading = false;
        }
      }
    )
  }

  shuffle(activities: Activity[]): Activity[] {
    let currentIndex = activities.length;
    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [activities[currentIndex], activities[randomIndex]] = [
        activities[randomIndex], activities[currentIndex]];
    }
    return activities.splice(0,3);
  }
}
