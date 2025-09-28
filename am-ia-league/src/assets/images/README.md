# 📸 Assets de Imágenes - Aeroméxico AI League 2025

Directorio organizado para todos los recursos visuales de la aplicación.

## 📁 Estructura de Directorios

### `/logos`
Logotipos oficiales de Aeroméxico y AI League
- **Formatos recomendados**: SVG, PNG con transparencia
- **Resoluciones**: 
  - Logo principal: 400x200px (2x para retina)
  - Logo compacto: 200x100px (2x para retina)
- **Archivos sugeridos**:
  - `aeromexico-logo.svg`
  - `ai-league-logo.svg` 
  - `combined-logo.png`

### `/backgrounds`
Fondos y texturas para secciones
- **Formatos**: JPG (optimizado), WebP
- **Resoluciones**: 1920x1080px mínimo
- **Archivos sugeridos**:
  - `hero-background.jpg`
  - `space-texture.jpg`
  - `aircraft-silhouette.png`
  - `stars-pattern.png`

### `/icons`
Iconografía temática y funcional
- **Formatos**: SVG preferido, PNG 32x32, 64x64
- **Estilo**: Línea fina, colores de la paleta
- **Archivos sugeridos**:
  - `airplane-icon.svg`
  - `trophy-icon.svg`
  - `mission-icons/` (subdirectorio)
    - `amazon-q.svg`
    - `ai-flight-tips.svg`
    - `code-increment.svg`
    - `jira.svg`

### `/avatars`
Fotos de perfil y avatares de desarrolladores
- **Formatos**: JPG, PNG
- **Resolución**: 200x200px (cuadrado)
- **Naming**: `nombre-apellido.jpg`
- **Fallback**: Sistema de iniciales ya implementado

### `/illustrations`
Ilustraciones decorativas y gráficos
- **Formatos**: SVG, PNG con transparencia
- **Estilo**: Flat design, colores corporativos
- **Archivos sugeridos**:
  - `podium-3d.svg`
  - `flight-path.svg`
  - `rocket-launch.svg`
  - `team-collaboration.svg`

## 🎨 Especificaciones de Diseño

### Paleta de Colores para Assets
```
Deep Space Blue: #0A1033
Aviation Blue: #00AEEF  
Sky Blue Neon: #00D4FF
Squadron Pink: #FF2D82
White Falcon: #FFFFFF
```

### Guías de Optimización
- **Compresión**: Usar TinyPNG o similar
- **Formatos modernos**: WebP para navegadores compatibles
- **Lazy loading**: Implementado automáticamente
- **Responsive**: Proveer versiones @2x para retina

## 🔧 Implementación en Código

### Importar Imágenes en Componentes
```typescript
// En el componente TypeScript
export class MyComponent {
  logoPath = '/assets/images/logos/aeromexico-logo.svg';
  backgroundImage = '/assets/images/backgrounds/hero-background.jpg';
}
```

### Uso en Templates HTML
```html
<!-- Logo responsive -->
<img 
  src="/assets/images/logos/aeromexico-logo.svg" 
  alt="Aeroméxico AI League"
  class="logo-responsive">

<!-- Background con CSS -->
<div class="hero-section" 
     [style.background-image]="'url(/assets/images/backgrounds/hero-background.jpg)'">
</div>

<!-- Avatar con fallback -->
<img 
  src="/assets/images/avatars/{{ developer.name | lowercase | replace:' ':'-' }}.jpg"
  [alt]="developer.name"
  (error)="useInitialsAvatar($event)"
  class="developer-avatar">
```

### CSS con Assets
```scss
.hero-section {
  background: 
    url('/assets/images/backgrounds/stars-pattern.png'),
    linear-gradient(180deg, var(--deep-space-blue) 0%, rgba(0, 46, 109, 0.3) 100%);
  background-size: 200px 100px, cover;
}

.mission-icon {
  &.amazon-q {
    background-image: url('/assets/images/icons/mission-icons/amazon-q.svg');
  }
  
  &.ai-flight-tips {
    background-image: url('/assets/images/icons/mission-icons/ai-flight-tips.svg');
  }
}
```

## 📱 Responsive Images

### Implementación con srcset
```html
<img 
  src="/assets/images/logos/aeromexico-logo.svg"
  srcset="
    /assets/images/logos/aeromexico-logo.svg 1x,
    /assets/images/logos/aeromexico-logo@2x.svg 2x
  "
  alt="Aeroméxico AI League">
```

### CSS Media Queries
```scss
.hero-background {
  background-image: url('/assets/images/backgrounds/hero-mobile.jpg');
  
  @media (min-width: 768px) {
    background-image: url('/assets/images/backgrounds/hero-tablet.jpg');
  }
  
  @media (min-width: 1200px) {
    background-image: url('/assets/images/backgrounds/hero-desktop.jpg');
  }
}
```

## 🚀 Optimización y Performance

### Lazy Loading Automático
```html
<!-- Angular implementa lazy loading automáticamente -->
<img 
  src="/assets/images/illustrations/team-collaboration.svg"
  loading="lazy"
  alt="Team Collaboration">
```

### Preload de Imágenes Críticas
```html
<!-- En index.html para imágenes críticas -->
<link rel="preload" as="image" href="/assets/images/logos/aeromexico-logo.svg">
<link rel="preload" as="image" href="/assets/images/backgrounds/hero-background.jpg">
```

## 📋 Checklist de Assets

### ✅ Logos
- [ ] Logo Aeroméxico oficial
- [ ] Logo AI League 2025
- [ ] Versión combinada
- [ ] Versiones monocromáticas

### ✅ Backgrounds
- [ ] Hero principal
- [ ] Textura de estrellas
- [ ] Gradientes corporativos
- [ ] Siluetas de aviones

### ✅ Icons
- [ ] Iconos de misiones (4 tipos)
- [ ] Iconos de navegación
- [ ] Iconos de estado
- [ ] Trofeos y medallas

### ✅ Avatars
- [ ] Fotos de desarrolladores (30)
- [ ] Fotos de Scrum Masters (6)
- [ ] Placeholder genérico

### ✅ Illustrations
- [ ] Podio 3D
- [ ] Ruta de vuelo
- [ ] Cohete/lanzamiento
- [ ] Colaboración en equipo

## 🔄 Workflow de Actualización

1. **Agregar imagen** al directorio correspondiente
2. **Optimizar** con herramientas de compresión
3. **Actualizar** referencias en código
4. **Probar** en diferentes resoluciones
5. **Commit** con mensaje descriptivo

## 📞 Contacto

Para solicitudes de assets específicos o modificaciones de diseño, contactar al equipo de UX/UI de Aeroméxico.

---

**Nota**: Todos los assets deben cumplir con las guías de marca de Aeroméxico y tener los derechos de uso correspondientes.