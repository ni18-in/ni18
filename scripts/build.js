const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');
const blogsDir = path.join(rootDir, 'blogs');

const headerPath = path.join(componentsDir, 'header.html');
const footerPath = path.join(componentsDir, 'footer.html');

let headerContent = '';
let footerContent = '';

// Helper to rewrite paths for nested files (depth > 0)
function adjustPaths(htmlContent, depth) {
    if (depth === 0) return htmlContent;
    const prefix = '../'.repeat(depth);
    
    // Regexp targets: local html files, logo images, custom scripts
    return htmlContent
        .replace(/href="(index\.html|about\.html|blogs\.html|contact\.html|c-dac-center-finder\.html|simple-javascript-compiler\.html|privacy-policy\.html|terms-of-service\.html)(#[a-zA-Z0-9_\-]+)?"/g, `href="${prefix}$1$2"`)
        .replace(/src="(images\/[^"]+|script\.js)"/g, `src="${prefix}$1"`);
}

function processFile(filePath, isBlog = false) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const depth = isBlog ? 1 : 0;
    
    const localHeader = adjustPaths(headerContent, depth);
    const localFooter = adjustPaths(footerContent, depth);

    let changed = false;

    // 1. Inject or replace Header
    if (content.includes('<div id="navbar-placeholder"></div>')) {
        content = content.replace('<div id="navbar-placeholder"></div>', localHeader);
        console.log(`Injected header placeholder in ${path.basename(filePath)}`);
        changed = true;
    } else if (content.includes('<nav id="mainNavbar"')) {
        // If navbar already exists, replace it with updated version
        content = content.replace(/<nav id="mainNavbar"[\s\S]*?<\/nav>/, localHeader);
        console.log(`Updated existing legacy header in ${path.basename(filePath)}`);
        changed = true;
    } else if (/(?:<!-- Top App Bar -->\s*)?<header class="fixed top[\s\S]*?<nav class="left drawer" id="mobile-menu">[\s\S]*?<\/nav>/.test(content)) {
        content = content.replace(/(?:<!-- Top App Bar -->\s*)?<header class="fixed top[\s\S]*?<nav class="left drawer" id="mobile-menu">[\s\S]*?<\/nav>/, localHeader);
        console.log(`Updated existing BeerCSS header in ${path.basename(filePath)}`);
        changed = true;
    }

    // 2. Inject or replace Footer
    if (content.includes('<div id="footer-placeholder"></div>')) {
        content = content.replace('<div id="footer-placeholder"></div>', localFooter);
        console.log(`Injected footer placeholder in ${path.basename(filePath)}`);
        changed = true;
    } else if (content.includes('<footer')) {
        // If footer already exists, replace it with updated version
        content = content.replace(/<footer[\s\S]*?<\/footer>/, localFooter);
        console.log(`Updated existing footer in ${path.basename(filePath)}`);
        changed = true;
    }

    // 3. Update Back to Top button if present in older files
    if (content.includes('backToTopBtn')) {
        // Let's strip any duplicated backToTopBtn outside the footer, since footer.html contains it
        content = content.replace(/<button[^>]*id="backToTopBtn"[\s\S]*?<\/button>/g, '');
        content = content.replace(/<!-- Back to Top (?:M3 Floating Action Button \(FAB\)|FAB) -->/gi, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

try {
    headerContent = fs.readFileSync(headerPath, 'utf8');
    footerContent = fs.readFileSync(footerPath, 'utf8');

    // 1. Process root pages
    const rootFiles = [
        'index.html',
        'about.html',
        'blogs.html',
        'contact.html',
        'c-dac-center-finder.html',
        'simple-javascript-compiler.html',
        'best-blogs.html'
    ];

    rootFiles.forEach(file => {
        processFile(path.join(rootDir, file), false);
    });

    // 2. Process blog pages dynamically
    if (fs.existsSync(blogsDir)) {
        const blogFiles = fs.readdirSync(blogsDir).filter(file => path.extname(file) === '.html');
        blogFiles.forEach(file => {
            processFile(path.join(blogsDir, file), true);
        });
    }

    console.log('Build complete.');
} catch (err) {
    console.error('Error during build:', err);
}
