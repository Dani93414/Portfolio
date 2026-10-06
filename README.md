# Portfolio profesional de Daniel Grande Rubio

Portfolio multipágina construido con HTML, CSS y JavaScript sin dependencias de producción. Incluye animaciones, modo claro/oscuro, diseño responsive, integración opcional con la API pública de GitHub y una versión imprimible del currículum.

## Páginas

- `index.html`: presentación, experiencia, formación, proyectos, motivaciones, currículum y contacto.
- `proyectos.html`: todos los repositorios, filtros, búsqueda y fichas detalladas.
- `valoinsight.html`: caso de estudio completo del proyecto principal.
- `curriculum.html`: currículum web imprimible.

## Iniciar en local

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Personalización

La información central de proyectos y enlaces se encuentra en:

```text
assets/js/data.js
```

La lista exacta de contenidos pendientes está en:

```text
docs/CONTENT_PENDING.md
```

Los pasos de despliegue están en:

```text
docs/DEPLOY.md
```

## Características

- Responsive para móvil, tableta y escritorio.
- Animaciones de entrada respetando `prefers-reduced-motion`.
- Modo claro y oscuro persistente.
- Filtros y búsqueda de proyectos.
- Modales accesibles con información de cada repositorio.
- Datos de GitHub con fallback local.
- Formulario de contacto sin almacenamiento externo.
- Currículum preparado para imprimir o guardar como PDF.
- Cabeceras de seguridad para Vercel.

## Nota sobre Riot Games

ValoInsight es un proyecto independiente y no está afiliado, respaldado ni patrocinado por Riot Games.

## Inicio rápido en Windows

1. Descomprime **todo** el ZIP. No abras los archivos directamente desde el ZIP.
2. Entra en la carpeta que contiene `package.json`.
3. Haz doble clic en `INICIAR_PORTFOLIO.bat`, o ejecuta:

```powershell
npm run dev
```

Después abre `http://localhost:3000`.

Si aparece `ENOENT ... package.json`, estás en una carpeta incorrecta o la extracción está incompleta. Ejecuta `dir package.json` y entra en la carpeta donde aparezca ese archivo.
