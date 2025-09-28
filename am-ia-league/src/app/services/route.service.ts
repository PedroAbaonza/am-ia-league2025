import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  color: string;
}

export interface Mission {
  id: number;
  name: string;
  type: string;
  points: number;
  routeId: number;
  description: string;
}

export interface SpecialChallenge {
  id: number;
  name: string;
  bonusPoints: number;
  deadline: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>('/assets/data/routes.json');
  }

  getMissions(): Observable<{missions: Mission[], specialChallenges: SpecialChallenge[]}> {
    return this.http.get<{missions: Mission[], specialChallenges: SpecialChallenge[]}>('/assets/data/missions.json');
  }
}
