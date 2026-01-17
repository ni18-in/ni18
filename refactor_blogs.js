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

    // 1. Remove Bootstrap CSS
    content = content.replace(/<link.*bootstrap.*?>/g, '');

    // 2. Remove old custom style.css link if present (or update it, but we are moving to tailwind)
    // We might keep it if it has custom article specific styles, but main layout is Tailwind.
    // Let's remove the global style.css link as it might conflict or be redundant.
    content = content.replace(/<link.*style\.css.*?>/g, '');


    // 3. Inject Tailwind and Config
    const headInjection = `
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
    <script src="../tailwind_config.js"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
    `;

    if (!content.includes('cdn.tailwindcss.com')) {
        content = content.replace('</head>', headInjection + '\n</head>');
    }

    // 4. Clean up Body
    // Replace old Navbar
    content = content.replace(/<nav id="mainNavbar"[\s\S]*?<\/nav>/, '<div id="navbar-placeholder"></div>');
    // Also check for older bootstrap navs if any
    content = content.replace(/<nav class="navbar[\s\S]*?<\/nav>/, '<div id="navbar-placeholder"></div>');

    // Replace Footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, '<div id="footer-placeholder"></div>');

    // 5. Add Script
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '    <script src="../script.js"></script>\n</body>');
    }
    // Fix existing bad connection
    content = content.replace(/\/ni18\/script.js/g, '../script.js');

    // 6. SEO Tags
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

    // 7. Ensure body has cleaner classes if needed
    // remove bootstrap classes from body if any
    // content = content.replace(/<body class=".*?">/, '<body class="bg-gray-50 text-gray-800 antialiased">'); 
    // ^ This is risky if simpler replace matches partially. better to just add class if missing.

    if (content.includes('<body>')) {
        content = content.replace('<body>', '<body class="bg-gray-50 text-gray-800 antialiased">');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
