import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  constructor(private http: HttpClient) {}

  getAllDestinations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrlNode}/api/destinations`);
  }

  searchDestinations(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrlNode}/api/destinations/search?q=${query}`);
  }
}
