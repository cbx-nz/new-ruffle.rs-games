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

fs.writeFileSync(path.join(__dirname, '../data/curriculum.json'), JSON.stringify(curriculum, null, 2));
fs.writeFileSync(path.join(__dirname, '../curriculum.json'), JSON.stringify(curriculum, null, 2));

const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(path.join(assetsDir, 'curriculum.json'), JSON.stringify(curriculum, null, 2));

console.log('Successfully generated curriculum.json in data, root, and assets.');
