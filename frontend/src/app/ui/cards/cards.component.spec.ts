import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsComponent } from './cards.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;

    // Set the input `data`, which will be used internally to set `cards`
    component.data = [
      { id: 1, name: 'Sample', description: 'Test' },
      { id: 2, name: 'Another', description: 'Test 2' }
    ];

    // Manually trigger ngOnChanges to simulate Angular input binding lifecycle
    component.ngOnChanges({
      data: new SimpleChange(null, component.data, true)
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set cards property based on input data', () => {
    expect(component.cards).toEqual(component.data);
  });
});
