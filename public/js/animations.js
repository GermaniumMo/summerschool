/**
 * Neural Nexus - Animations
 * Scroll-triggered animations, particle effects, and micro-interactions
 */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    animationThreshold: 0.1,
    animationRootMargin: '0px 0px -50px 0px',
    particleCount: 15,
    particleColors: ['#00f5d4', '#9b5de5', '#f15bb5']
  };

  // ===== PARTICLE SYSTEM =====
  const particles = {
    container: null,
    particles: [],

    /**
     * Initialize particle system
     */
    init: function() {
      this.container = document.getElementById('particles');
      if (!this.container) return;

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.container.style.display = 'none';
        return;
      }

      this.createParticles();
    },

    /**
     * Create particle elements
     */
    createParticles: function() {
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties
        const size = Math.random() * 4 + 2;
        const color = CONFIG.particleColors[Math.floor(Math.random() * CONFIG.particleColors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * -20;

        // Apply styles
        particle.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          left: ${left}%;
          --float-duration: ${duration}s;
          --float-delay: ${delay}s;
        `;

        fragment.appendChild(particle);
        this.particles.push(particle);
      }

      this.container.appendChild(fragment);

      // Activate particles after a brief delay
      requestAnimationFrame(() => {
        this.particles.forEach(p => p.classList.add('active'));
      });
    }
  };

  // ===== SCROLL ANIMATIONS =====
  const scrollAnimations = {
    observer: null,
    elements: [],

    /**
     * Initialize scroll animations
     */
    init: function() {
      this.setupObserver();
      this.observeElements();
      this.initParallax();
    },

    /**
     * Set up Intersection Observer
     */
    setupObserver: function() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: CONFIG.animationThreshold,
        rootMargin: CONFIG.animationRootMargin
      });
    },

    /**
     * Observe all animated elements
     */
    observeElements: function() {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        this.observer.observe(el);
        this.elements.push(el);
      });
    },

    /**
     * Animate element when visible
     */
    animateElement: function(element) {
      // Add stagger delay based on data attribute
      const stagger = element.dataset.stagger;
      if (stagger) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, parseInt(stagger, 10));
      } else {
        element.classList.add('is-visible');
      }

      // Trigger counter animations within the element
      element.querySelectorAll('[data-count]').forEach(counter => {
        this.animateCounter(counter);
      });
    },

    /**
     * Animate counter element
     */
    animateCounter: function(element) {
      const target = parseInt(element.dataset.count, 10);
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out-expo
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeProgress * target);

        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(animate);
    },

    /**
     * Initialize parallax effects
     */
    initParallax: function() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');

      if (parallaxElements.length === 0) return;

      let ticking = false;

      const updateParallax = () => {
        const scrollY = window.pageYOffset;

        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const yPos = scrollY * speed;
          el.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  };

  // ===== MICRO INTERACTIONS =====
  const microInteractions = {
    /**
     * Initialize micro interactions
     */
    init: function() {
      this.initTiltEffect();
      this.initMagneticButtons();
      this.initRippleEffect();
      this.initCursorFollower();
    },

    /**
     * Tilt effect for cards
     */
    initTiltEffect: function() {
      const cards = document.querySelectorAll('.type-card, .feature-card');

      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
        card.addEventListener('mouseleave', () => this.resetTilt(card));
      });
    },

    /**
     * Handle tilt effect
     */
    handleTilt: function(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    },

    /**
     * Reset tilt effect
     */
    resetTilt: function(card) {
      card.style.transform = '';
    },

    /**
     * Magnetic button effect
     */
    initMagneticButtons: function() {
      const buttons = document.querySelectorAll('.btn, .nav-cta');

      buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => this.handleMagnetic(e, button));
        button.addEventListener('mouseleave', () => this.resetMagnetic(button));
      });
    },

    /**
     * Handle magnetic effect
     */
    handleMagnetic: function(e, button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    },

    /**
     * Reset magnetic effect
     */
    resetMagnetic: function(button) {
      button.style.transform = '';
    },

    /**
     * Ripple effect for buttons
     */
    initRippleEffect: function() {
      document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn');
        if (!button || button.classList.contains('loading')) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          left: ${x}px;
          top: ${y}px;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        // Animate ripple
        ripple.animate([
          {
            width: '0px',
            height: '0px',
            opacity: 1
          },
          {
            width: '300px',
            height: '300px',
            opacity: 0
          }
        ], {
          duration: 600,
          easing: 'ease-out'
        }).onfinish = () => ripple.remove();
      });
    },

    /**
     * Custom cursor follower (optional)
     */
    initCursorFollower: function() {
      // Only on non-touch devices
      if ('ontouchstart' in window) return;

      const follower = document.createElement('div');
      follower.className = 'cursor-follower';
      follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #00f5d4;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s, transform 0.1s;
        mix-blend-mode: difference;
      `;

      document.body.appendChild(follower);

      let mouseX = 0;
      let mouseY = 0;
      let followerX = 0;
      let followerY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        follower.style.opacity = '1';
      });

      document.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
      });

      const animate = () => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        follower.style.left = `${followerX - 10}px`;
        follower.style.top = `${followerY - 10}px`;

        requestAnimationFrame(animate);
      };

      animate();
    }
  };

  // ===== PAGE TRANSITIONS =====
  const pageTransitions = {
    /**
     * Initialize page transitions
     */
    init: function() {
      this.initLeaveTransition();
    },

    /**
     * Initialize leave transition
     */
    initLeaveTransition: function() {
      const links = document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');

      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');

          // Skip if external or special links
          if (href.startsWith('http') && !href.includes(window.location.host)) {
            return;
          }

          e.preventDefault();

          // Add exit animation
          document.body.classList.add('page-exit');

          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      });
    }
  };

  // ===== INITIALIZE =====
  const animations = {
    /**
     * Initialize all animation modules
     */
    init: function() {
      // Wait for DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.boot());
      } else {
        this.boot();
      }
    },

    boot: function() {
      particles.init();
      scrollAnimations.init();
      microInteractions.init();
      pageTransitions.init();

      console.log('Animations initialized');
    }
  };

  // Start animations
  animations.init();

})();
