// Configuración para optimización de imágenes
// Usar con herramientas como imagemin, sharp, o similar

module.exports = {
  // Configuración para JPG
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },

  // Configuración para PNG
  png: {
    quality: [0.8, 0.9],
    speed: 4,
    strip: true
  },

  // Configuración para WebP
  webp: {
    quality: 85,
    lossless: false
  },

  // Configuración para SVG
  svg: {
    plugins: [
      { removeViewBox: false },
      { removeDimensions: true },
      { removeComments: true },
      { removeMetadata: true }
    ]
  },

  // Tamaños responsive
  responsive: {
    // Avatares
    avatar: [
      { width: 200, height: 200, suffix: '' },
      { width: 400, height: 400, suffix: '@2x' }
    ],
    
    // Backgrounds
    background: [
      { width: 1920, height: 1080, suffix: '-desktop' },
      { width: 1024, height: 768, suffix: '-tablet' },
      { width: 768, height: 1024, suffix: '-mobile' }
    ],

    // Logos
    logo: [
      { width: 200, height: 100, suffix: '' },
      { width: 400, height: 200, suffix: '@2x' }
    ]
  },

  // Directorios
  input: 'src/assets/images-source/',
  output: 'src/assets/images/',

  // Formatos de salida
  formats: ['webp', 'jpg', 'png'],

  // Compresión por directorio
  compression: {
    logos: { quality: 95 },
    backgrounds: { quality: 80 },
    icons: { quality: 90 },
    avatars: { quality: 85 },
    illustrations: { quality: 90 }
  }
};

// Script de optimización (package.json)
/*
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js",
    "build:images": "npm run optimize-images && ng build"
  }
}
*/