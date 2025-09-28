import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-important-dates',
  imports: [CommonModule],
  templateUrl: './important-dates.component.html',
  styleUrl: './important-dates.component.scss'
})
export class ImportantDatesComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedFilter: string = 'all';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.filteredEvents = [...this.events];
    });
  }

  getEventIcon(iconType: string): string {
    const iconMap: { [key: string]: string } = {
      'cloud': '☁️',
      'presentation': '📊',
      'code': '💻'
    };
    return iconMap[iconType] || '📅';
  }

  getEventTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'aws-training': 'AWS Training',
      'demo': 'Demo Session',
      'working-hours': 'Working Hours'
    };
    return typeMap[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long'
    });
  }

  getEventStatus(dateString: string): string {
    const eventDate = new Date(dateString);
    const today = new Date();
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
      'past': 'Finalizado',
      'today': 'Hoy',
      'upcoming': 'Próximo',
      'future': 'Programado'
    };
    return statusMap[status] || 'Programado';
  }

  filterEvents(type: string) {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.type === type);
    }
  }
}
