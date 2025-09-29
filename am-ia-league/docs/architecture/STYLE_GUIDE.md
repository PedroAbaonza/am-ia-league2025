# Guía de Estilos - Aeroméxico AI League 2025

## 🎨 Sistema de Diseño

### Paleta de Colores

#### Colores Principales
```scss
:root {
  // Colores Corporativos Aeroméxico
  --deep-space-blue: #0A1033;      // Fondo principal oscuro
  --aviation-blue: #00AEEF;        // Azul corporativo Aeroméxico
  --sky-blue-neon: #00D4FF;        // Azul neón para acentos
  --squadron-pink: #FF2D82;        // Rosa para elementos destacados
  
  // Colores de Texto
  --text-primary: #FFFFFF;         // Texto principal (blanco)
  --text-secondary: #F3F4F6;       // Texto secundario (gris claro)
  --text-muted: #9CA3AF;           // Texto atenuado (gris medio)
  
  // Colores de Interfaz
  --card-bg: rgba(255, 255, 255, 0.05);     // Fondo de tarjetas
  --card-border: rgba(255, 255, 255, 0.1);  // Bordes de tarjetas
  
  // Efectos de Resplandor
  --glow-blue: 0 0 20px rgba(0, 174, 239, 0.3);
  --glow-pink: 0 0 20px rgba(255, 45, 130, 0.3);
}
```

#### Uso de Colores
- **Deep Space Blue**: Fondo principal, navegación
- **Aviation Blue**: Enlaces, botones primarios, elementos interactivos
- **Sky Blue Neon**: Acentos, hover states, elementos destacados
- **Squadron Pink**: Alertas, elementos de alta prioridad, gamificación
- **Texto**: Jerarquía clara con tres niveles de contraste

### Tipografías

#### Fuentes Principales
```scss
// Importación desde Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500&display=swap');

// Clases de utilidad
.font-primary {
  font-family: 'Montserrat', sans-serif;
}

.font-mono {
  font-family: 'Roboto Mono', monospace;
}
```

#### Jerarquía Tipográfica
```scss
// Títulos principales
.title-xl {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
}

.title-lg {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.2;
}

.title-md {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.3;
}

// Texto de cuerpo
.text-lg {
  font-size: 1.125rem;
  line-height: 1.6;
}

.text-base {
  font-size: 1rem;
  line-height: 1.6;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.5;
}
```

### Espaciado y Layout

#### Sistema de Espaciado
```scss
// Escala de espaciado basada en 0.25rem (4px)
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
$spacing-3xl: 4rem;     // 64px
```

#### Breakpoints Responsive
```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);

// Mixins para media queries
@mixin mobile-up {
  @media (min-width: 768px) { @content; }
}

@mixin desktop-up {
  @media (min-width: 1024px) { @content; }
}
```

## 🧩 Componentes de UI

### Botones

