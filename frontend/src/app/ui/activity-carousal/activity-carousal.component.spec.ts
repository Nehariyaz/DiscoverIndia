import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCarousalComponent } from './activity-carousal.component';

describe('ActivityCarousalComponent', () => {
  let component: ActivityCarousalComponent;
  let fixture: ComponentFixture<ActivityCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCarousalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
