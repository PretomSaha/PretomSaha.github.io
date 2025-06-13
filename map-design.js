document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.querySelector('.modal-content');

    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');

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

    // Function to open the modal
    const openModal = (imgSrc) => {
        modalImage.src = imgSrc;
        modal.classList.add('show');
        // Reset transform when opening new image
        translateX = 0;
        translateY = 0;
        scale = 1;
        updateImageTransform();
    };

    // Function to close the modal
    const closeModal = () => {
        modal.classList.remove('show');
        // Reset transform when closing
        translateX = 0;
        translateY = 0;
        scale = 1;
        updateImageTransform();
    };

    // Function to update image transform
    const updateImageTransform = () => {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    // Function to calculate distance between two touch points
    const getDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Mouse events for panning
    modalContent.addEventListener('mousedown', (e) => {
        if (e.target === modalImage) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            modalImage.style.cursor = 'grab';
        }
    });

    // Touch events for mobile
    modalContent.addEventListener('touchstart', (e) => {
        if (e.target === modalImage) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            touchMoved = false;

            // Handle pinch zoom
            if (e.touches.length === 2) {
                initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
            }
        }
    });

    modalContent.addEventListener('touchmove', (e) => {
        if (e.target === modalImage) {
            e.preventDefault(); // Prevent scrolling while panning

            if (e.touches.length === 1) {
                // Panning
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                // Check if the touch has moved significantly
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    touchMoved = true;
                }

                translateX += deltaX;
                translateY += deltaY;
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                updateImageTransform();
            } else if (e.touches.length === 2) {
                // Pinch zoom
                currentPinchDistance = getDistance(e.touches[0], e.touches[1]);
                const pinchRatio = currentPinchDistance / initialPinchDistance;
                scale = Math.min(Math.max(scale * pinchRatio, 0.5), 3);
                initialPinchDistance = currentPinchDistance;
                updateImageTransform();
            }
        }
    });

    modalContent.addEventListener('touchend', (e) => {
        if (e.target === modalImage) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            // If the touch was short and didn't move much, close the modal
            if (touchDuration < 300 && !touchMoved) {
                closeModal();
            }

            touchStartX = null;
            touchStartY = null;
            initialPinchDistance = 0;
            currentPinchDistance = 0;
            touchMoved = false;
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
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            openModal(img.src);
        });
    });

    // Event listeners to close the modal
    // Close when clicking on the background
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}); 