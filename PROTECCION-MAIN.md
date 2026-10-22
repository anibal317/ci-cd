# Protección de `main`

`main` es la rama que se publica. Por eso tiene reglas: **nada llega a `main`
sin pasar por un pull request y sin que el CI esté verde.**

## Estado actual

Ya está configurado como **ruleset** (el mecanismo nuevo de GitHub, el que está
en Settings → Rules):

| Regla | Qué bloquea |
|---|---|
| `pull_request` | El push directo a `main`. Todo entra por PR. |
| `required_status_checks` | El merge con el check `test` en rojo, o sin haber corrido. |
| `non_fast_forward` | `git push --force` sobre `main`. |
| `deletion` | Borrar la rama `main`. |

Y **sin bypass**: ni un admin puede saltearlo. El hook `pre-push` se esquiva con
`--no-verify`; esto no.

Para verlo:

- En la web: **Settings → Rules → Rulesets → "Proteger main"**
- Por consola:
  ```bash
  gh api /repos/anibal317/ci-cd/rules/branches/main --jq '.[].type'
  ```

## Cómo recrearlo a mano (para la clase)

1. **Settings → Rules → Rulesets → New branch ruleset**
2. **Name:** `Proteger main` — **Enforcement status:** `Active`
3. **Target branches → Add target → Include by pattern:** `main`
4. Tildá:
   - ✅ **Require a pull request before merging** → Required approvals: `0`
   - ✅ **Require status checks to pass** → *Add checks* → buscá `test` → seleccionalo
     - ✅ **Require branches to be up to date before merging**
   - ✅ **Block force pushes**
   - ✅ **Restrict deletions**
5. **Create**

> ⚠️ Elegí `test`, **nunca `deploy`**. El CD solo dispara en push a `main`, así
> que en un pull request nunca reporta: si lo exigís, el PR queda bloqueado
> para siempre.

## Qué pasa en la práctica

```bash
git switch -c arreglar-h1
# ... el cambio ...
git push -u origin arreglar-h1
gh pr create --fill
```

1. El PR se abre y el CI corre solo.
2. Si `test` está rojo, el botón **Merge** queda deshabilitado.
3. Arreglás, pusheás, el CI vuelve a correr.
4. Verde → mergeás → el CD publica en Pages.

## Gotchas

- **Un check tiene que haber corrido al menos una vez** para poder seleccionarlo
  en la config. Si no aparece en el buscador, pusheá una vez y volvé.
- **`--no-verify` no sirve acá.** El hook es local y se saltea; el ruleset vive
  en el servidor. Por eso se hacen **los dos**: el hook avisa temprano, el
  ruleset garantiza.
- **Con `main` protegida no podés pushear directo.** Si tenés commits locales
  adelante, van por rama + PR.
- **"Require branches to be up to date"** obliga a actualizar tu rama con `main`
  antes de mergear, si `main` avanzó mientras trabajabas. Es más seguro, pero
  genera una corrida más del CI.

## Las dos guardias, juntas

| | Hook `pre-push` | Ruleset de `main` |
|---|---|---|
| Dónde corre | Tu máquina | GitHub |
| Se saltea con | `git push --no-verify` | nada |
| Para qué sirve | Avisarte temprano | Garantizar |
| Qué corre | `npm test` | El CI completo |

Un hook sin ruleset es una sugerencia. Un ruleset sin hook te avisa tarde, pero
al menos no se saltea. Juntos: feedback rápido **y** garantía.
