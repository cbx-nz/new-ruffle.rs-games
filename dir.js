// server.js – Express server with automatic directory listings
// -------------------------------------------------------------
// If a request targets a folder **and** that folder has no index.html, we
// return a simple HTML directory listing instead of the 404 page.

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app  = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

// 1) Serve static assets from /public
app.use(express.static(PUBLIC));

// 2) Directory‑listing middleware (runs *after* express.static)
app.use(async (req, res, next) => {
  try {
    // Map the URL path to the filesystem path inside /public
    const localPath = path.join(PUBLIC, decodeURIComponent(req.path));
    const stat = await fs.promises.stat(localPath);

    if (stat.isDirectory()) {
      const indexPath = path.join(localPath, 'index.html');
      const hasIndex  = fs.existsSync(indexPath);

      if (!hasIndex) {
        const entries = await fs.promises.readdir(localPath, { withFileTypes: true });
        const list = entries
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(dirent => {
            const slash = dirent.isDirectory() ? '/' : '';
            const href  = path.posix.join(req.path, dirent.name) + slash;
            return `<li><a href="${href}">${dirent.name}${slash}</a></li>`;
          })
          .join('\n');

        res.type('html').send(`<!DOCTYPE html>
          <html><head><meta charset="utf-8"><title>Index of ${req.path}</title>
          <style>body{font-family:system-ui,sans-serif;padding:1rem;}a{text-decoration:none;color:#0366d6}</style>
          </head><body><h1>Index of ${req.path}</h1><ul>${list}</ul></body></html>`);
        return; // do NOT fall through to 404
      }
    }
  } catch (_) {
    /* ignore and fall through to 404 */
  }
  next();
});

// 3) Catch‑all 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC, '404.html'));
});

// 4) Start server and open browser
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  exec(`start http://localhost:${PORT}`); // Windows: open default browser
});