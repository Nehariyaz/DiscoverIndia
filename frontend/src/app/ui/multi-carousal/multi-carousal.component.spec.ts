import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCarousalComponent } from './multi-carousal.component';

describe('MultiCarousalComponent', () => {
  let component: MultiCarousalComponent;
  let fixture: ComponentFixture<MultiCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCarousalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
