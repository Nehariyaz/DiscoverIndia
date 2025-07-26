import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  query: string = '';
  destinations: any[] = [];
  suggestions: string[] = [];
  isLoading: boolean = true;

  loggedIn = false;

  constructor(
    private router: Router,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });

    this.destinationService.getAllDestinations().subscribe({
      next: (data) => {
        this.destinations = data;
        this.isLoading = false;
        console.log('Fetched destinations:', this.destinations);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching destinations:', err);
      }
    });
  }

  checkLoginStatus() {
    this.loggedIn = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedIn = false;
    this.router.navigate(['/account']);
  }

  onInputChange() {
    const search = this.query.trim().toLowerCase();
    if (!search || this.destinations.length === 0) {
      this.suggestions = [];
      return;
    }

    const names = new Set<string>();

    this.destinations.forEach(dest => {
      if (dest.name?.toLowerCase().includes(search)) {
        names.add(dest.name);
      }
      if (dest.state?.toLowerCase().includes(search)) {
        names.add(dest.state);
      }
    });

    this.suggestions = Array.from(names).slice(0, 5);
  }

  selectSuggestion(suggestion: string) {
    this.query = suggestion;
    this.suggestions = [];
    this.onSubmitSearch(new Event('submit'));
  }

  onSubmitSearch(event: Event) {
    event.preventDefault();

    const rawSearch = this.query.trim().toLowerCase();
    if (!rawSearch || this.isLoading || this.destinations.length === 0) return;

    const matchedDestination = this.destinations.find(dest =>
      dest.name?.toLowerCase().includes(rawSearch)
    );

    if (matchedDestination) {
      const slug = matchedDestination.name.toLowerCase().replace(/\s+/g, '-');
      if (!matchedDestination.stateId) return;

      this.router.navigate(['/destination', slug], {
        state: {
          placeData: matchedDestination,
          stateId: matchedDestination.stateId
        }
      });
      return;
    }

    const matchedState = this.destinations.find(dest =>
      dest.state?.toLowerCase().includes(rawSearch)
    );

    if (matchedState) {
      this.router.navigate(['/state', matchedState.stateId]);
      return;
    }

    alert('No matching destination or state found.');
  }

  clearSearch() {
    this.query = '';
    this.suggestions = [];
  }
}
