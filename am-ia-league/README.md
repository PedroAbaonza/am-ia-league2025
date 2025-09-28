# Aeroméxico AI League 2025 🛩️

Portal estático de visualización para la competencia interna de inteligencia artificial de Aeroméxico.

## 🚀 Características

### 📱 Páginas Principales
- **Home** (`/`) - Landing page con hero, timeline de rutas, sistema de puntos, overview de squads y fechas importantes
- **Leaderboard** (`/leaderboard`) - Ranking de squads con podio top 3 y tabla completa
- **Individual** (`/individual`) - Ranking individual de los 30 desarrolladores con filtros por nivel
- **404** (`/404`) - Página de error personalizada con temática aeronáutica

### 🎨 Diseño y Branding

#### Paleta de Colores
- **Deep Space Blue** (`#0A1033`) - Fondo principal
- **Sky Blue Neon** (`#00AEEF`) - Borders, highlights, botones secundarios
- **White Falcon** (`#FFFFFF`) - Texto principal y contrastes
- **Squadron Pink** (`#FF2D82`) - CTAs y elementos destacados
- **Gradient Night Sky** - Gradientes de fondo

#### Tipografías
- **Primaria**: Montserrat (headers, navegación)
- **Secundaria**: Roboto Mono (stats, números, rankings)

#### Componentes UI
- Cards con bordes suaves y sombras ligeras
- Botones redondeados con efectos glow
- Podium visual para Top 3 en rankings
- Fondo con estrellas CSS animadas
- Navegación responsive con hamburguesa en mobile

### 📊 Datos y Funcionalidad

#### Mock Data
- `assets/data/routes.json` - 6 rutas de competencia con fechas y estados
- `assets/data/missions.json` - 24 misiones regulares y 4 retos especiales
- `assets/data/squads.json` - 6 squads con miembros y puntos
- `assets/data/individuals.json` - 30 desarrolladores con stats individuales
- `assets/data/events.json` - AWS trainings, demos y working hours

#### Assets de Imágenes
- `assets/images/logos/` - Logotipos oficiales de Aeroméxico y AI League
- `assets/images/backgrounds/` - Fondos y texturas para secciones
- `assets/images/icons/` - Iconografía temática y funcional
- `assets/images/avatars/` - Fotos de perfil de desarrolladores
- `assets/images/illustrations/` - Ilustraciones decorativas y gráficos

#### Servicios Angular
- **RouteService** - Gestión de rutas y misiones
- **LeaderboardService** - Squads y rankings individuales
- **EventService** - Fechas importantes y eventos
- **ImageUtilsService** - Utilidades para manejo de assets de imágenes

### 🏗️ Arquitectura

#### Estructura de Componentes
```
src/app/
├── components/
│   ├── hero-section/           # Hero principal con stats y CTAs
│   ├── routes-timeline/        # Timeline vertical de 6 rutas
│   ├── points-system/          # Sistema de puntos y retos
│   ├── squads-overview/        # Overview de 6 squads
│   ├── important-dates/        # Grid de eventos importantes
│   └── navigation/             # Navbar responsive
├── pages/
│   ├── home/                   # Landing page completa
│   ├── leaderboard/            # Ranking de squads
│   ├── individual/             # Ranking individual
│   └── not-found/              # Página 404 temática
└── services/
    ├── route.service.ts        # Rutas y misiones
    ├── leaderboard.service.ts  # Rankings y squads
    ├── event.service.ts        # Eventos y fechas
    └── image-utils.service.ts  # Utilidades de imágenes
```

#### Rutas
- `/` - Home (componente completo)
- `/leaderboard` - Squad leaderboard con podio
- `/individual` - Individual ranking con filtros
- `/404` - Error page aeronáutica
- `/**` - Redirect a 404

## 🔐 Panel de Administración

### Acceso
- **URL**: `http://localhost:4200/admin`
- **Contraseña**: `aeromexico2025`
- **Acceso discreto**: Icono ⚙️ en el footer

### Funcionalidades
- **Subida de CSV**: Actualizar datos de leaderboards dinámicamente
- **Gestión de datos**: Alternar entre datos estáticos y subidos
- **Monitoreo**: Estado actual y estadísticas de datos
- **Reset**: Volver a datos estáticos en cualquier momento

### Formatos CSV Soportados
```csv
# Squads
squadName,scrumMaster,name,points

# Individuales  
name,squadName,position,points,missions,challenges,level
```

Ver `ADMIN-PANEL.md` para documentación completa.

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ (recomendado LTS)
- Angular CLI 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd am-ia-league

# Instalar dependencias
npm install

# IMPORTANTE: Agregar las imágenes de logos
# Ver INSTRUCCIONES-IMAGENES.md para detalles
cp aeromexico-logo.png src/assets/images/logos/
cp ai-league-logo.png src/assets/images/logos/

# Servir en desarrollo
ng serve

# Abrir en navegador
http://localhost:4200
```

### Scripts Disponibles
```bash
# Desarrollo
ng serve                    # Servidor de desarrollo
ng serve --open            # Abrir automáticamente en navegador

# Build
ng build                    # Build de producción
ng build --watch           # Build con watch mode

# Testing
ng test                     # Unit tests
ng e2e                      # End-to-end tests

# Linting
ng lint                     # ESLint
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Características Mobile
- Navegación hamburguesa colapsable
- Timeline horizontal en mobile
- Grid adaptativo para cards
- Scroll horizontal en leaderboards
- Podios apilados verticalmente

