import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss'
})
export class ActivityCardComponent {
  @Input() name: string = "";
  @Input() loc_id: string = "";
  @Input() rating: string = "";
  @Input() imageUrl: string = "";
  @Input() description: string = "";

  isBookmarked : boolean = false;

  onBookmark() {
    this.isBookmarked = !this.isBookmarked
    console.log(this.isBookmarked)
  }
}
