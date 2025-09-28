import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Squad } from '../../services/leaderboard.service';

@Component({
  selector: 'app-squads-overview',
  imports: [CommonModule],
  templateUrl: './squads-overview.component.html',
  styleUrl: './squads-overview.component.scss'
})
export class SquadsOverviewComponent implements OnInit {
  squads: Squad[] = [];
  maxPoints = 3000; // Objetivo máximo de puntos
  
  // Control de visibilidad de detalles
  showSquadsDetails = false;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.getSquads().subscribe(squads => {
      // Ordenar por puntos descendente
      this.squads = squads.sort((a, b) => b.totalPoints - a.totalPoints);
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
      1: 'linear-gradient(135deg, #FFD700, #FFA500)', // Oro
      2: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', // Plata
      3: 'linear-gradient(135deg, #CD7F32, #B8860B)'  // Bronce
    };
    return colors[position as keyof typeof colors] || 'var(--card-bg)';
  }
  
  // Método para controlar visibilidad de detalles
  toggleSquadsDetails() {
    this.showSquadsDetails = !this.showSquadsDetails;
  }
}
