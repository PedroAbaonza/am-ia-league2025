import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {
  private readonly basePath = '/assets/images';

  constructor() { }

  // Obtener ruta de logo
  getLogo(logoName: string): string {
    return `${this.basePath}/logos/${logoName}`;
  }

  // Obtener ruta de background
  getBackground(backgroundName: string): string {
    return `${this.basePath}/backgrounds/${backgroundName}`;
  }

  // Obtener ruta de icono
  getIcon(iconName: string): string {
    return `${this.basePath}/icons/${iconName}`;
  }

  // Obtener ruta de avatar con fallback
  getAvatar(developerName: string): string {
    const fileName = this.sanitizeFileName(developerName);
    return `${this.basePath}/avatars/${fileName}.jpg`;
  }

  // Obtener ruta de ilustración
  getIllustration(illustrationName: string): string {
    return `${this.basePath}/illustrations/${illustrationName}`;
  }

  // Obtener icono de misión por tipo
  getMissionIcon(missionType: string): string {
    const iconMap: { [key: string]: string } = {
      'amazon-q': 'mission-icons/amazon-q.svg',
      'ai-flight-tips': 'mission-icons/ai-flight-tips.svg',
      'code-increment': 'mission-icons/code-increment.svg',
      'jira': 'mission-icons/jira.svg'
    };
    
    const iconPath = iconMap[missionType] || 'mission-icons/default.svg';
    return `${this.basePath}/icons/${iconPath}`;
  }

  // Obtener avatar con iniciales como fallback
  getAvatarWithFallback(developerName: string): { src: string; fallback: string } {
    return {
      src: this.getAvatar(developerName),
      fallback: this.getInitials(developerName)
    };
  }

  // Generar iniciales para fallback
  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Sanitizar nombre para archivo
  private sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Verificar si imagen existe (para uso con error handling)
  handleImageError(event: any, fallbackSrc?: string): void {
    if (fallbackSrc) {
      event.target.src = fallbackSrc;
    } else {
      // Ocultar imagen si no hay fallback
      event.target.style.display = 'none';
    }
  }

  // Generar srcset para imágenes responsive
  generateSrcSet(baseName: string, directory: 'logos' | 'backgrounds' | 'icons' | 'avatars' | 'illustrations'): string {
    const basePath = `${this.basePath}/${directory}/${baseName}`;
    return `${basePath} 1x, ${basePath.replace('.', '@2x.')} 2x`;
  }

  // Obtener URL completa para CSS background
  getCssBackgroundUrl(imagePath: string): string {
    return `url('${imagePath}')`;
  }

  // Precargar imagen crítica
  preloadImage(imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = imagePath;
    });
  }
}
