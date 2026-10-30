// server.js - Local Express Development Server (Matching Vercel Serverless Behavior)
const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3015;
const ROOT_DIR = __dirname;

// 1. Correct MIME types and encodings for Flash & WebAssembly
app.use((req, res, next) => {
  if (req.path.endsWith('.wasm')) {
    res.setHeader('Content-Type', 'application/wasm');
  } else if (req.path.endsWith('.swf')) {
    res.setHeader('Content-Type', 'application/x-shockwave-flash');
  } else if (req.path.endsWith('.br')) {
    res.setHeader('Content-Encoding', 'br');
  } else if (req.path.endsWith('.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
  }
  next();
});

// 2. Interceptor-Safe Academic APIs (Vercel Serverless Functions mounted locally)
app.all('/api/curriculum', require('./api/curriculum'));
app.all('/api/modules', require('./api/curriculum'));
app.all('/api/module', require('./api/module'));

// Legacy API aliases
app.all('/api/games', require('./api/curriculum'));
app.all('/api/game', require('./api/module'));
app.all('/api/random', (req, res, next) => {
  req.query.random = 'true';
  return require('./api/curriculum')(req, res, next);
});

// 3. Dynamic rewrites matching vercel.json
app.get(['/module/:id', '/lesson/:id', '/lab/:id', '/play/:id', '/game/:id'], (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'module.html'));
});

app.get('/calc', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'calculator.html'));
});

// 4. Serve static files from root directory
app.use(express.static(ROOT_DIR));

// 5. Catch-all route for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

// 6. Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`- Academic API at http://localhost:${PORT}/api/curriculum`);
    console.log(`- Static JSON fallback at http://localhost:${PORT}/assets/curriculum.json`);
    console.log(`- Universal module player at http://localhost:${PORT}/module.html?id=bloonstd`);
  });
}

module.exports = app;
