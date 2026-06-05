/**
 * Neural Nexus - Main JavaScript
 * Production-ready, modular JavaScript for the Neural Nexus website
 */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    animationThreshold: 0.1,
    animationRootMargin: '0px 0px -50px 0px',
    scrollThrottleDelay: 100,
    mobileBreakpoint: 768
  };

  // ===== STATE =====
  const state = {
    isScrolled: false,
    isMobileMenuOpen: false,
    lastScrollPosition: 0
  };

  // ===== DOM ELEMENTS =====
  const elements = {
    nav: document.getElementById('mainNav'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    particles: document.getElementById('particles')
  };

  // ===== UTILITY FUNCTIONS =====
  const utils = {
    /**
     * Debounce function for performance optimization
     */
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function for scroll events
     */
    throttle: function(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Check if viewport is mobile
     */
    isMobile: function() {
      return window.innerWidth <= CONFIG.mobileBreakpoint;
    },

    /**
     * Generate random number in range
     */
    random: function(min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };

  // ===== NAVIGATION =====
  const navigation = {
    /**
     * Initialize navigation functionality
     */
    init: function() {
      this.bindEvents();
      this.handleScroll();
    },

    /**
     * Bind navigation event listeners
     */
    bindEvents: function() {
      // Mobile menu toggle
      elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());

      // Close menu on link click
      elements.navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMobileMenuOpen) {
          this.closeMobileMenu();
          elements.hamburger.focus();
        }
      });

      // Handle scroll for navbar
      window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), CONFIG.scrollThrottleDelay));

      // Handle resize
      window.addEventListener('resize', utils.debounce(() => this.handleResize(), 200));
    },

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu: function() {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      elements.hamburger.classList.toggle('is-active', state.isMobileMenuOpen);
      elements.navMenu.classList.toggle('is-open', state.isMobileMenuOpen);
      elements.hamburger.setAttribute('aria-expanded', state.isMobileMenuOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
    },

    /**
     * Close mobile menu
     */
    closeMobileMenu: function() {
      if (state.isMobileMenuOpen) {
        state.isMobileMenuOpen = false;
        elements.hamburger.classList.remove('is-active');
        elements.navMenu.classList.remove('is-open');
        elements.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    },

    /**
     * Handle scroll events
     */
    handleScroll: function() {
      const scrollPosition = window.pageYOffset;
      const shouldBeScrolled = scrollPosition > 50;

      if (shouldBeScrolled !== state.isScrolled) {
        state.isScrolled = shouldBeScrolled;
        elements.nav.classList.toggle('is-scrolled', state.isScrolled);
      }

      // Store last scroll position
      state.lastScrollPosition = scrollPosition;
    },

    /**
     * Handle resize events
     */
    handleResize: function() {
      // Close mobile menu on resize to desktop
      if (!utils.isMobile() && state.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  };

  // ===== SMOOTH SCROLL =====
  const smoothScroll = {
    /**
     * Initialize smooth scroll for anchor links
     */
    init: function() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => this.handleClick(e));
      });
    },

    /**
     * Handle anchor click
     */
    handleClick: function(e) {
      const href = e.currentTarget.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const navHeight = elements.nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  };

  // ===== FORM HANDLING =====
  const forms = {
    /**
     * Initialize form handling
     */
    init: function() {
      this.bindForms();
    },

    /**
     * Bind form event listeners
     */
    bindForms: function() {
      // Newsletter form
      const newsletterForm = document.getElementById('homeNewsletterForm');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
      }

      // Contact form
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
      }

      // Real-time validation
      document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    },

    /**
     * Handle newsletter form submission
     */
    handleNewsletterSubmit: async function(e) {
      e.preventDefault();

      const form = e.target;
      const emailInput = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      const formMessage = document.getElementById('homeFormMessage');

      if (!emailInput || !button) return;

      const email = emailInput.value;

      // Validate email
      if (!this.validateEmail(email)) {
        this.showFieldError(emailInput, 'Please enter a valid email address');
        return;
      }

      // Show loading state
      const originalText = button.textContent;
      button.classList.add('loading');
      button.disabled = true;

      try {
        // Send to server
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          // Show success message
          form.style.display = 'none';
          formMessage.classList.add('show');
        } else {
          throw new Error(data.message || 'Subscription failed');
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        this.showFieldError(emailInput, 'Something went wrong. Please try again.');
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = originalText;
      }
    },

    /**
     * Handle contact form submission
     */
    handleContactSubmit: async function(e) {
      e.preventDefault();

      const form = e.target;
      const button = form.querySelector('button[type="submit"]');
      const alertContainer = form.querySelector('.alert');

      // Validate all fields
      let isValid = true;
      form.querySelectorAll('.form-input').forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) return;

      // Show loading state
      const originalText = button.textContent;
      button.classList.add('loading');
      button.disabled = true;

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          // Show success message
          if (alertContainer) {
            alertContainer.className = 'alert alert-success';
            alertContainer.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            alertContainer.style.display = 'block';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Message failed to send');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        if (alertContainer) {
          alertContainer.className = 'alert alert-error';
          alertContainer.textContent = 'Something went wrong. Please try again.';
          alertContainer.style.display = 'block';
        }
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = originalText;
      }
    },

    /**
     * Validate email format
     */
    validateEmail: function(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    /**
     * Validate a single form field
     */
    validateField: function(input) {
      const value = input.value.trim();
      const parent = input.closest('.form-group');
      let isValid = true;
      let errorMessage = '';

      // Check required
      if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      }

      // Check email
      if (input.type === 'email' && value && !this.validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }

      // Update UI
      if (parent) {
        if (isValid) {
          parent.classList.remove('has-error');
          input.setAttribute('aria-invalid', 'false');
        } else {
          parent.classList.add('has-error');
          input.setAttribute('aria-invalid', 'true');
          const errorEl = parent.querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = errorMessage;
          }
        }
      }

      return isValid;
    },

    /**
     * Show field error
     */
    showFieldError: function(input, message) {
      const parent = input.closest('.form-group');
      if (parent) {
        parent.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        const errorEl = parent.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = message;
        }
      }
    },

    /**
     * Clear field error
     */
    clearError: function(input) {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        input.setAttribute('aria-invalid', 'false');
      }
    }
  };

  // ===== COUNTER ANIMATION =====
  const counterAnimation = {
    /**
     * Initialize counter animations
     */
    init: function() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounters(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('[data-count]').forEach(el => {
        this.observer.observe(el);
      });
    },

    /**
     * Animate counter elements
     */
    animateCounters: function(element) {
      const target = parseInt(element.dataset.count, 10);
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-expo)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeProgress * (target - start) + start);

        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // ===== ACCESSIBILITY =====
  const a11y = {
    /**
     * Initialize accessibility features
     */
    init: function() {
      this.handlePrefersReducedMotion();
      this.addSkipLinkListener();
    },

    /**
     * Handle prefers-reduced-motion
     */
    handlePrefersReducedMotion: function() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const handleChange = (e) => {
        document.body.classList.toggle('reduce-motion', e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      handleChange(mediaQuery);
    },

    /**
     * Add skip link listener
     */
    addSkipLinkListener: function() {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(skipLink.getAttribute('href'));
          if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        });
      }
    }
  };

  // ===== INITIALIZE =====
  const app = {
    /**
     * Initialize the application
     */
    init: function() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.boot());
      } else {
        this.boot();
      }
    },

    /**
     * Boot the application
     */
    boot: function() {
      // Initialize all modules
      navigation.init();
      smoothScroll.init();
      forms.init();
      counterAnimation.init();
      a11y.init();

      // Add loaded class for entrance animations
      document.body.classList.add('is-loaded');

      console.log('Neural Nexus initialized');
    }
  };

  // Start the application
  app.init();

})();
