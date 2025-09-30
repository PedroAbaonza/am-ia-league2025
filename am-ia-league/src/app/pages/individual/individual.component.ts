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
  filteredIndividuals: Individual[] = [];
  topIndividuals: Individual[] = [];
  selectedFilter = 'all';
  maxPoints = 520; // Puntos del líder

  private squadColors: { [key: number]: string } = {
    1: '#00AEEF',
    2: '#FF2D82',
    3: '#00AEEF',
    4: '#FF2D82',
    5: '#00AEEF',
    6: '#FF2D82',
  };

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getIndividuals().subscribe((individuals) => {
      this.individuals = individuals.sort(
        (a, b) => b.totalPoints - a.totalPoints
      );
      this.filteredIndividuals = [...this.individuals];
      this.topIndividuals = this.individuals.slice(0, 3);
      this.maxPoints = this.individuals[0]?.totalPoints || 520;
    });
  }

  filterByLevel(level: string) {
    this.selectedFilter = level;
    if (level === 'all') {
      this.filteredIndividuals = [...this.individuals];
    } else {
      this.filteredIndividuals = this.individuals.filter(
        (dev) => dev.level === level
      );
    }
  }

  getSquadColor(squadId: number): string {
    return this.squadColors[squadId] || '#00AEEF';
  }

  getOriginalPosition(dev: Individual): number {
    return this.individuals.findIndex((d) => d.id === dev.id) + 1;
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
