import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnChanges {
  @Input() data: any;

  states: any;
  cards: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.cards = this.data;
    }
  }
}
