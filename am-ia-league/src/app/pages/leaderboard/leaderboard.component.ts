import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Squad } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent implements OnInit {
  squads: Squad[] = [];
  topSquads: Squad[] = [];
  maxPoints = 3000;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getSquads().subscribe((squads) => {
      this.squads = squads.sort((a, b) => b.totalPoints - a.totalPoints);
      this.topSquads = this.squads.slice(0, 3);
    });
  }

  getProgressPercentage(points: number): number {
    return Math.round((points / this.maxPoints) * 100);
  }

  getPositionColor(position: number): string {
    const colors = {
      1: 'linear-gradient(135deg, #FFD700, #FFA500)',
      2: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
      3: 'linear-gradient(135deg, #CD7F32, #B8860B)',
    };
    return colors[position as keyof typeof colors] || 'var(--card-bg)';
  }

  formatPoints(points: number): string {
    if (points >= 1000) {
      return (points / 1000).toFixed(1) + 'K';
    }
    return points.toString();
  }

  getShortSquadName(squadName: string): string {
    const squadMap: { [key: string]: string } = {
      Alpha: 'ALP',
      Beta: 'BET',
      Gamma: 'GAM',
      Delta: 'DEL',
      Echo: 'ECH',
      Foxtrot: 'FOX',
    };
    return squadMap[squadName] || squadName.substring(0, 3).toUpperCase();
  }

  getSquadInitials(squadName: string): string {
    return squadName.substring(0, 2).toUpperCase();
  }

  getMidpoint(length: number): number {
    return Math.ceil(length / 2);
  }

  getFirstColumnDevs(developers: string[]): string[] {
    const totalMembers = developers.length + 1; // +1 for SM
    const firstColumnTotal = Math.ceil(totalMembers / 2);
    const devsInFirstColumn = firstColumnTotal - 1; // -1 for SM
    return developers.slice(0, Math.max(0, devsInFirstColumn));
  }

  getSecondColumnDevs(developers: string[]): string[] {
    const totalMembers = developers.length + 1; // +1 for SM
    const firstColumnTotal = Math.ceil(totalMembers / 2);
    const devsInFirstColumn = firstColumnTotal - 1; // -1 for SM
    return developers.slice(Math.max(0, devsInFirstColumn));
  }
}
