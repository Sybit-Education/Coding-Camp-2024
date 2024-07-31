import { Component } from '@angular/core';
import { AirtableService } from '../../services/airtable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-lucky',
  standalone: true,
  imports: [],
  templateUrl: './get-lucky.component.html',
  styleUrl: './get-lucky.component.scss'
})
export class GetLuckyComponent {

  constructor(private airtable: AirtableService, private router: Router) {}

  navigateToRandomActivity(): void {
    this.airtable.getActivityList().subscribe({
      next: (activites) => {
        if (activites.length > 0) {
          const randomIndex = Math.floor(Math.random() * activites.length);
          const randomId = activites[randomIndex].osm_id;
          this.router.navigate(['/activity-details', randomId]);
        } else {
          console.error('Keine IDs gefunden.')
        }
      },
      error: (err) => {
        console.error(err)
      }
    }

    )
  }


}