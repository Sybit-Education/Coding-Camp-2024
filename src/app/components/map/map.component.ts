import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import { Point, Geometry } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
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

  ngOnInit(): void {
    this.vectorSource = new VectorSource();

    this.airtableService.getActivityList().subscribe(activities => {
      activities.forEach(activity => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([activity.longitude, activity.latitude])),
          activity: activity
        });

        feature.setStyle(new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: activity.type.color }),
            stroke: new Stroke({ color: 'black', width: 0.75 })
          })
        }));

        this.vectorSource.addFeature(feature);
      });

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
          maxZoom: 20
        })
      });

      this.map.on('click', this.handleMapClick.bind(this));
      this.map.on('pointermove', this.handlePointerMove.bind(this));
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
        tooltipElement.innerHTML = activity.name + ' (' + activity.type.name + ')';
        tooltipElement.style.display = 'block';
        tooltipElement.style.left = event.originalEvent.pageX + 'px';
        tooltipElement.style.top = (event.originalEvent.pageY - 15) + 'px';
        (feature as Feature<Geometry>).setStyle(new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({ color: activity.type.color }),
            stroke: new Stroke({ color: 'black', width: 0.75 })
          })
        }));
      }
    });

    if (!featureFound) {
      this.tooltip.nativeElement.style.display = 'none';
      this.vectorSource.getFeatures().forEach((feature: Feature<Geometry>) => {
        const activity = feature.get('activity');
        feature.setStyle(new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: activity.type.color }),
            stroke: new Stroke({ color: 'black', width: 0.75 })
          })
        }));
      });
    }
  }

  openDetailPage(activityId: string): void {
    this.router.navigate(['/activity-details', activityId]);
  }
}