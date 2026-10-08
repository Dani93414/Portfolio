(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dialog = document.querySelector('[data-tech-atlas-dialog]');
  if (!dialog) return;
  const canvas = dialog.querySelector('[data-tech-globe]');
  const list = dialog.querySelector('[data-tech-list]');
  const filters = dialog.querySelector('[data-tech-filters]');
  const search = dialog.querySelector('[data-tech-search]');
  const callout = dialog.querySelector('[data-tech-callout]');
  const count = dialog.querySelector('[data-tech-count]');
  const close = dialog.querySelector('[data-tech-atlas-close]');
  const root = document.documentElement;
  const ctx = canvas?.getContext('2d');

  const C = { web:'Web', backend:'Backend', data:'Datos & ML', microsoft:'Microsoft', systems:'Sistemas', platform:'Plataforma', tooling:'Tooling' };
  const clusters = { web:[37,-122], backend:[40,-74], data:[51,0], microsoft:[47,-104], systems:[59,18], platform:[52,20], tooling:[35,139] };
  const tech = [
    ['python','Python','data','Alto','Backend, pipelines de datos, machine learning y algoritmos de optimización.',['ValoInsight','Metaheurística P1','Algoritmo Genético P2','Series Temporales P3']],
    ['numpy','NumPy','data','Alto','Cálculo numérico para analítica, modelos y metaheurísticas.',['ValoInsight','Metaheurística P1','Algoritmo Genético P2','Series Temporales P3']],
    ['pandas','Pandas','data','Alto','Preparación y transformación de datos tabulares y series temporales.',['ValoInsight','Series Temporales P3']],
    ['sklearn','scikit-learn','data','Intermedio alto','Pipelines y modelos de clasificación aplicados a análisis económico.',['ValoInsight']],
    ['matplotlib','Matplotlib','data','Intermedio alto','Gráficas para evaluar convergencia, resultados y patrones.',['Metaheurística P1','Algoritmo Genético P2','Series Temporales P3']],
    ['typescript','TypeScript','web','Alto','Interfaces tipadas, consumo de APIs y lógica de cliente.',['ValoInsight','U24 · proyecto profesional']],
    ['javascript','JavaScript','web','Intermedio alto','Interacción, UI y comportamiento del portfolio.',['Portfolio']],
    ['html','HTML','web','Intermedio alto','Estructura semántica y accesible de interfaces web.',['Portfolio']],
    ['css','CSS','web','Intermedio alto','Diseño responsive, temas y componentes visuales.',['Portfolio','ValoInsight']],
    ['react','React','web','Alto','Dashboards, rutas y componentes de interfaz orientados a datos.',['ValoInsight','U24 · proyecto profesional']],
    ['vite','Vite','web','Intermedio','Entorno de desarrollo y compilación del frontend.',['ValoInsight']],
    ['react-query','React Query','web','Intermedio alto','Fetching, caché y estados de datos mediante hooks.',['ValoInsight']],
    ['recharts','Recharts','web','Intermedio alto','Visualizaciones interactivas de estadísticas y evolución de partidas.',['ValoInsight']],
    ['simpleheat','Simpleheat','web','Aplicado','Renderizado de heatmaps para eventos y posiciones sobre el mapa.',['ValoInsight']],
    ['lucide','Lucide','web','Aplicado','Iconografía de componentes y navegación.',['ValoInsight','Portfolio']],
    ['tailwind','Tailwind CSS','web','Intermedio','Utilidades de estilo para interfaces modernas.',['ValoInsight','U24 · proyecto profesional']],
    ['next','Next.js','web','Intermedio','Frontend administrativo con App Router en la plataforma interna.',['U24 · proyecto profesional']],
    ['fastapi','FastAPI','backend','Alto','APIs y servicios para ingestión, consulta y análisis.',['ValoInsight']],
    ['pydantic','Pydantic','backend','Intermedio alto','Modelado y validación de datos del backend.',['ValoInsight']],
    ['mongodb','MongoDB','backend','Alto','Persistencia documental, historial de partidas y consultas analíticas.',['ValoInsight']],
    ['pymongo','PyMongo','backend','Intermedio','Acceso Python a la persistencia documental.',['ValoInsight']],
    ['nestjs','NestJS','backend','Intermedio','API modular de la plataforma interna.',['U24 · proyecto profesional']],
    ['prisma','Prisma','backend','Intermedio','Esquema y acceso tipado a la persistencia relacional.',['U24 · proyecto profesional']],
    ['postgres','PostgreSQL','backend','Intermedio','Persistencia relacional de la plataforma interna.',['U24 · proyecto profesional']],
    ['redis','Redis','platform','Aplicado','Componente de infraestructura utilizado por la plataforma interna.',['U24 · proyecto profesional']],
    ['power-automate','Power Automate','microsoft','Alto','Automatización de correo, documentación y procesos internos.',['U24 · proyecto profesional']],
    ['sharepoint','SharePoint','microsoft','Alto','Listas relacionadas, gestión documental y capa de información.',['U24 · proyecto profesional']],
    ['spfx','SPFx','microsoft','Intermedio alto','Componentes y extensiones personalizadas sobre SharePoint.',['U24 · proyecto profesional']],
    ['fluent','Fluent UI','microsoft','Aplicado','Componentes de interfaz para extensiones de SharePoint.',['U24 · proyecto profesional']],
    ['heft','Heft','microsoft','Aplicado','Tooling de build y desarrollo en proyectos SPFx.',['U24 · proyecto profesional']],
    ['cpp','C++','systems','Intermedio','Intérprete ejecutable con AST, evaluación y tabla de símbolos.',['PL Interpreter']],
    ['flex','Flex','systems','Intermedio','Análisis léxico del lenguaje interpretado.',['PL Interpreter']],
    ['bison','Bison','systems','Intermedio','Gramática y análisis sintáctico para el intérprete.',['PL Interpreter']],
    ['make','GNU Make','systems','Aplicado','Compilación modular del intérprete.',['PL Interpreter']],
    ['docker','Docker','platform','Intermedio','Entornos reproducibles de desarrollo e infraestructura local.',['U24 · proyecto profesional']],
    ['pnpm','pnpm','platform','Aplicado','Gestión de workspaces y dependencias en monorepo.',['U24 · proyecto profesional']],
    ['git','Git','tooling','Alto','Control de versiones aplicado de forma transversal en los repositorios.',['Portfolio','ValoInsight','Proyectos académicos']],
    ['vitest','Vitest','tooling','Intermedio','Pruebas del frontend y lógica analítica.',['ValoInsight']],
    ['jest','Jest','tooling','Aplicado','Pruebas de API y extremo a extremo en la plataforma interna.',['U24 · proyecto profesional']],
    ['prettier','Prettier','tooling','Aplicado','Formateo consistente de código en la plataforma interna.',['U24 · proyecto profesional']],
    ['eslint','ESLint','tooling','Intermedio','Validación de calidad y consistencia de código frontend.',['ValoInsight','Portfolio']]
    ,['react-router','React Router','web','Intermedio','Navegacion declarativa entre vistas de una aplicacion React.',['ValoInsight']],
    ['seaborn','Seaborn','data','Aplicado','Visualizacion estadistica para el analisis experimental.',['Algoritmo Genetico P2']],
    ['fastdtw','fastdtw','data','Aplicado','Comparacion eficiente de patrones en series temporales.',['Series Temporales P3']],
    ['joblib','joblib','data','Aplicado','Persistencia de modelos y resultados de procesamiento.',['ValoInsight','Series Temporales P3']],
    ['microsoft-365','Microsoft 365','microsoft','Intermedio alto','Ecosistema de productividad e integracion de procesos empresariales.',['U24 · proyecto profesional']],
  ].map((item, index) => {
    const [id,name,category,level,summary,projects] = item;
    const [lat,lng] = clusters[category];
    const offsets = [[0,0],[6,9],[-6,12],[9,-8],[-9,-10],[3,18],[-4,-18]][index % 7];
    return { id,name,category,level,summary,projects,lat:lat+offsets[0],lng:lng+offsets[1], mark:name.replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase() };
  });
  const publicUrls = { 'Portfolio':'index.html', 'ValoInsight':'valoinsight.html', 'PL Interpreter':'https://github.com/Dani93414/PL-Interpreter_Interprete-didactico-con-Flex-Bison-y-C-', 'Metaheurística P1':'https://github.com/Dani93414/Comparativa-de-Hill-Climbing-y-Simulated-Annealing-para-TSP_Metaheuristica-P1', 'Algoritmo Genético P2':'https://github.com/Dani93414/Algoritmo-Genetico-para-Ajuste-de-Funciones_Metaheuristica-P2', 'Series Temporales P3':'https://github.com/Dani93414/Deteccion-Evolutiva-de-Patrones-en-Series-Temporales_Metaheuristica-P3' };
  publicUrls['Algoritmo Genetico P2'] = 'https://github.com/Dani93414/Algoritmo-Genetico-para-Ajuste-de-Funciones_Metaheuristica-P2';
  let worldPolygons = [
    [[5,-80],[25,-75],[48,-105],[63,-85],[45,-58],[20,-60]],
    [[35,-10],[55,5],[60,55],[40,80],[10,40],[-20,20],[0,-15]],
    [[12,95],[45,110],[55,145],[30,160],[5,130]],
    [[-12,-70],[-35,-62],[-52,-65],[-35,-45],[-10,-45]],
    [[-20,115],[-35,135],[-42,150],[-25,155],[-10,130]]
  ];
  fetch('assets/data/world-simplified.geojson')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      const polygons = data.features?.flatMap(feature => feature.geometry?.coordinates || []) || [];
      if (polygons.length) worldPolygons = polygons.map(points => points.map(([lng, lat]) => [lat, lng]));
      draw();
    })
    .catch(() => {});
  let active = tech[0], filter = 'all', query = '', longitude = active.lng, latitude = active.lat, target = null, dragging = null, markers = [], resizeObserver;
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  const labels = { es:{all:'TODAS',web:'WEB',backend:'BACKEND',data:'DATA / ML',microsoft:'MICROSOFT',systems:'SISTEMAS',platform:'PLATAFORMA',tooling:'TOOLING',used:'UTILIZADO EN',level:'NIVEL',hint:'Selecciona una tecnología o un marcador',count:'tecnologías',search:'Buscar tecnología...'}, en:{all:'ALL',web:'WEB',backend:'BACKEND',data:'DATA / ML',microsoft:'MICROSOFT',systems:'SYSTEMS',platform:'PLATFORM',tooling:'TOOLING',used:'USED IN',level:'LEVEL',hint:'Select a technology or marker',count:'technologies',search:'Search technology...'} };
  const translations = { es:{'Web':'Web','Backend':'Backend','Datos & ML':'Datos & ML','Microsoft':'Microsoft','Sistemas':'Sistemas','Plataforma':'Plataforma','Tooling':'Herramientas','Alto':'Alto','Intermedio alto':'Intermedio alto','Intermedio':'Intermedio','Aplicado':'Aplicado'}, en:{'Web':'Web','Backend':'Backend','Datos & ML':'Data & ML','Microsoft':'Microsoft','Sistemas':'Systems','Plataforma':'Platform','Tooling':'Tooling','Alto':'Strong','Intermedio alto':'Upper intermediate','Intermedio':'Intermediate','Aplicado':'Applied'} };
  const summaryEn = { python:'Backend, data pipelines, machine learning and optimisation algorithms.', numpy:'Numerical computing for analytics, models and metaheuristics.', pandas:'Preparation and transformation of tabular and time-series data.', sklearn:'Classification models and pipelines applied to economic analysis.', matplotlib:'Charts for evaluating convergence, results and patterns.', typescript:'Typed interfaces, API consumption and client-side logic.', javascript:'Interaction, UI and portfolio behaviour.', html:'Semantic, accessible structure for web interfaces.', css:'Responsive design, themes and visual components.', react:'Data-oriented dashboards, routes and interface components.', vite:'Frontend development and build environment.', 'react-query':'Data fetching, caching and state through hooks.', recharts:'Interactive match-statistics and progression visualisations.', simpleheat:'Heatmap rendering for map events and positions.', lucide:'Component and navigation iconography.', tailwind:'Styling utilities for modern interfaces.', next:'Administrative frontend with App Router.', fastapi:'APIs and services for ingestion, querying and analysis.', pydantic:'Backend data modelling and validation.', mongodb:'Document persistence, match history and analytical queries.', pymongo:'Python access to document persistence.', nestjs:'Modular API for the internal platform.', prisma:'Schema and typed access to relational persistence.', postgres:'Relational persistence for the internal platform.', redis:'Infrastructure component used by the internal platform.', 'power-automate':'Automation of email, document and internal workflows.', sharepoint:'Related lists, document management and information layer.', spfx:'Custom components and extensions on SharePoint.', fluent:'Interface components for SharePoint extensions.', heft:'Build and development tooling for SPFx projects.', cpp:'An executable interpreter with an AST, evaluation and symbol table.', flex:'Lexical analysis for the interpreted language.', bison:'Grammar and syntactic analysis for the interpreter.', make:'Modular compilation of the interpreter.', docker:'Reproducible development and local infrastructure environments.', pnpm:'Workspace and dependency management in a monorepo.', git:'Version control used across the repositories.', vitest:'Frontend and analytics-logic tests.', jest:'API and end-to-end tests for the internal platform.', prettier:'Consistent code formatting for the internal platform.', eslint:'Frontend code-quality and consistency checks.', 'react-router':'Declarative navigation between React application views.', seaborn:'Statistical visualisation for experimental analysis.', fastdtw:'Efficient comparison of time-series patterns.', joblib:'Persistence for models and processing results.', 'microsoft-365':'Productivity ecosystem and integration of business processes.' };
  const copy = (value) => translations[language()][value] || value;
  const filtered = () => tech.filter(t => (filter === 'all' || t.category === filter) && t.name.toLowerCase().includes(query.toLowerCase()));

  function renderList() {
    const l = labels[language()]; const items = filtered();
    count.textContent = `${items.length} ${l.count}`;
    filters.innerHTML = ['all',...Object.keys(C)].map(key => `<button type="button" class="${filter===key?'is-active':''}" data-tech-filter="${key}">${l[key]}</button>`).join('');
    list.innerHTML = items.map(t => `<button type="button" class="tech-chip ${t.id===active.id?'is-active':''}" data-tech-id="${t.id}" aria-pressed="${t.id===active.id}"><i>${t.mark}</i><span>${t.name}</span></button>`).join('') || `<p class="tech-empty">${language()==='en'?'No matching technology.':'No hay tecnologías coincidentes.'}</p>`;
    filters.querySelectorAll('[data-tech-filter]').forEach(button => button.addEventListener('click', () => { filter=button.dataset.techFilter; renderList(); draw(); }));
    list.querySelectorAll('[data-tech-id]').forEach(button => button.addEventListener('click', () => select(button.dataset.techId)));
  }
  function renderCallout() {
    const l=labels[language()];
    callout.innerHTML = `<div class="tech-callout-title"><i>${active.mark}</i><div><strong>${active.name}</strong><small>${copy(C[active.category])}</small></div><span>${l.level} · ${copy(active.level)}</span></div><p>${language()==='en' ? (summaryEn[active.id] || active.summary) : active.summary}</p><h4>${l.used}</h4><div class="tech-project-list">${active.projects.map(project => publicUrls[project] ? `<a href="${publicUrls[project]}" ${publicUrls[project].startsWith('http')?'target="_blank" rel="noreferrer"':''}>${project} ↗</a>` : `<span>${project}</span>`).join('')}</div>`;
    dialog.querySelector('.tech-globe-hint').textContent = l.hint;
  }
  function select(id, animate=true) { const next=tech.find(t=>t.id===id); if(!next) return; active=next; renderList(); renderCallout(); if (animate && !reducedMotion) target={lon:next.lng,lat:next.lat,startLon:longitude,startLat:latitude,start:performance.now(),duration:650}; else { longitude=next.lng; latitude=next.lat; target=null; draw(); } }
  function project(lat,lng,r,cx,cy) { const rad=Math.PI/180, phi=lat*rad, delta=(lng-longitude)*rad, centre=latitude*rad; const z=Math.sin(centre)*Math.sin(phi)+Math.cos(centre)*Math.cos(phi)*Math.cos(delta); return { x:cx+r*Math.cos(phi)*Math.sin(delta), y:cy-r*(Math.cos(centre)*Math.sin(phi)-Math.sin(centre)*Math.cos(phi)*Math.cos(delta)), z }; }
  function drawGrid(r,cx,cy,color) { ctx.strokeStyle=color; ctx.lineWidth=1; for(let lat=-60;lat<=60;lat+=30){ctx.beginPath();for(let lon=-180;lon<=180;lon+=4){const p=project(lat,lon,r,cx,cy); if(p.z>0) ctx.lineTo(p.x,p.y); else ctx.moveTo(p.x,p.y);}ctx.stroke();} for(let lon=-150;lon<180;lon+=30){ctx.beginPath();for(let lat=-90;lat<=90;lat+=3){const p=project(lat,lon,r,cx,cy); if(p.z>0)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);}ctx.stroke();} }
  function draw() { if(!ctx || !canvas) return; const rect=canvas.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,2), w=Math.max(1,rect.width),h=Math.max(1,rect.height); if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);} ctx.clearRect(0,0,w,h); const light=root.dataset.theme==='light', r=Math.min(w,h)*.39, cx=w*.5,cy=h*.47; const ocean=light?'#edf5f8':'#07151d', line=light?'rgba(33,105,120,.15)':'rgba(117,214,222,.13)', land=light?'rgba(54,128,143,.14)':'rgba(99,230,214,.08)'; const glow=ctx.createRadialGradient(cx-r*.1,cy-r*.25,r*.1,cx,cy,r*1.2); glow.addColorStop(0,light?'rgba(198,246,244,.8)':'rgba(22,71,82,.78)');glow.addColorStop(1,light?'rgba(225,239,243,.25)':'rgba(4,13,22,.35)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=light?'rgba(28,143,158,.55)':'rgba(99,230,214,.5)';ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();drawGrid(r,cx,cy,line); const continents=[[[5,-80],[25,-75],[48,-105],[63,-85],[45,-58],[20,-60]],[[35,-10],[55,5],[60,55],[40,80],[10,40],[-20,20],[0,-15]],[[12,95],[45,110],[55,145],[30,160],[5,130]], [[-12,-70],[-35,-62],[-52,-65],[-35,-45],[-10,-45]], [[-20,115],[-35,135],[-42,150],[-25,155],[-10,130]]];ctx.fillStyle=land;continents.forEach(poly=>{ctx.beginPath();poly.forEach(([la,lo],i)=>{const p=project(la,lo,r,cx,cy); i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.closePath();ctx.fill();});ctx.restore();markers=[]; tech.forEach(t=>{const p=project(t.lat,t.lng,r,cx,cy);if(p.z<=0)return;const muted=filter!=='all'&&filter!==t.category;const is=t.id===active.id;markers.push({t,x:p.x,y:p.y});ctx.globalAlpha=muted?.22:1;if(is){ctx.strokeStyle='#63e6d6';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.stroke();ctx.shadowColor='#63e6d6';ctx.shadowBlur=15;}ctx.fillStyle=is?'#63e6d6':light?'#226d79':'#8cb8c1';ctx.beginPath();ctx.arc(p.x,p.y,is?4.5:3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});ctx.globalAlpha=1; }
  draw = function drawGlobe() {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.clearRect(0, 0, w, h);
    const light = root.dataset.theme === 'light';
    const r = Math.min(w, h) * .39, cx = w * .5, cy = h * .47;
    const line = light ? 'rgba(33,105,120,.15)' : 'rgba(117,214,222,.13)';
    const land = light ? 'rgba(54,128,143,.18)' : 'rgba(99,230,214,.11)';
    const glow = ctx.createRadialGradient(cx-r*.1, cy-r*.25, r*.1, cx, cy, r*1.2);
    glow.addColorStop(0, light ? 'rgba(198,246,244,.8)' : 'rgba(22,71,82,.78)');
    glow.addColorStop(1, light ? 'rgba(225,239,243,.25)' : 'rgba(4,13,22,.35)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = light ? 'rgba(28,143,158,.55)' : 'rgba(99,230,214,.5)'; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    drawGrid(r, cx, cy, line);
    ctx.fillStyle = land;
    worldPolygons.forEach(poly => {
      ctx.beginPath();
      poly.forEach(([lat, lng], index) => {
        const point = project(lat, lng, r, cx, cy);
        index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
      });
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
    markers = [];
    tech.forEach(item => {
      const point = project(item.lat, item.lng, r, cx, cy);
      if (point.z <= 0) return;
      const muted = filter !== 'all' && filter !== item.category;
      const selected = item.id === active.id;
      markers.push({ t:item, x:point.x, y:point.y });
      ctx.globalAlpha = muted ? .22 : 1;
      if (selected) {
        ctx.strokeStyle = '#63e6d6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(point.x, point.y, 10, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowColor = '#63e6d6'; ctx.shadowBlur = 15;
      }
      ctx.fillStyle = selected ? '#63e6d6' : (light ? '#226d79' : '#8cb8c1');
      ctx.beginPath(); ctx.arc(point.x, point.y, selected ? 4.5 : 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
  };
  function tick(now) { if(!target) return; const t=Math.min(1,(now-target.start)/target.duration), eased=1-Math.pow(1-t,3); let delta=((target.lon-target.startLon+540)%360)-180;longitude=target.startLon+delta*eased;latitude=target.startLat+(target.lat-target.startLat)*eased;draw();if(t<1)requestAnimationFrame(tick);else{longitude=target.lon;latitude=target.lat;target=null;draw();} }
  function animateTarget(){ if(target)requestAnimationFrame(tick); }
  function open(folder) { if(dialog.open)return;folder?.classList.add('is-opening');setTimeout(()=>folder?.classList.remove('is-opening'),reducedMotion?0:150);dialog.showModal();dialog.classList.remove('is-closing');requestAnimationFrame(()=>dialog.classList.add('is-open'));select('python',false);if(!resizeObserver&&window.ResizeObserver)resizeObserver=new ResizeObserver(draw);resizeObserver?.observe(dialog.querySelector('.tech-globe-canvas-wrap')); }
  function closeDialog(){if(!dialog.open)return;dialog.classList.remove('is-open');dialog.classList.add('is-closing');setTimeout(()=>{if(dialog.open)dialog.close();dialog.classList.remove('is-closing');},reducedMotion?0:160);}
  canvas?.addEventListener('pointerdown',e=>{dragging={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});canvas?.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;if(Math.abs(dx)+Math.abs(dy)>2)dragging.moved=true;longitude-=dx*.35;latitude=Math.max(-65,Math.min(65,latitude+dy*.22));dragging.x=e.clientX;dragging.y=e.clientY;target=null;draw();});canvas?.addEventListener('pointerup',e=>{if(!dragging)return; if(!dragging.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=markers.find(m=>Math.hypot(m.x-x,m.y-y)<14);if(hit)select(hit.t.id);}dragging=null;});
  close?.addEventListener('click',closeDialog);dialog.addEventListener('close',()=>dialog.classList.remove('is-open','is-closing'));search?.addEventListener('input',()=>{query=search.value;renderList();});window.addEventListener('portfolio:language',()=>{renderList();renderCallout();draw();});
  window.TechAtlas={open,close:closeDialog}; renderList();renderCallout();
  const observer=new MutationObserver(()=>{if(target)animateTarget();}); observer.observe(dialog,{attributes:true,attributeFilter:['open']});
  const oldSelect=select; select=(id,animate=true)=>{oldSelect(id,animate);animateTarget();};
})();
