const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blogsDir = path.join(rootDir, 'blogs');

if (!fs.existsSync(blogsDir)) {
    console.error('Blogs directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(blogsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the head block
    const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
    if (!headMatch) return;
    
    let head = headMatch[1];
    
    // 1. Remove remixicon links
    head = head.replace(/<link[^>]*remixicon[^>]*>/gi, '');
    
    // 2. Remove tailwind script tags
    head = head.replace(/<script[^>]*tailwindcss[^>]*><\/script>/gi, '');
    head = head.replace(/<script[^>]*tailwind_config[^>]*><\/script>/gi, '');
    
    // 3. Remove all preconnect and google fonts links
    head = head.replace(/<link[^>]*preconnect[^>]*>/gi, '');
    head = head.replace(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*Outfit[^>]*>/gi, '');
    head = head.replace(/<link[^>]*fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined[^>]*>/gi, '');
    
    // 4. Remove all BeerCSS styles and scripts
    head = head.replace(/<link[^>]*beercss[^>]*>/gi, '');
    head = head.replace(/<script[^>]*beercss[^>]*><\/script>/gi, '');
    
    // 5. Remove style.css links
    head = head.replace(/<link[^>]*style\.css[^>]*>/gi, '');
    
    // 6. Remove meta theme-color if any
    head = head.replace(/<meta[^>]*theme-color[^>]*>/gi, '');
    
    // 7. Remove the redundant inline font-family styles
    head = head.replace(/<style>\s*body\s*\{\s*font-family:\s*'Roboto'[\s\S]*?<\/style>/gi, '');
    
    // Clean up empty lines from head
    head = head.replace(/^\s*[\r\n]/gm, '');
    
    // 8. Construct clean dependency block
    const cleanDeps = `
    <!-- DNS Preconnect / Prefetch Hints -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- Material Symbols Outlined icons -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">

    <!-- BeerCSS stylesheet and javascript module -->
    <link href="https://cdn.jsdelivr.net/npm/beercss@3.5.1/dist/cdn/beer.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/beercss@3.5.1/dist/cdn/beer.min.js" type="module"></script>

    <!-- Custom Styles -->
    <link rel="stylesheet" href="../style.css">
    
    <meta name="theme-color" content="#0f52ba">
    `;
    
    // Append at the end of head
    head = head.trim() + '\n' + cleanDeps.trim() + '\n';
    
    // Replace in content
    content = content.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n    ${head}</head>`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned head of ${file}`);
});

console.log('Head cleaning complete.');
