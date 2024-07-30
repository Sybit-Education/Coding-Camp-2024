import { Routes } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {DetailComponent} from "./components/detail/detail.component";
import {AboutUsComponent} from "./features/about-us/about-us.component";
import { DataprotectionComponent } from './features/dataprotection/dataprotection.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'activity-details/:osm_id',
    component: DetailComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'dataprotection',
    component: DataprotectionComponent
  }
];
