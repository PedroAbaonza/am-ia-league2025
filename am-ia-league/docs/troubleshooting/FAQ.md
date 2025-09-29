# ❓ Preguntas Frecuentes (FAQ) - Aeroméxico AI League 2025

Esta sección contiene respuestas a las preguntas más comunes sobre el desarrollo, configuración y uso del sistema.

## 🚀 Instalación y Configuración

### ¿Cómo instalo el proyecto por primera vez?

```bash
# 1. Clonar el repositorio
git clone [repository-url]
cd am-ia-league

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Ejecutar en modo desarrollo
npm run dev
```

### ¿Qué versiones de Node.js son compatibles?

- **Recomendado**: Node.js 18.x o superior
- **Mínimo**: Node.js 16.x
- **NPM**: 8.x o superior

```bash
# Verificar versiones
node --version
npm --version
```

### ¿Cómo configuro mi IDE para el proyecto?

**Visual Studio Code (Recomendado)**:
1. Instalar extensiones requeridas (ver `.vscode/extensions.json`)
2. Configurar settings.json:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔧 Desarrollo

### ¿Cómo ejecuto el proyecto en diferentes modos?

```bash
# Desarrollo
npm run dev

# Desarrollo con SSR
npm run dev:ssr

# Build para producción
npm run build

# Servir build de producción
npm run serve

# Tests
npm run test

# Tests con coverage
npm run test:coverage
```

### ¿Cómo agrego una nueva funcionalidad?

1. **Crear rama de feature**:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. **Generar componente**:
```bash
ng generate component features/nueva-funcionalidad
```

3. **Seguir estructura**:
```
src/app/features/nueva-funcionalidad/
├── components/
├── services/
├── models/
├── nueva-funcionalidad.module.ts
└── nueva-funcionalidad-routing.module.ts
```

### ¿Cómo manejo el estado de la aplicación?

**Para estado local**: Usar propiedades del componente
```typescript
export class MyComponent {
  isLoading = false;
  data: any[] = [];
}
```

**Para estado compartido**: Usar servicios con BehaviorSubject
```typescript
@Injectable()
export class StateService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();
  
  updateData(data: any[]): void {
    this.dataSubject.next(data);
  }
}
```

## 🎨 UI/UX

### ¿Cómo uso el sistema de diseño?

**Colores**:
```scss
.my-component {
  background-color: var(--primary-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

**Espaciado**:
```scss
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

**Tipografía**:
```scss
.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}
```

### ¿Cómo implemento responsive design?

```scss
.grid {
  display: grid;
  gap: var(--spacing-md);
  
  // Mobile first
  grid-template-columns: 1fr;
  
  // Tablet
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🔐 Autenticación y Seguridad

### ¿Cómo funciona la autenticación?

1. **Login**: Usuario ingresa credenciales
2. **Token**: Backend devuelve JWT token
3. **Storage**: Token se guarda en localStorage
4. **Guards**: Rutas protegidas verifican token
5. **Interceptor**: Token se agrega automáticamente a requests

```typescript
// Guard de autenticación
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
```

### ¿Cómo manejo roles y permisos?

```typescript
// Servicio de autorización
@Injectable()
export class AuthorizationService {
  hasRole(role: UserRole): boolean {
    const user = this.auth.getCurrentUser();
    return user?.role === role;
  }
  
  hasPermission(permission: string): boolean {
    const user = this.auth.getCurrentUser();
    return user?.permissions?.includes(permission) ?? false;
  }
}

