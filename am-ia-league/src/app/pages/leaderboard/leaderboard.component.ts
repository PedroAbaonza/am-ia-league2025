import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Squad } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  squads: Squad[] = [];
  topSquads: Squad[] = [];
  maxPoints = 3000;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getSquads().subscribe(squads => {
      this.squads = squads.sort((a, b) => b.totalPoints - a.totalPoints);
      this.topSquads = this.squads.slice(0, 3);
    });
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getProgressPercentage(points: number): number {
    return Math.round((points / this.maxPoints) * 100);
  }

  getPositionColor(position: number): string {
    const colors = {
      1: 'linear-gradient(135deg, #FFD700, #FFA500)',
      2: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
      3: 'linear-gradient(135deg, #CD7F32, #B8860B)'
    };
    return colors[position as keyof typeof colors] || 'var(--card-bg)';
  }
}
