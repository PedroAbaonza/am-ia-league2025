import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AdminService } from './admin.service';

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

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) { }

  getSquads(): Observable<Squad[]> {
    // Verificar si hay datos subidos por admin
    const uploadedData = this.adminService.getSquadsData();
    if (uploadedData && uploadedData.length > 0) {
      return of(uploadedData);
    }
    
    // Fallback a datos estáticos
    return this.http.get<Squad[]>('/assets/data/squads.json');
  }

  getIndividuals(): Observable<Individual[]> {
    // Verificar si hay datos subidos por admin
    const uploadedData = this.adminService.getIndividualsData();
    if (uploadedData && uploadedData.length > 0) {
      return of(uploadedData);
    }
    
    // Fallback a datos estáticos
    return this.http.get<Individual[]>('/assets/data/individuals.json');
  }
}
