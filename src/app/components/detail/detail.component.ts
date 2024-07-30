import {Component, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import { AirtableService } from '../../services/airtable.service';
import { Activity } from '../../types/activity.interface';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  activity: Activity | null = null  

  constructor(
    private route: ActivatedRoute, 
    private activityService: AirtableService
  ) {}
  ngOnInit(): void {
    const osmId = this.route.snapshot.paramMap.get('osm_id'); 
    if (osmId) {
      this.activityService.getActivitiesByOsmId(osmId).subscribe ((activities)=>{
        this.activity = activities[0]
      })
    }
  }
}
