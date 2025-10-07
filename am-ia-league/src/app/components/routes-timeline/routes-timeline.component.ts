import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService, Route } from '../../services/route.service';
import { EventService, Event } from '../../services/event.service';

interface RouteWithEvents {
  route: Route;
  events: Event[];
  status: 'past' | 'current' | 'upcoming' | 'future';
}

@Component({
  selector: 'app-routes-timeline',
  imports: [CommonModule],
  templateUrl: './routes-timeline.component.html',
  styleUrl: './routes-timeline.component.scss',
})
export class RoutesTimelineComponent implements OnInit {
  routes: Route[] = [];
  events: Event[] = [];
  routesWithEvents: RouteWithEvents[] = [];

  constructor(
    private routeService: RouteService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    Promise.all([
      this.eventService.getEvents().toPromise(),
      this.routeService.getRoutes().toPromise(),
    ]).then(([events, routes]) => {
      this.events =
        events?.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ) || [];
      this.routes = routes || [];
      this.organizeEventsByRoutes();
    });
  }

  organizeEventsByRoutes() {
    const firstRouteStartStr = this.routes[0]?.startDate || '2025-10-09';
    const [year1, month1, day1] = firstRouteStartStr.split('-').map(Number);
    const firstRouteStart = new Date(year1, month1 - 1, day1);

    const preRouteEvents = this.events.filter((event) => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate < firstRouteStart;
    });

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

    const assignedEventIds = new Set<string>();

    this.routes.forEach((route, routeIndex) => {
      const routeEvents = this.events.filter((event) => {
        if (assignedEventIds.has(event.date + event.title)) {
          return false;
        }

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

        if (eventDate >= routeStart && eventDate <= routeEnd) {
          if (eventDate.getTime() === routeStart.getTime()) {
            return true;
          }

          if (eventDate.getTime() === routeEnd.getTime()) {
            const nextRoute = this.routes[routeIndex + 1];
            if (nextRoute) {
              const [nextStartYear, nextStartMonth, nextStartDay] =
                nextRoute.startDate.split('-').map(Number);
              const nextRouteStart = new Date(
                nextStartYear,
                nextStartMonth - 1,
                nextStartDay
              );

              if (eventDate.getTime() === nextRouteStart.getTime()) {
                return false;
              }
            }
            return true;
          }

          return true;
        }

        return false;
      });

      routeEvents.forEach((event) => {
        assignedEventIds.add(event.date + event.title);
      });

      this.routesWithEvents.push({
        route,
        events: routeEvents,
        status: this.getRouteStatus(route.startDate, route.endDate),
      });
    });

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

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      completed: 'Completada',
      'in-progress': 'En Progreso',
      active: 'Activo',
      upcoming: 'Próxima',
      past: 'Completada',
      current: 'En Progreso',
      future: 'Próxima',
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  }

  formatDateShort(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
    });
  }
}
