document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.querySelector('.modal-content');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let isDesktop = window.innerWidth > 768;

    // Panning variables
    let isPanning = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    let touchStartX, touchStartY;
    let initialPinchDistance = 0;
    let currentPinchDistance = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let clickStartTime = 0;
    let clickMoved = false;
    let swipeStartX = 0;
    let swipeEndX = 0;

    // Update isDesktop on window resize
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
    });

    // Function to reset transform
    const resetTransform = () => {
        translateX = 0;
        translateY = 0;
        scale = 1;
        updateImageTransform();
    };

    // Function to open the modal
    const openModal = (imgSrc, index) => {
        currentImageIndex = index;
        modalImage.src = imgSrc;
        modal.classList.add('show');
        resetTransform();
        
        // Wait for image to load before centering
        modalImage.onload = () => {
            resetTransform();
        };
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('show');
        resetTransform();
    };

    // Function to update image transform
    const updateImageTransform = () => {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    // Function to navigate to next/previous image
    const navigateImage = (direction) => {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < galleryItems.length) {
            const img = galleryItems[newIndex].querySelector('img');
            openModal(img.src, newIndex);
        }
    };

    // Function to calculate distance between two touch points
    const getDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Mouse events for panning and closing
    modalContent.addEventListener('mousedown', (e) => {
        if (e.target === modalImage) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
            clickStartTime = Date.now();
            clickMoved = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Check if the mouse has moved significantly
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                clickMoved = true;
            }

            translateX = deltaX;
            translateY = deltaY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isPanning) {
            isPanning = false;
            modalImage.style.cursor = 'grab';
            
            const clickEndTime = Date.now();
            const clickDuration = clickEndTime - clickStartTime;

            // If the click was short and didn't move much, close the modal
            if (clickDuration < 300 && !clickMoved && e.target === modalImage) {
                closeModal();
            }
        }
    });

    // Touch events for swipe navigation
    modalContent.addEventListener('touchstart', (e) => {
        if (e.target === modalImage) {
            swipeStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
            touchMoved = false;
        }
    });

    modalContent.addEventListener('touchmove', (e) => {
        if (e.target === modalImage) {
            swipeEndX = e.touches[0].clientX;
            const deltaX = swipeEndX - swipeStartX;
            
            // Check if the touch has moved significantly
            if (Math.abs(deltaX) > 5) {
                touchMoved = true;
            }
        }
    });

    modalContent.addEventListener('touchend', (e) => {
        if (e.target === modalImage) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const swipeDistance = swipeEndX - swipeStartX;

            // If the touch was short and moved significantly, navigate
            if (touchDuration < 300 && touchMoved) {
                if (swipeDistance > 50) {
                    // Swipe right - go to previous
                    navigateImage(-1);
                } else if (swipeDistance < -50) {
                    // Swipe left - go to next
                    navigateImage(1);
                }
            }
        }
    });

    // Mouse wheel for zooming
    modalContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY;
        const zoomFactor = 0.1;
        
        if (delta < 0) {
            // Zoom in
            scale = Math.min(scale + zoomFactor, 3);
        } else {
            // Zoom out
            scale = Math.max(scale - zoomFactor, 0.5);
        }
        
        updateImageTransform();
    });

    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            openModal(img.src, index);
        });
    });

    // Navigation arrow click events
    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });

    // Event listeners to close the modal
    // Close when clicking anywhere on the screen in desktop view
    modal.addEventListener('click', (e) => {
        if (isDesktop) {
            // Don't close if clicking on navigation arrows
            if (e.target === prevArrow || e.target === nextArrow || 
                e.target.closest('.nav-arrow')) {
                return;
            }
            closeModal();
        } else if (e.target === modal) {
            // On mobile, only close when clicking the background
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        } else if (e.key === 'ArrowLeft' && modal.classList.contains('show')) {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight' && modal.classList.contains('show')) {
            navigateImage(1);
        }
    });
}); 