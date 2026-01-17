const fs = require('fs');
const path = require('path');

const BLOGS_DIR = path.join(__dirname, 'blogs');

if (!fs.existsSync(BLOGS_DIR)) {
    console.error('Blogs directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(BLOGS_DIR);

files.forEach(file => {
    if (path.extname(file) !== '.html') return;

    const filePath = path.join(BLOGS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove <style>...</style> content but keep the tag to replace or just remove it.
    // Actually, we want to remove the specific styles we consolidated.
    // Simplest way: Remove all <style> tags content if it looks like the old CSS.
    // But to be safe, I will just append the new link and let the cascade handle it, 
    // OR aggressively remove the style block if it contains "var(--primary-color)".
    content = content.replace(/<style>[\s\S]*?var\(--primary-color\)[\s\S]*?<\/style>/, '');

    // 2. Add Link to CSS
    if (!content.includes('style.css')) {
        // Use relative path for blogs (one level deep)
        content = content.replace('</head>', '    <link href="../style.css" rel="stylesheet">\n</head>');
    }
    // Fix existing bad connection if pre-existing
    content = content.replace(/\/ni18\/style.css/g, '../style.css');

    // 3. Replace Navbar
    content = content.replace(/<nav id="mainNavbar"[\s\S]*?<\/nav>/, '<div id="navbar-placeholder"></div>');

    // 4. Replace Footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, '<div id="footer-placeholder"></div>');

    // 5. Add Script
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '    <script src="../script.js"></script>\n</body>');
    }
    // Fix existing bad connection
    content = content.replace(/\/ni18\/script.js/g, '../script.js');

    // 6. Add Canonical and OG Tags if missing (Basic version)
    // We parse title to reuse it.
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'NI18 Blog';

    const descMatch = content.match(/<meta name="description"\s+content="(.*?)"/);
    const description = descMatch ? descMatch[1] : 'Read this article on NI18.';

    const url = `https://ni18-in.github.io/ni18/blogs/${file}`;

    const seoTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://ni18-in.github.io/ni18/images/ni18.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="https://ni18-in.github.io/ni18/images/ni18.png">

    <link rel="canonical" href="${url}">
    `;

    if (!content.includes('og:type')) {
        content = content.replace('</title>', '</title>\n' + seoTags);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
