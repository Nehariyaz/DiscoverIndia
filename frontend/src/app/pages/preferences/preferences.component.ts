import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../../ui/chatbot/chatbot.component';

@Component({
  selector: 'app-preferences',
  standalone: true,
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, ChatbotComponent]
})
export class PreferencesComponent implements OnChanges {
  // User preferences from chatbot or form
  preferences = {
    travelType: '',
    budget: 0,
    duration: 5,
    preferredSeason: '',
    interestedActivities: [] as string[],
    state: ''
  };

  // Activity options displayed in form
  activityOptions: string[] = [
    'trekking', 'nature', 'beach', 'nightlife', 'culture', 'heritage',
    'shopping', 'food', 'backwaters', 'boating', 'relaxation', 'rafting', 'yoga',
    'spiritual', 'temples', 'wildlife', 'tea gardens', 'ruins', 'history', 'urban',
    'architecture'
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Load initial preferences if returning from dashboard
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { preferences?: any };

    if (state?.preferences) {
      this.preferences = { ...this.preferences, ...state.preferences };
      console.log('🔙 Returned from dashboard with preferences:', this.preferences);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Placeholder - not needed unless working with @Input()s
  }

  /**
   * Called when chatbot emits collected form data
   */
  fillForm(data: any) {
    console.log('🔄 Filling form with chatbot data:', data);

    this.preferences.travelType = data.travelType || '';
    this.preferences.budget = data.budget || 0;
    this.preferences.duration = data.duration || 3;
    this.preferences.preferredSeason = data.season || '';
    this.preferences.state = data.state || '';

    // Support multiple or single activities
    this.preferences.interestedActivities = Array.isArray(data.interestedActivities) && data.interestedActivities.length
      ? data.interestedActivities
      : (data.activity ? [data.activity] : []);
  }

  /**
   * Toggled a checkbox input for activity
   */
  toggleActivity(activity: string, event: any) {
    const act = activity.toLowerCase();
    const list = this.preferences.interestedActivities;

    if (event.target.checked) {
      if (!list.includes(act)) {
        list.push(act);
      }
    } else {
      const index = list.indexOf(act);
      if (index > -1) list.splice(index, 1);
    }
  }

  /**
   * Submits preferences to backend
   */
  submitPreferences() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('⚠️ User not found. Please log in again.');
      return;
    }

    const fullPreferences = {
      userId,
      travelType: this.preferences.travelType?.toLowerCase(),
      preferredSeason: this.preferences.preferredSeason?.toLowerCase(),
      budget: this.preferences.budget,
      duration: this.preferences.duration,
      state: this.preferences.state?.toLowerCase() || undefined,
      interestedActivities: (this.preferences.interestedActivities || []).map(a => a.toLowerCase())
    };

    console.log('📤 Submitting preferences:', fullPreferences);

    this.http.post('http://localhost:5000/api/preferences', fullPreferences).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'], {
          state: { preferences: this.preferences }
        });
      },
      error: (err) => {
        console.error('Failed to save preferences', err);
        alert('Error: Could not save your preferences. Try again later.');
      }
    });
  }
}
