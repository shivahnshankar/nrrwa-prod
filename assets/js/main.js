// NRRWA Website JavaScript

// ============================================
// Theme Toggle (Dark/Light Mode)
// ============================================

// Initialize theme from localStorage or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Toggle theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme immediately (before DOMContentLoaded for no flash)
initializeTheme();

document.addEventListener('DOMContentLoaded', function () {
  // Theme Toggle Button
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Initialize Swiper if element exists
  const heroSwiper = document.querySelector('.hero-swiper');
  if (heroSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
    });
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // Stats Counter Animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const target = parseInt(statNumber.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            statNumber.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            statNumber.textContent = target;
          }
        };

        updateCounter();
        statsObserver.unobserve(statNumber);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const hasSubmenuItems = document.querySelectorAll('nav .has-submenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Handle submenu clicks on mobile
    hasSubmenuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('click', function (e) {
          // Only prevent default and toggle submenu on mobile when menu is visible
          const isMobile = window.innerWidth <= 768;
          const menuIsOpen = navMenu.classList.contains('active');

          if (isMobile && menuIsOpen) {
            e.preventDefault();
            e.stopPropagation();

            // Check if this item is currently active
            const wasActive = item.classList.contains('active');

            // Close other submenus
            hasSubmenuItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('active');
              }
            });

            // Toggle this submenu
            if (wasActive) {
              item.classList.remove('active');
            } else {
              item.classList.add('active');
            }
          }
        });
      }
    });

    // Close menu when clicking outside (only on mobile)
    document.addEventListener('click', function (e) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        // Also close all submenus
        hasSubmenuItems.forEach(item => {
          item.classList.remove('active');
        });
      }
    });

    // Prevent clicks inside nav menu from closing it (only on mobile)
    navMenu.addEventListener('click', function (e) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        e.stopPropagation();
      }
    });
  }

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ============================================
  // Scroll-Triggered Animations (Intersection Observer)
  // ============================================

  // Create intersection observer for scroll animations
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Optionally unobserve after animation (for performance)
        // animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element comes into view
  });

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .section-title, .stagger-animation, .cards-grid, .blog-grid'
  );

  animatedElements.forEach(el => {
    // Add animate-on-scroll class if not already present
    if (!el.classList.contains('animate-on-scroll') &&
      !el.classList.contains('stagger-animation')) {
      el.classList.add('animate-on-scroll', 'fade-in-up');
    }
    animationObserver.observe(el);
  });

  // Special handling for card grids - add stagger effect
  document.querySelectorAll('.cards-grid, .blog-grid').forEach(grid => {
    grid.classList.add('stagger-animation');
  });
});

// Lightbox functions
function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    lightbox.style.display = 'block';
    lightboxImg.src = imageSrc;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});
