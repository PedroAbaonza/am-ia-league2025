# 🧪 Guía de Testing - Aeroméxico AI League 2025

## 📋 Estrategia de Testing

### Pirámide de Testing
```
        /\
       /  \
      / E2E \     ← Pocos tests, alta confianza
     /______\
    /        \
   / Integration \  ← Tests moderados, confianza media
  /______________\
 /                \
/   Unit Tests     \  ← Muchos tests, rápidos
/__________________\
```

### Tipos de Tests Implementados
- **Unit Tests**: Componentes, servicios, pipes individuales
- **Integration Tests**: Interacción entre componentes y servicios
- **E2E Tests**: Flujos completos de usuario (opcional)

## 🔧 Configuración de Testing

### Herramientas Utilizadas
- **Framework**: Jasmine
- **Test Runner**: Karma
- **Utilities**: Angular Testing Utilities
- **Coverage**: Istanbul

### Configuración Karma
```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/am-ia-league'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

## 🧩 Testing de Componentes

### Estructura Básica de Test
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

    await TestBed.configureTestingModule({
      imports: [ComponentName, CommonModule],
      providers: [
        { provide: ServiceName, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Test de Componente con Datos
```typescript
describe('SquadsOverviewComponent', () => {
  let component: SquadsOverviewComponent;
  let fixture: ComponentFixture<SquadsOverviewComponent>;
  let mockLeaderboardService: jasmine.SpyObj<LeaderboardService>;

  const mockSquads: Squad[] = [
    {
      id: 1,
      name: 'Alpha Squadron',
      scrumMaster: 'María González',
      developers: ['Carlos', 'Ana', 'Luis'],
      totalPoints: 2450,
      color: '#00AEEF'
    },
    {
      id: 2,
      name: 'Beta Flight',
      scrumMaster: 'Roberto Silva',
      developers: ['Elena', 'Miguel', 'Carmen'],
      totalPoints: 2380,
      color: '#FF2D82'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LeaderboardService', ['getSquads']);

    await TestBed.configureTestingModule({
      imports: [SquadsOverviewComponent, CommonModule],
      providers: [
        { provide: LeaderboardService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SquadsOverviewComponent);
    component = fixture.componentInstance;
    mockLeaderboardService = TestBed.inject(LeaderboardService) as jasmine.SpyObj<LeaderboardService>;
  });

  it('should display squads correctly', fakeAsync(() => {
    // Arrange
    mockLeaderboardService.getSquads.and.returnValue(of(mockSquads));

    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.squads.length).toBe(2);
    expect(component.squads[0].name).toBe('Alpha Squadron');
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.squad-name').textContent).toContain('Alpha Squadron');
  }));

  it('should handle empty squads list', fakeAsync(() => {
    // Arrange
    mockLeaderboardService.getSquads.and.returnValue(of([]));

    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.squads.length).toBe(0);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.no-squads-message')).toBeTruthy();
  }));

  it('should handle service error', fakeAsync(() => {
    // Arrange
    const errorMessage = 'Service error';
    mockLeaderboardService.getSquads.and.returnValue(throwError(() => new Error(errorMessage)));

    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.error).toBe(errorMessage);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-message')).toBeTruthy();
  }));
});
```

### Test de Interacciones de Usuario
```typescript
it('should toggle squad details on click', () => {
  // Arrange
  mockLeaderboardService.getSquads.and.returnValue(of(mockSquads));
  component.ngOnInit();
  fixture.detectChanges();

  // Act
  const toggleButton = fixture.nativeElement.querySelector('.toggle-details');
  toggleButton.click();
  fixture.detectChanges();

  // Assert
  expect(component.showSquadsDetails).toBe(true);
  expect(fixture.nativeElement.querySelector('.squad-details')).toBeTruthy();
});

