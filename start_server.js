const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
};

const server = http.createServer((request, response) => {
    console.log(`request ${request.url}`);

    let filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Handle the /ni18/ prefix if present (stripping it for local serve)
    if (filePath.startsWith('./ni18/')) {
        filePath = '.' + request.url.substring(5);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(404);
                response.end('404 Not Found');
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`To stop the server, press Ctrl+C`);
});
