document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that should be animated on scroll
    const animatedElements = document.querySelectorAll('.reset-anim');

    // Create an Intersection Observer
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element comes into view
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the animation
                entry.target.classList.add('visible');
                // Optional: Stop observing once the animation has triggered
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe each element
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
