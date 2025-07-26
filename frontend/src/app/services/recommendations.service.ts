// src/app/services/recommendations.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private nodeUrl = environment.apiUrlNode;   // your Express backend
  private flaskUrl = environment.apiUrlFlask; // your Flask (ML) backend

  constructor(private http: HttpClient) {}

  /** ML-backed recommendation: calls Flask */
  getDestinations(filters: {
    state: string | null;
    activity: string | null;
    travelType: string | null;
    budget: number | null;
    season: string | null;
  }): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.flaskUrl}/api/recommendations`,
      filters
    );
  }

  /** Alias if you ever use it */
  getRecommendations(preferences: any): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.flaskUrl}/api/recommendations`,
      preferences
    );
  }

  /** Other API calls go to your Node backend */
  getUserPreferences(userId: string): Observable<any> {
    return this.http.get<any>(`${this.nodeUrl}/api/preferences/${userId}`);
  }

  getByState(state: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.nodeUrl}/api/recommendations/state/${state}`
    );
  }

  getAllDestinations(): Observable<any[]> {
  return this.http.get<any[]>(`${this.nodeUrl}/api/destinations`);
}

  getStatesByExperience(experience: string, state?: string): Observable<string[]> {
    const query = state ? `?state=${state}` : '';
    return this.http.get<string[]>(
      `${this.nodeUrl}/api/recommendations/experience/${experience}${query}`
    );
  }

  getTopDestinations(): Observable<any[]> {
  return this.http.get<any[]>(`${this.nodeUrl}/api/destinations/top`);
}

}