// Uso en componente
export class AdminComponent {
  canViewAdminPanel = this.authz.hasRole(UserRole.ADMIN);
  canEditUsers = this.authz.hasPermission('users:edit');
}
```

## 📊 Datos y API

### ¿Cómo consumo APIs?

```typescript
@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}
  
  getData(): Observable<any[]> {
    return this.http.get<any[]>('/api/data').pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### ¿Cómo manejo errores de API?

```typescript
// Interceptor global de errores
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to login
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          // Show error message
          this.notification.error('Server error occurred');
        }
        
        return throwError(() => error);
      })
    );
  }
}
```

## 🧪 Testing

### ¿Cómo escribo tests efectivos?

**Componente**:
```typescript
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent]
    });
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should display user name', () => {
    component.user = { name: 'John Doe' };
    fixture.detectChanges();
    
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('John Doe');
  });
});
```

**Servicio**:
```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);
  });
});
```

### ¿Cómo ejecuto tests específicos?

```bash
# Test específico
npm run test -- --include="**/user.service.spec.ts"

# Tests de un directorio
npm run test -- --include="**/features/admin/**"

# Tests con watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### ¿Cómo hago deploy a producción?

**Build para producción**:
```bash
npm run build:prod
```

**Deploy a servidor**:
```bash
# Copiar archivos dist/ al servidor
scp -r dist/ user@server:/var/www/html/

# O usar CI/CD pipeline
git push origin main  # Trigger automático
```

### ¿Cómo configuro variables de entorno?

**Desarrollo** (`.env`):
```
API_URL=http://localhost:3000/api
DEBUG=true
```

**Producción** (`environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  debug: false
};
```

## 🐛 Problemas Comunes

### Error: "Cannot find module"

**Causa**: Dependencia no instalada o path incorrecto

**Solución**:
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar imports
import { Component } from '@angular/core';  // ✅ Correcto
import { Component } from 'angular/core';   // ❌ Incorrecto
```

### Error: "Port 4200 is already in use"

**Solución**:
```bash
# Usar puerto diferente
ng serve --port 4201

# O matar proceso en puerto 4200
lsof -ti:4200 | xargs kill -9
```

### Error de CORS en desarrollo

**Solución**: Configurar proxy en `proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true
  }
}
```

```bash
ng serve --proxy-config proxy.conf.json
```

### Build falla por errores de TypeScript

**Solución**:
```bash
# Verificar errores
npm run lint

# Fix automático
npm run lint:fix

# Build con más información
npm run build -- --verbose
```

### Performance lenta en desarrollo

**Soluciones**:
1. **Usar OnPush change detection**:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

2. **Lazy loading de módulos**:
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

3. **TrackBy functions**:
```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

## 📱 Mobile y Responsive

### ¿Cómo optimizo para móviles?

**Viewport meta tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Touch-friendly interactions**:
```scss
.button {
  min-height: 44px;  // Minimum touch target
  min-width: 44px;
}
```

**Responsive images**:
```html
<img 
  src="image-small.jpg" 
  srcset="image-small.jpg 480w, image-large.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
  alt="Description"
>
```

## 🔍 Debugging

### ¿Cómo debuggeo la aplicación?

**Chrome DevTools**:
1. Abrir DevTools (F12)
2. Sources tab → Webpack → src
3. Colocar breakpoints
4. Recargar página

**Angular DevTools**:
1. Instalar extensión Angular DevTools
2. Inspeccionar componentes
3. Ver change detection
4. Profiler para performance

**Console debugging**:
```typescript
// Temporal para debugging
console.log('Debug:', data);
console.table(array);
console.group('Group name');
console.groupEnd();
```

## 📞 Soporte

### ¿Dónde puedo obtener ayuda?

1. **Documentación**: Revisar docs/ directory
2. **Issues**: Buscar en GitHub issues
3. **Team**: Contactar en Slack #dev-help
4. **Stack Overflow**: Para problemas generales de Angular

### ¿Cómo reporto un bug?

1. **Verificar**: ¿Es reproducible?
2. **Buscar**: ¿Ya existe el issue?
3. **Crear issue** con:
   - Descripción clara
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno

---

**Última actualización**: Diciembre 2024  
**¿Tienes más preguntas?** Crea un issue o contacta al equipo de desarrollo.