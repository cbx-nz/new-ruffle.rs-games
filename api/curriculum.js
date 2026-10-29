// api/curriculum.js - Vercel Serverless Function (Interceptor-safe academic API)
const { getAllModules, getModuleById, getRandomModule, getCategories, toHtmlDatalistOptions } = require('../lib/curriculum');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id, q, category, type, disguise, format, random } = req.query || {};

  // Random module
  if (random === 'true' || random === '1') {
    const item = getRandomModule();
    return res.status(200).json({ success: true, module: item, item });
  }

  // Single module lookup
  if (id) {
    const item = getModuleById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: `Module '${id}' not found.` });
    }
    return res.status(200).json({ success: true, module: item, item });
  }

  // Filtered module list
  const modules = getAllModules({ q, category, type, disguise });

  // HTML datalist output
  if (format === 'html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const isDisguised = disguise === 'true' || disguise === true;
    return res.status(200).send(toHtmlDatalistOptions(modules, isDisguised));
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).json({
    success: true,
    total: modules.length,
    categories: getCategories(),
    modules,
    items: modules,
    // Alias for backwards compatibility
    games: modules
  });
};
