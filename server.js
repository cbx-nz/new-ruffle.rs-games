// server.js - Local Express Development Server (Matching Vercel Serverless Behavior)
const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3015;
const PUBLIC_DIR = path.join(__dirname, 'public');

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

// 2. Vercel Serverless Functions mounted locally
app.all('/api/games', require('./api/games'));
app.all('/api/game', require('./api/game'));
app.all('/api/random', require('./api/random'));

// 3. Dynamic rewrites matching vercel.json
app.get('/play/:id', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'player.html'));
});

app.get('/calc', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'calculator.html'));
});

// 4. Serve static files from "public"
app.use(express.static(PUBLIC_DIR));

// 5. Catch-all route for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

// 6. Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`- API available at http://localhost:${PORT}/api/games`);
    console.log(`- Universal player at http://localhost:${PORT}/player.html?id=bloonstd`);
  });
}

module.exports = app;
