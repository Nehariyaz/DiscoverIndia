import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DestinationService } from '../../services/destination.service'; // Adjust path if needed

interface Attraction {
  name: string;
  imageUrl: SafeUrl | string;
  description?: string;
  activities?: string[];
  seasons?: string[];
  travelTypes?: string[];
  budgetRange?: [number, number];
  stateId?: number;
}

@Component({
  selector: 'app-multi-carousal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-carousal.component.html',
  styleUrls: ['./multi-carousal.component.scss']
})
export class MultiCarousalComponent implements OnChanges {
  @Input() stateId!: number;
  @Output() attractionClicked = new EventEmitter<Attraction>();

  attractions: Attraction[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private destinationService: DestinationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stateId'] && this.stateId) {
      this.loadAttractionsByState();
    }
  }

  selectAttraction(attraction: Attraction): void {
    this.attractionClicked.emit(attraction);
  }

  loadAttractionsByState(): void {
    this.destinationService.getAllDestinations().subscribe({
      next: (data) => {
        const filtered = data.filter(
          (item: any) => item.stateId === this.stateId
        );

        this.attractions = filtered.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl
            ? this.sanitizer.bypassSecurityTrustUrl(item.imageUrl)
            : 'assets/default.jpg' // fallback image
        }));
      },
      error: (err) => {
        console.error('Error loading destinations:', err);
      }
    });
  }

  chunk(arr: any[], size: number): any[][] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}
