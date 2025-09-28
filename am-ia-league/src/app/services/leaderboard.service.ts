import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Squad {
  id: number;
  name: string;
  scrumMaster: string;
  developers: string[];
  totalPoints: number;
  color: string;
}

export interface Individual {
  id: number;
  name: string;
  squadId: number;
  squadName: string;
  position: string;
  totalPoints: number;
  completedMissions: number;
  specialChallenges: number;
  avatar: string;
  level: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  getSquads(): Observable<Squad[]> {
    return this.http.get<Squad[]>('/assets/data/squads.json');
  }

  getIndividuals(): Observable<Individual[]> {
    return this.http.get<Individual[]>('/assets/data/individuals.json');
  }
}
