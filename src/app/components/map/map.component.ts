import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import Feature from 'ol/Feature';
import { Point, Geometry } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Router } from '@angular/router';
import { AirtableService } from '../../services/airtable.service';
import { MapBrowserEvent } from 'ol';
import { NgStyle } from "@angular/common";
import { Activity } from '../../types/activity.interface';

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

  //iconSize = 0.15;

  @ViewChild('tooltip_map', {static: true}) tooltip!: ElementRef;

  constructor(private router: Router, private airtableService: AirtableService) {}
  
  getBookmarked(osm_id: number | null | undefined) {
    const item = localStorage.getItem("savedLocations")
    if (item) {
      const savedLocations = JSON.parse(item)
      return savedLocations.includes(osm_id)
    }
    return false;
  }

  getColor(activity: Activity) {
    return this.getBookmarked(activity.osm_id) ?  "gold" : activity.type.color
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
        center: fromLonLat([8.970869314606485, 47.73981783654207]),
        zoom: 3,
        minZoom: 10,
        maxZoom: 25
      })
    });
  
    this.map.on('click', this.handleMapClick.bind(this));
    this.map.on('pointermove', this.handlePointerMove.bind(this));
  
    // INITIALIZE

    this.airtableService.getActivityList().subscribe(activities => {
      // Ensure features are added to the vector source and the map is refreshed
      activities.forEach((activity) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([activity.longitude, activity.latitude])),
          activity: activity,
          style: new Style({
            image: new Icon({
              src: 'data:image/svg+xml;utf8,' + activity.type.svg,
              color: this.getColor(activity),
              size: [activity.type.svg_scale, activity.type.svg_scale]
            })
          })
        });
        this.vectorSource.addFeature(feature);
      });
      this.tooltip.nativeElement.style.display = 'none';
      this.vectorSource.getFeatures().forEach((feature: Feature<Geometry>) => {
        const activity = feature.get('activity');
        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: this.getColor(activity),
            scale: activity.type.svg_scale
          })
        }));
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
            color: this.getColor(activity),
            scale: activity.type.svg_scale
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
            color: this.getColor(activity),
            scale: activity.type.svg_scale
          })
        }));
      });
    }
  }

    openDetailPage(activityId: string): void {
        this.router.navigate(['/activity-details', activityId]);
    }
}
