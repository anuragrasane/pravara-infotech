/* ============================================
   PRAVARA INFOTECH - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  const scrollTop = document.querySelector('.scroll-top');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }
    
    if (scrollTop) {
      scrollTop.classList.toggle('visible', scrollY > 500);
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.navbar-menu');
  const overlay = document.querySelector('.mobile-overlay');
  
  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    
    if (overlay) {
      overlay.addEventListener('click', toggleMenu);
    }

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  // ---- Scroll to Top ----
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * eased);
          el.textContent = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target + suffix;
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---- Floating Particles ----
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particlesContainer.appendChild(particle);
    }
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      const accessKey = String(data.access_key || '').trim();
      
      // Simple validation
      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_API_KEY') {
        showNotification('Please add your Web3Forms API key in contact.html before submitting.', 'error');
        return;
      }
      
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">&#9696;</span> Sending...';
      btn.disabled = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
          contactForm.reset();
        } else {
          showNotification(result.message || 'Unable to send your message right now. Please try again.', 'error');
        }
      } catch (error) {
        showNotification('Network error while sending the form. Please try again.', 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // ---- Newsletter Form ----
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value) {
        showNotification('Thank you for subscribing! You will receive our latest updates.', 'success');
        input.value = '';
      }
    });
  });

  // ---- Notification System ----
  function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${type}`;
    toast.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;

    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      maxWidth: '420px',
      width: '90%',
      zIndex: '9999',
      padding: '1rem 1.25rem',
      borderRadius: '0.75rem',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: '#fff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      animation: 'fadeInDown 0.4s ease',
      fontFamily: 'inherit'
    });

    const content = toast.querySelector('.notification-content');
    Object.assign(content.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    });

    const icon = toast.querySelector('.notification-icon');
    Object.assign(icon.style, {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      flexShrink: '0'
    });

    const msg = toast.querySelector('.notification-message');
    Object.assign(msg.style, {
      flex: '1',
      fontSize: '0.9rem',
      lineHeight: '1.4'
    });

    const closeBtn = toast.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '1.25rem',
      cursor: 'pointer',
      opacity: '0.8',
      flexShrink: '0'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Project Modal ----
  // Load project data dynamically from ProjectsDB (localStorage)
  // Falls back to defaults if ProjectsDB is not available
  function getProjectData() {
    if (window.ProjectsDB) {
      const all = window.ProjectsDB.getAll();
      const map = {};
      all.forEach(p => { map[p.id] = p; });
      return map;
    }
    return {};
  }

  const modalOverlay = document.getElementById('projectModal');
  const modalMainImg = document.getElementById('projectModalMainImg');
  const modalThumbs = document.getElementById('projectModalThumbs');
  const modalTag = document.getElementById('projectModalTag');
  const modalTitle = document.getElementById('projectModalTitle');
  const modalDesc = document.getElementById('projectModalDesc');
  const modalFeatures = document.getElementById('projectModalFeatures');
  const modalTech = document.getElementById('projectModalTech');
  const galleryCounter = document.getElementById('galleryCounter');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const modalClose = document.getElementById('projectModalClose');

  let currentGalleryIndex = 0;
  let currentImages = [];

  function updateGallery(index) {
    if (!currentImages.length) return;
    currentGalleryIndex = index;
    modalMainImg.style.opacity = '0';
    setTimeout(() => {
      modalMainImg.src = currentImages[index];
      modalMainImg.alt = modalTitle.textContent + ' screenshot ' + (index + 1);
      modalMainImg.style.opacity = '1';
    }, 150);
    galleryCounter.textContent = (index + 1) + ' / ' + currentImages.length;
    // Update thumb active state
    modalThumbs.querySelectorAll('img').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  function openProjectModal(projectKey) {
    const data = getProjectData()[projectKey];
    if (!data) return;

    // Populate modal
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;

    // Features
    modalFeatures.innerHTML = '';
    (data.features || []).forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      modalFeatures.appendChild(li);
    });

    // Tech badges
    modalTech.innerHTML = '';
    (data.tech || []).forEach(t => {
      const span = document.createElement('span');
      span.textContent = t;
      modalTech.appendChild(span);
    });

    // Gallery — resolve image paths for current page context
    const images = (data.images || []).map(src =>
      window.ProjectsDB ? window.ProjectsDB.resolveImagePath(src) : src
    );
    currentImages = images;
    modalThumbs.innerHTML = '';
    images.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.alt = data.title + ' thumbnail ' + (i + 1);
      if (i === 0) thumb.classList.add('active');
      thumb.addEventListener('click', () => updateGallery(i));
      modalThumbs.appendChild(thumb);
    });

    updateGallery(0);

    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click handlers for portfolio items
  if (modalOverlay) {
    document.querySelectorAll('.portfolio-item[data-project]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const projectKey = item.getAttribute('data-project');
        openProjectModal(projectKey);
      });
    });

    // Close modal
    if (modalClose) {
      modalClose.addEventListener('click', closeProjectModal);
    }

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });

    // Gallery navigation
    if (galleryPrev) {
      galleryPrev.addEventListener('click', () => {
        const newIndex = currentGalleryIndex > 0 ? currentGalleryIndex - 1 : currentImages.length - 1;
        updateGallery(newIndex);
      });
    }
    if (galleryNext) {
      galleryNext.addEventListener('click', () => {
        const newIndex = currentGalleryIndex < currentImages.length - 1 ? currentGalleryIndex + 1 : 0;
        updateGallery(newIndex);
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!modalOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeProjectModal();
      if (e.key === 'ArrowLeft') {
        const newIndex = currentGalleryIndex > 0 ? currentGalleryIndex - 1 : currentImages.length - 1;
        updateGallery(newIndex);
      }
      if (e.key === 'ArrowRight') {
        const newIndex = currentGalleryIndex < currentImages.length - 1 ? currentGalleryIndex + 1 : 0;
        updateGallery(newIndex);
      }
    });
  }
});
