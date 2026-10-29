// api/game.js - Vercel Serverless Function
const { getGameById, getAllGames } = require('../lib/games');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query || {};

  if (!id) {
    return res.status(400).json({ success: false, error: 'Module ID is required.' });
  }

  const game = getGameById(id);
  if (!game) {
    return res.status(404).json({ success: false, error: `Module '${id}' not found.` });
  }

  // Find related modules in the same category
  const related = getAllGames({ category: game.category })
    .filter(g => g.id !== game.id)
    .slice(0, 4)
    .map(g => ({
      id: g.id,
      title: g.title,
      mathTitle: g.mathTitle,
      courseCode: g.courseCode,
      category: g.category
    }));

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).json({
    success: true,
    game,
    related
  });
};