it('should filter squads by search term', () => {
  // Arrange
  mockLeaderboardService.getSquads.and.returnValue(of(mockSquads));
  component.ngOnInit();
  fixture.detectChanges();

  // Act
  const searchInput = fixture.nativeElement.querySelector('.search-input');
  searchInput.value = 'Alpha';
  searchInput.dispatchEvent(new Event('input'));
  fixture.detectChanges();

  // Assert
  const visibleSquads = fixture.nativeElement.querySelectorAll('.squad-card:not(.hidden)');
  expect(visibleSquads.length).toBe(1);
  expect(visibleSquads[0].textContent).toContain('Alpha Squadron');
});
```

## 🔧 Testing de Servicios

### Test Básico de Servicio
```typescript
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

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch squads', () => {
    const mockSquads: Squad[] = [
      { id: 1, name: 'Test Squad', scrumMaster: 'Test SM', developers: [], totalPoints: 100, color: '#000' }
    ];

    service.getSquads().subscribe(squads => {
      expect(squads).toEqual(mockSquads);
      expect(squads.length).toBe(1);
      expect(squads[0].name).toBe('Test Squad');
    });

    const req = httpMock.expectOne('/assets/data/squads.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSquads);
  });

  it('should handle HTTP error', () => {
    const errorMessage = 'Http failure response for /assets/data/squads.json: 404 Not Found';

    service.getSquads().subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne('/assets/data/squads.json');
    req.flush('404 error', { status: 404, statusText: 'Not Found' });
  });

  it('should sort squads by points descending', () => {
    const unsortedSquads: Squad[] = [
      { id: 1, name: 'Squad A', scrumMaster: 'SM A', developers: [], totalPoints: 100, color: '#000' },
      { id: 2, name: 'Squad B', scrumMaster: 'SM B', developers: [], totalPoints: 200, color: '#000' },
      { id: 3, name: 'Squad C', scrumMaster: 'SM C', developers: [], totalPoints: 150, color: '#000' }
    ];

    service.getSquads().subscribe(squads => {
      expect(squads[0].totalPoints).toBe(200);
      expect(squads[1].totalPoints).toBe(150);
      expect(squads[2].totalPoints).toBe(100);
    });

    const req = httpMock.expectOne('/assets/data/squads.json');
    req.flush(unsortedSquads);
  });
});
```

### Test de Servicio con Estado
```typescript
describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should cache config after first load', () => {
    const mockConfig: AppConfig = {
      event: { title: 'Test Event', startDate: '2024-01-01', endDate: '2024-12-31' },
      stats: { weeks: 14, routes: 6, squads: 6, challenges: 28 }
    };

    // Primera llamada
    service.getAppConfig().subscribe(config => {
      expect(config).toEqual(mockConfig);
    });

    // Segunda llamada - debería usar cache
    service.getAppConfig().subscribe(config => {
      expect(config).toEqual(mockConfig);
    });

    // Solo debería haber una petición HTTP
    const req = httpMock.expectOne('/assets/data/app-config.json');
    req.flush(mockConfig);
    
    httpMock.verify(); // No debería haber más peticiones
  });
});
```

## 🎭 Mocking y Stubs

### Mock de Servicios Complejos
```typescript
class MockLeaderboardService {
  private squadsSubject = new BehaviorSubject<Squad[]>([]);
  
  getSquads(): Observable<Squad[]> {
    return this.squadsSubject.asObservable();
  }
  
  updateSquads(squads: Squad[]): void {
    this.squadsSubject.next(squads);
  }
  
  // Método helper para tests
  setMockSquads(squads: Squad[]): void {
    this.squadsSubject.next(squads);
  }
}

// Uso en tests
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: LeaderboardService, useClass: MockLeaderboardService }
    ]
  });
  
  mockService = TestBed.inject(LeaderboardService) as MockLeaderboardService;
});
```

### Mock de HTTP Responses
```typescript
it('should handle different response formats', () => {
  const responses = [
    { data: mockSquads, status: 200 },
    { error: 'Not found', status: 404 },
    { data: [], status: 200 }
  ];

  responses.forEach((response, index) => {
    service.getSquads().subscribe({
      next: (data) => {
        if (response.status === 200) {
          expect(data).toEqual(response.data);
        }
      },
      error: (error) => {
        if (response.status === 404) {
          expect(error.status).toBe(404);
        }
      }
    });

    const req = httpMock.expectOne('/assets/data/squads.json');
    if (response.status === 200) {
      req.flush(response.data);
    } else {
      req.flush(response.error, { status: response.status, statusText: 'Error' });
    }
  });
});
```

## 🎯 Testing de Pipes

### Test de Pipe Personalizado
```typescript
describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;

  beforeEach(() => {
    pipe = new FormatDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = '2024-12-25';
    const result = pipe.transform(date, 'dd/MM/yyyy');
    expect(result).toBe('25/12/2024');
  });

  it('should handle invalid dates', () => {
    const invalidDate = 'invalid-date';
    const result = pipe.transform(invalidDate);
    expect(result).toBe('Fecha inválida');
  });

  it('should handle null values', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });
});
```

## 🔄 Testing de Observables

### Test de Streams Complejos
```typescript
it('should combine multiple data streams', fakeAsync(() => {
  const mockSquads = [/* mock data */];
  const mockRoutes = [/* mock data */];
  const mockEvents = [/* mock data */];

  mockLeaderboardService.getSquads.and.returnValue(of(mockSquads));
  mockRouteService.getRoutes.and.returnValue(of(mockRoutes));
  mockEventService.getEvents.and.returnValue(of(mockEvents));

  let result: DashboardData;
  component.dashboardData$.subscribe(data => {
    result = data;
  });

  tick();

  expect(result.squads).toEqual(mockSquads);
  expect(result.routes).toEqual(mockRoutes);
  expect(result.events).toEqual(mockEvents);
}));

