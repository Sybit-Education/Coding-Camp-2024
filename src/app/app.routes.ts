import {Routes} from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {DetailComponent} from "./components/detail/detail.component";
import {AboutUsComponent} from "./features/about-us/about-us.component";
import {ImprintComponent} from './features/imprint/imprint.component';
import {PrivacyPolicyComponent} from './features/privacy-policy/privacy-policy.component';
import {FavoritesComponent} from "./features/favorites/favorites.component";
import {MapComponent} from "./features/map/map.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'map',
        component: MapComponent
    },
    {
        path: 'favorites',
        component: FavoritesComponent
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
        path: "imprint",
        component: ImprintComponent
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
    }
];