## 🎯 Funcionalidades Destacadas

### Hero Section
- Título animado con gradiente
- Stats rápidos en cards (14 semanas, 6 rutas, 6 squads, 28 desafíos)
- CTAs principales: Explorar Rutas, Ver Squads, Ranking Individual

### Routes Timeline
- Timeline vertical alternada (izquierda/derecha)
- 6 rutas con estados: Completada / En progreso / Próxima
- Marcadores animados con colores por estado
- Responsive: línea lateral en mobile

### Points System
- Misiones regulares: Amazon Q, AI Flight Tips, Incremento de Código, Jira
- Retos especiales con bonus points
- Ejemplo de cálculo por squad
- Iconografía temática para cada tipo de misión

### Squads Overview
- Stats circulares: 6 squads, 5 devs por squad, 1 scrum master
- Cards con ranking por puntos
- Avatares con iniciales de desarrolladores
- Barras de progreso hacia objetivo

### Leaderboard
- Podio 3D para top 3 squads
- Tabla completa con avatares de miembros
- Colores distintivos por posición (oro, plata, bronce)
- Progreso visual hacia meta de puntos

### Individual Ranking
- Top 30 desarrolladores
- Filtros por nivel: Expert, Advanced, Intermediate, Beginner
- Stats individuales: puntos, misiones, retos especiales
- Badges de squad con colores identificativos

### Important Dates
- Grid responsive de eventos
- Tipos: AWS Trainings, Demo Sessions, Working Hours
- Estados: Finalizado, Hoy, Próximo, Programado
- Filtros por tipo de evento

## 📸 Gestión de Imágenes

### Estructura de Assets
```
src/assets/images/
├── logos/              # Logotipos oficiales
├── backgrounds/        # Fondos y texturas
├── icons/             # Iconografía temática
│   └── mission-icons/ # Iconos específicos de misiones
├── avatars/           # Fotos de desarrolladores
└── illustrations/     # Gráficos decorativos
```

### Servicio ImageUtilsService
```typescript
// Inyectar el servicio
constructor(private imageUtils: ImageUtilsService) {}

// Obtener rutas de imágenes
logoPath = this.imageUtils.getLogo('aeromexico-logo.svg');
avatarPath = this.imageUtils.getAvatar('carlos-rodriguez');
iconPath = this.imageUtils.getMissionIcon('amazon-q');

// Avatar con fallback a iniciales
avatarData = this.imageUtils.getAvatarWithFallback('Carlos Rodríguez');
// Retorna: { src: '/assets/images/avatars/carlos-rodriguez.jpg', fallback: 'CR' }
```

### Uso en Templates
```html
<!-- Logo responsive -->
<img [src]="imageUtils.getLogo('aeromexico-logo.svg')" 
     alt="Aeroméxico AI League">

<!-- Avatar con fallback -->
<img [src]="avatarData.src" 
     (error)="showInitials = true"
     class="avatar">
<div *ngIf="showInitials" class="avatar-fallback">
  {{ avatarData.fallback }}
</div>

<!-- Background dinámico -->
<div [style.background-image]="imageUtils.getCssBackgroundUrl(backgroundPath)">
</div>
```

### Especificaciones de Assets
- **Logos**: SVG preferido, PNG con transparencia
- **Backgrounds**: JPG optimizado, WebP, 1920x1080px mínimo
- **Icons**: SVG, PNG 32x32/64x64px
- **Avatars**: JPG/PNG, 200x200px cuadrado
- **Illustrations**: SVG, PNG con transparencia

## 🎨 Guía de Estilos

### Variables CSS
```scss
:root {
  --deep-space-blue: #0A1033;
  --aviation-blue: #00AEEF;
  --sky-blue-neon: #00D4FF;
  --squadron-pink: #FF2D82;
  --text-primary: #FFFFFF;
  --text-secondary: #F3F4F6;
  --text-muted: #9CA3AF;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --glow-blue: 0 0 20px rgba(0, 174, 239, 0.3);
  --glow-pink: 0 0 20px rgba(255, 45, 130, 0.3);
}
```

### Clases Utilitarias
```scss
.gradient-text        // Texto con gradiente azul
.glow-blue           // Sombra azul brillante
.glow-pink           // Sombra rosa brillante
.font-primary        // Montserrat
.font-mono           // Roboto Mono
```

## 🚀 Deployment

### Build de Producción
```bash
ng build --configuration production
```

### Optimizaciones Incluidas
- Tree shaking automático
- Minificación de CSS/JS
- Lazy loading de rutas
- Service Worker ready
- SEO optimizado con meta tags

## 📈 Métricas y Performance

### Lighthouse Score Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Optimizaciones
- Imágenes optimizadas y lazy loading
- Fonts preloaded
- Critical CSS inlined
- Bundle splitting por rutas
- Gzip compression ready

## 🤝 Contribución

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: estilos y formato
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Pull Request Process
1. Fork del repositorio
2. Crear branch feature/fix
3. Commits descriptivos
4. Tests passing
5. PR con descripción detallada

## 📄 Licencia

Este proyecto es propiedad de Aeroméxico y está destinado para uso interno en la competencia AI League 2025.

---

**Desarrollado con ❤️ para Aeroméxico AI League 2025**

*Una travesía donde la innovación, la inteligencia artificial y el trabajo en equipo impulsan el futuro digital de Aeroméxico.*