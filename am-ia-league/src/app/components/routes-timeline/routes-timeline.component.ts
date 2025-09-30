import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService, Route } from '../../services/route.service';

@Component({
  selector: 'app-routes-timeline',
  imports: [CommonModule],
  templateUrl: './routes-timeline.component.html',
  styleUrl: './routes-timeline.component.scss',
})
export class RoutesTimelineComponent implements OnInit {
  routes: Route[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    this.routeService.getRoutes().subscribe((routes) => {
      this.routes = routes;
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      completed: 'Completada',
      'in-progress': 'En Progreso',
      active: 'Activo',
      upcoming: 'Próxima',
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  }
}
