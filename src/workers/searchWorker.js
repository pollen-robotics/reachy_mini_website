import Fuse from 'fuse.js';

let fuse = null;

const FUSE_OPTIONS = {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'id', weight: 2 },
    { name: '_searchAuthor', weight: 2 },
    { name: '_searchDescription', weight: 1.5 },
    { name: '_searchTags', weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
};

/**
 * Build a Fuse.js index from app data.
 * Flattens searchable fields for better matching.
 */
function buildIndex(apps) {
  const enriched = apps.map((app) => ({
    id: app.id,
    name: app.name,
    _searchAuthor: app.extra?.author || app.id?.split('/')?.[0] || '',
    _searchDescription:
      app.extra?.cardData?.short_description || app.description || '',
    _searchTags: [...(app.extra?.tags || []), ...(app.extra?.cardData?.tags || [])]
      .filter(Boolean)
      .join(' '),
  }));

  fuse = new Fuse(enriched, FUSE_OPTIONS);
}

/**
 * Search and return ordered list of matching app IDs with scores.
 */
/**
 * Search and return ordered list of matching app IDs with scores and match indices.
 * Matches are keyed by field name for easy highlight rendering.
 */
function search(query) {
  if (!fuse || !query.trim()) return [];
  const results = fuse.search(query.trim());
  return results.map((r) => {
    // Convert Fuse matches array into a map: fieldName → [[start, end], ...]
    const matches = {};
    if (r.matches) {
      for (const m of r.matches) {
        matches[m.key] = m.indices;
      }
    }
    return { id: r.item.id, score: r.score, matches };
  });
}

// Handle messages from the main thread
self.onmessage = (e) => {
  const { type, apps, query } = e.data;

  if (type === 'INDEX') {
    buildIndex(apps);
    self.postMessage({ type: 'INDEXED' });
  } else if (type === 'SEARCH') {
    const results = search(query);
    self.postMessage({ type: 'RESULTS', results, query });
  }
};
