import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AirtableService } from '../../services/airtable.service';
import { Activity } from '../../types/activity.interface';
import { switchMap, map } from 'rxjs/operators';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {ActivityCardComponent} from "../activity-card/activity-card.component";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  imports: [
    NgSwitch,
    NgSwitchCase,
    ActivityCardComponent,
    NgSwitchDefault
  ],
  standalone: true
})
export class SearchResultComponent implements OnInit {
  searchTerm = '';
  activities: Activity[] = [];
  hasResults = false;

  constructor(
      private route: ActivatedRoute,
      private airtableService: AirtableService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
        map(params => params['q'] || ''),
        switchMap(searchTerm => {
          this.searchTerm = searchTerm;
          return this.airtableService.getActivityList().pipe(
              map(activities => activities.filter(activity =>
                  activity.name.toLowerCase().includes(searchTerm.toLowerCase())
              ))
          );
        })
    ).subscribe(filteredActivities => {
      this.activities = filteredActivities;
      this.hasResults = this.activities.length > 0;
    });
  }
}
