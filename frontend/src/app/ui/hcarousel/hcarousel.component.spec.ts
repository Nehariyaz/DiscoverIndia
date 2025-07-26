import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcarouselComponent } from './hcarousel.component';

describe('HcarouselComponent', () => {
  let component: HcarouselComponent;
  let fixture: ComponentFixture<HcarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HcarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HcarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
