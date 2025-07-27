import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

import { HcarouselComponent } from './hcarousel.component';

describe('HcarouselComponent', () => {
  let component: HcarouselComponent;
  let fixture: ComponentFixture<HcarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HcarouselComponent,        // standalone component
        HttpClientTestingModule,   // mock HttpClient provider if used
        RouterTestingModule,       // mock routing if used
        CommonModule               // for common directives like *ngIf, *ngFor, pipes, etc.
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HcarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
