const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blogsDir = path.join(rootDir, 'blogs');

// 1. Optimize contact.html: resolve duplicate HTML tags
function optimizeContact() {
    const contactPath = path.join(rootDir, 'contact.html');
    if (!fs.existsSync(contactPath)) return;

    let content = fs.readFileSync(contactPath, 'utf8');
    
    // Find the second <!DOCTYPE html> occurrence and slice from there
    const docTypeIndex = content.lastIndexOf('<!DOCTYPE html>');
    if (docTypeIndex > 0) {
        content = content.slice(docTypeIndex);
        fs.writeFileSync(contactPath, content, 'utf8');
        console.log('Optimized contact.html (removed duplicate pre-content block).');
    }
}

// 2. Process HTML files in root and blogs
function optimizeFile(filePath, isBlog = false) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // A. Clean up malformed image comments: e.g. <img src="..." <!-- Assumed path... --> ...>
    // Replace comment block within an img tag with clean spacing
    content = content.replace(/(<img[^>]*?)\s*<!--[\s\S]*?-->([^>]*?>)/gi, '$1 $2');

    // B. Fix double body tag if present (e.g. in javascript-roadmap.html)
    content = content.replace(/<body>\s*<body>/gi, '<body>');
    content = content.replace(/<body>\s*[\r\n]\s*<body>/gi, '<body>');

    // C. Standardize canonical links to lowercase
    content = content.replace(/<link rel="canonical" href="([^"]+)"/gi, (match, href) => {
        return `<link rel="canonical" href="${href.toLowerCase()}"`;
    });
    content = content.replace(/<meta property="og:url" content="([^"]+)"/gi, (match, href) => {
        return `<meta property="og:url" content="${href.toLowerCase()}"`;
    });
    content = content.replace(/<meta name="twitter:url" content="([^"]+)"/gi, (match, href) => {
        return `<meta name="twitter:url" content="${href.toLowerCase()}"`;
    });

    // D. Prune legacy inline scripts at the bottom of the files (e.g., Tailwind scripts)
    // We locate script blocks containing 'mobileMenuButton' or duplicate navigation controls
    content = content.replace(/<script>\s*(\/\/ Mobile menu toggle|\/\/\s*Update current year in footer)[\s\S]*?<\/script>/gi, '');

    // E. Ensure blog covers have alt tags and layout parameters
    if (isBlog) {
        // Fix empty alt or missing dimensions on ni18-cover.webp
        content = content.replace(
            /<img([^>]*?)src="[^"]*?ni18-cover\.webp"([^>]*?)>/gi,
            (match, p1, p2) => {
                let attrs = p1 + ' ' + p2;
                // Normalize spaces
                attrs = attrs.replace(/\s+/g, ' ').trim();
                
                // Set descriptive alt if empty or generic
                if (!attrs.includes('alt=') || attrs.includes('alt=""') || attrs.includes('alt="Cover image for')) {
                    const pageTitle = path.basename(filePath, '.html').replace(/-/g, ' ');
                    const descriptiveAlt = `Cover image for ${pageTitle} article`;
                    attrs = attrs.replace(/alt="[^"]*"/gi, '');
                    attrs += ` alt="${descriptiveAlt}"`;
                }
                
                // Add width/height/fetchpriority
                if (!attrs.includes('width=')) attrs += ' width="800"';
                if (!attrs.includes('height=')) attrs += ' height="400"';
                if (!attrs.includes('fetchpriority=')) attrs += ' fetchpriority="high"';
                
                return `<img src="../images/ni18-cover.webp" ${attrs}>`;
            }
        );
    }

    // F. Inject resource hints for root pages if not present
    if (!isBlog && !content.includes('href="https://cdn.jsdelivr.net"')) {
        const preconnectTags = `
    <!-- DNS Preconnect / Prefetch Hints -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
`;
        content = content.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/i, (match) => {
            return preconnectTags.trim() + '\n    ' + match;
        });
    }

    // G. Special Blogger preconnect and defer rules for blogs.html
    if (filePath.endsWith('blogs.html')) {
        if (!content.includes('href="https://blog.ni18.in"')) {
            const blogPreconnect = `
    <link rel="preconnect" href="https://blog.ni18.in" crossorigin>
`;
            content = content.replace(/<link rel="preconnect" href="https:\/\/cdn\.jsdelivr\.net"/i, (match) => {
                return blogPreconnect.trim() + '\n    ' + match;
            });
        }
        
        // Add defer to blogger JSON feed script
        content = content.replace(/src="https:\/\/blog\.ni18\.in\/feeds\/posts\/summary[^"]*"(?!\s+defer)/gi, '$& defer');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Optimized: ${path.basename(filePath)}`);
    }
}

try {
    // Run contact.html optimization first
    optimizeContact();

    // Optimize root HTML pages
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
        const filePath = path.join(rootDir, file);
        if (fs.existsSync(filePath)) {
            optimizeFile(filePath, false);
        }
    });

    // Optimize blogs
    if (fs.existsSync(blogsDir)) {
        const blogFiles = fs.readdirSync(blogsDir).filter(file => file.endsWith('.html'));
        blogFiles.forEach(file => {
            optimizeFile(path.join(blogsDir, file), true);
        });
    }

    console.log('Site optimization steps complete.');
} catch (err) {
    console.error('Error during optimization script run:', err);
}
