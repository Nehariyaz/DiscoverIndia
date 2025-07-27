import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecommendationService } from '../../services/recommendations.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  preferences: any = null;
  recommendations: any[] = [];
  selectedDestination: any = null;

  constructor(
    private recommendationService: RecommendationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Optional: If you no longer want to use history.state.preferences, remove/comment this line and related condition.
    const statePrefs = history.state?.preferences;
    const userId = localStorage.getItem('userId');

    if (statePrefs) {
      this.preferences = statePrefs;
      this.fetchRecommendations();
    } else if (userId) {
      this.recommendationService.getUserPreferences(userId).subscribe({
        next: (prefs) => {
          this.preferences = prefs;
          this.fetchRecommendations();
        },
        error: (err) => console.error('Error loading preferences', err),
      });
    } else {
      console.warn('No preferences or userId found');
      // Optional: Decide what to do here, e.g., redirect or show a message.
    }
  }

  private fetchRecommendations(): void {
    if (!this.preferences) {
      console.warn('No preferences set; skipping recommendations fetch.');
      return;
    }

    this.recommendationService.getRecommendations(this.preferences).subscribe({
      next: (data) => {
        this.recommendations = data.map((dest) => ({
          ...dest,
          stateId: dest.stateId ?? this.getStateIdByName(dest.state),
        }));
      },
      error: (err) => console.error('Failed to fetch recommendations', err),
    });
  }

  getStateIdByName(stateName: string): number | null {
    const stateMap: { [key: string]: number } = {
      // Example:
      // 'California': 1,
      // 'Texas': 2,
      // Add your state name-to-ID mappings here
    };
    return stateMap[stateName] ?? null;
  }

  viewDetails(dest: any): void {
    console.log('Clicked destination:', dest);
    if (!dest?.stateId) {
      console.error('Missing stateId! Destination is:', dest);
      return;
    }
    this.router.navigate([`/destinations/${dest.stateId}`], {
      state: { placeData: dest },
    });
    this.selectedDestination = dest;
  }

  changePreferences(): void {
    this.router.navigate(['/preferences'], {
      state: { preferences: this.preferences },
    });
  }
}
