import { Component, Input } from '@angular/core';
import { Activity } from '../../types/activity.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss'
})
export class ActivityCardComponent {
  @Input() activity: Activity | null = null;

  isBookmarked : boolean = false;

  onBookmark() {
    this.isBookmarked = !this.isBookmarked
    console.log(this.isBookmarked)
  }
}
