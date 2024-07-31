import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetLuckyComponent } from "../get-lucky/get-lucky.component";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { NgIf, NgOptimizedImage } from "@angular/common";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        FormsModule,
        GetLuckyComponent,
        RouterLink,
        RouterModule,
        NgIf,
        NgOptimizedImage
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    searchTerm = '';
    isRootUrl = false;

    constructor(private router: Router) {
        this.router.events.subscribe(() => {
            this.isRootUrl = this.router.url === '/';
        });
    }

    @Output() searchEvent = new EventEmitter<string>();

    onSearch() {
        this.searchEvent.emit(this.searchTerm);
    }

    onEnterKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.router.navigate(['/search-result'], { queryParams: { q: this.searchTerm } });
        }
    }
}
