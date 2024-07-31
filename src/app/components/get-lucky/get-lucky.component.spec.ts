import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetLuckyComponent } from './get-lucky.component';

describe('GetLuckyComponent', () => {
  let component: GetLuckyComponent;
  let fixture: ComponentFixture<GetLuckyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetLuckyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetLuckyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
