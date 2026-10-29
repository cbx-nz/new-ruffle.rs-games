// api/module.js - Vercel Serverless Function
const { getModuleById, getAllModules } = require('../lib/curriculum');

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

  const item = getModuleById(id);
  if (!item) {
    return res.status(404).json({ success: false, error: `Module '${id}' not found.` });
  }

  const related = getAllModules({ category: item.category })
    .filter(m => m.id !== item.id)
    .slice(0, 4)
    .map(m => ({
      id: m.id,
      title: m.shortMathTitle,
      mathTitle: m.mathTitle,
      courseCode: m.courseCode,
      category: m.category,
      moduleUrl: m.moduleUrl
    }));

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).json({
    success: true,
    module: item,
    item,
    game: item, // backward compat
    related
  });
};
