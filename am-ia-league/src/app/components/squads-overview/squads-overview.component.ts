import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Squad } from '../../services/leaderboard.service';

interface Route {
  name: string;
  averagePoints: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface SpecialChallenge {
  name: string;
  points: number;
  status: 'Aceptado' | 'Pendiente';
}

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

  // Datos para Progreso por Ruta
  completedRoutes: Route[] = [
    { name: 'Cancún', averagePoints: 143, status: 'completed' },
    { name: 'Bogotá', averagePoints: 118, status: 'completed' }
  ];

  inProgressRoutes: Route[] = [
    { name: 'Michoacán', averagePoints: 0, status: 'in-progress' }
  ];

  pendingRoutes: Route[] = [
    { name: 'Amsterdam', averagePoints: 0, status: 'pending' },
    { name: 'Tokio', averagePoints: 0, status: 'pending' },
    { name: 'CDMX', averagePoints: 0, status: 'pending' }
  ];

  // Datos para Retos Especiales
  totalDocumentations = 8;
  totalDemos = 3;

  specialChallenges: SpecialChallenge[] = [
    { name: 'Rules Documentation', points: 50, status: 'Aceptado' },
    { name: 'Liderar Demo', points: 100, status: 'Aceptado' },
    { name: 'Use Case', points: 120, status: 'Aceptado' },
    { name: 'Game Day Challenge', points: 0, status: 'Aceptado' }
  ];

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
