document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // 🚀 Section Fade-in Animation on Scroll
    gsap.utils.toArray("section").forEach((section) => {
        gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 📱 Mobile Navbar Toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileNavbar = document.getElementById("mobile-navbar");

    mobileMenuButton.addEventListener("click", function () {
        if (mobileNavbar.classList.contains("active")) {
            gsap.to(mobileNavbar, { y: -20, opacity: 0, duration: 0.3 });
            mobileNavbar.classList.remove("active");
        } else {
            gsap.fromTo(mobileNavbar, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
            mobileNavbar.classList.add("active");
        }
    });

    // 🔼 Scroll-to-Top Button Logic
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    window.onscroll = function () {
        if (document.documentElement.scrollTop > 100) {
            gsap.to(scrollToTopBtn, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
        } else {
            gsap.to(scrollToTopBtn, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        }
    };

    // 🖱️ Smooth Scroll to Top
    scrollToTopBtn.addEventListener("click", function () {
        gsap.to(window, { scrollTo: { y: 0 }, duration: 1 });
    });

    // 🔹 Navbar Section Highlighting on Scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar ul li a");

    window.addEventListener("scroll", () => {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            if (link.getAttribute("href").substring(1) === currentSection) {
                gsap.to(link, { color: "#0073e6", fontWeight: "bold", duration: 0.3 });
            } else {
                gsap.to(link, { color: "#333", fontWeight: "normal", duration: 0.3 });
            }
        });
    });

    // 🎨 Micro-Interaction: Navbar Hover Effect
    navLinks.forEach((link) => {
        link.addEventListener("mouseover", function () {
            gsap.to(link, { scale: 1.1, color: "#0073e6", duration: 0.2 });
        });
        link.addEventListener("mouseout", function () {
            gsap.to(link, { scale: 1, color: "", duration: 0.2 });
        });
    });

    // 🎯 Scroll-to-Top Button Hover Effect
    scrollToTopBtn.addEventListener("mouseover", function () {
        gsap.to(scrollToTopBtn, { scale: 1.1, duration: 0.3 });
    });
    scrollToTopBtn.addEventListener("mouseout", function () {
        gsap.to(scrollToTopBtn, { scale: 1, duration: 0.3 });
    });
});









