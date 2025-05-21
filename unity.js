const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const expressStaticGzip = require('express-static-gzip');

const app = express();
const PORT = 3000;

// Serve Unity assets with Brotli/Gzip support from /assets
app.use(
  '/assets',
  expressStaticGzip(path.join(__dirname, 'public', 'assets'), {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders(res, filePath) {
      if (filePath.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.data')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
  })
);

// Serve all other static files (HTML, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all for 404s
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  exec(`start http://localhost:${PORT}`);
});