const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blogsDir = path.join(rootDir, 'blogs');

// Root pages list (updated to lowercase)
const rootFiles = [
    'index.html',
    'about.html',
    'blogs.html',
    'contact.html',
    'c-dac-center-finder.html',
    'simple-javascript-compiler.html',
    'best-blogs.html'
];

function cleanTailwindAndAddCss(filePath, isBlog = false) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const relativeCssPath = isBlog ? '../style.css' : 'style.css';

    // Regex to match tailwind cdn script tag
    const tailwindCdnRegex = /<script\s+src="https:\/\/cdn\.tailwindcss\.com[^"]*"\s*><\/script>/gi;
    
    // Regex to match tailwind config script tag
    const tailwindConfigRegex = /<script\s+src="(\.\.\/)?tailwind_config\.js"\s*><\/script>/gi;

    let changed = false;

    if (tailwindCdnRegex.test(content) || tailwindConfigRegex.test(content)) {
        // Strip tailwind script tags
        content = content.replace(tailwindCdnRegex, '');
        content = content.replace(tailwindConfigRegex, '');
        
        console.log(`Stripped Tailwind from ${path.basename(filePath)}`);
        changed = true;
    }

    // Ensure script.js is loaded with defer
    const scriptJsRegex = /<script\s+src="(\.\.\/)?script\.js"(?!\s+defer)><\/script>/gi;
    if (scriptJsRegex.test(content)) {
        const relativeScriptPath = isBlog ? '../script.js' : 'script.js';
        content = content.replace(scriptJsRegex, `<script src="${relativeScriptPath}" defer></script>`);
        changed = true;
        console.log(`Added defer to script.js in ${path.basename(filePath)}`);
    }

    // Ensure style.css is linked
    const cssLink = `<link rel="stylesheet" href="${relativeCssPath}">`;
    if (!content.includes(cssLink) && !content.includes(`href="${relativeCssPath}"`)) {
        // Check if there is already a link tag in the head to insert before/after
        if (content.includes('</head>')) {
            content = content.replace('</head>', `    ${cssLink}\n</head>`);
            console.log(`Linked style.css in ${path.basename(filePath)}`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// 1. Process root pages
rootFiles.forEach(file => {
    cleanTailwindAndAddCss(path.join(rootDir, file), false);
});

// 2. Process blog pages
if (fs.existsSync(blogsDir)) {
    const blogFiles = fs.readdirSync(blogsDir).filter(file => path.extname(file) === '.html');
    blogFiles.forEach(file => {
        cleanTailwindAndAddCss(path.join(blogsDir, file), true);
    });
}

console.log('Tailwind removal complete.');
