// scripts/build-curriculum.js
const fs = require('fs');
const path = require('path');
const rawData = require('../data/games.json');

const curriculum = rawData.map(item => {
  return {
    ...item,
    moduleUrl: `/module.html?id=${item.id}`,
    lessonUrl: `/module.html?id=${item.id}`,
    playerUrl: `/module.html?id=${item.id}`
  };
});

// 1. Write curriculum.json to data, root, and assets
fs.writeFileSync(path.join(__dirname, '../data/curriculum.json'), JSON.stringify(curriculum, null, 2));
fs.writeFileSync(path.join(__dirname, '../curriculum.json'), JSON.stringify(curriculum, null, 2));

const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(path.join(assetsDir, 'curriculum.json'), JSON.stringify(curriculum, null, 2));

// 2. Synchronize to public directory (so both Root Directory = '.' and Root Directory = 'public' work on Vercel)
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'curriculum.json'), JSON.stringify(curriculum, null, 2));

// Copy HTML files to public
const filesToSync = ['index.html', 'module.html', 'player.html', 'calculator.html', '404.html'];
filesToSync.forEach(f => {
  const src = path.join(__dirname, '..', f);
  const dest = path.join(publicDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Sync assets & players to public if needed
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath) || fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

copyDirSync(path.join(__dirname, '../assets'), path.join(publicDir, 'assets'));
copyDirSync(path.join(__dirname, '../players'), path.join(publicDir, 'players'));

console.log('Successfully synchronized curriculum and HTML files across root and public directories.');
