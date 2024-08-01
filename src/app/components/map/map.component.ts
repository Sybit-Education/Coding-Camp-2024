import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import { Point, Geometry } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Router } from '@angular/router';
import { AirtableService } from '../../services/airtable.service';
import { MapBrowserEvent } from 'ol';
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

  @ViewChild('tooltip_map', { static: true }) tooltip!: ElementRef;

  constructor(private router: Router, private airtableService: AirtableService) {}

  getBookmarked(osm_id: number | null | undefined) {
    const item = localStorage.getItem("savedLocations")
    if(item) {
      const savedLocations = JSON.parse(item)
      return savedLocations.includes(osm_id)
    }
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
          minZoom: 12,
          maxZoom: 25
        })
      });

    this.map.on('click', this.handleMapClick.bind(this));
    this.map.on('pointermove', this.handlePointerMove.bind(this));    

    this.airtableService.getActivityList().subscribe(activities => {
      activities.forEach(activity => {
        const local = this.getBookmarked(activity.osm_id);
        const color = local ? "gold" : "black"

        const feature = new Feature({
          geometry: new Point(fromLonLat([activity.longitude, activity.latitude])),
          activity: activity
        });

        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: color
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

    this.map.forEachFeatureAtPixel(pixel, (feature) => {
      featureFound = true;
      const activity = (feature as Feature<Geometry>).get('activity');
      if (activity) {
        const tooltipElement = this.tooltip.nativeElement;
        const color = this.getBookmarked(activity.osm_id) ? "gold" : "black"
        tooltipElement.innerHTML = activity.name + ' (' + activity.type.name + (this.getBookmarked(activity.osm_id) ? " / favorisiert" : "") + ')';
        tooltipElement.style.display = 'block';
        tooltipElement.style.left = event.originalEvent.pageX + 'px';
        tooltipElement.style.top = (event.originalEvent.pageY - 15) + 'px';
        (feature as Feature<Geometry>).setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.svg,
            color: color,
          })
        }));
      }
    });

    if (!featureFound) {
      this.tooltip.nativeElement.style.display = 'none';
      this.vectorSource.getFeatures().forEach((feature: Feature<Geometry>) => {
        const activity = feature.get('activity');
        const color = this.getBookmarked(activity.osm_id) ? "gold" : "black"
        feature.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + activity.type.icon,
            color: color
          })
        }));
      });
    }
  }

  openDetailPage(activityId: string): void {
    this.router.navigate(['/activity-details', activityId]);
  }
}