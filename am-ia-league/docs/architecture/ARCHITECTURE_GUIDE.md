# Guía de Arquitectura - Aeroméxico AI League 2025

## 🏗️ Visión General de la Arquitectura

### Patrón Arquitectónico Principal
La aplicación implementa una **arquitectura por capas** basada en los principios de Angular, siguiendo el patrón **Component-Service-Data**:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Pages     │  │ Components  │  │   Guards    │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│                     BUSINESS LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Services   │  │ Interfaces  │  │   Models    │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│                      DATA LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ HTTP Client │  │ JSON Files  │  │ Local State │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Principios Arquitectónicos

#### 1. Separation of Concerns (SoC)
- **Presentación**: Componentes se enfocan únicamente en la UI
- **Lógica de Negocio**: Servicios manejan la lógica y transformaciones
- **Datos**: Capa de datos abstrae el origen de la información

#### 2. Single Responsibility Principle (SRP)
- Cada componente tiene una responsabilidad específica
- Servicios especializados por dominio de negocio
- Interfaces claras entre capas

#### 3. Dependency Injection (DI)
- Servicios inyectados como dependencias
- Facilita testing y mantenibilidad
- Permite intercambio de implementaciones

#### 4. Reactive Programming
- Uso extensivo de RxJS Observables
- Flujo de datos unidireccional
- Gestión de estado reactiva

## 📦 Estructura de Módulos

### Organización por Características
```
src/app/
├── components/          # Componentes reutilizables
│   ├── footer/
│   ├── navigation/
│   ├── hero-section/
│   ├── points-system/
│   ├── routes-timeline/
│   ├── squads-overview/
│   └── important-dates/
├── pages/              # Páginas/Rutas principales
│   ├── home/
│   ├── leaderboard/
│   ├── individual/
│   ├── admin/
│   └── not-found/
├── services/           # Servicios de negocio
│   ├── config.service.ts
│   ├── leaderboard.service.ts
│   ├── route.service.ts
│   ├── event.service.ts
│   └── admin.service.ts
├── guards/             # Guards de rutas
└── shared/             # Utilidades compartidas
```

### Ventajas de esta Organización
- **Escalabilidad**: Fácil agregar nuevas características
- **Mantenibilidad**: Código organizado por funcionalidad
- **Reutilización**: Componentes y servicios compartidos
- **Testing**: Aislamiento de responsabilidades

## 🔄 Flujo de Datos

### Patrón de Comunicación
```
┌─────────────┐    HTTP Request    ┌─────────────┐
│   Service   │ ──────────────────► │ JSON Files  │
│             │ ◄────────────────── │             │
└─────────────┘    HTTP Response   └─────────────┘
       │
       │ Observable
       ▼
┌─────────────┐    Data Binding    ┌─────────────┐
│ Component   │ ──────────────────► │  Template   │
│             │ ◄────────────────── │             │
└─────────────┘    User Events     └─────────────┘
```

### Ejemplo de Flujo Completo
```typescript
// 1. Servicio obtiene datos
@Injectable()
export class LeaderboardService {
  getSquads(): Observable<Squad[]> {
    return this.http.get<Squad[]>('/assets/data/squads.json')
      .pipe(
        map(squads => squads.sort((a, b) => b.totalPoints - a.totalPoints)),
        catchError(this.handleError)
      );
  }
}

// 2. Componente consume el servicio
@Component({...})
export class SquadsOverviewComponent implements OnInit {
  squads$ = this.leaderboardService.getSquads();
  
  constructor(private leaderboardService: LeaderboardService) {}
}

// 3. Template renderiza los datos
<div *ngFor="let squad of squads$ | async">
  {{ squad.name }} - {{ squad.totalPoints }} pts
</div>
```

## 🧩 Patrones de Diseño Implementados

### 1. Observer Pattern (RxJS)
```typescript
// Servicio como Subject
@Injectable()
export class StateService {
  private squadState$ = new BehaviorSubject<Squad[]>([]);
  
  // Múltiples componentes pueden suscribirse
  getSquads(): Observable<Squad[]> {
    return this.squadState$.asObservable();
  }
  
  updateSquads(squads: Squad[]): void {
    this.squadState$.next(squads); // Notifica a todos los observadores
  }
}
```