#### Botón Primario
```scss
.btn-primary {
  background: linear-gradient(135deg, var(--aviation-blue), var(--sky-blue-neon));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 174, 239, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

#### Botón Secundario
```scss
.btn-secondary {
  background: transparent;
  color: var(--aviation-blue);
  border: 2px solid var(--aviation-blue);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--aviation-blue);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
  }
}
```

### Tarjetas (Cards)

#### Tarjeta Base
```scss
.card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
                0 0 30px rgba(0, 174, 239, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(0, 174, 239, 0.5);
  }
}
```

#### Tarjeta Destacada
```scss
.card--highlighted {
  background: rgba(255, 45, 130, 0.15);
  border: 2px solid var(--squadron-pink);
  box-shadow: 0 0 30px rgba(255, 45, 130, 0.5),
              0 8px 25px rgba(255, 45, 130, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow-pulse 2s ease-in-out infinite alternate;
}
```

### Badges y Etiquetas

#### Badge de Puntos
```scss
.points-badge {
  background: linear-gradient(135deg, var(--aviation-blue), var(--sky-blue-neon));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: badge-shine 2s ease-in-out infinite;
  }
  
  &.bonus {
    background: linear-gradient(135deg, var(--squadron-pink), #FF6B9D);
    box-shadow: 0 4px 15px rgba(255, 45, 130, 0.3);
  }
}
```

### Iconos

#### Iconos de Misión
```scss
.mission-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 14px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  // Variantes por tipo
  &.icon-amazon-q {
    background: linear-gradient(135deg, #FF9500, #FFB84D);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
  }
  
  &.icon-ai-flight-tips {
    background: linear-gradient(135deg, var(--aviation-blue), var(--sky-blue-neon));
    color: white;
    box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
  }
}
```

## ✨ Efectos y Animaciones

### Animaciones de Entrada
```scss
// Fade in desde abajo
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Slide desde la izquierda
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Efectos de Hover
```scss
.interactive-element {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 174, 239, 0.4);
  }
}
```

### Efectos de Resplandor
```scss
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 30px rgba(255, 45, 130, 0.5);
  }
  100% {
    box-shadow: 0 0 50px rgba(255, 45, 130, 0.8);
  }
}

.glow-element {
  animation: glow-pulse 2s ease-in-out infinite alternate;
}
```

## 📱 Responsive Design

### Estrategia Mobile-First
```scss
// Base: Mobile (320px+)
.component {
  padding: 1rem;
  font-size: 0.875rem;
  
  // Tablet (768px+)
  @include mobile-up {
    padding: 1.5rem;
    font-size: 1rem;
  }
  
  // Desktop (1024px+)
  @include desktop-up {
    padding: 2rem;
    font-size: 1.125rem;
  }
}
```

### Grid Responsive
```scss
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @include mobile-up {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @include desktop-up {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## 🎯 Patrones de Uso

### Estados de Componentes
```scss
// Estado normal
.component {
  opacity: 1;
  transform: scale(1);
}

// Estado loading
.component--loading {
  opacity: 0.6;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 2px solid var(--aviation-blue);
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    transform: translate(-50%, -50%);
  }
}

// Estado error
.component--error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

// Estado success
.component--success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}
```

### Utilidades Comunes
```scss
// Texto con gradiente
.gradient-text {
  background: linear-gradient(135deg, var(--aviation-blue), var(--sky-blue-neon));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Truncar texto
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Centrar contenido
.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Ocultar en móvil
.hidden-mobile {
  @media (max-width: 767px) {
    display: none !important;
  }
}

// Mostrar solo en móvil
.mobile-only {
  @media (min-width: 768px) {
    display: none !important;
  }
}
```

## 🔧 Herramientas y Mixins

### Mixins Útiles
```scss
// Glassmorphism effect
@mixin glassmorphism($opacity: 0.08) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// Hover lift effect
@mixin hover-lift($distance: 4px) {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-#{$distance});
    box-shadow: 0 #{$distance * 2} #{$distance * 6} rgba(0, 0, 0, 0.2);
  }
}

// Gradient border
@mixin gradient-border($width: 2px) {
  position: relative;
  background: var(--card-bg);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: $width;
    background: linear-gradient(135deg, var(--aviation-blue), var(--squadron-pink));
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }
}
```

### Variables SCSS
```scss
// Duraciones de animación
$duration-fast: 0.15s;
$duration-normal: 0.3s;
$duration-slow: 0.5s;

// Funciones de easing
$ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
$ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);

// Z-index layers
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;
```

## 📋 Checklist de Implementación

### Antes de Crear un Componente
- [ ] Revisar si existe un componente similar
- [ ] Definir estados (normal, hover, active, disabled)
- [ ] Considerar variantes (tamaños, colores, tipos)
- [ ] Planificar responsive behavior
- [ ] Definir animaciones necesarias

### Durante el Desarrollo
- [ ] Usar variables CSS para colores y espaciado
- [ ] Implementar estados de hover y focus
- [ ] Añadir transiciones suaves
- [ ] Probar en diferentes tamaños de pantalla
- [ ] Verificar contraste de colores

### Después de la Implementación
- [ ] Documentar el componente
- [ ] Crear ejemplos de uso
- [ ] Probar accesibilidad
- [ ] Validar performance
- [ ] Revisar con el equipo de diseño

Esta guía debe ser consultada por todos los desarrolladores antes de implementar nuevos componentes o modificar estilos existentes.