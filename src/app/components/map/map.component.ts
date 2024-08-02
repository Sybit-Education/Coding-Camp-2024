import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Map, View, MapBrowserEvent } from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Router } from '@angular/router';
import { AirtableService } from '../../services/airtable.service';
import { GeolocationService } from '../../services/geolocation.service';
import {NgStyle} from "@angular/common";

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    imports: [
        NgStyle
    ],
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    map!: Map;
    vectorSource!: VectorSource;

    iconSize = 0.15;
    center = [8.970869314606485, 47.73981783654207];
    userLocationFeature: Feature = new Feature();

    @ViewChild('tooltip_map', {static: true}) tooltip!: ElementRef;

    constructor(private router: Router, private airtableService: AirtableService, private geolocationService: GeolocationService) {}

    getBookmarked(osm_id: number | null | undefined) {
      const item = localStorage.getItem("savedLocations")
      if (item) {
        const savedLocations = JSON.parse(item)
        return savedLocations.includes(osm_id)
      }
      return false;
    }
  
    ngOnInit(): void {
      this.vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: this.vectorSource
      });
  
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(this.center),
        zoom: 3,
        minZoom: 10,
        maxZoom: 25
      })
    });
    this.userLocationFeature.setStyle(new Style({
        image: new Icon({
          src: '/pin/my_location.png', // Pfad zu deinem benutzerdefinierten Pin-Bild
          anchor: [0.5, 1], // Bildausrichtung
          scale: 0.05 // Größe des Pins
        })
      }));
    
    this.vectorSource.addFeature(this.userLocationFeature);
    this.map.on('click', this.handleMapClick.bind(this));
    this.map.on('pointermove', this.handlePointerMove.bind(this));
  
    // INITIALIZE

    this.airtableService.getActivityList().subscribe(activities => {
      activities.forEach(activity => {
        const local = this.getBookmarked(activity.osm_id);
        console.log(`Activity: ${activity.name}, Bookmarked: ${local}, Color: ${activity.type.color}`);
  
        const feature = new Feature({
          geometry: new Point(fromLonLat([activity.longitude, activity.latitude])),
          activity: activity
        });
  
        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: activity.type.color,
            size: [this.iconSize, this.iconSize]
          })
        }));
  
        this.vectorSource.addFeature(feature);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleMapClick(event: MapBrowserEvent<any>) {
    this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const activity = (feature as Feature<Geometry>).get('activity');
      if (activity) {
        this.openDetailPage(activity.osm_id);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlePointerMove(event: MapBrowserEvent<any>) {
    const pixel = this.map.getEventPixel(event.originalEvent);
    let featureFound = false;

    // HOVER

    this.map.forEachFeatureAtPixel(pixel, (feature) => {
      featureFound = true;
      const activity = (feature as Feature<Geometry>).get('activity');
      if (activity) {
        const tooltipElement = this.tooltip.nativeElement;
        tooltipElement.innerHTML = activity.name + ' (' + activity.type.name + (this.getBookmarked(activity.osm_id) ? " / favorisiert" : "") + ')';
        tooltipElement.style.display = 'block';
        tooltipElement.style.left = event.originalEvent.pageX + 'px';
        tooltipElement.style.top = (event.originalEvent.pageY - 15) + 'px';
        (feature as Feature<Geometry>).setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: activity.type.color,
            scale: this.iconSize,
          })
        }));
      } 
    });

    // MOUSE MOVE NO HOVER

    if (!featureFound) {
      this.tooltip.nativeElement.style.display = 'none';
      this.vectorSource.getFeatures().forEach((feature: Feature<Geometry>) => {
        const activity = feature.get('activity');
        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: activity.type.color,
            scale: this.iconSize
          })
        }));
      });
    }
  }

    openDetailPage(activityId: string): void {
        this.router.navigate(['/activity-details', activityId]);
    }

    updateCurrentLocation() {
        this.geolocationService.getCurrentPosition()
          .then(position => {
            this.center = [position.coords.longitude, position.coords.latitude];
            console.log('Center: ', this.center);
            this.map.getView().setCenter(fromLonLat(this.center));
            const coordinates = fromLonLat(this.center);
            this.userLocationFeature.setGeometry(new Point(coordinates));            
          })
          .catch(error => {
            console.error('Error getting location: ', error);
          });
    }    
}
