const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');
const filesToProcess = [
    'index.html',
    'about.html',
    'blogs.html',
    'contact.html',
    'C-DAC-Center-Finder.html',
    'simple-javascript-compiler.html'
];

const headerPath = path.join(componentsDir, 'header.html');
const footerPath = path.join(componentsDir, 'footer.html');

try {
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    const footerContent = fs.readFileSync(footerPath, 'utf8');

    filesToProcess.forEach(file => {
        const filePath = path.join(rootDir, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Replace header placeholder
            if (content.includes('<div id="navbar-placeholder"></div>')) {
                content = content.replace('<div id="navbar-placeholder"></div>', headerContent);
                console.log(`Injected header into ${file}`);
            } else if (content.includes('<nav id="mainNavbar"')) {
                console.log(`Header already appears to be present in ${file}, skipping header injection.`);
            }

            // Replace footer placeholder
            if (content.includes('<div id="footer-placeholder"></div>')) {
                content = content.replace('<div id="footer-placeholder"></div>', footerContent);
                console.log(`Injected footer into ${file}`);
            } else if (content.includes('<footer')) {
                console.log(`Footer already appears to be present in ${file}, skipping footer injection.`);
            }

            fs.writeFileSync(filePath, content, 'utf8');
        } else {
            console.warn(`File not found: ${file}`);
        }
    });

    console.log('Build complete.');
} catch (err) {
    console.error('Error during build:', err);
}
