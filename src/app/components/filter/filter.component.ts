import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";


@Component({
  selector: 'app-home-filter',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

}