it('should handle stream errors gracefully', fakeAsync(() => {
  mockLeaderboardService.getSquads.and.returnValue(throwError(() => new Error('Service error')));
  mockRouteService.getRoutes.and.returnValue(of([]));

  let errorOccurred = false;
  component.dashboardData$.subscribe({
    next: (data) => {
      // Should still get routes data
      expect(data.routes).toEqual([]);
    },
    error: () => {
      errorOccurred = true;
    }
  });

  tick();

  expect(errorOccurred).toBe(false); // Error should be handled gracefully
}));
```

## 📊 Coverage y Métricas

### Configuración de Coverage
```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "codeCoverage": true,
      "codeCoverageExclude": [
        "src/**/*.spec.ts",
        "src/**/*.mock.ts",
        "src/test.ts"
      ]
    }
  }
}
```

### Objetivos de Coverage
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Comandos de Testing
```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test -- --code-coverage

# Tests en modo watch
npm run test -- --watch

# Tests con browsers específicos
npm run test -- --browsers=Chrome,Firefox

# Tests headless (CI)
npm run test -- --watch=false --browsers=ChromeHeadless
```

## 🚀 Testing en CI/CD

### GitHub Actions Configuration
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 📝 Mejores Prácticas

### Naming Conventions
```typescript
// ✅ Buenos nombres de tests
describe('UserService', () => {
  describe('when getting user data', () => {
    it('should return user data for valid ID', () => {});
    it('should throw error for invalid ID', () => {});
    it('should handle network errors gracefully', () => {});
  });
});

// ❌ Malos nombres de tests
describe('UserService', () => {
  it('test1', () => {});
  it('should work', () => {});
  it('user test', () => {});
});
```

### Estructura AAA (Arrange, Act, Assert)
```typescript
it('should calculate total points correctly', () => {
  // Arrange
  const squads = [
    { totalPoints: 100 },
    { totalPoints: 200 },
    { totalPoints: 150 }
  ];
  
  // Act
  const total = component.calculateTotalPoints(squads);
  
  // Assert
  expect(total).toBe(450);
});
```

### Test Data Builders
```typescript
class SquadBuilder {
  private squad: Squad = {
    id: 1,
    name: 'Default Squad',
    scrumMaster: 'Default SM',
    developers: [],
    totalPoints: 0,
    color: '#000000'
  };

  withName(name: string): SquadBuilder {
    this.squad.name = name;
    return this;
  }

  withPoints(points: number): SquadBuilder {
    this.squad.totalPoints = points;
    return this;
  }

  build(): Squad {
    return { ...this.squad };
  }
}

// Uso en tests
const squad = new SquadBuilder()
  .withName('Alpha Squadron')
  .withPoints(2450)
  .build();
```

## 🐛 Debugging Tests

### Técnicas de Debug
```typescript
// Usar fdescribe/fit para ejecutar solo tests específicos
fdescribe('ComponentName', () => {
  fit('should do something specific', () => {
    // Solo este test se ejecutará
  });
});

// Logging en tests
it('should process data correctly', () => {
  const result = component.processData(input);
  console.log('Result:', result); // Para debugging
  expect(result).toBeDefined();
});

// Usar debugger
it('should handle complex logic', () => {
  debugger; // Pausa ejecución en DevTools
  const result = component.complexMethod();
  expect(result).toBeTruthy();
});
```

### Herramientas de Debug
- **Chrome DevTools**: Para debugging interactivo
- **Karma Debug**: Abrir http://localhost:9876/debug.html
- **Console Logs**: Para inspeccionar valores
- **Angular DevTools**: Para inspeccionar componentes

---

**Última actualización**: Diciembre 2024
**Autor**: Equipo de Desarrollo Aeroméxico AI League