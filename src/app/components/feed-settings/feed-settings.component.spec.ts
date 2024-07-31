import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FeedSettingsComponent} from './feed-settings.component';

describe('FeedSettingsComponent', () => {
    let component: FeedSettingsComponent;
    let fixture: ComponentFixture<FeedSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeedSettingsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FeedSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
