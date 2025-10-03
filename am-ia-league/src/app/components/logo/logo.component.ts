import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUtilsService } from '../../services/image-utils.service';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit {
  @Input() type: 'aeromexico' | 'ai-league' = 'aeromexico';
  @Input() size: 'small' | 'medium' | 'medium-large' | 'large' = 'medium';
  @Input() showText: boolean = false;
  @Input() animated: boolean = false;

  showFallback = true; // Mostrar fallback por defecto hasta que tengas las imágenes reales

  constructor(private imageUtils: ImageUtilsService) {}

  ngOnInit() {
    // Precargar la imagen
    this.preloadImage();
  }

  getLogoSrc(): string {
    const logoMap = {
      aeromexico: 'aeromexico-logo.png',
      'ai-league': 'ai-league-logo.png',
    };
    return this.imageUtils.getLogo(logoMap[this.type]);
  }

  getLogoAlt(): string {
    const altMap = {
      aeromexico: 'Aeroméxico',
      'ai-league': 'Aeroméxico AI League 2025',
    };
    return altMap[this.type];
  }

  onImageError(event: any) {
    this.showFallback = true;
    event.target.style.display = 'none';
  }

  onImageLoad() {
    this.showFallback = false;
  }

  private preloadImage() {
    this.imageUtils.preloadImage(this.getLogoSrc()).catch(() => {
      this.showFallback = true;
    });
  }
}
