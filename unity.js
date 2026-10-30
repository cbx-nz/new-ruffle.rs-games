// unity.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const expressStaticGzip = require('express-static-gzip');
const mime = require('mime');

const app = express();
const PORT = 3048;
const ROOT_DIR = __dirname;

/* ------------------------------------------------------------------ */
/* 1) If the URL already ends with .br or .gz, manually add encoding  */
/* ------------------------------------------------------------------ */
app.use((req, res, next) => {
  if (req.path.endsWith('.br')) {
    res.setHeader('Content-Encoding', 'br');
    res.setHeader('Content-Type', mime.getType(req.path.slice(0, -3)) || 'application/octet-stream');
  } else if (req.path.endsWith('.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', mime.getType(req.path.slice(0, -3)) || 'application/octet-stream');
  }
  next();
});

/* ------------------------------------------------------------------ */
/* 2) Serve everything under /assets with express-static-gzip          */
/* ------------------------------------------------------------------ */
app.use(
  '/assets',
  expressStaticGzip(path.join(ROOT_DIR, 'assets'), {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders(res, filePath) {
      if (filePath.endsWith('.wasm') || filePath.endsWith('.wasm.br') || filePath.endsWith('.wasm.gz')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
    }
  })
);

/* ------------------------------------------------------------------ */
/* 3) Everything else in root (HTML, CSS, images, /players pages)     */
/* ------------------------------------------------------------------ */
app.use(express.static(ROOT_DIR));

/* 4) Custom 404 ----------------------------------------------------- */
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

/* 5) Start ---------------------------------------------------------- */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    exec(`start http://localhost:${PORT}`);
  });
}

module.exports = app;
