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
        const navLinks = document.querySelectorAll('nav a'); // targets specific structure

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Logic to match current page
            // If href is "index.html" and we are at "/", match it.
            if (!href) return;

            let isActive = false;

            if (href === currentPath) isActive = true;
            if (currentPath.endsWith('/') && href === 'index.html') isActive = true;
            if (currentPath.endsWith(href)) isActive = true;

            if (isActive) {
                // Add active styles (Tailwind: often simplified text color or background)
                // The header HTML uses specific classes for active state? 
                // It seems to hardcode 'text-gray-300' for inactive.
                // Let's add 'bg-gray-900' and 'text-white' for active.
                link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
                link.classList.add('bg-gray-900', 'text-white');
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