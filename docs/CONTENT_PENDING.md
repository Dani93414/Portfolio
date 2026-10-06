# Contenido pendiente antes de publicar

La web ya funciona y contiene una primera versión completa del contenido. Estos elementos necesitan información o archivos que no estaban disponibles en el proyecto local.

## 1. Currículum PDF original

**Dónde aparece:** `index.html`, sección `#curriculum`, y `curriculum.html`.

La web incluye una versión HTML imprimible basada en el currículum encontrado, pero no contiene el PDF original.

**Qué hacer:** copia el PDF dentro de:

```text
cv/Resume_Daniel_Grande_Rubio.pdf
```

Después puedes añadir un botón de descarga en `index.html` y `curriculum.html` con:

```html
<a href="cv/Resume_Daniel_Grande_Rubio.pdf" download>Descargar PDF</a>
```

## 2. Capturas reales de ValoInsight

**Dónde aparecen:** `index.html`, sección de ValoInsight, y `valoinsight.html`, sección `#galeria`.

Actualmente se muestran composiciones visuales creadas con CSS para que el diseño no quede vacío. Conviene sustituirlas o acompañarlas por capturas reales.

Capturas recomendadas:

1. Página principal o buscador.
2. Perfil y estadísticas de un jugador.
3. Historial y modal de detalle de partida.
4. Timeline y mapa de eventos de una ronda.
5. Heatmap.
6. Vista móvil.
7. Vídeo de 20–40 segundos recorriendo el flujo principal.

Guárdalas en `assets/img/valoinsight/` y cambia los bloques indicados en `valoinsight.html`.

## 3. URL pública de ValoInsight

**Dónde aparece:** botones de ValoInsight en `index.html`, `proyectos.html`, `valoinsight.html` y `assets/js/data.js`.

El campo `demo` del proyecto está vacío:

```js
demo: "",
```

Cuando la aplicación esté desplegada, añade la URL pública en `assets/js/data.js`.

## 4. Aportación exacta en proyectos colaborativos

**Dónde aparece:** modal de cada proyecto en `proyectos.html`, generado desde `assets/js/data.js`.

Los colaboradores están identificados, pero el reparto de responsabilidades figura como “Desarrollo colaborativo”. Debes concretar qué hiciste tú en:

- PL Interpreter.
- Detección evolutiva de patrones.
- Algoritmo genético para ajuste de funciones.
- Comparativa TSP.

Ejemplos de aportación útil:

- Diseño del AST y nodos de control.
- Implementación de operadores genéticos.
- Preprocesamiento de datos.
- Visualización y análisis de resultados.
- Integración, pruebas o documentación.

## 5. Repositorio TSP privado

**Dónde aparece:** `proyectos.html` y `assets/js/data.js`.

El enlace solo funciona para usuarios con permisos. Opciones:

- Hacer público el repositorio después de revisar datos y licencias.
- Publicar una copia reducida y limpia.
- Mantenerlo privado y dejar únicamente la explicación del portfolio.

## 6. Fechas y resultados medibles de las prácticas

**Dónde aparece:** `index.html`, sección `#experiencia`, y `curriculum.html`.

Falta concretar:

- Mes de inicio y finalización.
- Número aproximado de flujos creados.
- Volumen de correos, documentos o registros tratados.
- Tiempo manual ahorrado.
- Equipos o personas beneficiadas.

No inventes métricas. Añádelas solo si puedes justificarlas.

## 7. LinkedIn

**Dónde se configura:** `assets/js/data.js`, campo:

```js
linkedin: "",
```

Cuando tengas una URL definitiva, añádela también a los bloques de contacto en `index.html` y `curriculum.html`.

## 8. Título definitivo y descripción del TFG

**Dónde aparece:** `index.html` y `valoinsight.html`.

La web presenta ValoInsight como proyecto personal y TFG. Conviene añadir:

- Título académico definitivo.
- Tutor o tutora, si deseas mostrarlo.
- Objetivo formal.
- Estado: en desarrollo, entregado o defendido.
- Resultados y conclusiones cuando estén disponibles.

## 9. Foto pública

La web utiliza actualmente el avatar público de GitHub:

```text
https://avatars.githubusercontent.com/u/152321914?v=4
```

Comprueba que sea la foto que quieres mostrar profesionalmente. Para no depender de GitHub, guarda una copia optimizada en:

```text
assets/img/daniel-grande.webp
```

Y sustituye las URLs en `index.html` y `curriculum.html`.

## 10. Datos de contacto públicos

El portfolio muestra correo y teléfono. Antes de publicar, decide si quieres que el teléfono sea visible. La dirección postal completa del CV original no se ha mostrado por privacidad; solo aparece “Córdoba, España”.

## 11. Dominio, analítica y privacidad

Antes de publicar de forma definitiva:

- Elige un dominio, por ejemplo `danielgrande.dev`.
- Actualiza `sitemap.xml` cuando conozcas el dominio.
- Añade analítica solo si la necesitas.
- Si usas cookies o formularios externos, prepara aviso de privacidad.

## Archivos principales para editar

- Datos de repositorios y enlaces: `assets/js/data.js`.
- Página principal: `index.html`.
- Lista de proyectos: `proyectos.html`.
- Caso de estudio ValoInsight: `valoinsight.html`.
- Currículum web: `curriculum.html`.
- Diseño y responsive: `assets/css/styles.css`.
