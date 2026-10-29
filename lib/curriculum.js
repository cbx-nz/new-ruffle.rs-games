// lib/curriculum.js
const curriculumData = require('../data/curriculum.json');

/**
 * Get all curriculum modules with optional filters.
 * Terminology is intentionally academic to avoid network interceptors.
 */
function getAllModules(options = {}) {
  let results = [...curriculumData];
  const { q, category, type, disguise } = options;

  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    results = results.filter(m => m.category.toLowerCase().includes(catLower));
  }

  if (type && type !== 'all') {
    const typeLower = type.toLowerCase();
    results = results.filter(m => m.type.toLowerCase() === typeLower);
  }

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    results = results.filter(m => {
      const matchTitle = m.title.toLowerCase().includes(query);
      const matchMath = m.mathTitle.toLowerCase().includes(query);
      const matchShortMath = m.shortMathTitle.toLowerCase().includes(query);
      const matchCode = m.courseCode.toLowerCase().includes(query);
      const matchCategory = m.category.toLowerCase().includes(query);
      const matchDesc = m.description.toLowerCase().includes(query);
      const matchTags = Array.isArray(m.tags) && m.tags.some(t => t.toLowerCase().includes(query));
      return matchTitle || matchMath || matchShortMath || matchCode || matchCategory || matchDesc || matchTags;
    });
  }

  const isStrictDisguise = disguise === true || disguise === 'true' || disguise === 'strict';

  return results.map(m => {
    return {
      ...m,
      displayTitle: isStrictDisguise ? `${m.courseCode}: ${m.shortMathTitle}` : m.mathTitle,
      disguised: isStrictDisguise
    };
  });
}

function getModuleById(id) {
  if (!id) return null;
  const target = id.toString().trim().toLowerCase();
  return curriculumData.find(m => 
    m.id.toLowerCase() === target ||
    m.title.toLowerCase() === target ||
    m.courseCode.toLowerCase() === target
  ) || null;
}

function getRandomModule() {
  const index = Math.floor(Math.random() * curriculumData.length);
  return curriculumData[index];
}

function getCategories() {
  const catMap = {};
  curriculumData.forEach(m => {
    catMap[m.category] = (catMap[m.category] || 0) + 1;
  });
  return Object.entries(catMap).map(([name, count]) => ({ name, count }));
}

function toHtmlDatalistOptions(modulesList = curriculumData, disguise = false) {
  return modulesList.map(m => {
    const label = disguise ? `${m.courseCode}: ${m.shortMathTitle}` : `(${m.courseCode}) ${m.shortMathTitle}`;
    const url = m.moduleUrl || `/module.html?id=${m.id}`;
    return `<option value="${label}" data-url="${url}" data-id="${m.id}" data-category="${m.category}"></option>`;
  }).join('\n');
}

module.exports = {
  curriculumData,
  getAllModules,
  getModuleById,
  getRandomModule,
  getCategories,
  toHtmlDatalistOptions
};
