import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';
import { combineLatest, switchMap, take, map, BehaviorSubject, Observable } from 'rxjs';
import { TypesInterface } from '../../types/types.interface';
import { AirtableService } from '../../services/airtable.service';
import { Activity } from '../../types/activity.interface';

@Component({
  selector: 'app-feed-settings',
  standalone: true,
  imports: [FilterComponent],
  templateUrl: './feed-settings.component.html',
  styleUrl: './feed-settings.component.scss'
})
export class FeedSettingsComponent {

  
}
