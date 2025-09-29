# 📝 Estándares de Código - Aeroméxico AI League 2025

Esta guía establece las convenciones y mejores prácticas de código para mantener consistencia y calidad en el proyecto.

## 🎯 Principios Generales

### Legibilidad
- Código autodocumentado
- Nombres descriptivos
- Estructura clara y lógica
- Comentarios cuando sea necesario

### Mantenibilidad
- Funciones pequeñas y enfocadas
- Bajo acoplamiento
- Alta cohesión
- Principios SOLID

### Performance
- Optimización consciente
- Lazy loading apropiado
- Gestión eficiente de memoria
- Minimizar re-renders

## 🔧 TypeScript

### Configuración Estricta
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Tipos y Interfaces
```typescript
// ✅ Bueno - Interfaces descriptivas
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

// ✅ Bueno - Enums para constantes
enum UserRole {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
  VIEWER = 'viewer'
}

// ❌ Malo - Tipos any
function processData(data: any): any {
  return data;
}

// ✅ Bueno - Tipos específicos
function processUserData(data: UserProfile): ProcessedUser {
  return {
    displayName: data.name,
    isActive: true
  };
}
```

### Generics
```typescript
// ✅ Bueno - Generics para reutilización
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class DataService<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return [...this.items];
  }
}
```

## 🅰️ Angular

### Estructura de Componentes
```typescript
// ✅ Bueno - Estructura clara
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user!: UserProfile;
  @Output() userSelected = new EventEmitter<string>();
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.initializeComponent();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initializeComponent(): void {
    // Lógica de inicialización
  }
}
```

### Servicios
```typescript
// ✅ Bueno - Servicio con manejo de errores
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/users`).pipe(
      retry(3),
      catchError(this.handleError<UserProfile[]>('getUsers', []))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
```

### Reactive Forms
```typescript
// ✅ Bueno - Formularios tipados
interface UserFormValue {
  name: string;
  email: string;
  role: UserRole;
}

export class UserFormComponent {
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: [UserRole.PARTICIPANT, Validators.required]
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value as UserFormValue;
      this.processForm(formValue);
    }
  }
  
  private processForm(value: UserFormValue): void {
    // Procesar formulario
  }
}
```

## 🎨 SCSS/CSS

### Arquitectura BEM
```scss
// ✅ Bueno - Metodología BEM
.user-card {
  padding: 1rem;
  border-radius: 8px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  &__content {
    line-height: 1.5;
  }
  
  &--highlighted {
    border: 2px solid var(--accent-color);
  }
  
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
```

### Variables CSS
```scss
// ✅ Bueno - Variables semánticas
:root {
  // Colores primarios
  --primary-color: #1e40af;
  --primary-light: #3b82f6;
  --primary-dark: #1e3a8a;
  
  // Colores semánticos
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  // Espaciado
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  // Tipografía
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}
```

### Responsive Design
```scss
// ✅ Bueno - Mixins para breakpoints
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 1023px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1024px) {
    @content;
  }
}

// Uso
.user-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
  
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 📁 Estructura de Archivos

### Organización por Feature
```
src/
├── app/
│   ├── core/                 # Servicios singleton
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/               # Componentes reutilizables
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── models/
│   ├── features/             # Módulos por funcionalidad
│   │   ├── admin/
│   │   ├── leaderboard/
│   │   └── user-profile/
│   └── layout/               # Componentes de layout
├── assets/
└── environments/
```

### Nomenclatura de Archivos
```
// ✅ Bueno - Nombres descriptivos
user-profile.component.ts
user-profile.component.html
user-profile.component.scss
user-profile.component.spec.ts

admin-dashboard.service.ts
auth.guard.ts
date-format.pipe.ts
```

## 🧪 Testing

### Unit Tests
```typescript
// ✅ Bueno - Tests descriptivos
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  describe('getUsers', () => {
    it('should return users when API call is successful', () => {
      const mockUsers: UserProfile[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: UserRole.PARTICIPANT }
      ];
      
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });
      
      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
    
    it('should handle errors gracefully', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual([]);
      });
      
      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});
```

### Component Tests
```typescript
// ✅ Bueno - Tests de componente
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      imports: [CommonModule]
    });
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should display user information correctly', () => {
    const mockUser: UserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.PARTICIPANT
    };
    
    component.user = mockUser;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-card__title').textContent).toContain('John Doe');
    expect(compiled.querySelector('.user-card__email').textContent).toContain('john@example.com');
  });
});
```

## 🔍 Linting y Formatting

### ESLint Configuration
```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/directive-class-suffix": "error"
  }
}
```

### Prettier Configuration
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## 📋 Checklist de Código

### Antes de Commit
- [ ] Código sigue convenciones de nomenclatura
- [ ] No hay console.log en producción
- [ ] Tipos TypeScript correctos
- [ ] Tests pasan
- [ ] Linting sin errores
- [ ] Documentación actualizada

### Code Review
- [ ] Lógica clara y entendible
- [ ] Manejo apropiado de errores
- [ ] Performance optimizada
- [ ] Seguridad considerada
- [ ] Accesibilidad implementada

## 🚫 Anti-patrones

### Evitar
```typescript
// ❌ Malo - Mutación directa
this.users.push(newUser);

// ✅ Bueno - Inmutabilidad
this.users = [...this.users, newUser];

// ❌ Malo - Any types
function process(data: any): any {
  return data.something;
}

// ✅ Bueno - Tipos específicos
function processUser(user: UserProfile): string {
  return user.name;
}

// ❌ Malo - Lógica en template
{{ user.role === 'admin' ? 'Administrator' : user.role === 'participant' ? 'Participant' : 'Viewer' }}

// ✅ Bueno - Método en componente
{{ getRoleDisplayName(user.role) }}
```

## 📚 Recursos Adicionales

### Documentación
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Guidelines](https://sass-guidelin.es/)

### Herramientas
- ESLint para linting
- Prettier para formatting
- Husky para git hooks
- SonarQube para análisis de código

---

**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de Desarrollo Aeroméxico AI League