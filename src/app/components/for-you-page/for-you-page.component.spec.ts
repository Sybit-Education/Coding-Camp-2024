import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForYouPageComponent } from './for-you-page.component';

describe('ForYouPageComponent', () => {
  let component: ForYouPageComponent;
  let fixture: ComponentFixture<ForYouPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForYouPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForYouPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
