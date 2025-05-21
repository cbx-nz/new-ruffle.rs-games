// server.js
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const expressStaticGzip = require('express-static-gzip');
const mime = require('mime');

const app = express();
const PORT = 3000;

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
/*    (this covers Unity builds in public/assets/…)                    */
/* ------------------------------------------------------------------ */
app.use(
  '/assets',
  expressStaticGzip(path.join(__dirname, 'public', 'assets'), {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders(res, filePath) {
      // If we got here via express-static-gzip (i.e. the URL did *not* contain .gz/.br),
      // the lib already set Content-Encoding. We only need to ensure correct MIME.
      if (filePath.endsWith('.wasm') || filePath.endsWith('.wasm.br') || filePath.endsWith('.wasm.gz')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
    }
  })
);

/* ------------------------------------------------------------------ */
/* 3) Everything else in /public (HTML, CSS, images, /players pages)  */
/* ------------------------------------------------------------------ */
app.use(express.static(path.join(__dirname, 'public')));

/* 4) Custom 404 ----------------------------------------------------- */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

/* 5) Start ---------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  exec(`start http://localhost:${PORT}`);
});