### 2. Strategy Pattern (Configuración)
```typescript
// Diferentes estrategias de configuración
interface ConfigStrategy {
  loadConfig(): Observable<AppConfig>;
}

class JsonConfigStrategy implements ConfigStrategy {
  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/assets/data/app-config.json');
  }
}

class ApiConfigStrategy implements ConfigStrategy {
  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/api/config');
  }
}
```

### 3. Factory Pattern (Servicios)
```typescript
// Factory para crear servicios específicos
@Injectable()
export class ServiceFactory {
  createLeaderboardService(type: 'json' | 'api'): LeaderboardService {
    switch (type) {
      case 'json':
        return new JsonLeaderboardService(this.http);
      case 'api':
        return new ApiLeaderboardService(this.http);
      default:
        throw new Error('Unknown service type');
    }
  }
}
```

### 4. Facade Pattern (Servicios Complejos)
```typescript
// Facade que simplifica múltiples servicios
@Injectable()
export class DashboardFacade {
  constructor(
    private leaderboardService: LeaderboardService,
    private routeService: RouteService,
    private eventService: EventService
  ) {}
  
  getDashboardData(): Observable<DashboardData> {
    return combineLatest([
      this.leaderboardService.getSquads(),
      this.routeService.getRoutes(),
      this.eventService.getEvents()
    ]).pipe(
      map(([squads, routes, events]) => ({
        squads,
        routes,
        events,
        summary: this.calculateSummary(squads, routes, events)
      }))
    );
  }
}
```

## 🔧 Gestión de Estado

### Estado Local vs Global

#### Estado Local (Componente)
```typescript
@Component({...})
export class ComponentWithLocalState {
  // Estado específico del componente
  private isLoading = false;
  private selectedItem: Item | null = null;
  
  // Métodos para manejar estado local
  selectItem(item: Item): void {
    this.selectedItem = item;
  }
}
```

#### Estado Compartido (Servicio)
```typescript
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  // Estado compartido entre componentes
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  
  // Getters para acceso reactivo
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }
  
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }
}
```

### Patrón de Estado Inmutable
```typescript
interface AppState {
  readonly squads: Squad[];
  readonly routes: Route[];
  readonly loading: boolean;
}

@Injectable()
export class StateManager {
  private state$ = new BehaviorSubject<AppState>(initialState);
  
  updateSquads(squads: Squad[]): void {
    const currentState = this.state$.value;
    const newState: AppState = {
      ...currentState,
      squads: [...squads] // Nueva referencia
    };
    this.state$.next(newState);
  }
}
```

## 🚦 Gestión de Errores

### Estrategia de Manejo de Errores
```typescript
// Interceptor global para errores HTTP
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log del error
        console.error('HTTP Error:', error);
        
        // Transformar error para la UI
        const userError = this.transformError(error);
        
        // Notificar al usuario
        this.notificationService.showError(userError.message);
        
        return throwError(() => userError);
      })
    );
  }
}

// Servicio con manejo específico de errores
@Injectable()
export class DataService {
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      retry(3), // Reintentar 3 veces
      catchError(error => {
        // Fallback a datos locales
        return this.getLocalData();
      })
    );
  }
}
```

## 🔒 Seguridad y Guards

### Guards de Autenticación
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}

// Aplicación en rutas
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }
];
```

### Validación de Datos
```typescript
// Validadores personalizados
export class CustomValidators {
  static squadName(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const isValid = /^[A-Za-z\s]{3,50}$/.test(value);
    return isValid ? null : { invalidSquadName: true };
  }
}

// Uso en formularios
@Component({...})
export class SquadFormComponent {
  squadForm = this.fb.group({
    name: ['', [Validators.required, CustomValidators.squadName]],
    members: this.fb.array([])
  });
}
```

## 📊 Performance y Optimización

### Estrategias de Optimización

#### 1. OnPush Change Detection
```typescript
@Component({
  selector: 'app-optimized-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class OptimizedComponent {
  @Input() data: Data[] = [];
  
  // Solo se ejecuta cuando cambian las referencias de input
  trackByFn(index: number, item: Data): number {
    return item.id;
  }
}
```

#### 2. Lazy Loading
```typescript
// Rutas con carga diferida
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent)
  }
];
```

#### 3. Memoización de Cálculos
```typescript
@Injectable()
export class CalculationService {
  private cache = new Map<string, any>();
  
