import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Mission {
  id: number;
  name: string;
  type: string;
  points: number;
  description: string;
  progress: number;
}

interface SpecialChallenge {
  id: number;
  name: string;
  bonusPoints: number;
  highlighted?: boolean;
}

@Component({
  selector: 'app-points-system',
  imports: [CommonModule],
  templateUrl: './points-system.component.html',
  styleUrls: ['./points-system.component.scss'],
})
export class PointsSystemComponent implements OnInit {
  missions: Mission[] = [
    {
      id: 1,
      name: 'Amazon Q Adoption',
      type: 'amazon-q',
      points: 20,
      description: 'Adoptar Amazon Q en cada ruta',
      progress: 90,
    },
    {
      id: 2,
      name: 'AI Flight Tips',
      type: 'ai-flight-tips',
      points: 30,
      description: 'Participar en entrenamientos AWS',
      progress: 0,
    },
    {
      id: 3,
      name: 'Incremento de Código',
      type: 'code-increment',
      points: 50,
      description: 'Incrementar líneas de código por ruta',
      progress: 5,
    },
    {
      id: 4,
      name: 'Gestión Jira (Tier 0 & 1)',
      type: 'jira',
      points: 75,
      description: 'Mantener operaciones críticas',
      progress: 0,
    },
  ];

  specialChallenges: SpecialChallenge[] = [
    {
      id: 1,
      name: 'Rules Documentation',
      bonusPoints: 50,
    },
    {
      id: 2,
      name: 'Liderar un Demo',
      bonusPoints: 100,
    },
    {
      id: 3,
      name: 'Construir un Use Case',
      bonusPoints: 120,
    },
    {
      id: 4,
      name: 'Game Day Challenge',
      bonusPoints: 300,
      highlighted: true,
    },
  ];

  constructor() {}

  ngOnInit() {
    // Los datos ya están definidos arriba
  }

  getMissionIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'amazon-q': 'Q',
      'ai-flight-tips': '✈️',
      'code-increment': '⚡',
      jira: 'J',
    };
    return iconMap[type] || '🎯';
  }
}
