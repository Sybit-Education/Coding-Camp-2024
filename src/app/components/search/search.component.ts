import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-home-search',
    standalone: true,
    imports: [
    FormsModule,
],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    @Output() searchEvent = new EventEmitter<string>();
    searchTerm = ''

    onSearch() {
        this.searchEvent.emit(this.searchTerm);
    }
}
