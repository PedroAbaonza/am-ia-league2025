# 🔧 Configuración del Entorno - Aeroméxico AI League 2025

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Sistema Operativo**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 18.x LTS o superior
- **npm**: 9.x o superior
- **RAM**: 8GB mínimo, 16GB recomendado
- **Espacio en Disco**: 2GB libres mínimo

### Requisitos Recomendados
- **Node.js**: 20.x LTS (última versión estable)
- **npm**: 10.x (última versión)
- **RAM**: 16GB o superior
- **SSD**: Para mejor rendimiento
- **Conexión a Internet**: Para descarga de dependencias

## 🚀 Instalación Paso a Paso

### 1. Instalación de Node.js

#### Opción A: Descarga Directa
```bash
# Verificar si Node.js ya está instalado
node --version
npm --version

# Si no está instalado, descargar desde:
# https://nodejs.org/en/download/
```

#### Opción B: Usando Node Version Manager (Recomendado)
```bash
# macOS/Linux - Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows - Instalar nvm-windows
# Descargar desde: https://github.com/coreybutler/nvm-windows

# Reiniciar terminal y luego:
nvm install 20
nvm use 20
nvm alias default 20
```

#### Opción C: Usando Package Managers
```bash
# macOS con Homebrew
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows con Chocolatey
choco install nodejs
```

### 2. Verificación de Instalación
```bash
# Verificar versiones instaladas
node --version  # Debería mostrar v20.x.x o superior
npm --version   # Debería mostrar 10.x.x o superior

# Verificar configuración de npm
npm config list
npm config get registry  # Debería mostrar https://registry.npmjs.org/
```

### 3. Instalación de Angular CLI
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@19

# Verificar instalación
ng version

# Debería mostrar algo como:
# Angular CLI: 19.x.x
# Node: 20.x.x
# Package Manager: npm 10.x.x
```

### 4. Configuración de Git (Si no está configurado)
```bash
# Configurar usuario global
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@aeromexico.com"

# Verificar configuración
git config --list
```

## 📁 Setup del Proyecto

### 1. Clonar el Repositorio
```bash
# Clonar el proyecto
git clone [repository-url]
cd am-ia-league

# Verificar que estás en la rama correcta
git branch
git status
```

### 2. Instalación de Dependencias
```bash
# Instalar dependencias del proyecto
npm install

# Si hay problemas con el cache
npm cache clean --force
npm install

# Para instalación más rápida (opcional)
npm ci  # Usa package-lock.json exacto
```

### 3. Verificación de Assets
```bash
# Ejecutar script de verificación
npm run check-assets

# Si faltan assets, seguir las instrucciones mostradas
# Ver docs/guides/INSTRUCCIONES-IMAGENES.md para detalles
```

### 4. Primera Ejecución
```bash
# Iniciar servidor de desarrollo
npm run dev

# O alternativamente
npm start

# Abrir en navegador
# http://localhost:4200
```

## 🛠️ Configuración del IDE

### Visual Studio Code (Recomendado)

#### Extensiones Esenciales
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### Configuración de Workspace
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.html": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  },
  "angular.enable-strict-mode-prompt": false
}
```

#### Snippets Personalizados
```json
// .vscode/angular.code-snippets
{
  "Angular Component": {
    "prefix": "ng-component",
    "body": [
      "import { Component, OnInit } from '@angular/core';",
      "import { CommonModule } from '@angular/common';",
      "",
      "@Component({",
      "  selector: 'app-${1:component-name}',",
      "  imports: [CommonModule],",
      "  templateUrl: './${1:component-name}.component.html',",
      "  styleUrls: ['./${1:component-name}.component.scss']",
      "})",
      "export class ${2:ComponentName}Component implements OnInit {",
      "",
      "  constructor() { }",
      "",
      "  ngOnInit(): void {",
      "    ${3}",
      "  }",
      "",
      "}"
    ],
    "description": "Create Angular component"
  }
}
```

### WebStorm/IntelliJ IDEA

