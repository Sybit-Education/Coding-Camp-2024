import {Injectable} from '@angular/core';
import {concatMap, forkJoin, from, map, Observable, switchMap} from "rxjs";
import {Activity} from "../types/activity.interface";
import {TypesInterface} from "../types/types.interface";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AirtableService {

  constructor(private http: HttpClient) {}

  getActivityList(): Observable<Activity[]> {
    return from(this.getTypeList().pipe(
      concatMap(types => (
          from(this.http.get<Activity[]>(environment.apiUrl + '/activities')).pipe(
            map((records: any) => {
              return records.map((record: any) => {
                return {
                  name: record.fields['name'] as string,
                  description: record.fields['description'] as string,
                  type: types.find((type: any) => type.id === (record.fields?.['type']?.[0])) as TypesInterface,
                  street: record.fields['street'] as string,
                  number: record.fields['number'] as string,
                  zip: record.fields['zip'] as string,
                  city: record.fields['city'] as string,
                  latitude: record.fields['latitude'] as number,
                  longitude: record.fields['longitude'] as number,
                  website: record.fields['website'] as string,
                  osm_id: record.fields['osm_id'] as string
                } as Activity
              }) as Activity[]
            })
          )
        )
      )))
  }

  getActivitiesByOsmId(osmId: string): Observable<Activity[]> {
    return forkJoin([
      this.getTypeList(),
      this.getMediaList()
    ]).pipe(
      switchMap(([types, medias]) => {
        return from(this.http.get<Activity[]>(environment.apiUrl + '/activities/' + osmId)).pipe(
          map((records: any) => {
            return records.map((record: any) => {
              return {
                name: record.fields['name'] as string,
                description: record.fields['description'] as string,
                type: types.find((type: any) => type.id === (record.fields?.['type']?.[0])) as TypesInterface,
                street: record.fields['street'] as string,
                number: record.fields['number'] as string,
                zip: record.fields['zip'] as string,
                city: record.fields['city'] as string,
                latitude: record.fields['latitude'] as number,
                longitude: record.fields['longitude'] as number,
                website: record.fields['website'] as string,
                osm_id: record.fields['osm_id'] as string,
                media: medias.find((media: any) => media.id === (record.fields?.['media']?.[0])) as any,
              } as Activity
            }) as Activity[]
          })
        )
      })
    )
  }

  getTypeList(): Observable<any> {
    return from(this.http.get<Activity[]>(environment.apiUrl + '/types')).pipe(
      map((records) => {
        return records.map((record: any) => {
          return {
            id: record['id'] as string,
            name: record.fields['name'] as string,
            color: record.fields['color'] as string
          }
        })
      })
    )
  }

  getMediaList(): Observable<any> {
    return from(this.http.get<Activity[]>(environment.apiUrl + '/media')).pipe(
      map((records) => {
        return records.map((record: any) => {
          return {
            id: record['id'] as string,
            activity: record.fields['activity'] as string,
            file: record.fields['file'] as any,
            license_text: record.fields['license_text'] as string,
            source: record.fields['source'] as string,
          }
        })
      })
    )
  }
}
