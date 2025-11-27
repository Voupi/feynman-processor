const fs = require('fs');
const path = require('path');

// 1. Definimos dónde vamos a crear el archivo (src/environments/environment.ts)
// __dirname es la carpeta actual (scripts), así que subimos un nivel (..) y entramos a src
const dirPath = path.join(__dirname, '../src/environments');
const filePath = path.join(dirPath, 'environment.ts');

// 2. Definimos el contenido del archivo
// Aquí es donde inyectamos las variables que configuraste en Vercel
const envConfigFile = `export const environment = {
  production: true,
  supabase: {
    url: '${process.env.SUPABASE_URL}',
    key: '${process.env.SUPABASE_KEY}'
  }
};
`;

// 3. Verificamos si la carpeta environments existe (por seguridad)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

console.log('colors: Magenta, Cyan');
console.log('🚀 Generando archivo environment.ts dinámicamente...');

// 4. Escribimos el archivo
fs.writeFile(filePath, envConfigFile, (err) => {
  if (err) {
    console.error('❌ Error al generar environment.ts:', err);
    throw err;
  }
  console.log(`✅ Archivo environment.ts generado correctamente en: ${filePath}`);
});