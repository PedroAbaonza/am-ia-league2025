# Documentación Técnica - Aeromexico AI League 2025

## 📋 Tabla de Contenidos

1. [Información General](#información-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Look and Feel](#look-and-feel)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
6. [Componentes](#componentes)
7. [Servicios](#servicios)
8. [Configuración y Datos](#configuración-y-datos)
9. [Estilos y Diseño](#estilos-y-diseño)
10. [Desarrollo y Build](#desarrollo-y-build)
11. [Mejores Prácticas](#mejores-prácticas)
12. [Guías para Nuevos Desarrolladores](#guías-para-nuevos-desarrolladores)

---

## 🎯 Información General

### Descripción del Proyecto

**Aeromexico AI League 2025** es una aplicación web desarrollada en Angular que gestiona una competencia interna de inteligencia artificial para Aeromexico. La aplicación permite visualizar rankings, gestionar equipos, mostrar cronogramas y administrar puntuaciones.

### Características Principales

- **Dashboard interactivo** con métricas en tiempo real
- **Sistema de puntuación** gamificado
- **Gestión de equipos** (squads) y participantes individuales
- **Timeline de rutas** y eventos
- **Panel de administración** para gestión de datos
- **Diseño responsive** optimizado para todos los dispositivos
- **Tema visual** alineado con la identidad de Aeromexico

---

## 🏗️ Arquitectura del Proyecto

### Patrón Arquitectónico

La aplicación sigue el patrón **Component-Service Architecture** de Angular con las siguientes capas:

```
┌─────────────────────────────────────┐
│           PRESENTATION LAYER         │
│  (Components, Pages, Templates)     │
├─────────────────────────────────────┤
│           BUSINESS LAYER            │
│        (Services, Guards)           │
├─────────────────────────────────────┤
│            DATA LAYER               │
│    (JSON Files, HTTP Clients)      │
└─────────────────────────────────────┘
```

### Principios de Diseño

- **Separation of Concerns**: Separación clara entre presentación, lógica de negocio y datos
- **Single Responsibility**: Cada componente y servicio tiene una responsabilidad específica
- **Dependency Injection**: Uso extensivo del sistema DI de Angular
- **Reactive Programming**: Uso de RxJS para manejo de datos asíncronos
- **Component Composition**: Componentes reutilizables y modulares

---

## 🎨 Look and Feel

### Identidad Visual

#### Paleta de Colores

```scss
:root {
  --deep-space-blue: #0a1033; // Fondo principal
  --aviation-blue: #00aeef; // Azul Aeromexico
  --sky-blue-neon: #00d4ff; // Azul neón
  --squadron-pink: #ff2d82; // Rosa escuadrón
  --text-primary: #ffffff; // Texto principal
  --text-secondary: #f3f4f6; // Texto secundario
  --text-muted: #9ca3af; // Texto atenuado
}
```

#### Tipografías

- **Principal**: `Montserrat` (300, 400, 500, 600, 700)
- **Monospace**: `Roboto Mono` (300, 400, 500)

#### Efectos Visuales

- **Glassmorphism**: Efectos de vidrio con `backdrop-filter: blur()`
- **Gradientes**: Transiciones suaves entre colores corporativos
- **Animaciones**: Transiciones fluidas y micro-interacciones
- **Partículas**: Fondo animado con estrellas flotantes
- **Glows**: Efectos de resplandor en elementos interactivos

### Filosofía de Diseño

- **Futurista**: Inspirado en la aviación y tecnología espacial
- **Profesional**: Mantiene la seriedad corporativa de Aeromexico
- **Gamificado**: Elementos visuales que fomentan la competencia
- **Accesible**: Contraste adecuado y navegación intuitiva

---

## 📁 Estructura del Proyecto

```
am-ia-league/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── footer/
│   │   │   ├── hero-section/
│   │   │   ├── important-dates/
│   │   │   ├── navigation/
│   │   │   ├── points-system/
│   │   │   ├── routes-timeline/
│   │   │   └── squads-overview/
│   │   ├── pages/               # Páginas principales
│   │   │   ├── admin/
│   │   │   ├── home/
│   │   │   ├── individual/
│   │   │   ├── leaderboard/
│   │   │   └── not-found/
│   │   ├── services/            # Servicios de negocio
│   │   │   ├── admin.service.ts
│   │   │   ├── config.service.ts
│   │   │   ├── event.service.ts
│   │   │   ├── leaderboard.service.ts
│   │   │   └── route.service.ts
│   │   ├── guards/              # Guards de rutas
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── assets/
│   │   ├── data/               # Archivos JSON de configuración
│   │   ├── images/             # Recursos gráficos
│   │   └── templates/          # Plantillas para admin
│   └── styles.scss             # Estilos globales
├── public/                     # Archivos estáticos
├── scripts/                    # Scripts de utilidad
└── examples/                   # Ejemplos de datos CSV
```

### Convenciones de Nomenclatura

- **Componentes**: `kebab-case` (ej: `hero-section.component.ts`)
- **Servicios**: `camelCase` con sufijo `.service` (ej: `leaderboard.service.ts`)
- **Interfaces**: `PascalCase` (ej: `Squad`, `Individual`)
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos CSS**: `kebab-case`

---

## 🛠️ Tecnologías y Dependencias

### Stack Principal

- **Framework**: Angular 19.2.x
- **Lenguaje**: TypeScript 5.7.x
- **Estilos**: SCSS
- **Animaciones**: Angular Animations
- **HTTP**: Angular HttpClient
- **Routing**: Angular Router
- **SSR**: Angular Universal (opcional)

### Dependencias Principales

```json
{
  "@angular/animations": "^19.2.15",
  "@angular/common": "^19.2.0",
  "@angular/core": "^19.2.0",
  "@angular/forms": "^19.2.0",
  "@angular/router": "^19.2.0",
  "rxjs": "~7.8.0",
  "zone.js": "~0.15.0"
}
```

### Herramientas de Desarrollo

- **CLI**: Angular CLI 19.2.x
- **Testing**: Jasmine + Karma
- **Build**: Webpack (vía Angular CLI)
- **Linting**: ESLint (configuración Angular)
- **Package Manager**: npm

---

## 🧩 Componentes

### Componentes de Layout

#### NavigationComponent

- **Propósito**: Barra de navegación principal
- **Características**: Responsive, menú hamburguesa en móvil
- **Rutas**: Home, Leaderboard, Individual, Admin

#### FooterComponent

- **Propósito**: Pie de página con información corporativa
- **Características**: Links sociales, información de contacto

### Componentes de Contenido

#### HeroSectionComponent

- **Propósito**: Sección principal del home
- **Datos**: Configurables vía `ConfigService`
- **Características**: Animaciones de entrada, estadísticas dinámicas

#### PointsSystemComponent

- **Propósito**: Explicación del sistema de puntuación
- **Datos**: Misiones y retos especiales parametrizables
- **Características**: Cards interactivas, ejemplos de cálculo

#### RoutesTimelineComponent

- **Propósito**: Timeline de rutas del evento
- **Datos**: Cargados desde `RouteService`
- **Características**: Estados visuales, fechas formateadas

#### SquadsOverviewComponent

- **Propósito**: Resumen de equipos y progreso
- **Datos**: Integración con `LeaderboardService`
- **Características**: Rankings, progreso visual, detalles expandibles

#### ImportantDatesComponent

- **Propósito**: Calendario de eventos importantes
- **Datos**: Gestionados por `EventService`
- **Características**: Filtros por tipo, estados de eventos

### Estructura de Componente Estándar

```typescript
@Component({
  selector: "app-component-name",
  imports: [CommonModule /* otros imports */],
  templateUrl: "./component-name.component.html",
  styleUrls: ["./component-name.component.scss"],
  animations: [
    /* animaciones opcionales */
  ],
})
export class ComponentNameComponent implements OnInit {
  // Propiedades públicas
  // Propiedades privadas

  constructor(private service: Service) {}

  ngOnInit(): void {
    // Inicialización
  }

  // Métodos públicos
  // Métodos privados
}
```

---

## 🔧 Servicios

### ConfigService

- **Propósito**: Gestión de configuración global
- **Archivo**: `app-config.json`
- **Responsabilidades**:
  - Configuración del evento
  - Sistema de puntos
  - Estadísticas generales

### LeaderboardService

- **Propósito**: Gestión de rankings y equipos
- **Archivos**: `squads.json`, `individuals.json`
- **Responsabilidades**:
  - Datos de equipos
  - Rankings individuales
  - Integración con AdminService

### RouteService

- **Propósito**: Gestión de rutas del evento
- **Archivos**: `routes.json`, `missions.json`
- **Responsabilidades**:
  - Timeline de rutas
  - Misiones por ruta
  - Estados de progreso

### EventService

- **Propósito**: Gestión de eventos y fechas
- **Archivo**: `events.json`
- **Responsabilidades**:
  - Calendario de eventos
  - Filtros por tipo
  - Estados de eventos

### AdminService

- **Propósito**: Funcionalidades administrativas
- **Responsabilidades**:
  - Carga de archivos CSV
  - Validación de datos
  - Gestión de plantillas

### Patrón de Servicio Estándar

```typescript
@Injectable({
  providedIn: "root",
})
export class ServiceName {
  private apiUrl = "/assets/data/";

  constructor(private http: HttpClient) {}

  getData(): Observable<DataType[]> {
    return this.http.get<DataType[]>(`${this.apiUrl}data.json`);
  }
}
```

---

## ⚙️ Configuración y Datos

### Archivos de Configuración

#### `/assets/data/app-config.json`

Configuración principal del evento:

```json
{
  "event": {
    "title": "Aeromexico AI League 2025",
    "subtitle": "Descripción del evento",
    "startDate": "2024-09-26",
    "endDate": "2024-12-12"
  },
  "stats": {
    "weeks": 14,
    "routes": 6,
    "squads": 6,
    "challenges": 28
  },
  "pointsSystem": {
    "missions": [...],
    "specialChallenges": [...]
  }
}
```

#### Otros Archivos de Datos

- `routes.json`: Rutas y timeline
- `events.json`: Eventos y fechas importantes
- `squads.json`: Información de equipos
- `individuals.json`: Datos de participantes
- `missions.json`: Misiones y retos

### Parametrización

- **Ventajas**: Fácil actualización sin cambios de código
- **Flexibilidad**: Configuración por ambiente
- **Mantenibilidad**: Separación de datos y lógica
- **Escalabilidad**: Preparado para integración con APIs

---

## 🎨 Estilos y Diseño

### Arquitectura CSS

```scss
// 1. Variables globales
:root {
  --color-primary: #00aeef;
  // ...
}

// 2. Reset y base
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 3. Tipografías
.font-primary {
  font-family: "Montserrat", sans-serif;
}
.font-mono {
  font-family: "Roboto Mono", monospace;
}

// 4. Utilidades
.gradient-text {
  /* ... */
}
.glow-blue {
  /* ... */
}
```

### Metodología BEM

```scss
// Bloque
.card {
  // Estilos del bloque

  // Elemento
  &__header {
    // Estilos del elemento
  }

  // Modificador
  &--highlighted {
    // Estilos del modificador
  }
}
```

### Responsive Design

```scss
// Mobile First
.component {
  // Estilos móvil

  @media (min-width: 768px) {
    // Tablet
  }

  @media (min-width: 1024px) {
    // Desktop
  }
}
```

### Animaciones

```scss
// Transiciones suaves
.interactive-element {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 174, 239, 0.4);
  }
}

// Keyframes para animaciones complejas
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 20px rgba(255, 45, 130, 0.5);
  }
  100% {
    box-shadow: 0 0 40px rgba(255, 45, 130, 0.8);
  }
}
```

---

## 🚀 Desarrollo y Build

### Scripts Disponibles

```bash
# Desarrollo
npm run start          # Servidor de desarrollo
npm run dev            # Con verificación de assets
npm run watch          # Build en modo watch

# Producción
npm run build          # Build de producción
npm run serve:ssr      # Servidor SSR

# Testing
npm run test           # Tests unitarios
```

### Configuraciones de Build

#### Desarrollo

- **Optimización**: Deshabilitada
- **Source Maps**: Habilitados
- **SSR**: Deshabilitado
- **Hot Reload**: Habilitado

#### Producción

- **Optimización**: Habilitada
- **Minificación**: Habilitada
- **Tree Shaking**: Habilitado
- **SSR**: Opcional
- **Budgets**: Configurados para performance

### Variables de Entorno

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: "/assets/data/",
  enableSSR: false,
};
```

---

## 📋 Mejores Prácticas

### Código TypeScript

```typescript
// ✅ Buenas prácticas
export interface Squad {
  readonly id: number;
  name: string;
  totalPoints: number;
}

export class ComponentName implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.service
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.handleData(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Gestión de Estado

```typescript
// ✅ Uso de BehaviorSubject para estado compartido
@Injectable()
export class StateService {
  private squadState$ = new BehaviorSubject<Squad[]>([]);

  getSquads(): Observable<Squad[]> {
    return this.squadState$.asObservable();
  }

  updateSquads(squads: Squad[]): void {
    this.squadState$.next(squads);
  }
}
```

### Performance

- **OnPush Strategy**: Para componentes con datos inmutables
- **TrackBy Functions**: En \*ngFor para listas grandes
- **Lazy Loading**: Para rutas no críticas
- **Image Optimization**: Formatos WebP y lazy loading

### Accesibilidad

- **ARIA Labels**: En elementos interactivos
- **Semantic HTML**: Uso correcto de etiquetas
- **Keyboard Navigation**: Soporte completo
- **Color Contrast**: Cumplimiento WCAG 2.1

---

## 👥 Guías para Nuevos Desarrolladores

### Setup Inicial

1. **Clonar repositorio**

   ```bash
   git clone [repository-url]
   cd am-ia-league
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Verificar configuración**

   ```bash
   npm run check-assets
   ```

4. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

### Flujo de Desarrollo

#### Crear Nuevo Componente

```bash
ng generate component components/new-component
```

#### Crear Nuevo Servicio

```bash
ng generate service services/new-service
```

#### Estructura de Commit

```
type(scope): description

feat(components): add new squad card component
fix(services): resolve data loading issue
docs(readme): update installation instructions
style(global): improve responsive design
```

### Debugging

- **Angular DevTools**: Para inspección de componentes
- **Redux DevTools**: Para gestión de estado (si aplica)
- **Network Tab**: Para debugging de HTTP requests
- **Console Logs**: Con niveles apropiados

### Testing

```typescript
// Ejemplo de test unitario
describe("ComponentName", () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let service: jasmine.SpyObj<ServiceName>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("ServiceName", ["getData"]);

    TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [{ provide: ServiceName, useValue: spy }],
    });

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### Recursos Adicionales

- **Angular Documentation**: https://angular.dev
- **RxJS Documentation**: https://rxjs.dev
- **SCSS Documentation**: https://sass-lang.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

### Contacto y Soporte

Para dudas técnicas o problemas de desarrollo, consultar:

- Documentación interna del proyecto
- Issues en el repositorio
- Equipo de desarrollo senior

---

## 📝 Notas Finales

Esta documentación debe mantenerse actualizada con cada cambio significativo en la arquitectura o estructura del proyecto. Los nuevos desarrolladores deben familiarizarse con esta documentación antes de comenzar a contribuir al proyecto.

**Última actualización**: Diciembre 2024
**Versión del proyecto**: 1.0.0
**Versión de Angular**: 19.2.x
