import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Squad } from '../../services/leaderboard.service';
import { RouteService } from '../../services/route.service';
import { ConfigService } from '../../services/config.service';

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

  // Datos para Progreso por Ruta - Estos se pueden cargar desde RouteService
  completedRoutes: Route[] = [];
  inProgressRoutes: Route[] = [];
  pendingRoutes: Route[] = [];

  // Datos para Retos Especiales - Estos se pueden cargar desde ConfigService
  totalDocumentations = 0;
  totalDemos = 0;
  specialChallenges: SpecialChallenge[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
    private routeService: RouteService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    // Cargar squads
    this.leaderboardService.getSquads().subscribe(squads => {
      this.squads = squads.sort((a, b) => b.totalPoints - a.totalPoints);
    });

    // Cargar rutas y organizarlas por estado
    this.routeService.getRoutes().subscribe(routes => {
      this.completedRoutes = routes
        .filter(route => route.status === 'completed')
        .map(route => ({
          name: route.name.replace('Ruta ', ''),
          averagePoints: Math.floor(Math.random() * 200) + 100, // Simulado
          status: route.status as 'completed' | 'in-progress' | 'pending'
        }));

      this.inProgressRoutes = routes
        .filter(route => route.status === 'in-progress')
        .map(route => ({
          name: route.name.replace('Ruta ', ''),
          averagePoints: 0,
          status: route.status as 'completed' | 'in-progress' | 'pending'
        }));

      this.pendingRoutes = routes
        .filter(route => route.status === 'upcoming')
        .map(route => ({
          name: route.name.replace('Ruta ', '').replace('Game Day Final - ', ''),
          averagePoints: 0,
          status: 'pending' as 'completed' | 'in-progress' | 'pending'
        }));
    });

    // Cargar configuración para retos especiales
    this.configService.getAppConfig().subscribe(config => {
      this.specialChallenges = config.pointsSystem.specialChallenges.map(challenge => ({
        name: challenge.name,
        points: challenge.bonusPoints,
        status: 'Aceptado' as 'Aceptado' | 'Pendiente'
      }));
      
      // Calcular totales
      this.totalDocumentations = this.specialChallenges.filter(c => 
        c.name.toLowerCase().includes('documentation')).length;
      this.totalDemos = this.specialChallenges.filter(c => 
        c.name.toLowerCase().includes('demo')).length;
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
