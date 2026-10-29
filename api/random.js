// api/random.js - Vercel Serverless Function
const { getRandomGame } = require('../lib/games');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const game = getRandomGame();

  if (req.query && (req.query.redirect === 'true' || req.query.redirect === '1')) {
    return res.redirect(302, game.playerUrl || `/player.html?id=${game.id}`);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({
    success: true,
    game
  });
};
