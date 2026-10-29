// lib/games.js
const path = require('path');
const gamesData = require('../data/games.json');

/**
 * Get all games matching optional filters.
 * @param {Object} options
 * @param {string} [options.q] - Search query
 * @param {string} [options.category] - Filter by category
 * @param {string} [options.type] - Filter by engine type (flash, unity, webgl)
 * @param {boolean|string} [options.disguise] - If true, masks titles strictly as math modules
 */
function getAllGames(options = {}) {
  let results = [...gamesData];
  const { q, category, type, disguise } = options;

  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    results = results.filter(g => g.category.toLowerCase() === catLower || g.category.toLowerCase().includes(catLower));
  }

  if (type && type !== 'all') {
    const typeLower = type.toLowerCase();
    results = results.filter(g => g.type.toLowerCase() === typeLower);
  }

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    results = results.filter(g => {
      const matchTitle = g.title.toLowerCase().includes(query);
      const matchMath = g.mathTitle.toLowerCase().includes(query);
      const matchShortMath = g.shortMathTitle.toLowerCase().includes(query);
      const matchCode = g.courseCode.toLowerCase().includes(query);
      const matchCategory = g.category.toLowerCase().includes(query);
      const matchDesc = g.description.toLowerCase().includes(query);
      const matchTags = Array.isArray(g.tags) && g.tags.some(t => t.toLowerCase().includes(query));
      return matchTitle || matchMath || matchShortMath || matchCode || matchCategory || matchDesc || matchTags;
    });
  }

  const isStrictDisguise = disguise === true || disguise === 'true' || disguise === 'strict';

  return results.map(g => {
    if (isStrictDisguise) {
      return {
        ...g,
        displayTitle: `${g.courseCode}: ${g.shortMathTitle}`,
        disguised: true
      };
    }
    return {
      ...g,
      displayTitle: g.mathTitle,
      disguised: false
    };
  });
}

/**
 * Find game by id or name
 */
function getGameById(id) {
  if (!id) return null;
  const target = id.toString().trim().toLowerCase();
  return gamesData.find(g => 
    g.id.toLowerCase() === target ||
    g.title.toLowerCase() === target ||
    g.courseCode.toLowerCase() === target
  ) || null;
}

/**
 * Get a random game
 */
function getRandomGame() {
  const index = Math.floor(Math.random() * gamesData.length);
  return gamesData[index];
}

/**
 * Return all distinct categories with item counts
 */
function getCategories() {
  const catMap = {};
  gamesData.forEach(g => {
    catMap[g.category] = (catMap[g.category] || 0) + 1;
  });
  return Object.entries(catMap).map(([name, count]) => ({ name, count }));
}

/**
 * Generates HTML <option> tags for datalist backwards compatibility
 */
function toHtmlDatalistOptions(gamesList = gamesData, disguise = false) {
  return gamesList.map(g => {
    const prefix = g.type.toUpperCase();
    const label = disguise ? `${g.courseCode}: ${g.shortMathTitle}` : `(${prefix}) ${g.title}`;
    const url = g.playerUrl || `/player.html?id=${g.id}`;
    return `<option value="${label}" data-url="${url}" data-id="${g.id}" data-category="${g.category}"></option>`;
  }).join('\n');
}

module.exports = {
  gamesData,
  getAllGames,
  getGameById,
  getRandomGame,
  getCategories,
  toHtmlDatalistOptions
};
