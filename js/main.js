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
    
    // Toggle between hamburger and X icons
    if (sidebar.classList.contains('active')) {
      hamburgerIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      hamburgerIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
    
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
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
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
  
  // ----- Smooth Scrolling for Navigation Links -----
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
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
    const carousels = document.querySelectorAll('.carousel');
    let globalAutoSlideInterval;
    
    function startGlobalAutoSlide() {
      globalAutoSlideInterval = setInterval(() => {
        carousels.forEach(carousel => {
          const nextBtn = carousel.querySelector('.next');
          if (nextBtn) nextBtn.click();
        });
      }, 2500);
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

      function updateCarousel() {
        // Remove active class from all items and indicators
        items.forEach(item => {
          item.classList.remove('active', 'prev');
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current item and indicator
        items[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');

        // Add prev class to previous item
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        items[prevIndex].classList.add('prev');
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      }

      // Add click event listeners
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          stopGlobalAutoSlide();
          startGlobalAutoSlide();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          stopGlobalAutoSlide();
          startGlobalAutoSlide();
        });
      }
      
      // Add click event listeners to indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
          stopGlobalAutoSlide();
          startGlobalAutoSlide();
        });
      });

      // Pause auto-slide when hovering over any carousel
      carousel.addEventListener('mouseenter', stopGlobalAutoSlide);
      carousel.addEventListener('mouseleave', startGlobalAutoSlide);

      // Initialize carousel
      updateCarousel();
    });

    // Start global auto-slide
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