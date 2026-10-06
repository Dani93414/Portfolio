(() => {
  const data = window.PORTFOLIO_DATA || {};
  const helpers = window.PortfolioHelpers || {};
  const grid = document.querySelector('[data-project-grid]');
  const search = document.querySelector('[data-project-search]');
  const filters = [...document.querySelectorAll('[data-project-filter]')];
  const dialog = document.querySelector('[data-project-dialog]');
  const dialogContent = document.querySelector('[data-dialog-content]');
  let currentFilter = 'Todos';

  if (!grid || !Array.isArray(data.projects)) return;

  const render = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase('es');
    const visible = data.projects.filter((project) => {
      const filterMatch = currentFilter === 'Todos' || project.category.includes(currentFilter) || project.technologies.includes(currentFilter);
      const haystack = [project.name, project.description, project.longDescription, ...project.category, ...project.technologies].join(' ').toLocaleLowerCase('es');
      return filterMatch && (!query || haystack.includes(query));
    });

    const cardMarkup = (project) => {
      const base = helpers.projectCardMarkup(project, true);
      return base.replace('<article ', `<article data-project-id="${project.id}" `)
        .replace(/<a class="project-link"[^>]*>[\s\S]*?<\/a>/, `<button class="project-link btn-ghost" type="button" data-open-project="${project.id}">Ver detalles <span>→</span></button>`);
    };
    if (currentFilter === 'Todos' && !query) {
      const groups = [
        ['Proyecto destacado', visible.filter((project) => project.id === 'valoinsight')],
        ['Metaheurística', visible.filter((project) => project.category.includes('Metaheurística'))],
        ['Software, interfaces y experiencia', visible.filter((project) => project.id !== 'valoinsight' && !project.category.includes('Metaheurística'))],
      ];
      grid.innerHTML = groups.map(([title, projects]) => `<section class="project-family"><div class="project-family-heading"><span>${title}</span><strong>${String(projects.length).padStart(2, '0')}</strong></div><div class="project-family-grid">${projects.map(cardMarkup).join('')}</div></section>`).join('');
    } else {
      grid.innerHTML = visible.map(cardMarkup).join('');
    }

    if (!visible.length) {
      grid.innerHTML = '<div class="card" style="padding:32px;grid-column:1/-1"><h3>No hay proyectos que coincidan</h3><p class="muted">Prueba con otro filtro o término de búsqueda.</p></div>';
    }

    grid.querySelectorAll('[data-open-project]').forEach((button) => {
      button.addEventListener('click', () => openProject(button.dataset.openProject));
    });
  };

  const openProject = (id) => {
    const project = data.projects.find((item) => item.id === id);
    if (!project || !dialog || !dialogContent) return;
    const repoButton = project.visibility === 'private'
      ? `<a class="btn btn-secondary" href="${project.repo}" target="_blank" rel="noreferrer">Repositorio privado ↗</a>`
      : `<a class="btn btn-primary" href="${project.repo}" target="_blank" rel="noreferrer">Abrir GitHub ↗</a>`;
    const demoButton = project.demo ? `<a class="btn btn-secondary" href="${project.demo}" target="_blank" rel="noreferrer">Abrir demo ↗</a>` : '';
    const caseButton = project.href ? `<a class="btn btn-secondary" href="${project.href}">Caso de estudio</a>` : '';

    dialogContent.innerHTML = `
      <div class="dialog-kicker">${helpers.escapeHtml(project.kicker)}</div>
      <h2>${helpers.escapeHtml(project.name)}</h2>
      <p>${helpers.escapeHtml(project.longDescription)}</p>
      <div class="tag-row">${project.technologies.map((tech) => `<span class="tag">${helpers.escapeHtml(tech)}</span>`).join('')}</div>
      <div class="dialog-columns">
        <div class="dialog-block">
          <h3>Qué hace</h3>
          <ul>${project.capabilities.map((item) => `<li>${helpers.escapeHtml(item)}</li>`).join('')}</ul>
        </div>
        <div class="dialog-block">
          <h3>Colaboración</h3>
          <ul>${project.collaborators.map((person) => `<li><strong>${helpers.escapeHtml(person.name)}</strong><br><span class="muted">${helpers.escapeHtml(person.role)}</span></li>`).join('')}</ul>
        </div>
      </div>
      <div class="dialog-actions">${repoButton}${demoButton}${caseButton}</div>`;
    dialog.showModal();
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.projectFilter;
      filters.forEach((item) => item.classList.toggle('active', item === button));
      render();
    });
  });
  search?.addEventListener('input', render);
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });

  render();
})();
