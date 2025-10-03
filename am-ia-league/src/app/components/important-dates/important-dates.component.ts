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
      'aws-training': 'IA Flight Tips',
      demo: 'IA Demo Show',
      'working-hours': 'Hangar de preguntas',
      kickoff: 'Kick Off',
      gameday: 'Game Day',
      awards: 'Premiación',
    };
    return typeMap[type] || type;
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDateShort(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
    });
  }

  getEventStatus(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day); // month is 0-indexed
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
    // Find events before the first route to include with the first route
    const firstRouteStartStr = this.routes[0]?.startDate || '2025-10-09';
    const [year1, month1, day1] = firstRouteStartStr.split('-').map(Number);
    const firstRouteStart = new Date(year1, month1 - 1, day1);

    const preRouteEvents = this.events.filter((event) => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate < firstRouteStart;
    });

    // Find events after the last route
    const lastRouteEndStr =
      this.routes[this.routes.length - 1]?.endDate || '2025-12-12';
    const [year2, month2, day2] = lastRouteEndStr.split('-').map(Number);
    const lastRouteEnd = new Date(year2, month2 - 1, day2);

    const postRouteEvents = this.events.filter((event) => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate > lastRouteEnd;
    });

    this.routesWithEvents = [];

    // Add pre-route events if any exist (like Kick Off)
    if (preRouteEvents.length > 0) {
      this.routesWithEvents.push({
        route: {
          id: 0,
          name: 'Kick Off',
          startDate: preRouteEvents[0].date,
          endDate: preRouteEvents[preRouteEvents.length - 1].date,
          status: 'completed',
          description: 'Evento de inauguración de la liga',
          color: '#10b981',
        },
        events: preRouteEvents,
        status: this.getRouteStatus(
          preRouteEvents[0].date,
          preRouteEvents[preRouteEvents.length - 1].date
        ),
      });
    }

    // Add regular routes with their events
    this.routes.forEach((route) => {
      const routeEvents = this.events.filter((event) => {
        const [year, month, day] = event.date.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        const [startYear, startMonth, startDay] = route.startDate
          .split('-')
          .map(Number);
        const routeStart = new Date(startYear, startMonth - 1, startDay);
        const [endYear, endMonth, endDay] = route.endDate
          .split('-')
          .map(Number);
        const routeEnd = new Date(endYear, endMonth - 1, endDay);
        return eventDate >= routeStart && eventDate <= routeEnd;
      });

      this.routesWithEvents.push({
        route,
        events: routeEvents,
        status: this.getRouteStatus(route.startDate, route.endDate),
      });
    });

    // Add post-route events if any exist
    if (postRouteEvents.length > 0) {
      this.routesWithEvents.push({
        route: {
          id: 999,
          name: 'Eventos Finales',
          startDate: postRouteEvents[0].date,
          endDate: postRouteEvents[postRouteEvents.length - 1].date,
          status: 'upcoming',
          description: 'Eventos de cierre y premiación',
          color: '#f59e0b',
        },
        events: postRouteEvents,
        status: this.getRouteStatus(
          postRouteEvents[0].date,
          postRouteEvents[postRouteEvents.length - 1].date
        ),
      });
    }
  }

  getRouteStatus(
    startDate: string,
    endDate: string
  ): 'past' | 'current' | 'upcoming' | 'future' {
    const today = new Date();
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const end = new Date(endYear, endMonth - 1, endDay);

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

  isEventHighlighted(event: Event): boolean {
    if (this.selectedFilter === 'all') {
      return true; // All events are highlighted when no filter is active
    }
    return event.type === this.selectedFilter;
  }

  getDaysRemaining(dateString: string): number {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();

    // Reset time to compare only dates
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  shouldShowDaysRemaining(dateString: string): boolean {
    const status = this.getEventStatus(dateString);
    return status === 'today' || status === 'upcoming';
  }
}
