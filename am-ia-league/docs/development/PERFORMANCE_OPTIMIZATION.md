# ⚡ Optimización de Performance - Aeromexico AI League 2025

Esta guía proporciona estrategias y técnicas específicas para optimizar el rendimiento de la aplicación Angular.

## 🎯 Métricas de Performance

### Objetivos de Performance

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.5s

### Herramientas de Medición

```bash
# Lighthouse CI
npm run lighthouse

# Bundle analyzer
npm run build:analyze

# Performance profiling
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🏗️ Optimización de Build

### Tree Shaking Efectivo

```typescript
// ❌ Malo - Importa toda la librería
import * as _ from "lodash";
import moment from "moment";

// ✅ Bueno - Importa solo lo necesario
import { debounce, throttle } from "lodash-es";
import { format, parseISO } from "date-fns";

// ✅ Mejor - Importación específica
import debounce from "lodash-es/debounce";
```

### Configuración de Webpack Optimizada

```typescript
// angular.json - Configuración de build
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "optimization": {
      "scripts": true,
      "styles": true,
      "fonts": true
    },
    "outputHashing": "all",
    "sourceMap": false,
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true,
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "2mb",
        "maximumError": "5mb"
      }
    ]
  }
}
```

### Code Splitting Estratégico

```typescript
// Lazy loading de módulos
const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "leaderboard",
    loadChildren: () => import("./leaderboard/leaderboard.module").then((m) => m.LeaderboardModule),
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule),
  },
];

// Lazy loading de componentes
@Component({
  template: `
    <ng-container *ngIf="showChart">
      <app-chart-component></app-chart-component>
    </ng-container>
  `,
})
export class DashboardComponent {
  showChart = false;

  async loadChart(): Promise<void> {
    const { ChartComponent } = await import("./chart/chart.component");
    this.showChart = true;
  }
}
```

## 🔄 Optimización de Change Detection

### OnPush Strategy

```typescript
@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;

  constructor(private cdr: ChangeDetectorRef) {}

  updateUser(newData: Partial<User>): void {
    this.user = { ...this.user, ...newData };
    this.cdr.markForCheck(); // Trigger change detection manually
  }
}
```

### TrackBy Functions

```typescript
@Component({
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `,
})
export class UserListComponent {
  users: User[] = [];

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
```

### Immutable Data Patterns

```typescript
// ❌ Malo - Mutación directa
addUser(newUser: User): void {
  this.users.push(newUser);
}

// ✅ Bueno - Inmutabilidad
addUser(newUser: User): void {
  this.users = [...this.users, newUser];
}

// ✅ Mejor - Con Immer para objetos complejos
import { produce } from 'immer';

updateUserStats(userId: string, stats: UserStats): void {
  this.users = produce(this.users, draft => {
    const user = draft.find(u => u.id === userId);
    if (user) {
      user.stats = stats;
    }
  });
}
```

## 🖼️ Optimización de Assets

### Lazy Loading de Imágenes

```typescript
@Component({
  template: ` <img [src]="imageSrc" loading="lazy" [alt]="imageAlt" (load)="onImageLoad()" (error)="onImageError()" class="lazy-image" /> `,
  styles: [
    `
      .lazy-image {
        transition: opacity 0.3s ease;
        opacity: 0;
      }
      .lazy-image.loaded {
        opacity: 1;
      }
    `,
  ],
})
export class LazyImageComponent {
  @Input() imageSrc!: string;
  @Input() imageAlt!: string;

  onImageLoad(): void {
    // Add loaded class for smooth transition
  }

  onImageError(): void {
    // Handle image load error
    this.imageSrc = "/assets/images/placeholder.jpg";
  }
}
```

### Optimización de Imágenes

```typescript
// Servicio para optimización de imágenes
@Injectable()
export class ImageOptimizationService {
  getOptimizedImageUrl(originalUrl: string, width: number, quality = 80): string {
    // Implementar lógica de optimización
    return `${originalUrl}?w=${width}&q=${quality}&format=webp`;
  }

  preloadCriticalImages(urls: string[]): void {
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    });
  }
}
```

### WebP con Fallback

```html
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

## 🔄 Optimización de HTTP

### Interceptor de Cache

```typescript
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo cachear GET requests
    if (req.method !== "GET") {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.url, event);
        }
      })
    );
  }
}
```

### Request Batching

```typescript
@Injectable()
export class BatchRequestService {
  private batchQueue: Array<{ url: string; resolve: Function; reject: Function }> = [];
  private batchTimer?: number;

