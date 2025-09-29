# 🐛 Problemas Conocidos - Aeroméxico AI League 2025

Esta documentación mantiene un registro de problemas conocidos, sus causas, soluciones temporales y estado de resolución.

## 🚨 Problemas Críticos

### 1. Error de Renderizado SSR en Producción
**Estado**: 🔴 Activo  
**Prioridad**: Alta  
**Afecta**: Versiones 1.2.x  

**Descripción**:
Error intermitente en server-side rendering que causa páginas en blanco en producción.

**Síntomas**:
- Página en blanco al cargar
- Error en consola: `Cannot read property 'nativeElement' of null`
- Ocurre principalmente en rutas dinámicas

**Causa Raíz**:
Acceso a DOM elements antes de que el componente esté completamente inicializado en SSR.

**Solución Temporal**:
```typescript
// En componentes afectados
ngAfterViewInit(): void {
  if (this.platformId === 'browser') {
    // Código que accede al DOM
    this.initializeDOMElements();
  }
}

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
```

**Solución Permanente**:
- [ ] Refactorizar componentes para ser SSR-friendly
- [ ] Implementar guards para verificación de plataforma
- [ ] ETA: Sprint 15

---

### 2. Memory Leak en Leaderboard
**Estado**: 🟡 En Progreso  
**Prioridad**: Media  
**Afecta**: Todas las versiones  

**Descripción**:
Consumo creciente de memoria en la página de leaderboard después de uso prolongado.

**Síntomas**:
- Aplicación se vuelve lenta después de 30+ minutos
- Uso de memoria aumenta constantemente
- Principalmente en Chrome/Edge

**Causa Raíz**:
Subscripciones no canceladas en componentes de ranking y polling continuo.

**Solución Temporal**:
```typescript
// Implementar en componentes afectados
export class LeaderboardComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.processData(data));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Solución Permanente**:
- [x] Audit de todas las subscripciones
- [ ] Implementar auto-unsubscribe decorator
- [ ] ETA: Sprint 13

---

## 🟡 Problemas Menores

### 3. Inconsistencia en Formato de Fechas
**Estado**: 🟡 Conocido  
**Prioridad**: Baja  
**Afecta**: Componentes de fecha  

**Descripción**:
Diferentes formatos de fecha en distintas partes de la aplicación.

**Ejemplos**:
- Dashboard: "Dec 15, 2024"
- Reports: "15/12/2024"
- Cards: "2024-12-15"

**Solución Temporal**:
```typescript
// Usar pipe personalizado
{{ date | appDateFormat }}

// O servicio centralizado
constructor(private dateService: DateService) {}
formatDate(date: Date): string {
  return this.dateService.format(date, 'standard');
}
```

**Solución Permanente**:
- [ ] Crear pipe global de fechas
- [ ] Documentar estándares de formato
- [ ] ETA: Sprint 14

---

### 4. Scroll Infinito en Mobile Safari
**Estado**: 🟡 Workaround Disponible  
**Prioridad**: Media  
**Afecta**: iOS Safari  

**Descripción**:
El scroll infinito no funciona correctamente en Safari móvil debido a diferencias en el manejo de eventos.

**Síntomas**:
- No se cargan más elementos al hacer scroll
- Solo afecta Safari en iOS
- Funciona correctamente en otros browsers

**Solución Temporal**:
```typescript
// Detectar Safari y usar polling alternativo
@HostListener('scroll', ['$event'])
onScroll(event: any): void {
  if (this.isSafari) {
    // Lógica alternativa para Safari
    this.checkScrollPosition();
  } else {
    // Lógica estándar
    this.handleInfiniteScroll(event);
  }
}
```

**Solución Permanente**:
- [ ] Implementar Intersection Observer API
- [ ] Testing extensivo en dispositivos iOS
- [ ] ETA: Sprint 16

---

### 5. Validación de Formularios con Caracteres Especiales
**Estado**: 🟡 Documentado  
**Prioridad**: Baja  
**Afecta**: Formularios de usuario  

**Descripción**:
Validación inconsistente de nombres con caracteres especiales (acentos, ñ, etc.).

**Casos Problemáticos**:
- "José María" - A veces rechazado
- "Peña" - Validación inconsistente
- "O'Connor" - Apostrofe causa problemas

**Solución Temporal**:
```typescript
// Regex mejorado para nombres
const namePattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;

// Validador personalizado
nameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && !namePattern.test(value)) {
    return { invalidName: true };
  }
  return null;
}
```

---

## 🔧 Problemas de Configuración

### 6. Variables de Entorno en Docker
**Estado**: 🟢 Solucionado  
**Prioridad**: Media  
**Afecta**: Deployment con Docker  

**Descripción**:
Variables de entorno no se cargan correctamente en contenedores Docker.

**Solución Aplicada**:
```dockerfile
# Dockerfile actualizado
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Build con variables de entorno
ARG API_URL
ARG NODE_ENV
ENV API_URL=$API_URL
ENV NODE_ENV=$NODE_ENV

