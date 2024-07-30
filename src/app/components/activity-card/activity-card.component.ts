import {Component, Input} from '@angular/core';
import {Activity} from '../../types/activity.interface';
import {RouterLink} from '@angular/router';

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
  image: string = "assets/images/logo.png"

  @Input() activity: Activity | null = null;

    // isBookmarked = false;

    // onBookmark() {
    //   this.isBookmarked = !this.isBookmarked
    // }
    //TODO: Add later
}
