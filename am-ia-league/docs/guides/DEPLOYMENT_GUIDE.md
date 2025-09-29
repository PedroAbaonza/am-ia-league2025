# 🚀 Guía de Deployment - Aeroméxico AI League 2025

## 📋 Estrategias de Deployment

### Tipos de Deployment Soportados
1. **Static Site**: Aplicación de página única (SPA)
2. **Server-Side Rendering**: Con Angular Universal
3. **Hybrid**: Combinación de SSR y SPA
4. **Docker**: Containerización para diferentes entornos

## 🏗️ Build de Producción

### Configuración de Build
```bash
# Build básico de producción
npm run build

# Build con configuración específica
ng build --configuration production

# Build con análisis de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/am-ia-league/stats.json
```

### Configuraciones de Build
```json
// angular.json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kB",
          "maximumError": "1MB"
        },
        {
          "type": "anyComponentStyle",
          "maximumWarning": "4kB",
          "maximumError": "8kB"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    },
    "staging": {
      "optimization": true,
      "sourceMap": true,
      "namedChunks": true,
      "extractLicenses": false,
      "vendorChunk": true,
      "buildOptimizer": false
    }
  }
}
```

## 🌐 Deployment Estático (SPA)

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist/am-ia-league/browser

# Redirects file (_redirects)
/*    /index.html   200
```

### Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist/am-ia-league/browser"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build -- --base-href=/am-ia-league/
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/am-ia-league/browser
```

### AWS S3 + CloudFront
```bash
# Instalar AWS CLI
aws configure

# Sync a S3
aws s3 sync dist/am-ia-league/browser/ s3://your-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🖥️ Deployment con SSR

### Configuración SSR
```typescript
// server.ts
import { ngExpressEngine } from '@nguniversal/express-engine';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import express from 'express';

const app = express();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Engine de renderizado
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Servir archivos estáticos
app.get('*.*', express.static(DIST_FOLDER));

// Todas las rutas regulares usan Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Build SSR
```bash
# Build con SSR
npm run build:ssr

# Servir aplicación SSR
npm run serve:ssr
```

## 🐳 Deployment con Docker

### Dockerfile Multi-stage
```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

# Copiar archivos build
COPY --from=builder /app/dist/am-ia-league/browser /usr/share/nginx/html

# Configuración nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Configuración Nginx
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle Angular routes
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### Docker Compose para Desarrollo
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./dist/am-ia-league/browser:/usr/share/nginx/html:ro
    restart: unless-stopped

  app-dev:
    build:
      context: .
      target: builder
    ports:
      - "4200:4200"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm start
    environment:
      - NODE_ENV=development
```

## ☁️ Deployment en Cloud

### AWS Amplify
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist/am-ia-league/browser
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Azure Static Web Apps
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist/am-ia-league/browser"
          app_build_command: "npm run build"
```

### Google Cloud Platform
```yaml
# app.yaml (App Engine)
runtime: nodejs20

handlers:
  - url: /.*
    static_files: dist/am-ia-league/browser/index.html
    upload: dist/am-ia-league/browser/index.html

  - url: /(.*)
    static_files: dist/am-ia-league/browser/\1
    upload: dist/am-ia-league/browser/(.*)
```

## 🔧 Configuración por Entornos

### Variables de Entorno
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.aeromexico-league.com',
  enableAnalytics: true,
  enableSSR: true,
  cacheTimeout: 300000,
  logLevel: 'error'
};

// environment.staging.ts
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.aeromexico-league.com',
  enableAnalytics: false,
  enableSSR: false,
  cacheTimeout: 60000,
  logLevel: 'debug'
};

// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: '/assets/data',
  enableAnalytics: false,
  enableSSR: false,
  cacheTimeout: 0,
  logLevel: 'debug'
};
```

### Configuración de Build por Entorno
```json
// angular.json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }
}
```

## 🔍 Monitoreo Post-Deployment

### Health Checks
```typescript
// health-check.service.ts
@Injectable()
export class HealthCheckService {
  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health').pipe(
      timeout(5000),
      catchError(() => of({ status: 'unhealthy', timestamp: new Date() }))
    );
  }
}
```

### Logging y Monitoreo
```typescript
// logging.service.ts
@Injectable()
export class LoggingService {
  logError(error: Error, context?: string): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (environment.production) {
      // Enviar a servicio de logging externo
      this.sendToExternalLogger(logEntry);
    } else {
      console.error('Error logged:', logEntry);
    }
  }
}
```

## 🚨 Rollback y Recovery

### Estrategia de Rollback
```bash
# Mantener versiones anteriores
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp -r dist/am-ia-league dist/am-ia-league_backup_$TIMESTAMP

# Script de rollback
#!/bin/bash
# rollback.sh
BACKUP_DIR=$1
if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: ./rollback.sh <backup_directory>"
    exit 1
fi

echo "Rolling back to $BACKUP_DIR..."
rm -rf dist/am-ia-league
cp -r $BACKUP_DIR dist/am-ia-league
echo "Rollback completed"
```

### Blue-Green Deployment
```bash
# Script para blue-green deployment
#!/bin/bash
# blue-green-deploy.sh

CURRENT_ENV=$(cat current_env.txt)
NEW_ENV="blue"

if [ "$CURRENT_ENV" = "blue" ]; then
    NEW_ENV="green"
fi

echo "Deploying to $NEW_ENV environment..."

# Build y deploy a nuevo entorno
npm run build
deploy_to_environment $NEW_ENV

# Health check
if health_check $NEW_ENV; then
    echo "Health check passed, switching traffic..."
    switch_traffic_to $NEW_ENV
    echo $NEW_ENV > current_env.txt
    echo "Deployment completed successfully"
else
    echo "Health check failed, keeping current environment"
    exit 1
fi
```

## 📊 Métricas de Deployment

### Performance Budgets
```json
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "4kB",
      "maximumError": "8kB"
    },
    {
      "type": "bundle",
      "name": "vendor",
      "maximumWarning": "300kB",
      "maximumError": "500kB"
    }
  ]
}
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm install -g @lhci/cli@0.12.x
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Configuración Lighthouse
```json
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist/am-ia-league/browser',
      url: [
        'http://localhost/index.html',
        'http://localhost/leaderboard/index.html',
        'http://localhost/individual/index.html'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.95 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

## 🔐 Seguridad en Deployment

### Headers de Seguridad
```nginx
# nginx.conf
server {
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:;" always;
    
    # HSTS (opcional para HTTPS)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### Variables de Entorno Seguras
```bash
# .env (no commitear)
API_KEY=your-secret-api-key
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret

# Uso en aplicación
export const environment = {
  production: true,
  apiKey: process.env['API_KEY'],
  databaseUrl: process.env['DATABASE_URL']
};
```

## 🔄 CI/CD Pipeline Completo

### GitHub Actions Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to staging
        run: |
          # Deploy logic here
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to production
        run: |
          # Deploy logic here
          echo "Deploying to production..."
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 📋 Checklist de Deployment

### Pre-Deployment
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Build de producción exitoso
- [ ] Lighthouse score > 90
- [ ] Vulnerabilidades de seguridad resueltas
- [ ] Assets optimizados
- [ ] Variables de entorno configuradas
- [ ] Backup de versión anterior

### Durante Deployment
- [ ] Monitorear logs de build
- [ ] Verificar health checks
- [ ] Probar rutas principales
- [ ] Verificar assets cargando
- [ ] Comprobar responsive design
- [ ] Validar funcionalidades críticas

### Post-Deployment
- [ ] Verificar métricas de performance
- [ ] Monitorear errores en logs
- [ ] Probar flujos de usuario
- [ ] Verificar analytics funcionando
- [ ] Documentar cambios deployados
- [ ] Notificar al equipo

## 🚨 Troubleshooting de Deployment

### Problemas Comunes

#### Build Failures
```bash
# Error de memoria
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build

# Error de dependencias
rm -rf node_modules package-lock.json
npm install
npm run build

# Error de TypeScript
npx tsc --noEmit
npm run build
```

#### Runtime Errors
```bash
# Verificar assets
npm run check-assets

# Verificar rutas
ng build --stats-json
# Revisar chunks generados

# Verificar variables de entorno
echo $NODE_ENV
echo $API_URL
```

#### Performance Issues
```bash
# Analizar bundle
npx webpack-bundle-analyzer dist/am-ia-league/stats.json

# Verificar lazy loading
ng build --named-chunks
# Revisar chunks generados

# Optimizar imágenes
npm run optimize:images
```

---

**Última actualización**: Diciembre 2024
**Autor**: Equipo de DevOps Aeroméxico AI League