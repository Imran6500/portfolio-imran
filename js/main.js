/* ================================================
   IMRAN Hashmi — PORTFOLIO
   Main JavaScript — Loading, Particles, Animations
   ================================================ */

(function () {
  'use strict';

  // --------- UTILITIES ---------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isMobile = () => window.innerWidth <= 768;

  // --------- LOADING SCREEN ---------
  function initLoadingScreen() {
    if (isMobile()) {
      // Skip loading on mobile
      const ls = $('#loading-screen');
      if (ls) ls.classList.add('dismissed');
      document.body.classList.add('loaded');
      $('#main-content')?.classList.add('visible');
      initHeroAnimations();
      return;
    }

    const loadingScreen = $('#loading-screen');
    const loadingWrap = $('#loading-wrap');
    const loadingGlow = $('#loading-glow');
    const loadingPercent = $('#loading-percent');
    const loadingProgress = $('#loading-progress');
    const loadingWelcome = $('#loading-welcome');

    if (!loadingScreen) return;

    // Mouse tracking on loading button
    loadingWrap.addEventListener('mousemove', (e) => {
      const rect = loadingWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      loadingGlow.style.left = x + 'px';
      loadingGlow.style.top = y + 'px';
    });

    // Simulate loading
    let percent = 0;
    let loadingDone = false;

    function incrementPercent() {
      if (percent >= 100) {
        onLoadingComplete();
        return;
      }

      if (percent < 50) {
        percent += Math.floor(Math.random() * 8) + 3;
      } else if (percent < 85) {
        percent += Math.floor(Math.random() * 5) + 2;
      } else {
        percent += 3;
      }

      if (percent > 100) percent = 100;
      loadingPercent.textContent = percent + '%';

      const delay = percent < 50 ? 20 + Math.random() * 30 : 40 + Math.random() * 50;
      setTimeout(incrementPercent, delay);
    }

    function onLoadingComplete() {
      if (loadingDone) return;
      loadingDone = true;

      loadingProgress.classList.add('done');
      setTimeout(() => {
        loadingWelcome.classList.add('visible');
      }, 200);
      
      // Auto enter site automatically
      setTimeout(enterSite, 800);
    }

    // Click to enter
    loadingWrap.addEventListener('click', () => {
      if (!loadingDone) {
        // Force complete
        percent = 100;
        loadingPercent.textContent = '100%';
        onLoadingComplete();
        setTimeout(enterSite, 400);
      } else {
        enterSite();
      }
    });

    function enterSite() {
      loadingWrap.classList.add('expanding');

      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.add('loaded');
        $('#main-content')?.classList.add('visible');
        initHeroAnimations();
      }, 700);

      setTimeout(() => {
        loadingScreen.classList.add('dismissed');
      }, 1400);
    }

    // Start loading
    setTimeout(incrementPercent, 300);
  }

  // --------- PARTICLE CANVAS ---------
  function initParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles, animFrame;
    const particleCount = isMobile() ? 40 : 80;
    const maxDist = 150;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      const hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 164, 255, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(194, 164, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 200) {
          const alpha = (1 - mDist / 200) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(194, 164, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animFrame = requestAnimationFrame(drawParticles);
    }

    // Mouse tracking for particles
    const hero = canvas.parentElement;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  // --------- TYPEWRITER ---------
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;

    const phrases = [
      'Flutter Developer',
      'Mobile App Developer',
      'Hybrid App Developer',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function type() {
      const current = phrases[phraseIdx];

      if (!deleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;

        if (charIdx === current.length) {
          pauseTimer = setTimeout(() => {
            deleting = true;
            type();
          }, 2200);
          return;
        }
        setTimeout(type, 70 + Math.random() * 40);
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;

        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      }
    }

    // Start after a short delay
    setTimeout(type, 600);
  }

  // --------- HERO ANIMATIONS (triggered after loading) ---------
  function initHeroAnimations() {
    // Particles
    initParticles();

    // Typewriter
    setTimeout(initTypewriter, 300);

    // Stat counter animation
    initStatCounters();
  }

  // --------- STAT COUNTERS ---------
  function initStatCounters() {
    const counters = $$('[data-count]');
    const observed = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }

  // --------- SCROLL REVEAL ---------
  function initScrollReveal() {
    const reveals = $$('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger children if needed
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    reveals.forEach((el, i) => {
      // Add stagger delay for siblings
      const parent = el.parentElement;
      const siblings = $$('.reveal, .reveal-left, .reveal-right', parent);
      const siblingIdx = siblings.indexOf(el);
      if (siblingIdx > 0) {
        el.dataset.delay = siblingIdx * 100;
      }
      observer.observe(el);
    });
  }

  // --------- NAVBAR ---------
  function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#nav-hamburger');
    const navLinks = $('#nav-links');
    const links = $$('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    });

    // Active section
    const sections = $$('section[id]');
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle('active', link.dataset.section === id);
            });
          }
        });
      },
      {
          threshold: 0,
        rootMargin: '-50% 0px -50% 0px',
      }
    );

    sections.forEach((s) => navObserver.observe(s));

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    links.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        navLinks?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Smooth scroll for anchor links
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // --------- PROJECT CARD GLOW ---------
  function initProjectCardGlow() {
    const cards = $$('.project-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // --------- INITIALIZE ---------
  function init() {
    initLoadingScreen();
    initScrollReveal();
    initNavbar();
    initProjectCardGlow();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
