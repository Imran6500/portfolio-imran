/**
 * IMRAN HASHMI — PORTFOLIO JAVASCRIPT
 * Professional, lightweight client-side interactions
 */

(function () {
  'use strict';

  // --------- SELECTOR HELPERS ---------
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // --------- TOAST NOTIFICATION ---------
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --------- SITE PRELOADER ---------
  function initPreloader() {
    const preloader = $('#site-preloader');
    if (!preloader) return;

    const fill = $('#preloader-bar-fill');
    const percent = $('#preloader-percent');
    const status = $('#preloader-status');

    let currentPercent = 0;
    let isLoaded = false;
    let dismissed = false;

    const statuses = [
      { threshold: 0, text: 'Initializing Architecture...' },
      { threshold: 30, text: 'Loading Production Apps...' },
      { threshold: 65, text: 'Configuring Interactive Systems...' },
      { threshold: 92, text: 'Finalizing Experience...' }
    ];

    function updateProgress(val) {
      currentPercent = Math.min(100, Math.floor(val));
      if (fill) fill.style.width = `${currentPercent}%`;
      if (percent) percent.textContent = `${currentPercent}%`;

      const match = statuses.slice().reverse().find(s => currentPercent >= s.threshold);
      if (match && status && currentPercent < 100) {
        status.textContent = match.text;
      }
    }

    function dismissPreloader() {
      if (dismissed) return;
      dismissed = true;
      clearInterval(progressInterval);
      updateProgress(100);
      if (status) status.textContent = 'Welcome!';

      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 350);
    }

    // Smooth incremental progress
    const progressInterval = setInterval(() => {
      if (isLoaded) {
        currentPercent += 8;
      } else if (currentPercent < 85) {
        currentPercent += Math.random() * 4 + 1.8;
      }

      updateProgress(currentPercent);

      if (currentPercent >= 100) {
        clearInterval(progressInterval);
        dismissPreloader();
      }
    }, 28);

    // When the whole window finishes loading assets
    if (document.readyState === 'complete') {
      setTimeout(() => { isLoaded = true; }, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => { isLoaded = true; }, 450);
      });
    }

    // Fail-safe timeout so user is never blocked
    setTimeout(() => {
      isLoaded = true;
      dismissPreloader();
    }, 2400);
  }

  // Trigger preloader immediately as script executes
  initPreloader();

  // --------- NAVIGATION & MOBILE MENU ---------
  function initNavigation() {
    const menuToggle = $('#menu-toggle');
    const mainNav = $('#main-nav');
    const navLinks = $$('.nav-item');
    const sections = $$('section[id]');

    // Mobile menu toggle
    menuToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('open');
      mainNav?.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle?.classList.remove('open');
        mainNav?.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav?.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle?.contains(e.target)) {
        menuToggle?.classList.remove('open');
        mainNav?.classList.remove('open');
      }
    });

    // Scroll active link highlight
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            if (link && link.classList && link.dataset) {
              link.classList.toggle('active', link.dataset.section === id);
            }
          });
        }
      });
    });
  }

  // --------- SCREENSHOT LIGHTBOX MODAL ---------
  let openLightboxModal = null;

  function initLightbox() {
    const modal = $('#screenshot-modal');
    const backdrop = $('#modal-backdrop');
    const closeBtn = $('#modal-close');
    const modalImg = $('#modal-image');
    const captionEl = $('#modal-caption');

    openLightboxModal = function (src, caption) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      if (captionEl) captionEl.textContent = caption || 'Mobile Application Preview';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      const galleryModal = $('#gallery-modal');
      // If gallery modal is not active, restore scroll
      if (!galleryModal || !galleryModal.classList.contains('active')) {
        document.body.style.overflow = '';
      }
      if (modalImg) modalImg.src = '';
    }

    // Global delegation for all zoom triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.zoom-trigger');
      if (trigger) {
        e.preventDefault();
        const src = trigger.dataset.img || trigger.querySelector('img')?.src;
        const caption = trigger.dataset.caption || '';
        if (src) openLightboxModal(src, caption);
      }
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --------- ALL SCREENSHOTS GALLERY MODAL ---------
  function initProjectGalleryModal() {
    const galleryModal = $('#gallery-modal');
    const backdrop = $('#gallery-backdrop');
    const closeBtn = $('#gallery-close');
    const iconEl = $('#gallery-modal-icon');
    const titleEl = $('#gallery-modal-title');
    const subtitleEl = $('#gallery-modal-subtitle');
    const tabsContainer = $('#gallery-filter-tabs');
    const bodyContainer = $('#gallery-modal-body');

    if (!galleryModal || !bodyContainer) return;

    const projectGalleries = {
      'rush-baskets': {
        title: 'Rush Baskets',
        icon: 'images/apps/rush_baskets_user_icon.png',
        subtitle: '10-Min Quick Grocery — Dual App Ecosystem (Customer & Driver Apps)',
        filters: [
          { id: 'all', label: 'All Screens (8)' },
          { id: 'user', label: 'Customer App (4)' },
          { id: 'driver', label: 'Delivery Agent App (4)' }
        ],
        screens: [
          {
            src: 'images/apps/rush_baskets_user_screen_1.png',
            title: 'Customer Storefront & Catalog',
            category: 'user',
            badge: 'Customer'
          },
          {
            src: 'images/apps/rush_baskets_user_screen_2.png',
            title: 'Product Catalog & Live Search',
            category: 'user',
            badge: 'Customer'
          },
          {
            src: 'images/apps/rush_baskets_user_screen_3.png',
            title: 'Cart & Cashfree Gateway Checkout',
            category: 'user',
            badge: 'Customer'
          },
          {
            src: 'images/apps/rush_baskets_user_screen_4.png',
            title: 'Live Order & Rider Map Tracking',
            category: 'user',
            badge: 'Customer'
          },
          {
            src: 'images/apps/rush_baskets_driver_screen_1.png',
            title: 'Delivery Agent Orders Dashboard',
            category: 'driver',
            badge: 'Driver'
          },
          {
            src: 'images/apps/rush_baskets_driver_screen_2.png',
            title: 'Order Dispatch & 10-Min SLA Timers',
            category: 'driver',
            badge: 'Driver'
          },
          {
            src: 'images/apps/rush_baskets_driver_screen_3.png',
            title: 'Turn-by-Turn Google Maps Routing',
            category: 'driver',
            badge: 'Driver'
          },
          {
            src: 'images/apps/rush_baskets_driver_screen_4.png',
            title: 'Agent Daily Earnings & Payouts',
            category: 'driver',
            badge: 'Driver'
          }
        ]
      },
      'goody-tokri': {
        title: 'Goody Tokri',
        icon: 'images/apps/goody_tokri_user_icon.png',
        subtitle: 'Hyperlocal Grocery Platform (Customer Storefront + Delivery Partner Suite)',
        filters: [
          { id: 'all', label: 'All Screens (8)' },
          { id: 'user', label: 'User App (4)' },
          { id: 'rider', label: 'Rider Partner App (4)' }
        ],
        screens: [
          {
            src: 'images/apps/goody_tokri_user_screen_1.png',
            title: 'User Home Catalog & Deals',
            category: 'user',
            badge: 'User'
          },
          {
            src: 'images/apps/goody_tokri_user_screen_2.png',
            title: 'Smart Category Exploration',
            category: 'user',
            badge: 'User'
          },
          {
            src: 'images/apps/goody_tokri_user_screen_3.png',
            title: 'Smart Cart & Discount Coupons',
            category: 'user',
            badge: 'User'
          },
          {
            src: 'images/apps/goody_tokri_user_screen_4.png',
            title: 'Checkout & Order Confirmation',
            category: 'user',
            badge: 'User'
          },
          {
            src: 'images/apps/goody_tokri_driver_screen_1.png',
            title: 'Rider Active Orders Hub',
            category: 'rider',
            badge: 'Rider'
          },
          {
            src: 'images/apps/goody_tokri_driver_screen_2.png',
            title: 'Store Pickup Route & Navigation',
            category: 'rider',
            badge: 'Rider'
          },
          {
            src: 'images/apps/goody_tokri_driver_screen_3.png',
            title: 'Customer Connect & Drop-off Proof',
            category: 'rider',
            badge: 'Rider'
          },
          {
            src: 'images/apps/goody_tokri_driver_screen_4.png',
            title: 'Shift Analytics & Earnings Wallet',
            category: 'rider',
            badge: 'Rider'
          }
        ]
      },
      'bid-venchure': {
        title: 'Bid Venchure',
        icon: 'images/apps/bid_venchure_icon.png',
        subtitle: 'Reverse-Auction Event Booking & Certified Vendor Bidding Marketplace',
        filters: [
          { id: 'all', label: 'All Screens (4)' }
        ],
        screens: [
          {
            src: 'images/apps/bid_venchure_screen_1.png',
            title: 'Event Requirements Setup',
            category: 'all',
            badge: 'Event Setup'
          },
          {
            src: 'images/apps/bid_venchure_screen_2.png',
            title: 'Venue & Caterer Preferences',
            category: 'all',
            badge: 'Preferences'
          },
          {
            src: 'images/apps/bid_venchure_screen_3.png',
            title: 'Live Vendor Bids & Counter-Offers',
            category: 'all',
            badge: 'Live Bids'
          },
          {
            src: 'images/apps/bid_venchure_screen_4.png',
            title: 'Contract Booking Confirmation',
            category: 'all',
            badge: 'Confirmation'
          }
        ]
      }
    };

    let currentProjectData = null;
    let currentFilter = 'all';

    function renderScreens(filterId) {
      if (!currentProjectData) return;
      bodyContainer.innerHTML = '';

      const screens = currentProjectData.screens.filter(
        (s) => filterId === 'all' || s.category === filterId
      );

      screens.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'gallery-item-card zoom-trigger';
        card.dataset.img = item.src;
        card.dataset.caption = `${currentProjectData.title} — ${item.title}`;

        card.innerHTML = `
          <div class="phone-mockup">
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <span class="mockup-label">${item.badge}</span>
          </div>
          <span class="gallery-item-title">${item.title}</span>
        `;

        bodyContainer.appendChild(card);
      });
    }

    function openGalleryModal(projectId) {
      const data = projectGalleries[projectId];
      if (!data) return;

      currentProjectData = data;
      currentFilter = 'all';

      if (iconEl) iconEl.src = data.icon;
      if (titleEl) titleEl.textContent = `${data.title} — Full Screen Gallery`;
      if (subtitleEl) subtitleEl.textContent = data.subtitle;

      // Render filter tabs
      if (tabsContainer) {
        tabsContainer.innerHTML = '';
        data.filters.forEach((tab) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `gallery-tab-btn ${tab.id === 'all' ? 'active' : ''}`;
          btn.textContent = tab.label;
          btn.addEventListener('click', () => {
            tabsContainer.querySelectorAll('.gallery-tab-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            renderScreens(tab.id);
          });
          tabsContainer.appendChild(btn);
        });
      }

      renderScreens('all');

      galleryModal.classList.add('active');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeGalleryModal() {
      galleryModal.classList.remove('active');
      galleryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Attach click to all "View All" buttons
    document.querySelectorAll('.btn-view-all-screens').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = btn.dataset.galleryTarget;
        if (target) openGalleryModal(target);
      });
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-view-all-screens');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const target = btn.dataset.galleryTarget;
        if (target) openGalleryModal(target);
      }
    });

    closeBtn?.addEventListener('click', closeGalleryModal);
    backdrop?.addEventListener('click', closeGalleryModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
        closeGalleryModal();
      }
    });
  }

  // --------- PROJECT SCREENSHOT SLIDERS ---------
  function initProjectSliders() {
    const containers = $$('.showcase-slider-container');

    containers.forEach((container) => {
      const slider = container.querySelector('.device-showcase-wrap');
      const prevBtn = container.querySelector('.slider-nav-btn.prev');
      const nextBtn = container.querySelector('.slider-nav-btn.next');
      const counterNum = container.querySelector('.slider-current-num');
      const items = container.querySelectorAll('.phone-mockup');

      if (!slider || !prevBtn || !nextBtn || items.length === 0) return;

      const itemWidth = 181; // 165px mockup + 16px gap

      function updateControls() {
        const scrollLeft = slider.scrollLeft;
        const maxScroll = slider.scrollWidth - slider.clientWidth - 5;

        prevBtn.disabled = scrollLeft <= 8;
        nextBtn.disabled = scrollLeft >= maxScroll;

        if (counterNum) {
          const currentIndex = Math.min(
            items.length,
            Math.max(1, Math.round(scrollLeft / itemWidth) + 1)
          );
          counterNum.textContent = currentIndex;
        }
      }

      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
      });

      // Smooth horizontal scroll handling without runaway speed
      slider.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          slider.scrollLeft += Math.sign(e.deltaX) * 90;
        }
      }, { passive: false });

      slider.addEventListener('scroll', updateControls, { passive: true });
      updateControls();
    });
  }

  // --------- SMOOTH ANCHOR SCROLLING (CONTROLLED SPEED) ---------
  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerHeight = 74;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        // Controlled duration: smooth 700ms with cubic easing so it never feels "too fast"
        const duration = Math.min(Math.max(Math.abs(distance) * 0.35, 550), 800);
        let startTime = null;

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          // Ease-in-out cubic
          const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          window.scrollTo(0, startPosition + distance * ease);

          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            window.scrollTo(0, targetPosition);
          }
        }

        requestAnimationFrame(animation);
      });
    });
  }

  // --------- COPY TO CLIPBOARD BUTTONS ---------
  function initCopyButtons() {
    const copyBtns = $$('.copy-action-btn');

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = btn.dataset.copy;
        if (!text) return;

        try {
          await navigator.clipboard.writeText(text);
          showToast(`Copied "${text}" to clipboard!`);
          btn.innerHTML = '<i class="ri-check-line text-success"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="ri-file-copy-line"></i>';
          }, 2000);
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(`Copied "${text}" to clipboard!`);
        }
      });
    });
  }

  // --------- CONTACT FORM HANDLING ---------
  function initContactForm() {
    const form = $('#contact-form');
    const statusMsg = $('#form-status-msg');
    const submitBtn = $('#submit-btn');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      const nameInput = $('#name');
      const emailInput = $('#email');
      const subjectInput = $('#subject');
      const messageInput = $('#message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (statusMsg) {
          statusMsg.textContent = 'Please fill out all required fields.';
          statusMsg.className = 'form-status-msg error';
        }
        return;
      }

      const originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending to Imran...</span> <i class="ri-loader-4-line spin-fast"></i>';
      submitBtn.disabled = true;
      if (statusMsg) {
        statusMsg.textContent = 'Delivering message to imranhashimi6500@gmail.com...';
        statusMsg.className = 'form-status-msg';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/imranhashimi6500@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject || `Portfolio Inquiry from ${name}`,
            message: message,
            _subject: `New Portfolio Message: ${subject || 'Inquiry'} (from ${name})`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          submitBtn.innerHTML = '<span>Message Sent!</span> <i class="ri-checkbox-circle-fill"></i>';
          submitBtn.style.background = '#10b981';
          submitBtn.style.color = '#ffffff';

          if (statusMsg) {
            statusMsg.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Thank you! Your message was delivered directly to <strong>imranhashimi6500@gmail.com</strong>. Imran will get back to you shortly.';
            statusMsg.className = 'form-status-msg success';
          }
          form.reset();
        } else if (data.message && data.message.includes('Activation')) {
          submitBtn.innerHTML = '<span>Activation Notice Sent</span> <i class="ri-mail-check-line"></i>';
          submitBtn.style.background = '#38bdf8';
          submitBtn.style.color = '#090a10';

          if (statusMsg) {
            statusMsg.innerHTML = 'Notice: Form activation link sent to <strong>imranhashimi6500@gmail.com</strong>. Please check your inbox and click "Activate Form" once to start receiving all client messages!';
            statusMsg.className = 'form-status-msg info';
          }
        } else {
          throw new Error(data.message || 'Submission error');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        submitBtn.innerHTML = '<span>Direct Email</span> <i class="ri-mail-send-line"></i>';
        submitBtn.style.background = '#6366f1';
        submitBtn.style.color = '#ffffff';

        if (statusMsg) {
          const mailtoUrl = `mailto:imranhashimi6500@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
          statusMsg.innerHTML = `If network is blocked, <a href="${mailtoUrl}" style="text-decoration:underline;color:var(--brand-cyan);font-weight:700;">click here to email Imran directly</a>.`;
          statusMsg.className = 'form-status-msg error';
        }
      } finally {
        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 6000);
      }
    });
  }

  // --------- SCROLL REVEAL ANIMATIONS ---------
  function initScrollReveal() {
    const targets = [
      '.section-header',
      '.stat-box',
      '.about-card',
      '.pillar-card',
      '.skill-group-card',
      '.timeline-entry',
      '.project-showcase-card',
      '.education-card',
      '.contact-method-card',
      '.contact-form-card',
      '.footer-col'
    ];

    targets.forEach((selector) => {
      $$(selector).forEach((el, index) => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
          el.classList.add('reveal');
          const delayIndex = (index % 4) + 1;
          el.classList.add(`delay-${delayIndex}`);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    $$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      observer.observe(el);
    });
  }

  // --------- ANIMATED COUNTERS FOR STATS STRIP ---------
  function initStatsCounter() {
    const statsStrip = $('.stats-strip');
    const statBoxes = $$('.stat-box');
    if (!statsStrip || statBoxes.length === 0) return;

    let animated = false;

    const statsData = [
      { target: 2.5, suffix: '+', decimals: 1 },
      { target: 8, suffix: '+', decimals: 0 },
      { target: 5, suffix: 'K+', decimals: 0 },
      { target: 95, suffix: '%+', decimals: 0 }
    ];

    function animateValue(el, start, end, duration, decimals, suffix) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = (start + (end - start) * easeOut).toFixed(decimals);
        el.textContent = current + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = (end % 1 === 0 && decimals === 0 ? end : end.toFixed(decimals)) + suffix;
        }
      };
      window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statBoxes.forEach((box, i) => {
              const numEl = box.querySelector('.stat-number');
              if (numEl && statsData[i]) {
                const { target, suffix, decimals } = statsData[i];
                animateValue(numEl, 0, target, 1600 + i * 150, decimals, suffix);
              }
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(statsStrip);
  }

  // --------- CARD 3D TILT EFFECT ---------
  function initCardTilt() {
    const tiltCards = $$('.avatar-card-frame, .phone-mockup');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --------- HEADER GLASSMORPHISM ON SCROLL ---------
  function initHeaderScroll() {
    const header = $('#site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --------- BACK TO TOP BUTTON ---------
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------- FLOATING ACTION BUTTON (FAB) ---------
  function initFAB() {
    const fabContainer = $('#fab-container');
    const fabBtn = $('#fab-main-btn');
    if (!fabContainer || !fabBtn) return;

    fabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fabContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!fabContainer.contains(e.target)) {
        fabContainer.classList.remove('open');
      }
    });
  }

  // --------- INITIALIZE ---------
  function init() {
    initNavigation();
    initLightbox();
    initProjectSliders();
    initProjectGalleryModal();
    initSmoothAnchorScroll();
    initCopyButtons();
    initContactForm();
    initBackToTop();
    initFAB();
    initScrollReveal();
    initStatsCounter();
    initCardTilt();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
