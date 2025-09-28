import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService, Mission, SpecialChallenge } from '../../services/route.service';

@Component({
  selector: 'app-points-system',
  imports: [CommonModule],
  templateUrl: './points-system.component.html',
  styleUrl: './points-system.component.scss'
})
export class PointsSystemComponent implements OnInit {
  missions: Mission[] = [];
  specialChallenges: SpecialChallenge[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    this.routeService.getMissions().subscribe(data => {
      this.missions = data.missions;
      this.specialChallenges = data.specialChallenges;
    });
  }

  getMissionIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'amazon-q': 'Q',
      'ai-flight-tips': '✈️',
      'code-increment': '⚡',
      'jira': 'J'
    };
    return iconMap[type] || '🎯';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  }
}
