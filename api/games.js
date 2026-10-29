// api/games.js - Vercel Serverless Function
const { getAllGames, getGameById, getRandomGame, getCategories, toHtmlDatalistOptions } = require('../lib/games');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id, q, category, type, disguise, format, random } = req.query || {};

  // Random game request
  if (random === 'true' || random === '1') {
    const game = getRandomGame();
    return res.status(200).json({ success: true, game });
  }

  // Single game lookup by ID
  if (id) {
    const game = getGameById(id);
    if (!game) {
      return res.status(404).json({ success: false, error: `Module '${id}' not found.` });
    }
    return res.status(200).json({ success: true, game });
  }

  // Filtered/searched list
  const games = getAllGames({ q, category, type, disguise });

  // HTML datalist output (for legacy frontends)
  if (format === 'html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const isDisguised = disguise === 'true' || disguise === true;
    return res.status(200).send(toHtmlDatalistOptions(games, isDisguised));
  }

  // Standard JSON response
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).json({
    success: true,
    total: games.length,
    categories: getCategories(),
    games
  });
};
