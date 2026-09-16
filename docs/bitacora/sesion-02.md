<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 2 (15 ago 2026): GitHub + deploy público  [RECONSTRUIDO]

> Nota de integridad: los commits originales de este anexo nunca llegaron a GitHub (el `git push` final quedó pendiente y la sandbox se reinició). Este anexo se reconstruyó fielmente en la sesión 3 a partir del historial de la conversación. Lección aplicada: la bitácora solo está a salvo cuando está PUSHEADA al repo, no en local ni en la sandbox.

### Resultado de la sesión
- ✅ Repo público creado y poblado: **https://github.com/DavinsonR/proyecto-davirson** (rama `main`, 45 objetos).
- ✅ Repo vinculado a Vercel → proyecto `proyecto-davirson-git` (id `prj_6A4tybxsDzHqEewvp8BPYRholyNa`, team `team_vsIksKP4BA1FeV3paGf1JR6s`).
- ✅ Primer deploy disparado por el usuario desde el dashboard (Create Preview Deployment, rama main).
- ✅ FALLO-05 resuelto: usuario apagó "Require Log In" (Vercel Authentication) a nivel de **proyecto y de team**.
- ✅ **Sitio PÚBLICO verificado:** https://proyecto-davirson-git.vercel.app — confirmado en incógnito, otro navegador y datos móviles (3 redes independientes).

### Ejecuciones (E-26 a E-35)
| Paso | Acción | Resultado |
|---|---|---|
| E-26 | git init + commit en sandbox; zip con .git entregado al usuario | ✅ |
| E-27 | Usuario crea repo público DavinsonR/proyecto-davirson | ✅ |
| E-28 | Usuario descomprime en /mnt/c/... y trabaja desde WSL/Zsh | ✅ |
| E-29 | git add -A + commit (los "modified" masivos eran cambios de permisos por /mnt/c) | ✅ |
| E-30 | Push por SSH | ❌ FALLO-07 |
| E-31 | Push por HTTPS con credenciales inválidas / token sin permisos | ❌ FALLO-08 |
| E-32 | Token nuevo con permiso correcto + limpiar credencial cacheada | ✅ |
| E-33 | git push -u origin main → 45 objetos | ✅ |
| E-34 | Vercel create_git_project (vincular repo) | ⚠️ FALLO-09 (vinculó, no pudo disparar deploy) |
| E-35 | Usuario dispara deploy manual + apaga Require Log In (proyecto y team) | ✅ SITIO LIVE |

### Fallos documentados
**FALLO-07 — Push SSH: Permission denied (publickey)**
- Causa: WSL sin llave SSH registrada en GitHub.
- Fix: cambiar remote a HTTPS: `git remote set-url origin https://github.com/DavinsonR/proyecto-davirson.git`.

**FALLO-08 — Push HTTPS: invalid credentials / 403 denied**
- Causa doble: (a) "Password" en el prompt de Git = Personal Access Token, NO la contraseña de la cuenta; (b) el primer token no tenía permiso de escritura; (c) una credencial inválida quedó cacheada y repetía el 403.
- Fix: `git config --global --unset credential.helper` + generar token con permiso correcto → **fine-grained: "Contents: Read and write"** (no existe casilla "repo" ahí) / **classic: scope "repo"**. Usuario `DavinsonR` + token como password.
- Lección: al pegar el token en la terminal no se ve nada (normal). Guardar con `git config --global credential.helper store` tras el primer éxito.

**FALLO-09 — Conector Vercel: 403 al disparar deployment**
- Síntoma: `create_git_project` crea y vincula el proyecto, pero el deploy automático falla; `list_projects` devuelve vacío; `get_project`/`update_project_deployment_protection` → 404/403.
- Causa: el token del conector MCP tiene rol restringido en el team — puede crear/vincular proyectos, NO puede disparar deployments de producción, listar, leer config ni modificar Deployment Protection.
- Fix: el primer deploy lo dispara el usuario desde el dashboard; los siguientes son automáticos por push.
- Lección permanente: NO reintentar deploys/config vía conector en este team. El canal es: push a GitHub → autodeploy.

### Nota crítica de verificación (para futuras sesiones)
La verificación por `curl` desde la sandbox devuelve **403 falso** contra vercel.app, incluso con User-Agent de navegador. NO es indicador del estado real del sitio. La prueba válida es navegador real en red real (incógnito / otra red / datos móviles). No diagnosticar "sitio caído" por curl.

---
