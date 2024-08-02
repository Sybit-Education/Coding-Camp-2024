import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetLuckyComponent } from "../get-lucky/get-lucky.component";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { FilterComponent } from "../filter/filter.component";
import { BehaviorSubject } from 'rxjs';
import { TypesInterface } from '../../types/types.interface';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
    FormsModule,
    GetLuckyComponent,
    RouterLink,
    RouterModule,
    NgIf,
    NgOptimizedImage,
    FilterComponent
],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    searchTerm = '';
    isRootUrl = false;
    isMapUrl = false;
    isHamburgerMenuActive = false;
    filterSubject = new BehaviorSubject<TypesInterface[]>([])

    constructor(private router: Router) {
        this.router.events.subscribe(() => {
            this.isRootUrl = this.router.url === '/';
            this.isMapUrl = this.router.url === '/map';
            this.isHamburgerMenuActive = false;
        });
    }

    @Output() searchEvent = new EventEmitter<string>();

    onSearch() {
        this.searchEvent.emit(this.searchTerm);
    }

    onEnterKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.router.navigate(["/search-result"], {
                queryParams: {
                    ...this.router.routerState.snapshot.root.queryParams,
                    q: this.searchTerm
                },
                queryParamsHandling: 'merge'
            });
        }
    }

    showHamburgerMenu() {
        this.isHamburgerMenuActive = !this.isHamburgerMenuActive
    }

    applyActiveFilters(filters: TypesInterface[]) {
        this.filterSubject.next(filters);
    }

    getFavouriteCount() {
        const item = localStorage.getItem("savedLocations")
        if (item) {
            const savedLocations = JSON.parse(item)
            return savedLocations.length
        }
        return 0
    }
}
