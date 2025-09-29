# 🤝 Guía de Contribución - Aeroméxico AI League 2025

Esta guía establece el proceso y las mejores prácticas para contribuir al proyecto de manera efectiva y colaborativa.

## 🎯 Proceso de Desarrollo

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone [repository-url]
cd am-ia-league

# Instalar dependencias
npm install

# Configurar entorno de desarrollo
npm run setup:dev
```

### 2. Flujo de Trabajo con Git

#### Estructura de Branches
- `main` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/[nombre]` - Nuevas funcionalidades
- `bugfix/[nombre]` - Corrección de errores
- `hotfix/[nombre]` - Correcciones urgentes

#### Proceso de Contribución
```bash
# 1. Crear nueva rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# 2. Realizar cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 3. Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

## 📝 Convenciones de Commits

### Formato
```
tipo(scope): descripción breve

Descripción detallada (opcional)

Closes #123
```

### Tipos de Commit
- `feat` - Nueva funcionalidad
- `fix` - Corrección de errores
- `docs` - Documentación
- `style` - Cambios de formato/estilo
- `refactor` - Refactorización de código
- `test` - Agregar o modificar tests
- `chore` - Tareas de mantenimiento

### Ejemplos
```bash
feat(admin): agregar panel de configuración
fix(leaderboard): corregir ordenamiento de rankings
docs(api): actualizar documentación de endpoints
style(ui): mejorar espaciado en cards de estadísticas
```

## 🔍 Proceso de Code Review

### Antes de Crear PR
- [ ] Código sigue los estándares establecidos
- [ ] Tests pasan correctamente
- [ ] Documentación actualizada
- [ ] No hay conflictos con develop
- [ ] Funcionalidad probada localmente

### Template de Pull Request
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🔄 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ✅ Checklist
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Código revisado por el autor
- [ ] No hay warnings en consola

## 📸 Screenshots (si aplica)
[Agregar capturas de pantalla]

## 🧪 Testing
Describe cómo se probó la funcionalidad.
```

### Criterios de Aprobación
- Mínimo 1 aprobación de reviewer
- Todos los tests deben pasar
- No conflictos de merge
- Cumple con estándares de código

## 🧪 Testing y Calidad

### Antes de Commit
```bash
# Ejecutar tests
npm run test

# Verificar linting
npm run lint

# Verificar build
npm run build
```

### Cobertura de Tests
- Funcionalidades nuevas: 80% mínimo
- Componentes críticos: 90% mínimo
- Utilidades: 95% mínimo

## 📚 Documentación

### Actualizar Documentación
- Nuevas funcionalidades requieren documentación
- Cambios en API deben documentarse
- Actualizar README si es necesario
- Mantener changelog actualizado

### Comentarios en Código
```typescript
/**
 * Calcula el ranking de un squad basado en métricas
 * @param squad - Datos del squad
 * @param metrics - Métricas a evaluar
 * @returns Posición en el ranking
 */
function calculateRanking(squad: Squad, metrics: Metrics): number {
  // Implementación
}
```

## 🚀 Deployment y Release

### Proceso de Release
1. Merge de develop a main
2. Crear tag de versión
3. Generar changelog
4. Deploy automático via CI/CD

### Versionado Semántico
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: Nuevas funcionalidades
- PATCH: Bug fixes

## 🛠️ Herramientas de Desarrollo

### IDE Recomendado
- Visual Studio Code
- Extensiones requeridas (ver .vscode/extensions.json)

### Configuración de Desarrollo
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🔒 Seguridad

### Buenas Prácticas
- No commitear credenciales
- Usar variables de entorno
- Validar inputs del usuario
- Sanitizar datos sensibles

### Reporte de Vulnerabilidades
- Crear issue privado
- Contactar al equipo de seguridad
- No divulgar públicamente

## 📞 Comunicación

### Canales
- Issues de GitHub para bugs
- Discussions para propuestas
- Slack para comunicación diaria
- Email para temas urgentes

### Meetings
- Daily standup: 9:00 AM
- Sprint planning: Lunes
- Retrospective: Viernes

## 🎯 Mejores Prácticas

### Código
- Seguir principios SOLID
- Usar TypeScript estricto
- Implementar error handling
- Optimizar performance

### UI/UX
- Seguir design system
- Implementar responsive design
- Considerar accesibilidad
- Mantener consistencia visual

### Performance
- Lazy loading para rutas
- Optimización de imágenes
- Minimizar bundle size
- Implementar caching

## 📋 Checklist de Contribución

### Antes de Empezar
- [ ] Issue asignado y entendido
- [ ] Rama creada desde develop
- [ ] Entorno configurado correctamente

### Durante el Desarrollo
- [ ] Seguir estándares de código
- [ ] Escribir tests apropiados
- [ ] Documentar cambios importantes
- [ ] Probar funcionalidad localmente

### Antes del PR
- [ ] Tests pasan
- [ ] Linting sin errores
- [ ] Build exitoso
- [ ] Documentación actualizada
- [ ] Commits bien formateados

### Después del Merge
- [ ] Verificar deploy
- [ ] Monitorear errores
- [ ] Actualizar issues relacionados

## 🆘 Soporte

### Problemas Técnicos
1. Revisar documentación existente
2. Buscar en issues cerrados
3. Crear nuevo issue con template
4. Contactar al equipo si es urgente

### Dudas sobre Proceso
- Revisar esta guía
- Preguntar en Slack #dev-help
- Contactar tech lead

---

**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de Desarrollo Aeroméxico AI League