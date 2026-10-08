(() => {
  const dialog = document.querySelector('[data-tech-keyboard-dialog]');
  const data = window.TECH_KEYBOARD_DATA || [];
  if (!dialog || !data.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = dialog.querySelector('[data-tech-keyboard-list]'), filters = dialog.querySelector('[data-tech-keyboard-filters]');
  const rows = dialog.querySelector('[data-tech-keyboard-rows]'), popover = dialog.querySelector('[data-tech-keyboard-popover]');
  const search = dialog.querySelector('[data-tech-keyboard-search]'), count = dialog.querySelector('[data-tech-keyboard-count]');
  const close = dialog.querySelector('[data-tech-keyboard-close]'), shell = dialog.querySelector('[data-tech-keyboard-stage]');
  const categories = { all:'TODAS', web:'WEB', backend:'BACKEND', data:'DATA', microsoft:'MICROSOFT', systems:'SYSTEMS', platform:'PLATFORM', tooling:'TOOLS' };
  const categoryNames = { web:'Web', backend:'Backend & APIs', data:'Data & ML', microsoft:'Microsoft & Automation', systems:'Systems & Compilers', platform:'Platform & Infrastructure', tooling:'Tools & Testing' };
  const levels = { high:['ALTO',4], proficient:['INTERMEDIO ALTO',3], working:['INTERMEDIO',2], applied:['APLICADO',1] };
  const officialIcons = new Set(['cpp','pydantic','git','query','lucide','pandas','router','numpy','mongodb','docker','pnpm','redis','vitest','prisma','javascript','fastapi','tailwind','jest','eslint','prettier','make','postgres','sklearn','next','python','react','typescript','css','nestjs','html','matplotlib','heft','flex','bison','m365','power','pymongo','joblib','fastdtw','rest','fluent','sharepoint','spfx','recharts','simpleheat']);
  const iconFilters = { web:'invert(74%) sepia(41%) saturate(633%) hue-rotate(151deg)', backend:'invert(81%) sepia(38%) saturate(572%) hue-rotate(122deg)', data:'invert(71%) sepia(25%) saturate(1048%) hue-rotate(198deg)', microsoft:'invert(76%) sepia(21%) saturate(639%) hue-rotate(89deg)', systems:'invert(72%) sepia(25%) saturate(941%) hue-rotate(219deg)', platform:'invert(78%) sepia(39%) saturate(553%) hue-rotate(340deg)', tooling:'invert(75%) sepia(17%) saturate(730%) hue-rotate(147deg)' };
  const publicUrls = { Portfolio:'index.html', ValoInsight:'valoinsight.html', 'PL Interpreter':'https://github.com/Dani93414/PL-Interpreter_Interprete-didactico-con-Flex-Bison-y-C-', 'Metaheurística P1':'https://github.com/Dani93414/Comparativa-de-Hill-Climbing-y-Simulated-Annealing-para-TSP_Metaheuristica-P1', 'Algoritmo Genético P2':'https://github.com/Dani93414/Algoritmo-Genetico-para-Ajuste-de-Funciones_Metaheuristica-P2', 'Series Temporales P3':'https://github.com/Dani93414/Deteccion-Evolutiva-de-Patrones-en-Series-Temporales_Metaheuristica-P3' };
  publicUrls.Portfolio = 'https://github.com/Dani93414/Portfolio';
  publicUrls.ValoInsight = 'https://github.com/Dani93414/ValoInsight_Centro-tactico-y-analitico-para-VALORANT';
  let active = null, filter = 'all', query = '';
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  const copy = (es,en) => language() === 'en' ? en : es;
  function renderStatic() {
    const english = language() === 'en';
    dialog.querySelector('.tech-keyboard-header .eyebrow').textContent = english ? 'EDUCATION & STACK' : 'FORMACIÓN Y STACK';
    dialog.querySelector('#tech-keyboard-title').textContent = english ? 'My stack, key by key.' : 'Mi stack, tecla a tecla.';
    dialog.querySelector('.tech-keyboard-header p').textContent = english ? 'Languages, frameworks and tools connected to the projects where I have used them.' : 'Lenguajes, frameworks y herramientas conectados con los proyectos donde los he utilizado.';
    dialog.querySelector('.tech-academic').textContent = english ? 'ACADEMIC FOUNDATION · Computer Engineering · Computing specialisation · University of Córdoba · ESTALMAT 2018–2022' : 'BASE ACADÉMICA · Ingeniería Informática · Mención en Computación · Universidad de Córdoba · ESTALMAT 2018–2022';
    dialog.querySelector('#tech-skill-title').textContent = english ? 'EXPLORE STACK' : 'EXPLORAR STACK';
    search.placeholder = english ? 'Search skill...' : 'Buscar habilidad...';
  }
  const visible = () => data.filter(item => (filter === 'all' || item.category === filter) && item.name.toLowerCase().includes(query.toLowerCase()));
  function marker(item) { return officialIcons.has(item.id) ? `<img class="tech-key-logo tech-brand-logo" style="filter:${iconFilters[item.category]}" src="assets/img/tech/${item.id}.svg" alt="" aria-hidden="true">` : `<svg class="tech-key-logo" aria-hidden="true" viewBox="0 0 48 48"><use href="assets/img/tech/stack-icons.svg#${item.id}"></use></svg>`; }
  function renderList() {
    const items = visible(); count.textContent = `${items.length} ${language()==='en'?'technologies':'tecnologías'}`;
    filters.innerHTML = Object.keys(categories).map(key => `<button type="button" class="${filter===key?'is-active':''}" data-filter="${key}">${key==='all'&&language()==='en'?'ALL':categories[key]}</button>`).join('');
    list.innerHTML = items.map(item => `<button type="button" class="tech-skill-button key-${item.category} ${item.id===active?.id?'is-active':''}" data-id="${item.id}" aria-pressed="${item.id===active?.id}">${marker(item)}<span>${item.name}</span></button>`).join('') || `<p class="tech-empty">${language()==='en'?'No matching technology.':'No hay habilidades coincidentes.'}</p>`;
    filters.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { filter=button.dataset.filter; renderList(); refreshKeys(); }));
    list.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => select(button.dataset.id, false)));
  }
  function renderKeyboard() {
    const order = ['function','number','qwerty','home','bottom'];
    rows.innerHTML = order.map((row,index) => `<div class="keyboard-row row-${row}" style="--row-delay:${index * 55}ms">${data.filter(item=>item.row===row).map(item => `<button type="button" class="tech-key key-${item.category}" data-key-id="${item.id}" style="--key-units:${item.keyUnits}" aria-label="${item.name} · ${levels[item.level][0]}">${marker(item)}<span class="tech-key-label">${item.name}</span></button>`).join('')}</div>`).join('');
    rows.querySelectorAll('[data-key-id]').forEach(button => button.addEventListener('click', () => select(button.dataset.keyId, true)));
  }
  function refreshKeys() {
    rows.querySelectorAll('[data-key-id]').forEach(key => {
      const item = data.find(entry => entry.id === key.dataset.keyId);
      key.classList.toggle('is-active', item.id === active?.id);
      key.classList.toggle('is-related', Boolean(active?.related.includes(item.id)));
    });
  }
  function renderPopover() {
    if (!active) { popover.innerHTML = ''; popover.classList.remove('is-visible'); return; }
    const [level, segments] = levels[active.level];
    const projects = active.projects.map(project => publicUrls[project] ? `<a href="${publicUrls[project]}" ${publicUrls[project].startsWith('http')?'target="_blank" rel="noreferrer"':''}>${project} ↗</a>` : `<span>${project}</span>`).join('');
    const related = active.related.map(id => data.find(item => item.id===id)?.name).filter(Boolean).slice(0,4).join(' · ');
    popover.innerHTML = `<div class="tech-popover-head">${marker(active)}<div><strong>${active.name}</strong><small>${categoryNames[active.category]}</small></div></div><div class="tech-popover-level"><i aria-label="${level}">${[1,2,3,4].map(n=>`<b class="${n<=segments?'is-filled':''}"></b>`).join('')}</i></div><p>${copy(active.summaryEs,active.summaryEn)}</p><h4>${language()==='en'?'USED IN':'UTILIZADO EN'}</h4><div class="tech-project-list">${projects}</div>${related?`<h4>${language()==='en'?'RELATED':'RELACIONADO'}</h4><small class="tech-related">${related}</small>`:''}`;
    popover.classList.add('is-visible');
  }
  function positionPopover() {
    if (!active) return;
    const key = rows.querySelector(`[data-key-id="${active.id}"]`); if (!key) return;
    const panel = shell.getBoundingClientRect(), rect = key.getBoundingClientRect();
    const w = Math.min(270, panel.width - 20), left = Math.max(10, Math.min(panel.width-w-10, rect.left-panel.left+rect.width/2-w/2));
    const above = rect.top-panel.top > panel.height * .46;
    const top = above ? rect.top-panel.top-popover.offsetHeight-12 : rect.bottom-panel.top+12;
    popover.style.setProperty('--popover-left', `${left}px`); popover.style.setProperty('--popover-top', `${top}px`); popover.classList.toggle('is-below', !above);
  }
  function select(id, fromKey) {
    const item=data.find(entry=>entry.id===id); if(!item) return;
    if (active?.id === id) { clearSelection(); return; }
    active=item; renderList(); refreshKeys(); renderPopover();
    const key=rows.querySelector(`[data-key-id="${id}"]`); if(key){ key.classList.remove('is-pressing'); void key.offsetWidth; key.classList.add('is-pressing'); if(!fromKey) key.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'}); }
    requestAnimationFrame(positionPopover);
  }
  function clearSelection() { active=null; renderList(); refreshKeys(); renderPopover(); }
  function open(folder) { if(dialog.open) return; folder?.classList.add('is-opening'); setTimeout(()=>folder?.classList.remove('is-opening'),reduced?0:150); dialog.showModal(); requestAnimationFrame(()=>{dialog.classList.add('is-open'); clearSelection();}); }
  function closeDialog(){ if(!dialog.open)return; dialog.classList.remove('is-open'); setTimeout(()=>dialog.open&&dialog.close(),reduced?0:150); }
  search.addEventListener('input',()=>{query=search.value;renderList();}); close.addEventListener('click',closeDialog); dialog.addEventListener('close',()=>dialog.classList.remove('is-open')); dialog.addEventListener('pointerdown',(event)=>{if(active&&!event.target.closest('.tech-popover, .tech-key, .tech-skill-button'))clearSelection();}); window.addEventListener('resize',positionPopover); window.addEventListener('portfolio:language',()=>{renderStatic(); active ? select(active.id,false) : clearSelection();});
  renderKeyboard(); renderStatic(); renderList(); refreshKeys(); renderPopover();
  window.TechKeyboard = { open, close:closeDialog };
})();
