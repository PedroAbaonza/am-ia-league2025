import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LeaderboardService } from './leaderboard.service';

export interface AppConfig {
  event: {
    title: string;
    subtitle: string;
    edition: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  stats: {
    weeks: number;
    routes: number;
    squads: number;
    missions: number;
  };
  pointsSystem: {
    title: string;
    subtitle: string;
    missions: Mission[];
    specialChallenges: SpecialChallenge[];
    squadExample: {
      title: string;
      subtitle: string;
      members: number;
      calculation: {
        description: string;
        points: number;
        multiplier: number;
        total: number;
      };
    };
  };
}

export interface Mission {
  id: number;
  name: string;
  type: string;
  points: number;
  description: string;
  progress: number;
}

export interface SpecialChallenge {
  id: number;
  name: string;
  bonusPoints: number;
  highlighted?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private http: HttpClient,
    private leaderboardService: LeaderboardService
  ) {}

  getAppConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/assets/data/app-config.json').pipe(
      switchMap((config) =>
        this.leaderboardService.getSquads().pipe(
          map((squads) => ({
            ...config,
            stats: {
              ...config.stats,
              squads: squads.length, // Dynamically set squad count
            },
          }))
        )
      )
    );
  }
}
