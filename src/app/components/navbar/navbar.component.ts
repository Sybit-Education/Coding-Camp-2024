import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    @Output() searchEvent = new EventEmitter<string>();
    searchTerm = ''

    onSearch() {
        this.searchEvent.emit(this.searchTerm);
    }
}
