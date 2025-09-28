import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUtilsService } from '../../services/image-utils.service';

@Component({
  selector: 'app-image-example',
  imports: [CommonModule],
  templateUrl: './image-example.component.html',
  styleUrl: './image-example.component.scss'
})
export class ImageExampleComponent implements OnInit {
  developerName = 'Carlos Rodríguez';
  avatarData: { src: string; fallback: string } = { src: '', fallback: '' };
  showInitials = false;

  missionTypes = [
    { type: 'amazon-q', name: 'Amazon Q' },
    { type: 'ai-flight-tips', name: 'AI Flight Tips' },
    { type: 'code-increment', name: 'Code Increment' },
    { type: 'jira', name: 'Jira Integration' }
  ];

  constructor(public imageUtils: ImageUtilsService) {}

  ngOnInit() {
    this.avatarData = this.imageUtils.getAvatarWithFallback(this.developerName);
    
    // Precargar imagen crítica
    this.imageUtils.preloadImage(this.imageUtils.getLogo('aeromexico-logo.svg'))
      .then(() => console.log('Logo precargado'))
      .catch(() => console.log('Error precargando logo'));
  }
}
