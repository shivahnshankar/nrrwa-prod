// NRRWA Website JavaScript

// Hero Swiper Slider
document.addEventListener('DOMContentLoaded', function() {
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
    question.addEventListener('click', function() {
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
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Handle submenu clicks on mobile
    hasSubmenuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
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
    document.addEventListener('click', function(e) {
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
    navMenu.addEventListener('click', function(e) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        e.stopPropagation();
      }
    });
  }
  
  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});
