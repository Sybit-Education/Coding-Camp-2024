import {TypesInterface} from "./types.interface";

export interface Activity {
  name: string;
  description?: string;
  type: TypesInterface;
  osm_id: string;
  street: string;
  number?: string;
  zip: string;
  city: string;
  latitude: number;
  longitude: number;
  website?: string;
  media: any;
  age_restriction?: number;
}
