import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  private states$?: Observable<any[]>;

  constructor(private http: HttpClient) {}

  getAllStates(): Observable<any[]> {
    if (!this.states$) {
      this.states$ = this.http
        .get<any[]>('/assets/states.json')
        .pipe(shareReplay(1));
    }
    return this.states$;
  }

  getStateById(id: number): Observable<any> {
    return this.getAllStates().pipe(
      map(states => {
        const state = states.find(s => s.id === id);
        if (!state) {
          throw new Error(`State with id ${id} not found`);
        }
        return state;
      })
    );
  }
}
