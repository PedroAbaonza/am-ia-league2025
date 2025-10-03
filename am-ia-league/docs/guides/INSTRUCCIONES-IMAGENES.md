# 📸 Instrucciones para Agregar las Imágenes

## 🎯 Imágenes que necesitas agregar:

### 1. Logo de Aeromexico

- **Archivo**: La primera imagen que me enviaste (logo blanco de Aeromexico)
- **Ubicación**: `src/assets/images/logos/aeromexico-logo.png`
- **Formato recomendado**: PNG con transparencia
- **Resolución**: Mantener la original, idealmente 400x200px o similar
- **Uso**: Navegación principal y branding

### 2. Logo AI League 2025

- **Archivo**: La segunda imagen que me enviaste (escudo del AI League)
- **Ubicación**: `src/assets/images/logos/ai-league-logo.png`
- **Formato recomendado**: PNG con transparencia
- **Resolución**: Mantener la original, idealmente 600x600px o similar
- **Uso**: Hero section principal y páginas de título

## 🔧 Pasos para agregar las imágenes:

### Paso 1: Guardar las imágenes

1. Guarda la primera imagen como `aeromexico-logo.png`
2. Guarda la segunda imagen como `ai-league-logo.png`

### Paso 2: Copiar a la aplicación

```bash
# Desde tu directorio de descargas o donde tengas las imágenes
cp aeromexico-logo.png am-ia-league/src/assets/images/logos/
cp ai-league-logo.png am-ia-league/src/assets/images/logos/
```

### Paso 3: Verificar que funcionan

1. Ejecuta `ng serve` si no está corriendo
2. Ve a `http://localhost:4200`
3. Deberías ver:
   - Logo de Aeromexico en la navegación superior
   - Logo del AI League en el hero section principal

## ✅ Verificación

### En la Navegación:

- Deberías ver el logo blanco de Aeromexico en la esquina superior izquierda
- Al lado debe aparecer "AI League 2025"

### En el Hero Section:

- Deberías ver el escudo grande del AI League 2025 centrado
- Con efectos de glow animados (azul y rosa alternando)

### Si no se ven las imágenes:

- Verifica que los nombres de archivo coincidan exactamente
- Asegúrate de que estén en la carpeta correcta
- Revisa la consola del navegador para errores
- Los fallbacks mostrarán iconos de emoji (✈️ y 🚀) si las imágenes no cargan

## 🎨 Optimizaciones adicionales (opcionales):

### Para mejor rendimiento:

1. **Comprimir las imágenes** usando TinyPNG o similar
2. **Crear versiones @2x** para pantallas retina:
   - `aeromexico-logo@2x.png` (doble resolución)
   - `ai-league-logo@2x.png` (doble resolución)

### Para diferentes formatos:

1. **Convertir a WebP** para navegadores modernos
2. **Crear versiones SVG** si tienes los archivos vectoriales originales

## 🚀 Resultado esperado:

Una vez agregadas las imágenes, tendrás:

- ✅ Branding profesional con logos oficiales
- ✅ Navegación con logo de Aeromexico
- ✅ Hero impactante con logo del AI League
- ✅ Efectos visuales y animaciones
- ✅ Fallbacks automáticos si las imágenes fallan
- ✅ Responsive design en todos los dispositivos

## 📞 Si tienes problemas:

1. Verifica que los archivos estén en la ubicación correcta
2. Revisa que los nombres sean exactos (case-sensitive)
3. Asegúrate de que sean archivos PNG válidos
4. Reinicia el servidor de desarrollo (`ng serve`)

¡Una vez agregadas las imágenes, tu aplicación tendrá el branding completo de Aeromexico AI League 2025! 🎉
