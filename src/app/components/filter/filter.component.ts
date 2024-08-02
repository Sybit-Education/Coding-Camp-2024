import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AsyncPipe } from "@angular/common";
import { AirtableService } from "../../services/airtable.service";
import { Observable } from "rxjs";
import { TypesInterface } from "../../types/types.interface";

@Component({
    selector: 'app-home-filter',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'] // Corrected the key from "styleUrl" to "styleUrls"
})
export class FilterComponent implements OnInit {
    types$!: Observable<TypesInterface[]>;
    filters: TypesInterface[] = [];

    @Output()
    filtersEvent = new EventEmitter<TypesInterface[]>();

    constructor(private airtable: AirtableService, private elRef: ElementRef) {}

    ngOnInit() {
        this.types$ = this.airtable.getTypeList();
    }

    resetFilters() {
        const buttons = this.elRef.nativeElement.querySelectorAll('button[data-bs-toggle]');

        buttons.forEach((button: HTMLElement) => {
            button.classList.remove('active');
        });

        this.filters = [];
    }

    onFilter(type: TypesInterface) {
        if (this.filters.includes(type)) {
            this.filters = this.filters.filter(filter => filter !== type);
        } else {
            this.filters.push(type);
        }
    }

    acceptFilters() {
        this.filtersEvent.emit(this.filters);
        const filterNames = this.filters.map(filter => filter.name).join(',');
        const encodedFilters = encodeURIComponent(filterNames);
        const currentUrl = window.location.href;
        
        if (currentUrl.includes("/search-result")) {
            const url = `${currentUrl.split("&filters=")[0]}&filters=${encodedFilters}`;
            window.location.href = url;
        } else {
            const url = `/search-result?filters=${encodedFilters}`;
            window.location.href = url;
        }
    }
}
