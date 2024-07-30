import {Component} from '@angular/core';
import {FilterComponent} from '../filter/filter.component';

@Component({
    selector: 'app-feed-settings',
    standalone: true,
    imports: [FilterComponent],
    templateUrl: './feed-settings.component.html',
    styleUrl: './feed-settings.component.scss'
})
export class FeedSettingsComponent {


}
