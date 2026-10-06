# Cómo desplegar el portfolio

## Opción recomendada: GitHub + Vercel

### 1. Crea el repositorio

En GitHub crea un repositorio, por ejemplo:

```text
portfolio-daniel-grande
```

No es necesario inicializarlo con README porque este proyecto ya lo incluye.

### 2. Sube el proyecto

Abre una terminal dentro de la carpeta `portfolio-daniel` y ejecuta:

```bash
git init
git add .
git commit -m "Crear portfolio profesional"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio-daniel-grande.git
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario real.

### 3. Importa en Vercel

1. Entra en Vercel con tu cuenta de GitHub.
2. Pulsa **Add New → Project**.
3. Selecciona el repositorio del portfolio.
4. En **Framework Preset**, selecciona **Other**.
5. No añadas Build Command.
6. No cambies el Output Directory.
7. Pulsa **Deploy**.

El archivo `vercel.json` activa URLs limpias, cabeceras de seguridad y caché de recursos.

### 4. Comprueba las páginas

Prueba estas rutas:

```text
/
/proyectos
/valoinsight
/curriculum
```

### 5. Conecta un dominio

En Vercel:

1. Abre el proyecto.
2. Ve a **Settings → Domains**.
3. Añade el dominio.
4. Sigue las instrucciones DNS.
5. Actualiza las URLs de `sitemap.xml`.

## Vista local

Necesitas Node.js. Dentro de la carpeta:

```bash
npm run dev
```

Después abre:

```text
http://localhost:3000
```

También puedes usar Python:

```bash
python -m http.server 3000
```

## Netlify

### Método rápido

1. Comprime la carpeta o selecciónala completa.
2. Abre Netlify Drop.
3. Arrastra el contenido del proyecto.

### Desde GitHub

1. **Add new site → Import an existing project**.
2. Selecciona GitHub y el repositorio.
3. Deja vacío el comando de build.
4. Usa `.` como directorio de publicación.

## GitHub Pages

1. Sube el proyecto a GitHub.
2. Abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige `main` y `/root`.
5. Guarda.

En GitHub Pages utiliza los enlaces `.html` incluidos en el proyecto. Vercel ofrece una experiencia mejor con las URLs limpias.

## Actualizaciones posteriores

Cada cambio que subas a la rama `main` se desplegará automáticamente en Vercel o Netlify:

```bash
git add .
git commit -m "Actualizar portfolio"
git push
```

## GitHub API

La web consulta de forma opcional los repositorios públicos para mostrar lenguaje, estrellas y fecha de actualización. Si la API no responde o alcanza su límite, se mantiene la información local y la página sigue funcionando.

No pongas un token privado de GitHub en JavaScript del navegador.
