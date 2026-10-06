(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-coverflow]').forEach((carousel) => {
    const items = [...carousel.querySelectorAll('[data-coverflow-item]')];
    const isCurriculumCarousel = carousel.dataset.coverflow === 'cv';
    const previousButton = carousel.querySelector('[data-coverflow-prev]');
    const nextButton = carousel.querySelector('[data-coverflow-next]');
    let active = isCurriculumCarousel ? 0 : 1;

    const render = (direction = 1) => {
      items.forEach((item, index) => {
        let offset = index - active;
        if (offset > items.length / 2) offset -= items.length;
        if (offset < -items.length / 2) offset += items.length;
        item.dataset.position = offset === 0 ? 'active' : offset < 0 ? 'left' : 'right';
        item.style.setProperty('--carousel-distance', String(Math.min(Math.abs(offset), 2)));
        item.style.setProperty('--carousel-direction', String(Math.sign(offset)));
        item.setAttribute('aria-hidden', String(offset !== 0));
        item.querySelectorAll('a, button').forEach((control) => { control.tabIndex = offset === 0 ? 0 : -1; });
        if (!reducedMotion && offset === 0 && carousel.dataset.coverflow !== 'cv') item.animate([
          { transform: `translateX(${direction * 34}px) rotateY(${direction * -8}deg) scale(.92)`, opacity: .55 },
          { transform: 'translateX(0) rotateY(0) scale(1)', opacity: 1 }
        ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
      if (isCurriculumCarousel) {
        previousButton?.toggleAttribute('hidden', active === 0);
        nextButton?.toggleAttribute('hidden', active === items.length - 1);
      }
    };
    const move = (step) => {
      const destination = active + step;
      if (isCurriculumCarousel && (destination < 0 || destination >= items.length)) return;
      active = isCurriculumCarousel ? destination : (destination + items.length) % items.length;
      render(step);
    };
    previousButton?.addEventListener('click', () => move(-1));
    nextButton?.addEventListener('click', () => move(1));
    items.forEach((item, index) => item.addEventListener('click', (event) => {
      if (event.target.closest('a') || index === active) return;
      move(index > active ? 1 : -1);
    }));
    render();
  });

  const directory = document.querySelector('[data-project-directory]');
  const data = window.PORTFOLIO_DATA;
  if (directory && Array.isArray(data?.projects)) {
    const excluded = new Set(['valoinsight', 'tsp', 'genetic-fit', 'time-series']);
    directory.innerHTML = data.projects.filter((project) => !excluded.has(project.id)).map((project, index) => `
      <a class="project-directory-item reveal visible" href="proyecto.html?id=${encodeURIComponent(project.id)}" style="--item-index:${index}">
        <span class="project-directory-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="project-directory-copy"><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.description)}</small></span>
        <span class="project-directory-arrow">↗</span>
      </a>`).join('');
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);
  }
})();
