// Enhanced Portfolio Interactive Features
// Main JavaScript file for smooth scrolling, active link highlighting and synchronized sidebar scrolling

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sidebar = document.querySelector('.sidebar');
  const contentContainer = document.querySelector('.content-container');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const backToTopButton = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const navContainer = document.querySelector('.nav');
  const sections = document.querySelectorAll('.section');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  // Variables for scroll optimization
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollTop = 0;
  
  // Function to update active section
  function updateActiveSection() {
    const scrollPosition = contentContainer.scrollTop;
    let currentSection = null;
    let closestSection = null;
    let closestDistance = Infinity;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200; // Increased offset for earlier activation
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      // Special handling for About section (top of page)
      if (section.id === 'about') {
        if (scrollPosition < 200) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      // Special handling for References section (bottom of page)
      else if (section.id === 'references') {
        if (scrollPosition >= sectionTop - 100) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      // Regular sections
      else {
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      }
      
      // Find closest section for fallback
      const distance = Math.abs(scrollPosition - sectionTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });
    
    // Fallback to closest section if no section is in view
    if (!currentSection) {
      currentSection = closestSection;
      if (currentSection) {
        currentSection.classList.add('active');
      }
    }
    
    // Update navigation links with smooth scrolling
    if (currentSection) {
      const currentSectionId = currentSection.getAttribute('id');
      navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === currentSectionId) {
          link.classList.add('active');
          
          // Smoothly scroll the sidebar to keep the active link visible
          const linkEffectiveOffset = link.offsetTop - navContainer.offsetTop;
          const navScrollPosition = linkEffectiveOffset - (navContainer.clientHeight / 2) + (link.offsetHeight / 2);
          
          // Use requestAnimationFrame for smoother scrolling
          requestAnimationFrame(() => {
            navContainer.scrollTo({
              top: Math.max(0, navScrollPosition),
              behavior: 'smooth'
            });
          });
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  // Add scroll event listener to content container with improved performance
  contentContainer.addEventListener('scroll', function() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        isScrolling = false;
      });
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateActiveSection();
    }, 50); // Reduced timeout for more responsive updates

    // Back to top button visibility
    if (contentContainer.scrollTop > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Initialize active section on load
  updateActiveSection();
  
  // Initialize the carousel if it exists
  initCarousel();
  
  // ----- Mobile Navigation Toggle -----
  mobileNavToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    this.classList.toggle('active');
    this.setAttribute('aria-expanded', sidebar.classList.contains('active'));
  });
  
  // Only close when clicking the toggle button or a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        mobileNavToggle.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Set smooth scroll to target within contentContainer
        contentContainer.scrollTo({
          top: targetSection.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ----- Back to Top Button -----
  backToTopButton.addEventListener('click', function() {
    contentContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ----- Carousel Functionality -----
  function initCarousel() {
    const carousels = document.querySelectorAll('.carousel, .drawing-carousel');
    let globalAutoSlideInterval;
    
    function startGlobalAutoSlide() {
      globalAutoSlideInterval = setInterval(() => {
        carousels.forEach(carousel => {
          const nextBtn = carousel.querySelector('.next');
          if (nextBtn) nextBtn.click();
        });
      }, 5000); // Increased to 5 seconds for better viewing
    }

    function stopGlobalAutoSlide() {
      clearInterval(globalAutoSlideInterval);
    }

    carousels.forEach(carousel => {
      const items = carousel.querySelectorAll('.carousel-item');
      const indicators = carousel.querySelectorAll('.indicator');
      const prevBtn = carousel.querySelector('.prev');
      const nextBtn = carousel.querySelector('.next');
      let currentIndex = 0;
      const totalItems = items.length;
      let isTransitioning = false;

      function updateCarousel() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Remove active class from all items and indicators
        items.forEach(item => {
          item.classList.remove('active');
          item.classList.remove('prev');
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current item and indicator
        items[currentIndex].classList.add('active');
        if (indicators[currentIndex]) {
          indicators[currentIndex].classList.add('active');
        }

        // Add prev class to previous item for smooth transition
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        items[prevIndex].classList.add('prev');

        // Reset transition flag after animation
        setTimeout(() => {
          isTransitioning = false;
        }, 600); // Match this with CSS transition duration
      }

      function nextSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }

      function prevSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      }

      // Event listeners for controls
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);

      // Event listeners for indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          if (isTransitioning) return;
          currentIndex = index;
          updateCarousel();
        });
      });

      // Touch events for mobile swipe
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
          nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          prevSlide();
        }
      }

      // Pause auto-slide on hover/touch
      carousel.addEventListener('mouseenter', stopGlobalAutoSlide);
      carousel.addEventListener('mouseleave', startGlobalAutoSlide);
      carousel.addEventListener('touchstart', stopGlobalAutoSlide, { passive: true });
      carousel.addEventListener('touchend', startGlobalAutoSlide, { passive: true });
    });

    // Start auto-slide
    startGlobalAutoSlide();
  }

  // ----- Intersection Observer for Animations -----
  // Create an observer for fade-in effects when scrolling
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
  };
  
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  
  // Apply the animation to all section content elements
  const sectionContents = document.querySelectorAll('.section-content > div');
  sectionContents.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    appearOnScroll.observe(item);
  });
});

// Initialize GSAP ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

// Enhanced smooth scrolling for navigation links with GSAP
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      // Add active class to clicked link
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Smooth scroll with GSAP
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: targetSection,
          offsetY: 70,
          autoKill: false
        },
        ease: "power2.inOut"
      });
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        if (sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          mobileNavToggle.classList.remove('active');
        }
      }
    }
  });
});

// Update active section on scroll with GSAP
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links with GSAP
        document.querySelectorAll('.nav-link').forEach(link => {
          gsap.to(link, {
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => link.classList.remove('active')
          });
        });
        
        // Add active class to current section's link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          gsap.to(activeLink, {
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => activeLink.classList.add('active')
          });
        }
        
        // Add active class to section with GSAP
        sections.forEach(s => {
          gsap.to(s, {
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => s.classList.remove('active')
          });
        });
        
        gsap.to(section, {
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => section.classList.add('active')
        });
      }
    });
  }, 50);
});

// Initialize GSAP animations for sections
gsap.utils.toArray('.section').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none reverse"
    }
  });
});

// Smooth scroll for back to top button
document.getElementById('backToTop').addEventListener('click', function() {
  gsap.to(window, {
    duration: 1.5,
    scrollTo: {
      y: 0,
      autoKill: false
    },
    ease: "power2.inOut"
  });
});