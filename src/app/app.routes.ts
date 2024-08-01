import {Routes} from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {DetailComponent} from "./components/detail/detail.component";
import {AboutUsComponent} from "./features/about-us/about-us.component";
import {ImprintComponent} from './features/imprint/imprint.component';
import {PrivacyPolicyComponent} from './features/privacy-policy/privacy-policy.component';
import {SearchResultComponent} from "./components/search-result/search-result.component";
import {FavoritesComponent} from "./features/favorites/favorites.component";
import {MapViewComponent} from "./features/map-view/map-view.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'map',
        component: MapViewComponent
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

    },
    {
        path: 'search-result',
        component: SearchResultComponent
    }
];
