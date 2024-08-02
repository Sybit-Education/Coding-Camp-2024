import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Map, MapBrowserEvent, View} from 'ol';
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
      activities.forEach(activity => {
        const local = this.getBookmarked(activity.osm_id);
        console.log(`Activity: ${activity.name}, Bookmarked: ${local}, Color: ${activity.type.color}`);
        const color = local ? "gold" : activity.type.color;
  
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
        const color = this.getBookmarked(activity.osm_id) ? "gold" : activity.type.color;
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
        const color = this.getBookmarked(activity.osm_id) ? "gold" : activity.type.color;
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
}
