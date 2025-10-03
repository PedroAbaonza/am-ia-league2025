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

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getSquads().subscribe((squads) => {
      this.squads = squads.sort((a, b) => b.totalPoints - a.totalPoints);
      // Handle cases with fewer than 3 squads
      this.topSquads = this.squads.slice(0, Math.min(3, this.squads.length));
    });
  }

  getPositionColor(position: number): string {
    const colors = {
      1: 'linear-gradient(135deg, #FFD700, #FFA500)', // Gold
      2: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', // Silver
      3: 'linear-gradient(135deg, #CD7F32, #B8860B)', // Bronze
    };

    // For positions 4 and beyond, use a subtle gradient based on the squad's color
    if (position > 3) {
      const squad = this.squads[position - 1];
      if (squad) {
        return `linear-gradient(135deg, ${squad.color}40, ${squad.color}20)`;
      }
    }

    return colors[position as keyof typeof colors] || 'var(--card-bg)';
  }

  formatPoints(points: number): string {
    if (points >= 1000) {
      return (points / 1000).toFixed(1) + 'K';
    }
    return points.toString();
  }

  getShortSquadName(squadName: string): string {
    // Dynamic mapping for common squad names
    const squadMap: { [key: string]: string } = {
      'Alpha Squadron': 'ALP',
      'Beta Flight': 'BET',
      'Gamma Wings': 'GAM',
      'Delta Force': 'DEL',
      'Echo Team': 'ECH',
      'Foxtrot Squad': 'FOX',
      'Golf Unit': 'GOL',
      'Hotel Division': 'HOT',
      'India Corps': 'IND',
      'Juliet Brigade': 'JUL',
      'Kilo Battalion': 'KIL',
      'Lima Company': 'LIM',
      'Mike Platoon': 'MIK',
      'November Squad': 'NOV',
      'Oscar Team': 'OSC',
      'Papa Unit': 'PAP',
      'Quebec Force': 'QUE',
      'Romeo Wing': 'ROM',
      'Sierra Group': 'SIE',
      'Tango Squad': 'TAN',
    };

    // Check for exact match first
    if (squadMap[squadName]) {
      return squadMap[squadName];
    }

    // Check for partial matches (e.g., "Alpha" in "Alpha Squadron")
    for (const [key, value] of Object.entries(squadMap)) {
      if (squadName.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
        return value;
      }
    }

    // Fallback: create abbreviation from first letters of words
    const words = squadName.split(' ');
    if (words.length > 1) {
      return words
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 3);
    }

    // Final fallback: first 3 characters
    return squadName.substring(0, 3).toUpperCase();
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

  // Helper methods for dynamic squad handling
  getTotalSquads(): number {
    return this.squads.length;
  }

  hasMinimumSquads(): boolean {
    return this.squads.length >= 2;
  }

  getPodiumSquads(): Squad[] {
    return this.topSquads;
  }

  getSquadRank(squadId: number): number {
    return this.squads.findIndex((squad) => squad.id === squadId) + 1;
  }

  isTopThree(position: number): boolean {
    return position <= 3;
  }
}
