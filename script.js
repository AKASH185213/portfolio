(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky glass header + page progress
  const header = $('.topbar'), progress = $('#scrollProgress');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 25);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal elements when they enter view
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  // Local photo support: if assets/akash-photo.jpg exists, display it.
  const profilePhoto = $('#profilePhoto'), photoPlaceholder = $('#photoPlaceholder');
  function showProfilePhoto() {
    profilePhoto.hidden = false;
    photoPlaceholder.hidden = true;
  }
  function showPhotoPlaceholder() {
    profilePhoto.hidden = true;
    photoPlaceholder.hidden = false;
  }
  profilePhoto.addEventListener('load', showProfilePhoto);
  profilePhoto.addEventListener('error', showPhotoPlaceholder);
  if (profilePhoto.complete && profilePhoto.naturalWidth > 0) showProfilePhoto();
  else if (profilePhoto.complete && profilePhoto.naturalWidth === 0) showPhotoPlaceholder();

  // Project explorer content. Keep labels honest and avoid inventing functionality.
  const projects = {
    collegeconnect: {
      title: 'CollegeConnect', status: 'EXISTING PROJECT', statusClass: 'live', id: 'PROJECT / 01',
      description: 'A completed college-information web application built with Flask and SQLite. It brings campus announcements, events, academic schedules, holidays, and documents together in one place.',
      features: ['Announcements and events', 'Class and exam timetables', 'Holidays and documents', 'Student and faculty views', 'Session timeout and logout'],
      tech: ['Python', 'Flask', 'SQLite', 'HTML / CSS'], preview: 'college',
      actions: '<a class="btn btn-primary small-btn" href="https://github.com/AKASH185213/CollegeConnect-Expo-Final" target="_blank" rel="noopener noreferrer">View GitHub Repo ↗</a><span class="source-note">Public source repository</span>'
    },
    studentai: {
      title: 'StudentAI', status: 'IN PROGRESS', statusClass: 'progress', id: 'PROJECT / 02',
      description: 'A student-focused assistant idea that remains in progress. The scope and feature set are not yet finalized, so this card describes the project as a work in progress.',
      features: ['Early-stage project concept', 'Feature scope still being defined', 'No completed feature claims'],
      tech: ['Student-assistant concept', 'In development'], preview: 'student',
      actions: '<span class="source-note">In progress · No public demo linked</span>'
    },
    portfolio: {
      title: 'Personal Portfolio', status: 'IN PROGRESS', statusClass: 'progress', id: 'PROJECT / 03',
      description: 'This personal portfolio presents my education, projects, learning journey, and achievements in a responsive cyber-tech design.',
      features: ['About and education sections', 'Project cards and previews', 'Achievement and learning sections', 'Responsive navigation and interactions'],
      tech: ['HTML', 'CSS', 'JavaScript'], preview: 'portfolio',
      actions: '<span class="source-note">Current website · Still being refined</span>'
    },
    todo: {
      title: 'To-Do List App', status: 'PLANNED', statusClass: 'planned', id: 'PROJECT / 04',
      description: 'A future task-management project intended for practicing interactive web interfaces and organizing tasks. Development has not started yet.',
      features: ['Idea for a future project', 'Task organization as the goal', 'Implementation not started'],
      tech: ['Planned project', 'Web development practice'], preview: 'todo',
      actions: '<span class="source-note">Planned · Not implemented yet</span>'
    }
  };
  const detail = $('#projectDetail');
  function renderProject(key) {
    const p = projects[key]; if (!p) return;
    $$('.project-tab').forEach(btn => {
      const active = btn.dataset.project === key;
      btn.classList.toggle('active', active); btn.setAttribute('aria-selected', String(active));
    });
    const preview = $('.project-preview', detail);
    preview.className = `project-preview preview-${p.preview}`;
    const visual = {
      college: '<div class="preview-top"><span class="preview-logo">CC<span>.</span></span><span class="preview-window"><i></i><i></i><i></i></span></div><div class="college-preview-ui"><div class="college-sidebar"><span class="sidebar-brand">CC.</span><i class="selected"></i><i></i><i></i><i></i><i></i></div><div class="college-dashboard"><div class="college-greeting"><span class="preview-label">CAMPUS INFORMATION HUB</span><b>Everything in one place.</b><small>Announcements · Timetables · Documents</small></div><div class="college-stat-row"><div><i></i><span>Announcements</span><b>Updates</b></div><div><i></i><span>Timetables</span><b>Classes & exams</b></div><div><i></i><span>Resources</span><b>Documents</b></div></div><div class="college-notice"><span></span><span></span><span></span></div></div></div><div class="preview-glow"></div>',
      student: '<div class="preview-top"><span class="preview-logo">S<span>.</span>AI</span><span class="preview-window"><i></i><i></i><i></i></span></div><div class="preview-content"><span class="preview-label">STUDENT TOOL / CONCEPT</span><h3>Student<span>AI</span></h3><div class="preview-lines"><i></i><i></i><i></i></div><div class="preview-pills"><span>IN PROGRESS</span><span>EXPLORING</span></div></div><div class="preview-glow"></div>',
      portfolio: '<div class="preview-top"><span class="preview-logo">A<span>.</span></span><span class="preview-window"><i></i><i></i><i></i></span></div><div class="preview-content"><span class="preview-label">PERSONAL SPACE / 003</span><h3>Digital<span>Portfolio</span></h3><div class="preview-lines"><i></i><i></i><i></i></div><div class="preview-pills"><span>HTML</span><span>CSS</span><span>JAVASCRIPT</span></div></div><div class="preview-glow"></div>',
      todo: '<div class="preview-top"><span class="preview-logo">✓<span>.</span></span><span class="preview-window"><i></i><i></i><i></i></span></div><div class="preview-content"><span class="preview-label">NEXT ON THE ROADMAP / 004</span><h3>To-Do<span>List</span></h3><div class="preview-lines"><i></i><i></i><i></i></div><div class="preview-pills"><span>PLANNED</span><span>COMING LATER</span></div></div><div class="preview-glow"></div>'
    };
    preview.innerHTML = visual[p.preview];
    $('.project-detail-top', detail).innerHTML = `<span class="status-label ${p.statusClass}"><i></i> ${p.status}</span><span class="mono project-id">${p.id}</span>`;
    $('#detailTitle').textContent = p.title;
    $('#detailDescription').textContent = p.description;
    const features = $('#detailFeatures');
    if (features) features.innerHTML = (p.features || []).map(item => `<li>${item}</li>`).join('');
    $('#detailTech').innerHTML = p.tech.map(t => `<span>${t}</span>`).join('');
    $('#detailActions').innerHTML = p.actions;
  }
  $$('.project-tab').forEach(btn => btn.addEventListener('click', () => renderProject(btn.dataset.project)));

  // Command palette: Ctrl/Cmd+K or slash; keyboard searchable section jumps.
  const overlay = $('#commandOverlay'), input = $('#commandInput'), results = $('#commandResults');
  const commands = [
    { name: 'Go to Projects', target: '#projects', terms: 'work project gallery' },
    { name: 'About Me', target: '#about', terms: 'intro about interests' },
    { name: 'Education', target: '#education', terms: 'college school grades' },
    { name: 'Achievements', target: '#achievements', terms: 'award prize presentation' },
    { name: 'Learning Journey', target: '#journey', terms: 'skills tools learning' },
    { name: 'Contact', target: '#contact', terms: 'github linkedin email instagram' },
    { name: 'Go Home', target: '#home', terms: 'home top hero' }
  ];
  let selected = 0;
  function openPalette() { overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); input.value = ''; filterCommands(''); setTimeout(() => input.focus(), 20); }
  function closePalette() { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); }
  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    const matches = commands.filter(c => `${c.name} ${c.terms}`.toLowerCase().includes(q));
    results.innerHTML = matches.length ? matches.map((c, i) => `<button data-target="${c.target}" class="${i === 0 ? 'selected' : ''}"><span>⌁</span>${c.name}<kbd>↵</kbd></button>`).join('') : '<p style="padding:12px;color:#8d96b4;font-size:11px">No matching commands</p>';
    selected = 0;
  }
  function chooseCommand(target) { closePalette(); const el = document.querySelector(target); if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }
  $('#commandTrigger').addEventListener('click', openPalette);
  $('#commandBackdrop').addEventListener('click', closePalette);
  input.addEventListener('input', () => filterCommands(input.value));
  results.addEventListener('click', e => { const btn = e.target.closest('button[data-target]'); if (btn) chooseCommand(btn.dataset.target); });
  input.addEventListener('keydown', e => {
    const buttons = $$('button[data-target]', results);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!buttons.length) return; selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length; buttons.forEach((b, i) => b.classList.toggle('selected', i === selected)); buttons[selected].scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter' && buttons[selected]) chooseCommand(buttons[selected].dataset.target);
  });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') closePalette();
  });

  // Mobile navigation
  const menuToggle = $('#menuToggle'), nav = $('.nav-links');
  menuToggle.addEventListener('click', () => { const isOpen = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(isOpen)); });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
  if ('IntersectionObserver' in window) {
    const sections = $$('main section[id]');
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  // Custom cursor: dot and ring stay locked together; trail is optional decoration.
  const cursorCore = $('.custom-cursor');
  const cursorRing = $('.custom-cursor-ring');
  const trailLayer = $('#cursorTrailLayer');
  const canUseCustomCursor = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canUseCustomCursor && cursorCore && cursorRing) {
    document.documentElement.classList.add('custom-cursor-on');
    let lastTrail = 0;
    const trails = [];
    function setPos(el, px, py) {
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    }
    function spawnTrail(px, py) {
      if (!trailLayer || reducedMotion) return;
      const dot = document.createElement('span');
      dot.className = 'cursor-trail';
      const size = 5 + Math.random() * 7;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      trailLayer.appendChild(dot);
      trails.push({ el: dot, x: px, y: py, vx: (Math.random() - .5) * .7, vy: (Math.random() - .5) * .7, life: 1, decay: .04 });
      if (trails.length > 8) trails.shift().el.remove();
    }
    window.addEventListener('pointermove', e => {
      setPos(cursorCore, e.clientX, e.clientY);
      setPos(cursorRing, e.clientX, e.clientY);
      cursorCore.classList.add('visible');
      cursorRing.classList.add('visible');
      const target = e.target instanceof Element ? e.target.closest('a,button,[role="tab"],input') : null;
      cursorCore.classList.toggle('hovering', !!target);
      cursorRing.classList.toggle('hovering', !!target);
      const now = performance.now();
      if (now - lastTrail > 70) { spawnTrail(e.clientX, e.clientY); lastTrail = now; }
    }, { passive: true });
    window.addEventListener('blur', () => {
      cursorCore.classList.remove('visible');
      cursorRing.classList.remove('visible');
    });
    window.addEventListener('focus', () => {
      // They become visible again on the next pointer movement.
    });
    if (!reducedMotion && trailLayer) {
      function animateCursorTrail() {
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.x += t.vx; t.y += t.vy; t.life -= t.decay;
          t.el.style.left = `${t.x}px`; t.el.style.top = `${t.y}px`;
          t.el.style.opacity = `${Math.max(0, t.life * .35)}`;
          t.el.style.transform = `translate(-50%,-50%) scale(${Math.max(.08, t.life)})`;
          if (t.life <= 0) { t.el.remove(); trails.splice(i, 1); }
        }
        requestAnimationFrame(animateCursorTrail);
      }
      animateCursorTrail();
    }
  }

  // Lightweight animated neural-network canvas; no external library required.
  const canvas = $('#network'), ctx = canvas.getContext('2d');
  if (ctx && !reducedMotion) {
    let width = 0, height = 0, dpr = 1, nodes = [];
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.5); width = innerWidth; height = innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(55, Math.max(24, Math.floor(width * height / 23000)));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.3 + .4, phase: Math.random() * Math.PI * 2 }));
    }
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height); frame++;
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; n.phase += .012; if (n.x < 0 || n.x > width) n.vx *= -1; if (n.y < 0 || n.y > height) n.vy *= -1; });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
        if (dist < 135) { const alpha = (1 - dist / 135) * .18; ctx.strokeStyle = `rgba(126,145,255,${alpha})`; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      nodes.forEach(n => { const pulse = .55 + .45 * Math.sin(n.phase); ctx.beginPath(); ctx.arc(n.x, n.y, n.r + pulse * .4, 0, Math.PI * 2); ctx.fillStyle = `rgba(154,177,255,${.22 + pulse * .38})`; ctx.fill(); });
      requestAnimationFrame(draw);
    }
    resize(); addEventListener('resize', resize, { passive: true }); draw();
  }

  // Contact placeholders are deliberately non-functional until real URLs are supplied.
  const toast = $('#toast'); let toastTimeout;
  $$('.placeholder-link').forEach(link => link.addEventListener('click', e => {
    e.preventDefault(); toast.textContent = `${link.dataset.service} link will be added when your real profile details are ready.`; toast.classList.add('show');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
  }));
})();
const emailButton = document.getElementById("email-button");

if (emailButton) {
  emailButton.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Email: akashdigitals0783@gmail.com");
  });
}