import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConfigService,
  AppConfig,
  Mission,
  SpecialChallenge,
} from '../../services/config.service';

@Component({
  selector: 'app-points-system',
  imports: [CommonModule],
  templateUrl: './points-system.component.html',
  styleUrls: ['./points-system.component.scss'],
})
export class PointsSystemComponent implements OnInit {
  config: AppConfig | null = null;
  missions: Mission[] = [];
  specialChallenges: SpecialChallenge[] = [];

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getAppConfig().subscribe((config) => {
      this.config = config;
      this.missions = config.pointsSystem.missions;
      this.specialChallenges = config.pointsSystem.specialChallenges;
    });
  }

  getMissionIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'amazon-q': 'Q',
      'ai-flight-tips': 'F',
      'code-increment': 'C',
      jira: 'J',
    };
    return iconMap[type] || 'T';
  }
}
