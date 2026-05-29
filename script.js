document.addEventListener('DOMContentLoaded', () => {
    // Determine base path logic from before (simplified)
    const isGithubPages = window.location.pathname.startsWith('/ni18/');
    let basePath = '';
    if (isGithubPages) {
        basePath = '/ni18';
    } else {
        basePath = '';
    }

    /* 
       Dynamic Loading Logic
    */
    // Initialize UI components directly since they are now statically injected
    initNavbar();
    initFooter();
    highlightActiveLink();


    // --- UI Initialization Logic ---

    function initNavbar() {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIconOpen = document.getElementById('menuIconOpen');
        const menuIconClose = document.getElementById('menuIconClose');

        if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
            mobileMenuButton.addEventListener('click', () => {
                const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                mobileMenuButton.setAttribute('aria-expanded', !expanded);
                mobileMenu.classList.toggle('hidden');
                menuIconOpen.classList.toggle('hidden');
                menuIconClose.classList.toggle('hidden');
            });

            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.add('hidden');
                    menuIconOpen.classList.remove('hidden');
                    menuIconClose.classList.add('hidden');
                });
            });
        }

        // Navbar scroll effect
        // We attach the scroll listener to window, but we need to query navbar inside it or here.
        const navbar = document.getElementById('mainNavbar');
        window.addEventListener('scroll', () => {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            }
        });
    }

    function initFooter() {
        // Update current year
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // Back to Top Button
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Add scroll listener for back to top
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    backToTopBtn.style.opacity = "1";
                    backToTopBtn.style.visibility = "visible";
                } else {
                    backToTopBtn.style.opacity = "0";
                    backToTopBtn.style.visibility = "hidden";
                }
            });
        }
    }

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
                // Apply Material 3 Tonal container active styling
                link.classList.remove('text-on-surface-variant', 'hover:bg-primary/5', 'hover:text-primary');
                link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-semibold');
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