(() => {
  const root = document.querySelector('[data-project-detail]');
  const id = new URLSearchParams(location.search).get('id');
  const project = window.PORTFOLIO_DATA?.projects?.find((item) => item.id === id);
  if (!root || !project) {
    if (root) root.innerHTML = '<section class="page-hero"><div class="container"><span class="eyebrow">404</span><h1>Proyecto no encontrado</h1><p>Vuelve al archivo para consultar los proyectos disponibles.</p><a class="btn btn-primary" href="proyectos.html">Ver proyectos</a></div></section>';
    return;
  }
  document.title = `${project.name} — Daniel Grande Rubio`;
  const esc = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);
  const authors = project.collaborators?.length ? project.collaborators : [{ name: 'Daniel Grande Rubio', role: 'Desarrollo' }];
  root.innerHTML = `
    <section class="page-hero project-detail-hero"><div class="container"><a class="project-back" href="proyectos.html">← Archivo de proyectos</a><span class="eyebrow">${esc(project.kicker)}</span><h1>${esc(project.name)}</h1><p>${esc(project.longDescription)}</p><div class="page-hero-actions"><a class="btn btn-primary" href="${esc(project.repo)}" target="_blank" rel="noreferrer">Abrir repositorio ↗</a><span class="project-status">${esc(project.status)} · ${esc(project.year)}</span></div></div></section>
    <section class="section compact"><div class="container project-detail-grid"><article class="project-narrative"><span class="eyebrow">El proyecto</span><h2>Objetivo y funcionamiento</h2><p>${esc(project.description)}</p><ul class="detail-capabilities">${project.capabilities.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></article><aside class="project-tech-panel card"><span class="eyebrow">Tecnologías</span>${project.technologies.map((technology, index) => `<div class="detail-tech"><span>${String(index + 1).padStart(2,'0')}</span><div><strong>${esc(technology)}</strong><small>${technologyDescription(technology)}</small></div></div>`).join('')}</aside></div></section>
    <section class="section compact"><div class="container"><div class="section-heading"><span class="eyebrow">Galería</span><h2>Espacios preparados para capturas.</h2><p>Añade las imágenes del proyecto en <code>assets/img/projects/${esc(project.id)}/</code>.</p></div><div class="detail-gallery"><div class="gallery-placeholder"><span>01</span><strong>Vista principal</strong><small>Imagen pendiente</small></div><div class="gallery-placeholder"><span>02</span><strong>Funcionamiento</strong><small>Imagen pendiente</small></div><div class="gallery-placeholder"><span>03</span><strong>Resultados</strong><small>Imagen pendiente</small></div></div></div></section>
    <section class="section compact"><div class="container detail-bottom-grid"><article class="card detail-authors"><span class="eyebrow">Autores</span><h2>Equipo del proyecto</h2>${authors.map((author) => `<div class="author-row"><strong>${esc(author.name)}</strong><span>${esc(author.role)}</span></div>`).join('')}</article><article class="card detail-document"><span class="eyebrow">Documento</span><h2>Memoria o informe</h2><p>Espacio preparado para incorporar el documento asociado al proyecto.</p><span class="document-pending">Documento pendiente</span></article></div></section>`;

  function technologyDescription(technology) {
    const descriptions = { Python:'Procesamiento, algoritmia y automatización.', React:'Construcción de interfaces por componentes.', TypeScript:'Tipado y mantenibilidad del frontend.', FastAPI:'API, validación y lógica de backend.', MongoDB:'Persistencia documental y consultas.', NumPy:'Cálculo numérico y representación eficiente.', Pandas:'Preparación y análisis de datos.', Matplotlib:'Visualización de resultados experimentales.', 'C++':'Implementación eficiente y estructuras de datos.', Flex:'Análisis léxico del lenguaje.', Bison:'Análisis sintáctico y gramática.', JavaScript:'Interacción y lógica de interfaz.' };
    return descriptions[technology] || 'Tecnología aplicada al desarrollo y funcionamiento del proyecto.';
  }
})();