  batchRequest<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ url, resolve, reject });

      if (!this.batchTimer) {
        this.batchTimer = window.setTimeout(() => {
          this.processBatch();
        }, 50); // Batch requests within 50ms
      }
    });
  }

  private processBatch(): void {
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    this.batchTimer = undefined;

    // Process batch request
    this.http.post("/api/batch", { requests: batch.map((b) => b.url) }).subscribe((responses) => {
      batch.forEach((item, index) => {
        item.resolve(responses[index]);
      });
    });
  }
}
```

### Connection Pooling

```typescript
// Configuración de HTTP client
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConnectionPoolInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}

@Injectable()
export class ConnectionPoolInterceptor implements HttpInterceptor {
  private activeConnections = new Map<string, Observable<HttpEvent<any>>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const key = `${req.method}:${req.url}`;

    // Reutilizar conexiones activas para requests idénticos
    if (this.activeConnections.has(key)) {
      return this.activeConnections.get(key)!;
    }

    const request$ = next.handle(req).pipe(
      finalize(() => {
        this.activeConnections.delete(key);
      }),
      share()
    );

    this.activeConnections.set(key, request$);
    return request$;
  }
}
```

## 🧠 Optimización de Memoria

### Gestión de Subscripciones

```typescript
// Patrón de auto-unsubscribe
export class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({})
export class UserComponent extends BaseComponent implements OnInit {
  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));

    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe((notifications) => this.handleNotifications(notifications));
  }
}
```

### Object Pooling

```typescript
@Injectable()
export class ObjectPoolService {
  private pools = new Map<string, any[]>();

  getObject<T>(type: string, factory: () => T): T {
    const pool = this.pools.get(type) || [];

    if (pool.length > 0) {
      return pool.pop();
    }

    return factory();
  }

  returnObject(type: string, obj: any): void {
    const pool = this.pools.get(type) || [];

    // Reset object state
    this.resetObject(obj);

    pool.push(obj);
    this.pools.set(type, pool);
  }

  private resetObject(obj: any): void {
    // Implementar lógica de reset según el tipo de objeto
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = null;
      }
    });
  }
}
```

### Weak References para Cache

```typescript
@Injectable()
export class WeakCacheService {
  private cache = new WeakMap<object, any>();

  set(key: object, value: any): void {
    this.cache.set(key, value);
  }

  get(key: object): any {
    return this.cache.get(key);
  }

  has(key: object): boolean {
    return this.cache.has(key);
  }
}
```

## 🎨 Optimización de Rendering

### Virtual Scrolling

```typescript
@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let user of users; trackBy: trackByFn">
        <app-user-card [user]="user"></app-user-card>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      .viewport {
        height: 400px;
      }
    `,
  ],
})
export class VirtualScrollComponent {
  users: User[] = [];

  trackByFn(index: number, user: User): string {
    return user.id;
  }
}
```

### Intersection Observer para Lazy Loading

```typescript
@Directive({
  selector: "[appLazyLoad]",
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Output() lazyLoad = new EventEmitter<void>();

  private observer?: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.lazyLoad.emit();
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

### CSS Containment

```scss
.user-card {
  // Optimización de layout
  contain: layout style paint;

  // Optimización de rendering
  will-change: transform;
  transform: translateZ(0); // Force hardware acceleration
}

