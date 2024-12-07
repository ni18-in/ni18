document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Form validation for contact page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;

            if (!email || !name) {
                e.preventDefault();
                alert('Please fill all required fields');
            }
        });
    }

    // Performance tracking
    window.addEventListener('load', () => {
        if (window.performance) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    });
});