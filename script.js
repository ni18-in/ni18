document.addEventListener('DOMContentLoaded', () => {
    // Dynamic navigation active route highlighting
    highlightActiveLink();
    initBackToTop();
    initFooterYear();

    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Normalize names to match pages accurately
            const pageName = currentPath.split('/').pop() || 'index.html';
            const linkPage = href.split('#')[0].split('/').pop();

            let isActive = false;

            if (linkPage === pageName) {
                isActive = true;
            } else if ((pageName === '' || pageName === 'ni18') && linkPage === 'index.html') {
                isActive = true;
            }

            if (isActive) {
                // Apply Material 3 BeerCSS active class
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Toggle visibility on scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    backToTopBtn.style.display = 'inline-flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });
        }
    }

    function initFooterYear() {
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // Performance tracking
    window.addEventListener('load', () => {
        if (window.performance) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    });
});