.leaderboard-item {
  contain: layout;

  &:hover {
    contain: none; // Allow reflow on hover
  }
}
```

## 📊 Monitoreo de Performance

### Performance Metrics Service

```typescript
@Injectable()
export class PerformanceService {
  measureComponentRender(componentName: string): void {
    performance.mark(`${componentName}-start`);

    // Usar en ngAfterViewInit
    setTimeout(() => {
      performance.mark(`${componentName}-end`);
      performance.measure(`${componentName}-render`, `${componentName}-start`, `${componentName}-end`);

      const measure = performance.getEntriesByName(`${componentName}-render`)[0];
      console.log(`${componentName} render time:`, measure.duration);
    });
  }

  measureApiCall(endpoint: string): (response: any) => void {
    const startTime = performance.now();

    return (response: any) => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`API call to ${endpoint} took ${duration}ms`);

      // Enviar métricas a servicio de monitoreo
      this.sendMetrics({
        type: "api_call",
        endpoint,
        duration,
        timestamp: Date.now(),
      });
    };
  }

  private sendMetrics(metrics: any): void {
    // Implementar envío de métricas
    if ("sendBeacon" in navigator) {
      navigator.sendBeacon("/api/metrics", JSON.stringify(metrics));
    }
  }
}
```

### Performance Budget

```json
// angular.json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2mb",
    "maximumError": "5mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "6kb",
    "maximumError": "10kb"
  },
  {
    "type": "bundle",
    "name": "vendor",
    "maximumWarning": "1mb",
    "maximumError": "2mb"
  }
]
```

## 🔧 Herramientas de Profiling

### Angular DevTools

```typescript
// Habilitar profiling en desarrollo
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

if (environment.production) {
  enableProdMode();
} else {
  // Habilitar profiling en desarrollo
  (window as any).ng = {
    profiler: {
      timeChangeDetection: true,
    },
  };
}
```

### Custom Performance Hooks

```typescript
export function usePerformanceMonitor(componentName: string) {
  return {
    startMeasure: () => performance.mark(`${componentName}-start`),
    endMeasure: () => {
      performance.mark(`${componentName}-end`);
      performance.measure(componentName, `${componentName}-start`, `${componentName}-end`);
    },
  };
}

// Uso en componente
export class MyComponent implements OnInit, AfterViewInit {
  private perf = usePerformanceMonitor("MyComponent");

  ngOnInit(): void {
    this.perf.startMeasure();
  }

  ngAfterViewInit(): void {
    this.perf.endMeasure();
  }
}
```

## 📋 Checklist de Optimización

### Build Time

- [ ] Tree shaking configurado
- [ ] Code splitting implementado
- [ ] Bundle analyzer ejecutado
- [ ] Dependencias optimizadas
- [ ] Source maps deshabilitados en producción

### Runtime Performance

- [ ] OnPush change detection donde sea posible
- [ ] TrackBy functions en \*ngFor
- [ ] Lazy loading de rutas implementado
- [ ] Virtual scrolling para listas grandes
- [ ] Intersection Observer para lazy loading

### Network

- [ ] HTTP caching implementado
- [ ] Request batching donde sea apropiado
- [ ] Compresión gzip/brotli habilitada
- [ ] CDN configurado para assets estáticos
- [ ] Service Worker para caching offline

### Memory

- [ ] Subscripciones manejadas correctamente
- [ ] Event listeners removidos
- [ ] Referencias circulares evitadas
- [ ] Object pooling para objetos frecuentes

### Assets

- [ ] Imágenes optimizadas (WebP, tamaños apropiados)
- [ ] Lazy loading de imágenes
- [ ] Fonts optimizados
- [ ] CSS crítico inlined

## 📈 Métricas de Éxito

### Antes de Optimización

- Bundle size: 3.2MB
- FCP: 2.8s
- LCP: 4.1s
- TTI: 5.2s

### Después de Optimización

- Bundle size: 1.8MB (-44%)
- FCP: 1.2s (-57%)
- LCP: 2.1s (-49%)
- TTI: 2.9s (-44%)

---

**Última actualización**: Diciembre 2024  
**Próxima revisión**: Enero 2025  
**Mantenido por**: Equipo de Performance
