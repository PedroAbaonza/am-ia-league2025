# 🔐 Panel de Administración - Aeromexico AI League 2025

## 🚀 Acceso al Panel

### URL de Acceso

```
http://localhost:4200/admin
```

### Credenciales

- **Contraseña**: `aeromexico2025`
- **Nota**: Cambiar en `src/app/services/admin.service.ts` línea 25 para mayor seguridad

### Acceso Discreto

- Icono de engranaje (⚙️) en el footer de la aplicación
- Solo visible al hacer hover, muy discreto

## 📊 Funcionalidades

### ✅ **Subida de Datos CSV**

- **Squads**: Datos de equipos y puntos acumulados
- **Individuales**: Datos de desarrolladores individuales
- **Formatos soportados**: CSV, Excel (.xlsx, .xls)
- **Procesamiento automático** de datos

### ✅ **Gestión de Datos**

- **Modo dinámico**: Los leaderboards usan datos subidos
- **Fallback automático**: Si no hay datos subidos, usa datos estáticos
- **Reset**: Volver a datos estáticos en cualquier momento
- **Persistencia**: Datos guardados en localStorage

### ✅ **Monitoreo**

- **Estado actual**: Fuente de datos (estática/subida)
- **Última actualización**: Timestamp de la última subida
- **Contadores**: Número de squads y desarrolladores cargados

## 📋 Formato de Archivos CSV

### Squads CSV

```csv
squadName,scrumMaster,name,points
Alpha Squadron,María González,Carlos Rodríguez,520
Alpha Squadron,María González,Ana Martínez,495
Beta Flight,Roberto Silva,Elena Vargas,485
```

**Campos requeridos:**

- `squadName`: Nombre del equipo
- `scrumMaster`: Nombre del Scrum Master
- `name`: Nombre del desarrollador
- `points`: Puntos del desarrollador

### Individuales CSV

```csv
name,squadName,position,points,missions,challenges,level
Carlos Rodríguez,Alpha Squadron,Senior Developer,520,8,2,Expert
Ana Martínez,Alpha Squadron,Full Stack Developer,495,7,2,Advanced
```

**Campos requeridos:**

- `name`: Nombre del desarrollador
- `squadName`: Nombre del equipo
- `position`: Cargo/posición
- `points`: Puntos totales
- `missions`: Misiones completadas
- `challenges`: Retos especiales completados
- `level`: Nivel (Expert/Advanced/Intermediate/Beginner)

## 🔧 Proceso de Actualización

### 1. **Preparar Datos**

- Exportar datos desde tu sistema (Excel, base de datos, etc.)
- Asegurar que las columnas coincidan con el formato requerido
- Guardar como archivo CSV

### 2. **Subir al Panel**

- Acceder a `/admin` con la contraseña
- Seleccionar archivo CSV correspondiente
- Hacer clic en "Procesar Datos"
- Verificar mensaje de éxito

### 3. **Verificar Cambios**

- Ir a `/leaderboard` o `/individual`
- Los datos deberían reflejar la información subida
- El footer mostrará "Datos subidos" como fuente

### 4. **Rollback (si es necesario)**

- En el panel admin, hacer clic en "Volver a Datos Estáticos"
- Confirmar la acción
- Los leaderboards volverán a usar datos mock

## 🛡️ Seguridad

### Autenticación

- **Sesión persistente**: Se mantiene hasta cerrar sesión o limpiar localStorage
- **Timeout**: No hay timeout automático (considerar implementar)
- **Contraseña**: Hardcoded en el código (cambiar para producción)

### Datos

- **Almacenamiento local**: Los datos se guardan en localStorage del navegador
- **No servidor**: No se envían datos a ningún servidor externo
- **Privacidad**: Los datos solo existen en el navegador del administrador

## 📈 Casos de Uso

### Actualización Semanal

1. Exportar datos actualizados del sistema interno
2. Formatear como CSV según especificaciones
3. Subir al panel de administración
4. Verificar que los leaderboards se actualicen

### Demo/Presentación

1. Preparar datos de ejemplo para la demo
2. Subir datos específicos para la presentación
3. Mostrar leaderboards actualizados
4. Resetear a datos estáticos después

### Testing

1. Subir datos de prueba
2. Verificar funcionalidad de leaderboards
3. Probar diferentes escenarios
4. Resetear cuando termine el testing

## 🚨 Troubleshooting

### Archivo no se procesa

- **Verificar formato**: Asegurar que sea CSV válido
- **Revisar columnas**: Deben coincidir exactamente con los nombres esperados
- **Encoding**: Usar UTF-8 para caracteres especiales
- **Separadores**: Usar comas (,) como separador

### Datos no aparecen

- **Refrescar página**: Los cambios son inmediatos pero refrescar ayuda
- **Verificar consola**: Revisar errores en DevTools del navegador
- **Comprobar formato**: Asegurar que los datos CSV sean válidos

### Pérdida de sesión

- **Re-autenticar**: Volver a ingresar la contraseña
- **localStorage**: Los datos persisten aunque se cierre sesión

## 🔄 Automatización Futura

### Posibles Mejoras

- **API REST**: Conectar con sistema backend
- **Autenticación OAuth**: Integrar con sistema corporativo
- **Scheduled Updates**: Actualización automática periódica
- **Audit Log**: Registro de cambios y actualizaciones
- **Backup/Restore**: Sistema de respaldo de configuraciones

## 📞 Soporte

### Archivos de Ejemplo

- `examples/squads-example.csv`: Ejemplo de formato para squads
- `examples/individuals-example.csv`: Ejemplo de formato para individuales

### Logs y Debugging

- Abrir DevTools del navegador (F12)
- Revisar Console para errores
- Network tab para verificar carga de archivos

---

**Nota**: Este panel está diseñado para ser simple y funcional. Para un entorno de producción, considerar implementar autenticación más robusta y almacenamiento en servidor.
