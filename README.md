# CI/CD Demo

Demo mínima para mostrar CI/CD en clase: una página que **se verifica** en cada
cambio y **se publica sola** cuando el cambio llega a `main`.

[![CI](https://github.com/anibal317/ci-cd/actions/workflows/ci.yml/badge.svg)](https://github.com/anibal317/ci-cd/actions/workflows/ci.yml)

**Sitio publicado:** https://anibal317.github.io/ci-cd/

## Los dos conceptos

| Concepto | Qué significa |
|---|---|
| **CI** — Integración Continua | Cada vez que alguien manda un cambio, se verifica solo. Si está rojo, no entra. |
| **CD** — Despliegue Continuo | Si está verde y llega a `main`, se publica solo. |

## Estructura

```
public/index.html                  estructura de la página (solo HTML)
public/styles.css                  los estilos
public/app.js                      el JS (ahí está la constante VERSION)
check.mjs                          la verificación (sin dependencias, se lee entera)
package.json                       script `npm test` -> corre check.mjs
.github/workflows/ci.yml           CI: verifica en cada push y cada PR
.github/workflows/cd.yml           CD: verifica y publica en Pages (solo en main)
```

## Correrlo local

```bash
npm ci          # instala (no hay dependencias, pero genera el lock)
npm test        # corre la verificación -> OK/FALLA
npm run preview # levanta la página en http://localhost:3000
```

## Guion de la clase

**Momento 1 — se corre solo.**
Hacé un cambio chico y push. Nadie ejecutó nada. Abrí la pestaña **Actions** y
mostrá el job corriendo en vivo. Verde.

**Momento 2 — el rojo (el momento que enseña).**
Borrá el `<h1>` de `public/index.html` y push. Rojo. Abrí el log y mostrá
*dónde* falló y *por qué*. El error llegó antes que el usuario.

**Momento 3 — CD.**
Arreglalo, cambiá el `v1` por `v2`, push a `main`. Andá a la URL publicada:
la página ya cambió sola. Nadie copió archivos por FTP.

**Momento 4 — el por qué.**
Activá branch protection en `main` pidiendo que CI pase
(Settings → Branches → Add rule). Ahora un PR con CI rojo **no se puede mergear**.
Ese es el motivo real del CI, no la sintaxis del YAML.

## Cosas que suelen salir mal

- **La primera corrida tarda 30-60s.** Avisalo antes, si no se impacientan.
- **`npm ci` necesita `package-lock.json` commiteado.** Si falta, falla. Es el
  error número uno al armar el primer workflow.
- **Pages tiene que estar en "GitHub Actions" como source** (Settings → Pages),
  no en "Deploy from a branch". Si no, el deploy falla.
- **`environment: github-pages` puede aparecer subrayado en VS Code.** Es un
  falso positivo de la extensión de GitHub Actions, no un error del YAML.
  Se arregla activando Pages y refrescando el panel; el workflow corre igual.
- **El CD verifica antes de publicar.** Si rompés la página y pusheás a `main`,
  el deploy **falla** y no se publica nada roto. Es a propósito.
