import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { ConfigService, AppConfig } from '../../services/config.service';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '0.8s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(
          '0.6s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate(
          '0.6s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate(
          '0.7s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HeroSectionComponent implements OnInit {
  config: AppConfig | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getAppConfig().subscribe((config) => {
      this.config = config;
    });
  }

  formatDateRange(): string {
    if (!this.config) return '';

    const startDate = new Date(this.config.event.startDate);
    const endDate = new Date(this.config.event.endDate);

    const startFormatted = startDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
    });
    const endFormatted = endDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return `${startFormatted} – ${endFormatted}`;
  }

  scrollToRoutes(): void {
    const routesElement = document.querySelector('app-routes-timeline');
    if (routesElement) {
      routesElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
