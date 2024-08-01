import {TypesInterface} from "./types.interface";

export interface Activity {
    name: string;
    description?: string;
    type: TypesInterface;
    osm_id: number;
    street: string;
    number?: string;
    zip: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    website?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    media: any;
    age_restriction?: number;
    barrier_free: boolean;
    maps_link: string;
}
