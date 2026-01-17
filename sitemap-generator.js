const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ni18-in.github.io/ni18/';
const ROOT_DIR = __dirname;
const BLOGS_DIR = path.join(ROOT_DIR, 'blogs');

// Files to exclude
const EXCLUDES = ['google4f98659ea4f8d4fc.html', '404.html'];

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== '.git' && file !== 'components' && file !== 'images') {
                getAllHtmlFiles(filePath, fileList);
            }
        } else {
            if (path.extname(file) === '.html' && !EXCLUDES.includes(file)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

htmlFiles.forEach(file => {
    // Convert file path to URL
    let relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    let url = BASE_URL + relativePath;

    // Get last modified date
    const stats = fs.statSync(file);
    const lastMod = stats.mtime.toISOString().split('T')[0];

    sitemap += `
    <url>
        <loc>${url}</loc>
        <lastmod>${lastMod}</lastmod>
        <priority>${relativePath === 'index.html' ? '1.0' : '0.8'}</priority>
    </url>`;
});

sitemap += `
</urlset>`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemap);
console.log(`Sitemap generated with ${htmlFiles.length} URLs.`);