#### Configuración Recomendada
1. **File > Settings > Languages & Frameworks > TypeScript**
   - Enable TypeScript service
   - Use TypeScript service for: "For both editing and error highlighting"

2. **File > Settings > Editor > Code Style > TypeScript**
   - Set indent: 2 spaces
   - Enable "Use single quotes always"

3. **File > Settings > Tools > File Watchers**
   - Add watcher for SCSS files
   - Add watcher for TypeScript files

## 🔧 Configuración de Herramientas

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["@angular-eslint/template/recommended"],
      "rules": {}
    }
  ]
}
```

### EditorConfig
```ini
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

## 🌐 Configuración de Proxy (Si es necesario)

### Proxy para Desarrollo
```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### Configuración de npm para Proxy Corporativo
```bash
# Si estás detrás de un proxy corporativo
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
npm config set registry https://registry.npmjs.org/

# Para verificar configuración
npm config list
```

## 🔍 Verificación del Setup

### Checklist de Verificación
```bash
# 1. Verificar Node.js y npm
node --version  # ✅ v20.x.x
npm --version   # ✅ 10.x.x

# 2. Verificar Angular CLI
ng version      # ✅ Angular CLI: 19.x.x

# 3. Verificar dependencias del proyecto
npm list --depth=0  # ✅ Sin errores

# 4. Verificar que el proyecto compila
npm run build   # ✅ Build exitoso

# 5. Verificar que los tests pasan
npm run test    # ✅ Tests exitosos

# 6. Verificar servidor de desarrollo
npm start       # ✅ Servidor corriendo en http://localhost:4200
```

### Script de Verificación Automática
```bash
#!/bin/bash
# verify-setup.sh

echo "🔍 Verificando configuración del entorno..."

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm no está instalado"
    exit 1
fi

# Verificar Angular CLI
if command -v ng &> /dev/null; then
    NG_VERSION=$(ng version --skip-git 2>/dev/null | grep "Angular CLI" | cut -d: -f2 | xargs)
    echo "✅ Angular CLI: $NG_VERSION"
else
    echo "❌ Angular CLI no está instalado"
    echo "💡 Ejecuta: npm install -g @angular/cli@19"
    exit 1
fi

# Verificar dependencias del proyecto
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules existe"
    else
        echo "⚠️  node_modules no existe, ejecuta: npm install"
    fi
else
    echo "❌ package.json no encontrado"
    exit 1
fi

echo "🎉 Configuración del entorno verificada exitosamente!"
```

## 🚨 Solución de Problemas Comunes

### Error: "ng: command not found"
```bash
# Solución 1: Instalar Angular CLI globalmente
npm install -g @angular/cli@19

# Solución 2: Usar npx
npx @angular/cli@19 serve

# Solución 3: Verificar PATH
echo $PATH
which ng
```

### Error: "Cannot resolve dependency"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: "Port 4200 is already in use"
```bash
# Opción 1: Usar otro puerto
ng serve --port 4201

# Opción 2: Matar proceso en puerto 4200
# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Error: "Insufficient memory"
```bash
# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=8192"
npm start

# O en Windows
set NODE_OPTIONS=--max-old-space-size=8192
npm start
```

### Error: "EACCES: permission denied"
```bash
# Cambiar directorio global de npm (recomendado)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# O usar sudo (no recomendado)
sudo npm install -g @angular/cli@19
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Node.js Documentation](https://nodejs.org/docs/)
- [Angular Documentation](https://angular.dev/)
- [npm Documentation](https://docs.npmjs.com/)

### Herramientas Útiles
- [Node Version Manager](https://github.com/nvm-sh/nvm)
- [Angular DevTools](https://angular.dev/tools/devtools)
- [VS Code Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)

### Comunidad y Soporte
- [Angular Community](https://angular.dev/community)
- [Stack Overflow - Angular](https://stackoverflow.com/questions/tagged/angular)
- [Angular GitHub](https://github.com/angular/angular)

---

**Última actualización**: Diciembre 2024
**Autor**: Equipo de Desarrollo Aeroméxico AI League