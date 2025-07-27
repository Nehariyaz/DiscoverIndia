import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

import { MultiCarousalComponent } from './multi-carousal.component';

describe('MultiCarousalComponent', () => {
  let component: MultiCarousalComponent;
  let fixture: ComponentFixture<MultiCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MultiCarousalComponent,  // standalone component
        HttpClientTestingModule, // provides mock HttpClient for services
        RouterTestingModule,     // provides mocks for ActivatedRoute/router injections
        CommonModule             // provides *ngIf, *ngFor, pipes, etc. in template
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
