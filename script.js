/* ==========================================================================
   NI18 — Global Scripts (framework-free)
   Replaces BeerCSS JS. Provides the global ui() drawer toggle plus
   navigation highlighting, drawer UX, sticky-header elevation,
   back-to-top button, and footer year.
   ========================================================================== */

/* Global UI helper — referenced by inline onclick="ui('#mobile-menu')".
   Toggles the `active` state on the target element (used by the nav drawer).
   Defined on window so it is available to inline handlers immediately. */
window.ui = function (selector) {
    if (!selector) return;
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveLink();
    initDrawer();
    initHeaderElevation();
    initBackToTop();
    initFooterYear();

    /* ---- Active route highlighting ---- */
    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        const pageName = currentPath.split('/').pop() || 'index.html';
        const isHome = pageName === '' || pageName === 'ni18';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const [pathPart, hashPart] = href.split('#');
            const linkPage = pathPart.split('/').pop();
            const linkHash = hashPart ? '#' + hashPart : '';

            const pageMatches = linkPage === pageName || (isHome && linkPage === 'index.html');

            // A link is active when its page matches AND, if it targets a hash
            // (e.g. index.html#services), that hash is the one currently shown.
            const isActive = pageMatches && (linkHash ? window.location.hash === linkHash : true);

            link.classList.toggle('active', isActive);
        });
    }

    /* ---- Navigation drawer UX ---- */
    function initDrawer() {
        const drawer = document.getElementById('mobile-menu');
        if (!drawer) return;

        const close = () => drawer.classList.remove('active');

        // Close after tapping any link inside the drawer.
        drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

        // Close on Escape.
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') close();
        });

        // Close the drawer if the viewport grows to desktop width.
        const desktop = window.matchMedia('(min-width: 992px)');
        const onChange = e => { if (e.matches) close(); };
        if (desktop.addEventListener) desktop.addEventListener('change', onChange);
        else if (desktop.addListener) desktop.addListener(onChange);
    }

    /* ---- Sticky header elevation on scroll ---- */
    function initHeaderElevation() {
        const header = document.querySelector('header.fixed.top');
        if (!header) return;
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Back-to-top button ---- */
    function initBackToTop() {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;

        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const toggle = () => { btn.style.display = window.scrollY > 300 ? 'inline-flex' : 'none'; };
        toggle();
        window.addEventListener('scroll', toggle, { passive: true });
    }

    /* ---- Footer year ---- */
    function initFooterYear() {
        const span = document.getElementById('currentYear');
        if (span) span.textContent = new Date().getFullYear();
    }
});
