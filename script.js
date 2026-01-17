document.addEventListener('DOMContentLoaded', () => {
    // Determine base path
    // If on GitHub Pages, path starts with /ni18/
    // If local, it might be root / or something else.
    // We check if the pathname starts with /ni18/
    const isGithubPages = window.location.pathname.startsWith('/ni18/');
    // For local development, if we are at root, basePath is empty.
    // If we are in specific subfolders, we might need adjustments, but absolute path from root is best if server is running.
    // A safer bet involves checking the current location.

    let basePath = '';
    if (isGithubPages) {
        basePath = '/ni18';
    } else {
        // Local development adjustments
        // If we are opening via file://, fetch won't work at all usually.
        // If localhost, usually root is the project folder.
        basePath = '';
    }

    // Heuristic: Check if we are in a subdirectory like '/blogs/' and adjust if using relative paths?
    // No, absolute paths relative to domain are better.
    // But local servers sometimes serve directories.
    // Let's try to detect the relative distance to root.

    function getPath(path) {
        return `${basePath}${path}`;
    }

    /* 
       NOTE: If you are opening this file directly in your browser (file:// protocol),
       the Header and Footer WILL NOT load due to browser security settings (CORS).
       You must use a local server (like "Live Server" in VS Code).
    */

    function loadComponent(id, path) {
        // Try multiple paths if one fails? No, keep it simple first.
        // We will try to fetch relative to the current location if absolute fails?
        // Let's stick to the dynamic basePath logic which handles production vs local.

        /* FIX: If running locally at http://localhost:5500/index.html, basePath is ''. path is '/components/header.html'.
           If running at http://localhost:5500/ni18/index.html, basePath is '/ni18'.
        */

        // Improved Path Logic:
        // We can actually just check where 'style.css' is, or use a relative walk up.
        // But simpler:
        const cssLink = document.querySelector('link[href*="style.css"]');
        let relativeRoot = '';
        if (cssLink) {
            // styles.css is usually at root.
            // if href is "style.css", we are at root.
            // if href is "../style.css", we are one level down.
            const href = cssLink.getAttribute('href');
            if (href.indexOf('style.css') > -1) {
                relativeRoot = href.replace('style.css', '');
            }
        }

        const fullPath = relativeRoot + 'components/' + path;

        fetch(fullPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (id === 'navbar-placeholder') highlightActiveLink();
                if (id === 'footer-placeholder') document.getElementById('current-year').textContent = new Date().getFullYear();
            })
            .catch(error => {
                console.error(`Error loading ${path}:`, error);
                document.getElementById(id).innerHTML = `<div class="alert alert-warning">Failed to load ${path}. If using file://, please use a local server.</div>`;
            });
    }

    loadComponent('navbar-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');

    // Highlight Active Link
    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // loose matching
            if (link.getAttribute('href') === currentPath || (currentPath.endsWith('/') && link.getAttribute('href').endsWith('index.html'))) {
                link.classList.add('active');
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