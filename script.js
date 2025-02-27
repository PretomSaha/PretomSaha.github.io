// script.js
// Updated JavaScript with GSAP
document.addEventListener('DOMContentLoaded', function () {
    // Initialize GSAP ScrollSmoother
    const smoother = ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNavbar = document.getElementById('mobile-navbar');

    mobileMenuButton.addEventListener('click', function () {
        mobileNavbar.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                smoother.scrollTo(target, true, "top top");

                if (mobileNavbar.classList.contains('active')) {
                    mobileNavbar.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                }
            }
        });
    });

    // Scroll-to-Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    ScrollTrigger.create({
        onUpdate: self => {
            self.direction === -1 ? scrollToTopBtn.classList.add('show') : scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        smoother.scrollTo(0, true);
    });

    // Add subtle animation to profile section
    gsap.from("#about", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out"
    });

    // Animate other sections
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => ScrollTrigger.refresh());

    // **Fixed Navbar on Scroll**
    const navbar = document.getElementById("navbar");
    navbar.classList.add("fixed-navbar");

    // **Highlight Active Section in Navbar**
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove("active"));

                // Find corresponding link and add active class
                const id = entry.target.getAttribute("id");
                const activeLink = document.querySelector(`a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, { threshold: 0.6 }); // Trigger when 60% of the section is in view

    sections.forEach(section => observer.observe(section));
});


document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollSmoother
    const smoother = ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNavbar = document.getElementById('mobile-navbar');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileNavbar.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                smoother.scrollTo(target, true, "top top");
                
                if (mobileNavbar.classList.contains('active')) {
                    mobileNavbar.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                }
            }
        });
    });

    // Scroll-to-Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    ScrollTrigger.create({
        onUpdate: self => {
            self.direction === -1 ? scrollToTopBtn.classList.add('show') : scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        smoother.scrollTo(0, true);
    });

    // Add subtle animation to profile section
    gsap.from("#about", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out"
    });

    // Animate other sections
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => ScrollTrigger.refresh());
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNavbar = document.getElementById('mobile-navbar');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileNavbar.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu after clicking link
                if (mobileNavbar.classList.contains('active')) {
                    mobileNavbar.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                }
            }
        });
    });

    // Scroll-to-Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollToTopBtn.style.display = 'block';
            setTimeout(() => {
                scrollToTopBtn.style.opacity = '1';
            }, 100);
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => {
                scrollToTopBtn.style.display = 'none';
            }, 300);
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Tooltip Interactions
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            this.querySelector('.tooltip-text').style.visibility = 'visible';
            this.querySelector('.tooltip-text').style.opacity = '1';
        });

        tooltip.addEventListener('mouseleave', function() {
            this.querySelector('.tooltip-text').style.visibility = 'hidden';
            this.querySelector('.tooltip-text').style.opacity = '0';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileNavbar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileNavbar.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        }
    });

    // Project Image Hover Effect
    document.querySelectorAll('.project-image').forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
            this.style.transition = 'transform 0.3s ease';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileNavbar.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        }
    });
});