  calculateRanking(squads: Squad[]): Squad[] {
    const cacheKey = this.generateCacheKey(squads);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = this.performCalculation(squads);
    this.cache.set(cacheKey, result);
    
    return result;
  }
}
```

## 🧪 Testing Architecture

### Estrategia de Testing
```typescript
// Test de componente
describe('SquadsOverviewComponent', () => {
  let component: SquadsOverviewComponent;
  let mockService: jasmine.SpyObj<LeaderboardService>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('LeaderboardService', ['getSquads']);
    
    TestBed.configureTestingModule({
      imports: [SquadsOverviewComponent],
      providers: [
        { provide: LeaderboardService, useValue: spy }
      ]
    });
    
    mockService = TestBed.inject(LeaderboardService) as jasmine.SpyObj<LeaderboardService>;
  });
  
  it('should display squads', () => {
    const mockSquads = [{ id: 1, name: 'Test Squad', totalPoints: 100 }];
    mockService.getSquads.and.returnValue(of(mockSquads));
    
    component.ngOnInit();
    
    expect(component.squads$).toBeDefined();
    // Más assertions...
  });
});

// Test de servicio
describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaderboardService]
    });
    
    service = TestBed.inject(LeaderboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch squads', () => {
    const mockSquads = [{ id: 1, name: 'Test', totalPoints: 100 }];
    
    service.getSquads().subscribe(squads => {
      expect(squads).toEqual(mockSquads);
    });
    
    const req = httpMock.expectOne('/assets/data/squads.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSquads);
  });
});
```

## 🔄 Ciclo de Vida y Hooks

### Gestión del Ciclo de Vida
```typescript
@Component({...})
export class LifecycleAwareComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // Inicialización de datos
    this.loadData();
  }
  
  ngAfterViewInit(): void {
    // Inicialización de elementos del DOM
    this.initializeCharts();
  }
  
  ngOnDestroy(): void {
    // Limpieza de suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadData(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.handleData(data));
  }
}
```

## 📈 Escalabilidad

### Preparación para Crecimiento

#### 1. Modularización
```typescript
// Módulo de características
@NgModule({
  declarations: [
    LeaderboardComponent,
    SquadCardComponent,
    RankingTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    LeaderboardService
  ]
})
export class LeaderboardModule {}
```

#### 2. Configuración por Ambiente
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.aeromexico-league.com',
  enableAnalytics: true,
  cacheTimeout: 300000
};

// environment.dev.ts
export const environment = {
  production: false,
  apiUrl: '/assets/data',
  enableAnalytics: false,
  cacheTimeout: 0
};
```

#### 3. Abstracción de Datos
```typescript
// Interfaz para diferentes fuentes de datos
interface DataProvider {
  getSquads(): Observable<Squad[]>;
  getRoutes(): Observable<Route[]>;
}

// Implementación para JSON
class JsonDataProvider implements DataProvider {
  getSquads(): Observable<Squad[]> {
    return this.http.get<Squad[]>('/assets/data/squads.json');
  }
}

// Implementación para API
class ApiDataProvider implements DataProvider {
  getSquads(): Observable<Squad[]> {
    return this.http.get<Squad[]>('/api/squads');
  }
}
```

## 🎯 Mejores Prácticas Arquitectónicas

### 1. Principio DRY (Don't Repeat Yourself)
- Componentes reutilizables
- Servicios compartidos
- Utilidades comunes

### 2. Principio KISS (Keep It Simple, Stupid)
- Componentes con responsabilidad única
- Lógica simple y clara
- Evitar over-engineering

### 3. Principio YAGNI (You Aren't Gonna Need It)
- Implementar solo lo necesario
- Evitar funcionalidades especulativas
- Refactorizar cuando sea necesario

### 4. Composición sobre Herencia
- Usar servicios inyectados
- Composición de componentes
- Mixins cuando sea apropiado

Esta arquitectura proporciona una base sólida, escalable y mantenible para el proyecto Aeroméxico AI League 2025.