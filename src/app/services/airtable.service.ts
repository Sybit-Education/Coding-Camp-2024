/* eslint-disable @typescript-eslint/no-explicit-any */
import {Injectable} from '@angular/core';
import {forkJoin, from, map, Observable, of, Subject, switchMap} from "rxjs";
import {Activity} from "../types/activity.interface";
import {TypesInterface} from "../types/types.interface";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class AirtableService {

    activities: Activity[] = []
    subjects: Subject<Activity[]>[] = []
    loaded = false

    constructor(private http: HttpClient) {
        this.fetchActivities()
    }

    getActivityList(): Observable<Activity[]> {
        if (this.loaded) {
            return of(this.activities)
        } else {
            const subject = new Subject<Activity[]>()
            this.subjects.push(subject)
            return subject.asObservable();
        }
    }

    getActivitiesByOsmId(osmId: string): Observable<Activity[]> {
        return this.getActivityList().pipe(map(activities => {
            return Array.from(activities).filter(activity => activity.osm_id == osmId)
        }))
    }

    getTypeList(): Observable<any> {
        return from(this.http.get<Activity[]>(environment.apiUrl + "/types")).pipe(map((records) => {
            return records.map((record: any) => {
                return {
                    id: record["id"] as string,
                    name: record.fields["name"] as string,
                    color: record.fields["color"] as string,
                };
            });
        }),);
    }

    getMediaList(): Observable<any> {
        return from(this.http.get<Activity[]>(environment.apiUrl + "/media")).pipe(map((records) => {
            return records.map((record: any) => {
                return {
                    id: record["id"] as string,
                    activity: record.fields["activity"] as string,
                    file: record.fields["file"] as any,
                    license_text: record.fields["license_text"] as string,
                    source: record.fields["source"] as string,
                };
            });
        }),);
    }

    private fetchActivities() {
        forkJoin([this.getTypeList(), this.getMediaList()]).pipe(switchMap(([types, medias]) => {
            return from(this.http.get<Activity[]>(environment.apiUrl + '/activities')).pipe(map((records: any) => {
                return records.map((record: any) => {
                    return {
                        name: record.fields['name'] as string,
                        description: record.fields['description'] as string,
                        type: types.find((type: any) => type.id === (record.fields?.['type']?.[0])) as TypesInterface,
                        street: record.fields['street'] as string,
                        number: record.fields['number'] as string,
                        zip: record.fields['zip'] as string,
                        city: record.fields['city'] as string,
                        country: record.fields['country'] as string,
                        latitude: record.fields['latitude'] as number,
                        longitude: record.fields['longitude'] as number,
                        website: record.fields['website'] as string,
                        osm_id: record.fields['osm_id'] as string,
                        media: medias.find((media: any) => media.id === (record.fields?.['media']?.[0])) as any,
                        age_restriction: record.fields['age_restriction'] as number,
                        barrier_free: record.fields['barrier_free'] as boolean,
                        maps_link: record.fields['google_maps_link'] as string,
                    } as Activity
                }) as Activity[]
            }))
        })).subscribe({
            next: (response) => {
                response.forEach(activity => this.activities.push(activity))
                this.subjects.forEach(subject => subject.next(response))
                this.loaded = true;
            }, error: (error) => {
                console.error(error)
            }
        })
    }
}