RUN npm run build:prod
EXPOSE 4000
CMD ["npm", "run", "serve:ssr"]
```

---

### 7. CORS en Desarrollo Local
**Estado**: 🟢 Solucionado  
**Prioridad**: Baja  
**Afecta**: Desarrollo local  

**Descripción**:
Errores de CORS al conectar con API local durante desarrollo.

**Solución Aplicada**:
```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

```bash
# Comando actualizado
ng serve --proxy-config proxy.conf.json
```

---

## 🚀 Problemas de Performance

### 8. Carga Lenta de Imágenes en Dashboard
**Estado**: 🟡 En Progreso  
**Prioridad**: Media  
**Afecta**: Dashboard principal  

**Descripción**:
Las imágenes del dashboard tardan mucho en cargar, especialmente en conexiones lentas.

**Métricas**:
- Tiempo de carga: 3-5 segundos
- Tamaño promedio: 2-3MB por imagen
- Afecta principalmente a usuarios móviles

**Solución Temporal**:
```html
<!-- Lazy loading implementado -->
<img 
  [src]="imageSrc" 
  loading="lazy"
  [alt]="imageAlt"
  (load)="onImageLoad()"
  (error)="onImageError()"
>
```

**Solución Permanente**:
- [ ] Implementar WebP con fallback
- [ ] Optimización automática de imágenes
- [ ] CDN para assets estáticos
- [ ] ETA: Sprint 15

---

### 9. Bundle Size Excesivo
**Estado**: 🟡 Monitoreado  
**Prioridad**: Media  
**Afecta**: Tiempo de carga inicial  

**Descripción**:
El bundle principal es demasiado grande (>2MB), afectando el tiempo de carga inicial.

**Análisis**:
```bash
# Análisis de bundle
npm run build:analyze

# Principales contribuyentes:
# - Chart.js: 400KB
# - Moment.js: 300KB
# - Lodash: 250KB
```

**Solución Temporal**:
```typescript
// Tree shaking mejorado
import { debounce } from 'lodash-es/debounce';  // ✅
import * as _ from 'lodash';  // ❌

// Lazy loading de librerías pesadas
const ChartModule = () => import('./chart/chart.module');
```

**Solución Permanente**:
- [ ] Migrar de Moment.js a date-fns
- [ ] Implementar code splitting agresivo
- [ ] Optimizar imports de librerías
- [ ] ETA: Sprint 17

---

## 🔍 Problemas de Testing

### 10. Tests Flaky en CI/CD
**Estado**: 🟡 Investigando  
**Prioridad**: Media  
**Afecta**: Pipeline de CI/CD  

**Descripción**:
Algunos tests pasan localmente pero fallan intermitentemente en CI/CD.

**Tests Afectados**:
- `user-service.spec.ts` - 15% failure rate
- `leaderboard.component.spec.ts` - 8% failure rate
- `auth.guard.spec.ts` - 12% failure rate

**Posibles Causas**:
- Race conditions en async tests
- Dependencias de tiempo
- Mocks inconsistentes

**Solución Temporal**:
```typescript
// Aumentar timeouts en CI
beforeEach(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
});

// Usar fakeAsync para control de tiempo
it('should handle async operation', fakeAsync(() => {
  // Test code
  tick(1000);
  // Assertions
}));
```

---

## 📊 Monitoreo y Métricas

### Estado General de Issues

| Categoría | Total | Críticos | En Progreso | Resueltos |
|-----------|-------|----------|-------------|-----------|
| Funcionalidad | 15 | 2 | 5 | 8 |
| Performance | 8 | 0 | 3 | 5 |
| UI/UX | 12 | 0 | 2 | 10 |
| Testing | 6 | 0 | 1 | 5 |
| **Total** | **41** | **2** | **11** | **28** |

### Tendencias
- ✅ 68% de issues resueltos
- 🔄 27% en progreso
- 🚨 5% críticos pendientes

## 🔄 Proceso de Reporte

### Para Reportar Nuevo Issue
1. **Verificar** si ya existe en esta lista
2. **Reproducir** el problema consistentemente
3. **Documentar** pasos, entorno, y screenshots
4. **Crear issue** en GitHub con template
5. **Asignar** prioridad y labels apropiados

### Template de Issue
```markdown
## 🐛 Descripción del Problema
[Descripción clara y concisa]

## 🔄 Pasos para Reproducir
1. Ir a...
2. Hacer click en...
3. Ver error...

## ✅ Comportamiento Esperado
[Qué debería pasar]

## 🚨 Comportamiento Actual
[Qué está pasando]

## 🖥️ Entorno
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 1.2.3]

## 📸 Screenshots
[Si aplica]

## 📋 Información Adicional
[Contexto adicional]
```

## 📞 Contacto

Para reportar problemas críticos:
- **Slack**: #dev-urgent
- **Email**: dev-team@company.com
- **GitHub**: Crear issue con label "critical"

---

**Última actualización**: Diciembre 2024  
**Próxima revisión**: Enero 2025  
**Mantenido por**: Equipo de QA y Desarrollo