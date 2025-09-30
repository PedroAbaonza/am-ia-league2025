import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/event.service';
import { RouteService, Route } from '../../services/route.service';

interface RouteWithEvents {
  route: Route;
  events: Event[];
  status: 'past' | 'current' | 'upcoming' | 'future';
}

@Component({
  selector: 'app-important-dates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './important-dates.component.html',
  styleUrl: './important-dates.component.scss',
})
export class ImportantDatesComponent implements OnInit {
  events: Event[] = [];
  routes: Route[] = [];
  routesWithEvents: RouteWithEvents[] = [];
  filteredEvents: Event[] = [];
  selectedFilter: string = 'all';

  constructor(
    private eventService: EventService,
    private routeService: RouteService
  ) {}

  ngOnInit() {
    // Load both events and routes
    Promise.all([
      this.eventService.getEvents().toPromise(),
      this.routeService.getRoutes().toPromise(),
    ]).then(([events, routes]) => {
      this.events =
        events?.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ) || [];
      this.routes = routes || [];
      this.filteredEvents = [...this.events];
      this.organizeEventsByRoutes();
    });
  }

  getEventIcon(iconType: string): string {
    // Return empty string to remove emojis
    return '';
  }

  getEventTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'aws-training': 'AWS Training',
      demo: 'Demo Session',
      'working-hours': 'Working Hours',
    };
    return typeMap[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
    });
  }

  getEventStatus(dateString: string): string {
    const eventDate = new Date(dateString);
    const today = new Date();

    // Reset time to compare only dates
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 7) return 'upcoming';
    return 'future';
  }

  getEventStatusText(dateString: string): string {
    const status = this.getEventStatus(dateString);
    const statusMap: { [key: string]: string } = {
      past: 'Finalizado',
      today: 'Hoy',
      upcoming: 'Próximo',
      future: 'Programado',
    };
    return statusMap[status] || 'Programado';
  }

  organizeEventsByRoutes() {
    this.routesWithEvents = this.routes.map((route) => {
      // Find events that fall within this route's date range
      const routeEvents = this.events.filter((event) => {
        const eventDate = new Date(event.date);
        const routeStart = new Date(route.startDate);
        const routeEnd = new Date(route.endDate);
        return eventDate >= routeStart && eventDate <= routeEnd;
      });

      return {
        route,
        events: routeEvents,
        status: this.getRouteStatus(route.startDate, route.endDate),
      };
    });
  }

  getRouteStatus(
    startDate: string,
    endDate: string
  ): 'past' | 'current' | 'upcoming' | 'future' {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < today) return 'past';
    if (start <= today && today <= end) return 'current';
    if (
      start > today &&
      start.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000
    )
      return 'upcoming';
    return 'future';
  }

  filterEvents(type: string) {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter((event) => event.type === type);
    }
  }
}
