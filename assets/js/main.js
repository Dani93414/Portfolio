(() => {
  const data = window.PORTFOLIO_DATA || {};
  const root = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Desktop landing: folders reveal the existing portfolio sections.
  const desktop = qs('[data-os-desktop]');
  const desktopLight = qs('[data-desktop-light]');
  const cvLibraryDialog = qs('[data-cv-library-dialog]');
  const certificatesDialog = qs('[data-certificates-dialog]');
  const openCvLibrary = () => {
    if (cvLibraryDialog?.showModal) cvLibraryDialog.showModal();
  };
  const openCertificatesDialog = (folder) => {
    if (!certificatesDialog?.showModal || certificatesDialog.open) return;
    folder?.classList.add('is-opening');
    window.setTimeout(() => folder?.classList.remove('is-opening'), prefersReduced ? 0 : 160);
    certificatesDialog.classList.remove('is-closing', 'is-open');
    certificatesDialog.showModal();
    if (prefersReduced) {
      certificatesDialog.classList.add('is-open');
      return;
    }
    void certificatesDialog.offsetWidth;
    requestAnimationFrame(() => certificatesDialog.classList.add('is-open'));
  };
  const closeCertificatesDialog = () => {
    if (!certificatesDialog?.open) return;
    if (prefersReduced) {
      certificatesDialog.close();
      return;
    }
    certificatesDialog.classList.remove('is-open');
    certificatesDialog.classList.add('is-closing');
    window.setTimeout(() => {
      if (certificatesDialog.open) certificatesDialog.close();
      certificatesDialog.classList.remove('is-closing');
    }, 180);
  };
  const leaveDesktop = (destination = '#inicio') => {
    if (!desktop) return;
    body.classList.add('desktop-exited');
    window.setTimeout(() => {
      const target = qs(destination);
      if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }, prefersReduced ? 0 : 280);
  };
  if (desktop) {
    const languageButton = qs('[data-desktop-language]');
    const updateLanguageButton = () => {
      if (!languageButton) return;
      const spanish = document.documentElement.lang !== 'en';
      languageButton.setAttribute('aria-label', spanish ? 'View in English' : 'Ver en español');
      languageButton.title = spanish ? 'View in English' : 'Ver en español';
    };
    languageButton?.addEventListener('click', () => {
      window.PortfolioI18n?.applyLanguage(document.documentElement.lang === 'es' ? 'en' : 'es');
    });
    window.addEventListener('portfolio:language', updateLanguageButton);
    window.setTimeout(updateLanguageButton, 0);
    const folders = qsa('[data-folder-id]', desktop);
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    // Folder positions are intentionally temporary: a page refresh restores the desktop layout.
    try { localStorage.removeItem('portfolio-desktop-folders'); } catch { /* Storage may be unavailable. */ }
    const savedFolderPositions = {};
    const saveFolderPositions = () => {};
    const selectFolder = (folder, append = false) => {
      if (!append) folders.forEach((item) => item.classList.remove('selected'));
      folder.classList.toggle('selected', append ? !folder.classList.contains('selected') : true);
    };
    folders.forEach((folder) => {
      // These are links, which browsers otherwise try to drag natively before
      // our pointer-based positioning code can take control.
      folder.draggable = false;
      folder.addEventListener('dragstart', (event) => event.preventDefault());
      const saved = savedFolderPositions[folder.dataset.folderId];
      if (saved) folder.style.translate = `${saved.x}px ${saved.y}px`;
      folder.addEventListener('click', (event) => {
        event.preventDefault();
        if (folder.dataset.dragged === 'true') {
          folder.dataset.dragged = 'false';
          return;
        }
        if (finePointer) selectFolder(folder, event.ctrlKey || event.metaKey);
        else if (folder.dataset.folderId === 'cv') openCvLibrary();
        else if (folder.dataset.folderId === 'certificates') openCertificatesDialog(folder);
        else leaveDesktop(folder.getAttribute('href'));
      });
      folder.addEventListener('dblclick', (event) => {
        event.preventDefault();
        if (folder.dataset.folderId === 'cv') {
          openCvLibrary();
          return;
        }
        if (folder.dataset.folderId === 'certificates') {
          openCertificatesDialog(folder);
          return;
        }
        leaveDesktop(folder.getAttribute('href'));
      });
      folder.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (folder.dataset.folderId === 'cv') {
          openCvLibrary();
          return;
        }
        if (folder.dataset.folderId === 'certificates') {
          openCertificatesDialog(folder);
          return;
        }
        leaveDesktop(folder.getAttribute('href'));
      });
      if (!finePointer) return;
      let dragStart;
      const finishDrag = (event, shouldSave = true) => {
        if (!dragStart) return;
        if (dragStart.moved && shouldSave) {
          savedFolderPositions[folder.dataset.folderId] = { x: dragStart.currentX, y: dragStart.currentY };
          // The click generated after a drag must not select or follow the link.
          folder.dataset.dragged = 'true';
          saveFolderPositions();
        }
        folder.classList.remove('dragging');
        dragStart = null;
        if (event && folder.hasPointerCapture(event.pointerId)) folder.releasePointerCapture(event.pointerId);
      };
      folder.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || !event.isPrimary) return;
        const position = savedFolderPositions[folder.dataset.folderId] || { x: 0, y: 0 };
        dragStart = {
          pointerX: event.clientX,
          pointerY: event.clientY,
          x: position.x,
          y: position.y,
          currentX: position.x,
          currentY: position.y,
          moved: false
        };
        folder.setPointerCapture(event.pointerId);
      });
      folder.addEventListener('pointermove', (event) => {
        if (!dragStart) return;
        const x = Math.round(dragStart.x + event.clientX - dragStart.pointerX);
        const y = Math.round(dragStart.y + event.clientY - dragStart.pointerY);
        // Start moving as soon as the held pointer actually changes position.
        // This avoids the previous 6 px dead zone at the beginning of a drag.
        if (x !== dragStart.x || y !== dragStart.y) dragStart.moved = true;
        if (!dragStart.moved) return;
        folder.classList.add('dragging');
        folder.style.translate = `${x}px ${y}px`;
        dragStart.currentX = x;
        dragStart.currentY = y;
      });
      folder.addEventListener('pointerup', (event) => finishDrag(event));
      folder.addEventListener('pointercancel', (event) => finishDrag(event, false));
    });
    desktop.addEventListener('click', (event) => {
      if (finePointer && !event.target.closest('[data-folder-id]')) folders.forEach((folder) => folder.classList.remove('selected'));
    });
    qs('[data-desktop-enter]')?.addEventListener('click', () => leaveDesktop());
    qs('[data-desktop-return]')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      body.classList.remove('desktop-exited');
    });
    qs('[data-cv-library-close]')?.addEventListener('click', () => cvLibraryDialog?.close());
    qs('[data-certificates-close]')?.addEventListener('click', closeCertificatesDialog);
    certificatesDialog?.addEventListener('close', () => certificatesDialog.classList.remove('is-open', 'is-closing'));
    qsa('[data-certificates-link]').forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault();
      openCertificatesDialog();
    }));
    if (!prefersReduced && window.matchMedia('(pointer:fine)').matches && desktopLight) {
      desktop.addEventListener('pointermove', (event) => {
        const rect = desktop.getBoundingClientRect();
        desktopLight.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px)`;
        desktopLight.classList.add('visible');
      }, { passive: true });
      desktop.addEventListener('pointerleave', () => desktopLight.classList.remove('visible'));
    }
  }

  // Mark the enhanced experience as ready and feed pointer coordinates to cards.
  requestAnimationFrame(() => body.classList.add('ui-ready'));
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.card, .featured-project, .project-dialog');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  }

  // Theme
  const storedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  root.dataset.theme = initialTheme;

  const updateThemeButtons = () => {
    qsa('[data-theme-toggle]').forEach((button) => {
      const isLight = root.dataset.theme === 'light';
      button.setAttribute('aria-label', isLight ? 'Activar modo oscuro' : 'Activar modo claro');
      button.innerHTML = isLight
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 1 0 9 9A9 9 0 1 1 12 3Z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    });
  };
  updateThemeButtons();
  qsa('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('portfolio-theme', root.dataset.theme);
      updateThemeButtons();
    });
  });

  // Mobile navigation
  const menuButton = qs('[data-menu-toggle]');
  const nav = qs('[data-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
    qsa('a', nav).forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }));
  }

  // Header, scroll progress and active navigation
  const header = qs('[data-header]');
  const progress = qs('[data-scroll-progress]');
  const updateScroll = () => {
    const scrollTop = window.scrollY;
    header?.classList.toggle('scrolled', scrollTop > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;
    }
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  const sections = qsa('main section[id]');
  const navLinks = qsa('[data-nav] a[href^="#"]');
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-42% 0px -50% 0px', threshold: 0.01 });
    sections.forEach((section) => navObserver.observe(section));
  }

  // Reveal animations
  const reveals = qsa('.reveal');
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => observer.observe(el));
  }

  // Cursor glow
  const glow = qs('[data-cursor-glow]');
  if (glow && !prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Counter animation
  const counters = qsa('[data-counter]');
  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();
    const tick = (time) => {
      const progressValue = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: .7 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // Subtle 3D tilt
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    qsa('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Shared footer year
  qsa('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // Copy buttons
  const toast = qs('[data-toast]');
  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  qsa('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast('Copiado al portapapeles');
      } catch {
        showToast('No se pudo copiar automáticamente');
      }
    });
  });

  // Open Gmail compose with the completed form.
  const contactForm = qs('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const name = String(form.get('name') || '').trim();
      const email = String(form.get('email') || '').trim();
      const subject = String(form.get('subject') || 'Contacto desde el portfolio').trim();
      const message = String(form.get('message') || '').trim();
      const target = data.person?.email || 'lrg200175@gmail.com';
      const bodyText = `Hola Daniel,\n\n${message}\n\nNombre: ${name}\nEmail: ${email}`;
      const gmailUrl = new URL('https://mail.google.com/mail/');
      gmailUrl.searchParams.set('view', 'cm');
      gmailUrl.searchParams.set('fs', '1');
      gmailUrl.searchParams.set('to', target);
      gmailUrl.searchParams.set('su', subject);
      gmailUrl.searchParams.set('body', bodyText);
      window.open(gmailUrl.toString(), '_blank', 'noopener,noreferrer');
      showToast('Abriendo Gmail');
    });
  }

  // Populate featured project cards on homepage
  const homeGrid = qs('[data-home-projects]');
  if (homeGrid && Array.isArray(data.projects)) {
    const selected = data.projects.filter((project) => project.featured && project.id !== 'valoinsight').slice(0, 3);
    homeGrid.innerHTML = selected.map((project) => projectCardMarkup(project, false)).join('');
  }

  // GitHub enrichment for repo metadata. The site has local fallback data.
  const repoTargets = qsa('[data-repo-name]');
  if (repoTargets.length && data.person?.githubUser) {
    fetch(`https://api.github.com/users/${encodeURIComponent(data.person.githubUser)}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('GitHub unavailable')))
      .then((repos) => {
        const map = new Map(repos.map((repo) => [repo.name, repo]));
        repoTargets.forEach((target) => {
          const repo = map.get(target.dataset.repoName);
          if (!repo) return;
          const updated = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(new Date(repo.updated_at));
          target.textContent = `${repo.language || 'Varios'} · ★ ${repo.stargazers_count} · ${updated}`;
        });
      })
      .catch(() => {
        // Fallback text already in the HTML.
      });
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function projectCardMarkup(project, extended = false) {
    const destination = project.href || `proyecto.html?id=${encodeURIComponent(project.id)}`;
    const privateLabel = project.visibility === 'private' ? '<span class="tag">Privado</span>' : '';
    const capabilities = extended ? `<ul class="project-capabilities">${project.capabilities.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
    return `
      <article class="project-card card reveal" data-accent="${escapeHtml(project.accent)}" data-tilt>
        <div class="project-kicker">${escapeHtml(project.kicker)}</div>
        <h3>${escapeHtml(project.name)}</h3>
        <p>${escapeHtml(project.description)}</p>
        ${capabilities}
        <div class="tag-row">
          ${project.technologies.slice(0, extended ? 6 : 4).map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join('')}
          ${privateLabel}
        </div>
        <div class="project-card-footer">
          <a class="project-link" href="${escapeHtml(destination)}" ${destination.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>
            Ver proyecto <span>→</span>
          </a>
          <span class="repo-meta" data-repo-name="${escapeHtml(project.repoName)}">${escapeHtml(project.year)}</span>
        </div>
      </article>`;
  }

  window.PortfolioHelpers = { projectCardMarkup, escapeHtml, showToast };
})();
