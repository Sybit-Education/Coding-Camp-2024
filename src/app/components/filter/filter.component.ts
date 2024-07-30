import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import { Observable } from 'rxjs';
import { TypesInterface } from '../../types/types.interface';
import { AirtableService } from '../../services/airtable.service';


@Component({
  selector: 'app-home-filter',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
    types$!: Observable<TypesInterface[]>

    filters: TypesInterface[]=[]

  @Output()
  filtersEvent= new EventEmitter<TypesInterface[]>()

  constructor(private airtable: AirtableService, private elRef: ElementRef) {}

  ngOnInit(){
    this.types$=this.airtable.getTypeList();
  }

  resetFilters() {
    const buttons = this.elRef.nativeElement.querySelectorAll('button[data-bs-toggle]');
    buttons.forEach((button:any) => {
        buttons.classList.remove('active')
    });
    this.filters= []
  }


  onFilter(type: TypesInterface){
      if(this.filters.includes(type)){
        this.filters = this.filters.filter(filter=>filter!==type)
      } else{
          this.filters.push(type)
      }
      
  }
  acceptFilters(){
      this.filtersEvent.emit(this.filters)
  }
}
