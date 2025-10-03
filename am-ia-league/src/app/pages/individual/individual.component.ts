import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LeaderboardService,
  Individual,
} from '../../services/leaderboard.service';

@Component({
  selector: 'app-individual',
  imports: [CommonModule],
  templateUrl: './individual.component.html',
  styleUrl: './individual.component.scss',
})
export class IndividualComponent implements OnInit {
  individuals: Individual[] = [];
  topIndividuals: Individual[] = [];

  private squadColors: { [key: number]: string } = {
    1: '#00AEEF', // Aviation Blue
    2: '#FF2D82', // Squadron Pink
    3: '#10b981', // Emerald Green
    4: '#f97316', // Orange
    5: '#8b5cf6', // Purple
    6: '#eab308', // Gold
    7: '#ef4444', // Red
    8: '#14b8a6', // Teal
    9: '#f59e0b', // Amber
    10: '#6366f1', // Indigo
    11: '#ec4899', // Pink
    12: '#06b6d4', // Cyan
    13: '#84cc16', // Lime
    14: '#f472b6', // Rose
    15: '#22d3ee', // Light Blue
    16: '#a78bfa', // Light Purple
    17: '#fbbf24', // Yellow
    18: '#fb7185', // Light Pink
    19: '#34d399', // Light Green
    20: '#60a5fa', // Sky Blue
  };

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getIndividuals().subscribe((individuals) => {
      this.individuals = individuals.sort(
        (a, b) => b.totalPoints - a.totalPoints
      );
      this.topIndividuals = this.individuals.slice(0, 3);
    });
  }

  getSquadColor(squadId: number): string {
    // Use modulo to cycle through colors if squadId exceeds available colors
    const colorKeys = Object.keys(this.squadColors).map(Number);
    const maxColorId = Math.max(...colorKeys);
    const effectiveId =
      squadId > maxColorId ? ((squadId - 1) % maxColorId) + 1 : squadId;
    return this.squadColors[effectiveId] || '#00AEEF';
  }

  getOriginalPosition(dev: Individual): number {
    return this.individuals.findIndex((d) => d.id === dev.id) + 1;
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

  getShortRole(position: string): string {
    const roleMap: { [key: string]: string } = {
      Developer: 'DEV',
      'Senior Developer': 'SDEV',
      'Lead Developer': 'LEAD',
      DevOps: 'DVPS',
      Architect: 'ARCH',
      Manager: 'MGR',
      'Scrum Master': 'SM',
      'Product Owner': 'PO',
    };
    return roleMap[position] || position.substring(0, 4).toUpperCase();
  }
}
