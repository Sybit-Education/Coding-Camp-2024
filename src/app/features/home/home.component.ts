import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { SearchComponent } from "../../components/search/search.component";
import { FilterComponent } from "../../components/filter/filter.component";
import { MapComponent } from "../../components/map/map.component";
import { RouterLink } from "@angular/router";
import { ListComponent } from "../../components/list/list.component";
import { AsyncPipe } from "@angular/common";
import { FooterComponent } from "../../components/footer/footer.component";
import { BehaviorSubject, combineLatest, map, Observable, switchMap, take } from 'rxjs';
import { Activity } from '../../types/activity.interface';
import { TypesInterface } from '../../types/types.interface';
import { AirtableService } from '../../services/airtable.service';
import { ActivityCardComponent } from "../../components/activity-card/activity-card.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FeedSettingsComponent } from "../../components/feed-settings/feed-settings.component";;


@Component({
	selector: "app-home",
	standalone: true,
	imports: [
		HeaderComponent,
		SearchComponent,
		FilterComponent,
		MapComponent,
		RouterLink,
		ListComponent,
		AsyncPipe,
		FooterComponent,
		ActivityCardComponent,
		NavbarComponent,
		FeedSettingsComponent,
		
	],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  activities$!: Observable<Activity[]>
  filterSubject = new BehaviorSubject<TypesInterface[]>([])
  searchTermSubject = new BehaviorSubject<string>('')
  listView = false;

    constructor(private airtable: AirtableService) {}

  ngOnInit() {
    this.activities$ = combineLatest([
      this.filterSubject,
      this.searchTermSubject
    ]).pipe(
      switchMap(([filters, searchTerm]) => this.airtable.getActivityList().pipe(
        take(1),
        map(activities => activities.filter(activity => (
          filters.length === 0 || filters.some(filter => filter.id === activity.type.id)
        ) && (searchTerm === '' || activity.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ))
      ))
    )
  }

  applyActiveFilters(filters: TypesInterface[]) {
    this.filterSubject.next(filters);
  }

  applySearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }

    
}
