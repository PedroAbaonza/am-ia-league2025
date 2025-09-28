#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando assets de imágenes...\n');

const assetsPath = path.join(__dirname, '../src/assets/images');
const requiredImages = [
  'logos/aeromexico-logo.png',
  'logos/ai-league-logo.png'
];

const optionalImages = [
  'logos/aeromexico-logo@2x.png',
  'logos/ai-league-logo@2x.png',
  'backgrounds/hero-background.jpg',
  'icons/airplane-icon.svg',
  'avatars/carlos-rodriguez.jpg'
];

let allGood = true;

// Verificar imágenes requeridas
console.log('📋 Imágenes requeridas:');
requiredImages.forEach(imagePath => {
  const fullPath = path.join(assetsPath, imagePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✅ ${imagePath} (${sizeKB}KB)`);
  } else {
    console.log(`❌ ${imagePath} - FALTANTE`);
    allGood = false;
  }
});

// Verificar imágenes opcionales
console.log('\n📋 Imágenes opcionales:');
optionalImages.forEach(imagePath => {
  const fullPath = path.join(assetsPath, imagePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✅ ${imagePath} (${sizeKB}KB)`);
  } else {
    console.log(`⚪ ${imagePath} - opcional`);
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 ¡Todos los assets requeridos están presentes!');
  console.log('✨ La aplicación debería mostrar los logos correctamente.');
} else {
  console.log('⚠️  Faltan assets requeridos.');
  console.log('📖 Ver INSTRUCCIONES-IMAGENES.md para más detalles.');
}
console.log('='.repeat(50));

process.exit(allGood ? 0 : 1);