# 📊 Descarga de Plantillas de Datos - Panel Admin

## 🎯 Nueva Funcionalidad

Ahora el panel de administración incluye la capacidad de **descargar los datos actuales** como plantillas CSV para facilitar la actualización de información.

## 📥 Funcionalidades de Descarga

### ✅ **Datos de Squads Actuales**
- **Archivo**: `squads-data-YYYY-MM-DD.csv`
- **Contenido**: Todos los squads con sus miembros y puntos actuales
- **Formato**: Compatible para re-subir al panel
- **Uso**: Base para actualizar puntos de equipos

### ✅ **Datos Individuales Actuales**
- **Archivo**: `individuals-data-YYYY-MM-DD.csv`
- **Contenido**: Todos los desarrolladores con stats completos
- **Formato**: Compatible para re-subir al panel
- **Uso**: Base para actualizar rankings individuales

## 🚀 Cómo Usar

### 1. **Acceder al Panel Admin**
```
URL: http://localhost:4200/admin
Contraseña: aeromexico2025
```

### 2. **Descargar Plantillas**
- Buscar la sección "Descargar Datos Actuales"
- Hacer clic en "Descargar Squads CSV" o "Descargar Individuales CSV"
- Los archivos se descargan automáticamente con fecha actual

### 3. **Editar Datos**
- Abrir el CSV descargado en Excel/Google Sheets
- Modificar puntos, agregar/quitar miembros, etc.
- Guardar como CSV manteniendo el formato

### 4. **Re-subir Datos Actualizados**
- En la sección "Subir Datos del Leaderboard"
- Seleccionar el archivo CSV editado
- Hacer clic en "Procesar Datos"
- Los leaderboards se actualizan automáticamente

## 📋 Datos Incluidos

### **Squads CSV**
```csv
squadName,scrumMaster,name,points
Alpha Squadron,María González,Carlos Rodríguez,520
Alpha Squadron,María González,Ana Martínez,495
Beta Flight,Roberto Silva,Elena Vargas,485
...
```

**Campos:**
- `squadName`: Nombre del equipo
- `scrumMaster`: Scrum Master del equipo
- `name`: Nombre del desarrollador
- `points`: Puntos individuales del desarrollador

### **Individuales CSV**
```csv
name,squadName,position,points,missions,challenges,level
Carlos Rodríguez,Alpha Squadron,Senior Developer,520,8,2,Expert
Ana Martínez,Alpha Squadron,Full Stack Developer,495,7,2,Advanced
...
```

**Campos:**
- `name`: Nombre del desarrollador
- `squadName`: Equipo al que pertenece
- `position`: Cargo/posición
- `points`: Puntos totales
- `missions`: Misiones completadas
- `challenges`: Retos especiales completados
- `level`: Nivel (Expert/Advanced/Intermediate/Beginner)

## 🔄 Flujo de Trabajo Recomendado

### **Actualización Semanal**
1. **Descargar** datos actuales del panel admin
2. **Actualizar** puntos en Excel/Sheets basado en progreso semanal
3. **Subir** CSV actualizado al panel
4. **Verificar** que leaderboards reflejen cambios
5. **Comunicar** actualizaciones al equipo

### **Backup de Datos**
1. **Descargar** regularmente como respaldo
2. **Versionar** archivos por fecha
3. **Mantener** historial de cambios
4. **Restaurar** desde backup si es necesario

## 🛡️ Estado del Sistema

### **Indicadores en Panel**
- ✅ **Fuente de datos**: Estáticos vs Subidos
- ✅ **Última actualización**: Timestamp de cambios
- ✅ **Contadores**: Squads y desarrolladores cargados
- ✅ **Acciones**: Reset y actualización de vista

### **Botones de Control**
- 🔄 **Actualizar Vista**: Refresca la página
- 🔄 **Volver a Datos Estáticos**: Reset completo
- 📊 **Descargar Squads**: Plantilla de equipos
- 👤 **Descargar Individuales**: Plantilla de desarrolladores

## 📱 Compatibilidad

### **Formatos Soportados**
- ✅ **CSV**: Formato principal
- ✅ **Excel**: Compatible para edición
- ✅ **Google Sheets**: Compatible para colaboración
- ✅ **UTF-8**: Soporte para caracteres especiales

### **Navegadores**
- ✅ Chrome/Edge: Descarga automática
- ✅ Firefox: Descarga automática
- ✅ Safari: Descarga automática
- ✅ Mobile: Funcional en tablets

## 🎯 Beneficios

1. **Facilidad de uso**: No necesitas crear CSVs desde cero
2. **Consistencia**: Formato garantizado compatible
3. **Backup automático**: Siempre tienes los datos actuales
4. **Versionado**: Archivos con fecha para historial
5. **Colaboración**: Fácil compartir con equipo para edición

---

**Acceso**: `http://localhost:4200/admin`
**Contraseña**: `aeromexico2025`
**Ubicación**: Sección "Descargar Datos Actuales"