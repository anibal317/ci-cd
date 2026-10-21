// Verificación de la página. Sin dependencias, para que se entienda entero.
// Sale con código 1 si algo falla -> eso es lo que pinta el CI de rojo.

import { readFileSync, existsSync } from 'node:fs';

const leer = (ruta) => (existsSync(ruta) ? readFileSync(ruta, 'utf8') : '');

const html = leer('public/index.html');
const css = leer('public/styles.css');
const js = leer('public/app.js');

const checks = [
  ['index.html: el <title> dice "CI/CD Demo"', /<title>\s*CI\/CD Demo\s*<\/title>/.test(html)],
  ['index.html: el <h1> dice "CI/CD Demo"', /<h1[^>]*>\s*CI\/CD Demo\s*<\/h1>/.test(html)],
  ['index.html: declara lang="es"', /<html[^>]+lang="es"/.test(html)],
  ['index.html: enlaza styles.css', /<link[^>]+href="styles\.css"/.test(html)],
  ['index.html: carga app.js', /<script[^>]+src="app\.js"/.test(html)],
  ['index.html: tiene el elemento #version', /id="version"/.test(html)],
  ['styles.css: existe y tiene reglas', css.includes('{') && css.includes('}')],
  ['app.js: existe y tiene código', js.trim().length > 0],
  ['app.js: define la constante VERSION', /const\s+VERSION\s*=/.test(js)],
];

let failed = 0;
for (const [nombre, ok] of checks) {
  console.log(`${ok ? 'OK   ' : 'FALLA'}  ${nombre}`);
  if (!ok) failed++;
}

console.log('');
if (failed > 0) {
  console.error(`Fallaron ${failed} de ${checks.length} verificaciones.`);
  process.exit(1);
}
console.log(`Pasaron las ${checks.length} verificaciones.`);
