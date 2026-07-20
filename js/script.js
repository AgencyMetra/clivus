/* ==========================================================================
   CLIVUS — script.js (Vanilla JS)
   Preloader, custom cursor, scroll reveals, laptop parallax, portfolio grid
   + modal, before/after slider, animated counters, swiper, accordion.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 0. ICONS — map data-icon to lucide + render                        */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = '<i data-lucide="' + el.getAttribute('data-icon') + '"></i>';
  });
  if (window.lucide) { lucide.createIcons(); }

  /* ------------------------------------------------------------------ */
  /* 1. PRELOADER                                                        */
  /* ------------------------------------------------------------------ */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    setTimeout(function () {
      preloader.classList.add('is-hidden');
      document.body.style.overflow = '';
      initScrollAnimations();
    }, 500);
  });
  document.body.style.overflow = 'hidden';
  // Safety fallback in case load event is delayed by slow CDNs
  setTimeout(function () {
    var preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('is-hidden')) {
      preloader.classList.add('is-hidden');
      document.body.style.overflow = '';
    }
  }, 2500);

  /* ------------------------------------------------------------------ */
  /* 2. CUSTOM CURSOR                                                    */
  /* ------------------------------------------------------------------ */
  var cursorDot = document.querySelector('.cursor-dot');
  var cursorRing = document.querySelector('.cursor-ring');
  var cursorLabel = document.querySelector('.cursor-label');
  var hasFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (hasFinePointer && cursorDot && cursorRing) {
    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      var link = e.target.closest('a, button, [data-cursor="link"]');
      if (link) {
        cursorRing.classList.add('is-link');
        if (link.closest('.project-card')) {
          cursorRing.classList.add('is-view');
          cursorLabel.textContent = 'Ver';
        }
      }
    });
    document.addEventListener('mouseout', function (e) {
      var link = e.target.closest('a, button, [data-cursor="link"]');
      if (link) {
        cursorRing.classList.remove('is-link', 'is-view');
        cursorLabel.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. HEADER SCROLL STATE + MOBILE MENU                                */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById('header');
  var onScrollHeader = function () {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  menuToggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* 4. LAPTOP TILT PARALLAX                                             */
  /* ------------------------------------------------------------------ */
  var laptop = document.getElementById('laptop');
  var hero = document.getElementById('hero');
  if (laptop && hero && hasFinePointer) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      laptop.style.transform = 'rotateY(' + (-12 + px * 10) + 'deg) rotateX(' + (4 - py * 8) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () {
      laptop.style.transform = 'rotateY(-12deg) rotateX(4deg)';
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. GSAP SCROLL REVEALS (Fade + Slide)                                */
  /* ------------------------------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 4) * 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Timeline progress line
    var progress = document.querySelector('.timeline-progress');
    if (progress) {
      gsap.to(progress, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 1
        }
      });
    }

    // Hero content parallax fade on scroll
    gsap.to('.hero-visual', {
      y: 60,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ */
  /* 6. ANIMATED STAT COUNTERS                                           */
  /* ------------------------------------------------------------------ */
  var counters = document.querySelectorAll('.stat-number');
  var countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var current = 0;
      var duration = 1600;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounters(); statsObserver.disconnect(); }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------ */
  /* 7. FAQ ACCORDION                                                    */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion-item');
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ------------------------------------------------------------------ */
  /* 8. BEFORE / AFTER COMPARE SLIDER                                    */
  /* ------------------------------------------------------------------ */
  var compareWrap = document.getElementById('compareSlider');
  var compareBefore = document.getElementById('compareBefore');
  var compareHandle = document.getElementById('compareHandle');
  if (compareWrap && compareBefore && compareHandle) {
    var dragging = false;

    function setCompare(clientX) {
      var rect = compareWrap.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      var pct = (x / rect.width) * 100;
      compareBefore.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      compareHandle.style.left = pct + '%';
    }
    compareHandle.style.left = '50%';

    function start(e) { dragging = true; }
    function end() { dragging = false; }
    function move(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setCompare(clientX);
    }
    compareHandle.addEventListener('mousedown', start);
    compareHandle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    compareWrap.addEventListener('click', function (e) { setCompare(e.clientX); });
  }

  /* ------------------------------------------------------------------ */
  /* 9. SWIPER TESTIMONIALS                                              */
  /* ------------------------------------------------------------------ */
  if (window.Swiper) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        720: { slidesPerView: 2 },
        1080: { slidesPerView: 3 }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 10. PORTFOLIO DATA + RENDER + FILTER + MODAL                        */
  /* ------------------------------------------------------------------ */
  var projects = [
    {
      id: 'barbearia-premium',
      name: 'Barbearia Premium',
      category: 'Serviços',
      filter: 'servicos',
      description: 'Site institucional para barbearia de alto padrão, com agendamento online e catálogo de serviços.',
      objective: 'Aumentar agendamentos online e transmitir uma imagem premium para o público masculino AB.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      icon: 'scissors',
      hue: '#3B82F6', hue2: '#0f2947'
    },
    {
      id: 'clinica-odontologica',
      name: 'Clínica Odontológica',
      category: 'Saúde & Bem-estar',
      filter: 'saude',
      description: 'Plataforma institucional com apresentação da equipe, especialidades e formulário de contato integrado.',
      objective: 'Gerar autoridade médica e facilitar o primeiro contato de novos pacientes.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'SEO técnico'],
      icon: 'stethoscope',
      hue: '#60A5FA', hue2: '#0e2540'
    },
    {
      id: 'restaurante-italiano',
      name: 'Restaurante Italiano',
      category: 'Serviços',
      filter: 'servicos',
      description: 'Site com cardápio digital, galeria de ambiente e sistema de reservas para um restaurante italiano contemporâneo.',
      objective: 'Elevar a percepção de sofisticação da marca e reduzir reservas por telefone.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Swiper.js'],
      icon: 'utensils-crossed',
      hue: '#3B82F6', hue2: '#1a1508'
    },
    {
      id: 'escritorio-advocacia',
      name: 'Escritório de Advocacia',
      category: 'Corporativo',
      filter: 'corporativo',
      description: 'Site institucional sóbrio com áreas de atuação, artigos jurídicos e canal direto de contato.',
      objective: 'Transmitir credibilidade e captar leads qualificados via formulário.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'SEO técnico'],
      icon: 'scale',
      hue: '#6B7280', hue2: '#15181f'
    },
    {
      id: 'studio-tatuagem',
      name: 'Studio de Tatuagem',
      category: 'Serviços',
      filter: 'servicos',
      description: 'Portfólio visual imersivo para exibir estilos e trabalhos autorais dos tatuadores do estúdio.',
      objective: 'Valorizar o trabalho artístico e facilitar orçamentos personalizados.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      icon: 'pen-tool',
      hue: '#3B82F6', hue2: '#160b26'
    },
    {
      id: 'academia',
      name: 'Academia',
      category: 'Saúde & Bem-estar',
      filter: 'saude',
      description: 'Landing page de alta conversão para captação de novos alunos com planos e turmas em destaque.',
      objective: 'Aumentar matrículas através de uma página objetiva e persuasiva.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'ScrollTrigger'],
      icon: 'dumbbell',
      hue: '#60A5FA', hue2: '#0c1f12'
    },
    {
      id: 'imobiliaria',
      name: 'Imobiliária',
      category: 'Corporativo',
      filter: 'corporativo',
      description: 'Plataforma com catálogo de imóveis filtrável, busca inteligente e páginas individuais de cada propriedade.',
      objective: 'Facilitar a busca de imóveis e aumentar o volume de contatos qualificados.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Sistema Web'],
      icon: 'building-2',
      hue: '#3B82F6', hue2: '#101820'
    },
    {
      id: 'loja-de-roupas',
      name: 'Loja de Roupas',
      category: 'Varejo',
      filter: 'varejo',
      description: 'Loja virtual completa com catálogo de coleções, carrinho e checkout otimizado para conversão.',
      objective: 'Triplicar as vendas online e criar uma vitrine digital alinhada à identidade da marca.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
      icon: 'shirt',
      hue: '#60A5FA', hue2: '#210f1c'
    },
    {
      id: 'cafe',
      name: 'Café',
      category: 'Serviços',
      filter: 'servicos',
      description: 'Site aconchegante com cardápio, história da marca e localização das unidades.',
      objective: 'Reforçar identidade de marca local e atrair novos clientes de bairro.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Mapas'],
      icon: 'coffee',
      hue: '#3B82F6', hue2: '#1f150c'
    },
    {
      id: 'empresa-de-engenharia',
      name: 'Empresa de Engenharia',
      category: 'Corporativo',
      filter: 'corporativo',
      description: 'Site institucional técnico com portfólio de obras, certificações e área de clientes corporativos.',
      objective: 'Posicionar a empresa como referência técnica para grandes contratantes.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Sistema Web'],
      icon: 'ruler',
      hue: '#6B7280', hue2: '#0e1116'
    }
  ];

  function thumbSVG(p) {
    var uid = p.id;
    return '' +
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + p.name + '">' +
        '<defs>' +
          '<linearGradient id="g-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="' + p.hue2 + '"/>' +
            '<stop offset="100%" stop-color="#0a0c10"/>' +
          '</linearGradient>' +
          '<radialGradient id="glow-' + uid + '" cx="30%" cy="15%" r="60%">' +
            '<stop offset="0%" stop-color="' + p.hue + '" stop-opacity="0.55"/>' +
            '<stop offset="100%" stop-color="' + p.hue + '" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<rect width="400" height="300" fill="url(#g-' + uid + ')"/>' +
        '<rect width="400" height="300" fill="url(#glow-' + uid + ')"/>' +
        '<rect x="0" y="0" width="400" height="34" fill="#ffffff" opacity="0.03"/>' +
        '<circle cx="18" cy="17" r="3.4" fill="#f87171"/>' +
        '<circle cx="30" cy="17" r="3.4" fill="#facc15"/>' +
        '<circle cx="42" cy="17" r="3.4" fill="#4ade80"/>' +
        '<rect x="150" y="10" width="100" height="14" rx="7" fill="#ffffff" opacity="0.06"/>' +
        '<circle cx="200" cy="120" r="46" fill="' + p.hue + '" opacity="0.14"/>' +
        '<circle cx="200" cy="120" r="30" fill="' + p.hue + '" opacity="0.22"/>' +
        iconPath(p.icon, 200, 120, p.hue) +
        '<rect x="120" y="192" width="160" height="10" rx="5" fill="#ffffff" opacity="0.16"/>' +
        '<rect x="150" y="210" width="100" height="7" rx="3.5" fill="#ffffff" opacity="0.08"/>' +
        '<rect x="164" y="234" width="72" height="20" rx="10" fill="' + p.hue + '" opacity="0.85"/>' +
      '</svg>';
  }

  // Minimal inline icon paths (subset, mirrors lucide style) keyed by name.
  var iconPaths = {
    'scissors': 'M6 6 20 20M14 6 6 20M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    'stethoscope': 'M6 3v6a4 4 0 0 0 8 0V3M10 15a6 6 0 0 0 12 0v-2M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'utensils-crossed': 'M8 3v7c0 1.1.9 2 2 2h0M16 3l-3 9M6 3 3 6l9 9M21 15l-6 6M15 21l6-6',
    'scale': 'M12 3v18M5 8l-3 6a4 4 0 0 0 8 0zM19 8l-3 6a4 4 0 0 0 8 0zM3 8h6M15 8h6M8 21h8',
    'pen-tool': 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 13a2 2 0 1 0 4 0 2 2 0 0 0-4 0z',
    'dumbbell': 'M6.5 6.5 17.5 17.5M8 6a2 2 0 1 0-4 0v0a2 2 0 0 0 4 0zM20 18a2 2 0 1 0-4 0v0a2 2 0 0 0 4 0zM4 8v8M20 8v8',
    'building-2': 'M6 22V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18M14 22V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v13M2 22h20M9 6h1M9 10h1M9 14h1',
    'shirt': 'M6 3 3 6l3 3 3-3M18 3l3 3-3 3-3-3M9 3l3 3 3-3M6 6v15h12V6',
    'coffee': 'M18 8h1a3 3 0 0 1 0 6h-1M2 8h16v6a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 2v2M10 2v2M14 2v2',
    'ruler': 'M3 8l13 13 5-5L8 3 3 8zM12.5 8.5l1-1M14.5 10.5l1-1M16.5 12.5l1-1M8.5 4.5l1-1'
  };
  function iconPath(name, cx, cy, color) {
    var d = iconPaths[name] || iconPaths['scale'];
    return '<g transform="translate(' + (cx - 12) + ',' + (cy - 12) + ')" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + d + '"/></g>';
  }

  var portfolioGrid = document.getElementById('portfolioGrid');
  function renderPortfolio(filter) {
    portfolioGrid.innerHTML = projects
      .filter(function (p) { return filter === 'all' || p.filter === filter; })
      .map(function (p) {
        return '' +
          '<article class="project-card reveal" data-reveal data-id="' + p.id + '">' +
            '<div class="project-thumb">' + thumbSVG(p) +
              '<div class="project-thumb-overlay"><span class="project-view-btn">Visualizar Projeto ' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>' +
            '</div>' +
            '<div class="project-info">' +
              '<div class="project-category">' + p.category + '</div>' +
              '<h3>' + p.name + '</h3>' +
              '<p>' + p.description + '</p>' +
            '</div>' +
          '</article>';
      }).join('');

    // animate newly injected cards in
    if (window.gsap) {
      gsap.fromTo(portfolioGrid.querySelectorAll('.project-card'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.06 });
    } else {
      portfolioGrid.querySelectorAll('.project-card').forEach(function (c) { c.style.opacity = 1; c.style.transform = 'none'; });
    }

    portfolioGrid.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card.getAttribute('data-id')); });
    });
  }
  renderPortfolio('all');

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      renderPortfolio(btn.getAttribute('data-filter'));
    });
  });

  /* ---- Modal ---- */
  var modalOverlay = document.getElementById('modalOverlay');
  var modalBody = document.getElementById('modalBody');
  var modalClose = document.getElementById('modalClose');

  function openModal(id) {
    var p = projects.find(function (x) { return x.id === id; });
    if (!p) return;
    modalBody.innerHTML = '' +
      '<div class="modal-hero">' + thumbSVG(p) + '</div>' +
      '<div class="modal-content">' +
        '<div class="modal-category">' + p.category + '</div>' +
        '<h2>' + p.name + '</h2>' +
        '<p class="modal-desc">' + p.description + '</p>' +
        '<div class="modal-grid">' +
          '<div class="modal-block"><h4>Tecnologias utilizadas</h4><div class="tech-tags">' +
            p.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('') +
          '</div></div>' +
          '<div class="modal-block"><h4>Objetivo do projeto</h4><p>' + p.objective + '</p></div>' +
        '</div>' +
        '<a href="#contato" class="btn btn-primary" id="modalDemoBtn">' +
          '<span>Acessar demonstração</span>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>' +
      '</div>';
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalDemoBtn').addEventListener('click', closeModal);
  }
  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

})();
