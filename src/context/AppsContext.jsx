import { createContext, useContext, useState, useEffect } from 'react';

// Context
const AppsContext = createContext(null);

// API base: absolute URL of the Reachy Mini API Space, injected at
// build time via VITE_API_BASE. Empty -> relative `/api` (dev, where
// Vite proxies `/api` to the local API server). Production sets it to
// the API Space origin so the static site calls the API cross-origin.
const API_BASE = import.meta.env.VITE_API_BASE || '';
// API endpoint (uses server cache in production, falls back to direct HF API in dev)
const API_ENDPOINT = `${API_BASE}/api/apps`;
const FALLBACK_HF_API = 'https://huggingface.co/api/spaces';
const FALLBACK_OFFICIAL_URL = 'https://huggingface.co/datasets/pollen-robotics/reachy-mini-official-app-store/raw/main/app-list.json';
// Note: HF API doesn't support pagination with filter=, so we use a high limit
const FALLBACK_LIMIT = 1000;

// Fallback: fetch directly from HuggingFace API (for dev mode)
// Returns same format as server (desktop-compatible)
async function fetchAppsDirectFromHF() {
  console.log('[AppsContext] Fallback: fetching directly from HuggingFace API');
  
  // Fetch official app IDs
  const officialResponse = await fetch(FALLBACK_OFFICIAL_URL);
  let officialIdList = [];
  if (officialResponse.ok) {
    officialIdList = await officialResponse.json();
  }
  const officialSet = new Set(officialIdList.map(id => id.toLowerCase()));

  // Fetch all spaces
  // Note: HF API doesn't support pagination with filter=, so we use a high limit
  const spacesResponse = await fetch(`${FALLBACK_HF_API}?filter=reachy_mini&full=true&limit=${FALLBACK_LIMIT}`);
  if (!spacesResponse.ok) {
    throw new Error(`HF API returned ${spacesResponse.status}`);
  }
  const allSpaces = await spacesResponse.json();

  // Build apps list in desktop-compatible format
  const allApps = allSpaces.map(space => {
    const spaceId = space.id || '';
    const tags = space.tags || [];
    const isOfficial = officialSet.has(spaceId.toLowerCase());
    const isPythonApp = tags.includes('reachy_mini_python_app');
    const author = spaceId.split('/')[0];
    const name = spaceId.split('/').pop();
    
    return {
      // Core fields
      id: spaceId,
      name,
      description: space.cardData?.short_description || '',
      url: `https://huggingface.co/spaces/${spaceId}`,
      source_kind: 'hf_space',
      isOfficial,
      
      // Extra metadata (desktop-compatible structure)
      extra: {
        id: spaceId,
        author,
        likes: space.likes || 0,
        downloads: space.downloads || 0,
        lastModified: space.lastModified,
        runtime: space.runtime || null,
        tags,
        isPythonApp,
        cardData: {
          emoji: space.cardData?.emoji || (isPythonApp ? '📦' : '🌐'),
          short_description: space.cardData?.short_description || '',
          sdk: space.cardData?.sdk || null,
          tags: space.cardData?.tags || [],
          ...space.cardData,
        },
      },
    };
  });

  // Sort: official first, then by likes
  allApps.sort((a, b) => {
    if (a.isOfficial !== b.isOfficial) {
      return a.isOfficial ? -1 : 1;
    }
    return (b.extra.likes || 0) - (a.extra.likes || 0);
  });

  return allApps;
}

// Provider component
export function AppsProvider({ children }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch once
    if (hasFetched) return;

    async function fetchApps() {
      setLoading(true);
      setError(null);

      try {
        let allApps;

        // Try server cache first
        try {
          const response = await fetch(API_ENDPOINT);
          if (response.ok) {
            const data = await response.json();
            allApps = data.apps;
            // Cache age moved from response body to the standard
            // `Age` HTTP header (RFC 7234 §5.1) so the body stays
            // byte-stable across same-cache-window requests and
            // ETag-based 304s work. `headers.get('age')` is null
            // on same-origin if the server didn't set it (older
            // deploy of the website Space): degrade gracefully to
            // a `?` rather than poisoning the log with `null`.
            const age = response.headers.get('age');
            console.log(
              `[AppsContext] Fetched ${allApps.length} apps from server cache (age: ${age ?? '?'}s)`,
            );
          } else {
            throw new Error('Server API not available');
          }
        } catch (serverErr) {
          // Fallback to direct HF API (for dev mode or if server fails)
          console.log('[AppsContext] Server cache unavailable, using direct API');
          allApps = await fetchAppsDirectFromHF();
          console.log(`[AppsContext] Fetched ${allApps.length} apps directly from HuggingFace`);
        }

        setApps(allApps);
        setHasFetched(true);
      } catch (err) {
        console.error('Failed to fetch apps:', err);
        setError('Failed to load apps. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [hasFetched]);

  return (
    <AppsContext.Provider value={{ apps, loading, error }}>
      {children}
    </AppsContext.Provider>
  );
}

// Hook to use the apps context
export function useApps() {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error('useApps must be used within an AppsProvider');
  }
  return context;
}

