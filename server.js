const http = require('http');
const path = require('path');
const fs = require('fs');
const open = require('open'); // Ensure this is correctly imported

const PORT = 3000;
const PUBLIC_FOLDER = path.join(__dirname, 'public');

// Create the server
const server = http.createServer((req, res) => {
  const filePath = path.join(PUBLIC_FOLDER, req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  // Define content types for various file extensions
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    case '.swf':
      contentType = 'application/x-shockwave-flash';
      break;
    default:
      contentType = 'application/octet-stream';
  }

  // Serve the file or handle errors
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_FOLDER, '404.html'), (error, notFoundContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(notFoundContent || '404 Not Found', 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});