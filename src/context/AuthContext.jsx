import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { oauthLoginUrl, oauthHandleRedirectIfPresent } from '@huggingface/hub';

const AuthContext = createContext(null);

const HF_API = 'https://huggingface.co';

// Whether we're running inside an iframe (i.e. embedded on huggingface.co)
const isInIframe = typeof window !== 'undefined' && window.parent !== window;

// API base for the (optional) server fallback. Empty in dev (Vite
// proxy); set to the API Space origin in prod via VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || '';

/**
 * Resolve OAuth config (clientId, scopes).
 *
 * On a static HF Space with `hf_oauth: true`, the platform injects the
 * values into `window.huggingface.variables`, so we read them directly
 * - no server round-trip. We keep a fetch to `${API_BASE}/api/oauth-config`
 * as a fallback for non-static hosting / local dev.
 */
async function fetchOAuthConfig() {
  const injected =
    typeof window !== 'undefined' ? window.huggingface?.variables : null;
  if (injected?.OAUTH_CLIENT_ID) {
    return {
      clientId: injected.OAUTH_CLIENT_ID,
      scopes: injected.OAUTH_SCOPES || 'openid profile',
    };
  }
  try {
    const response = await fetch(`${API_BASE}/api/oauth-config`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Fetch all space IDs liked by a user.
 * Returns a Set of lowercase space IDs (e.g. "pollen-robotics/reachy-mini-teleop").
 */
async function fetchUserLikedSpaces(username) {
  try {
    const response = await fetch(`${HF_API}/api/users/${username}/likes`);
    if (!response.ok) return new Set();
    const likes = await response.json();
    // Filter only spaces and return their repo names as a Set
    return new Set(
      likes
        .filter((item) => item.repo?.type === 'space')
        .map((item) => item.repo.name.toLowerCase())
    );
  } catch (err) {
    console.error('[Auth] Failed to fetch user likes:', err);
    return new Set();
  }
}

/**
 * Send a like request to the HF parent frame via postMessage.
 * Returns a Promise that resolves with the response data.
 * The parent frame (huggingface.co) handles auth via session cookies.
 */
function likeViaPostMessage(spaceId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Like request timed out'));
    }, 5000);

    function handler(event) {
      if (event.data?.type !== 'LIKE_REPO_RESPONSE') return;
      clearTimeout(timeout);
      window.removeEventListener('message', handler);
      resolve(event.data);
    }

    window.addEventListener('message', handler);
    window.parent.postMessage(
      { type: 'LIKE_REPO_REQUEST', repo: { type: 'space', name: spaceId } },
      '*'
    );
  });
}

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, avatarUrl }
  const [likedSpaceIds, setLikedSpaceIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [oauthConfig, setOauthConfig] = useState(null); // { clientId, scopes }
  const pendingLikes = useRef(new Set()); // Track in-flight like requests

  // On mount: fetch OAuth config + check if user just completed OAuth redirect
  useEffect(() => {
    async function init() {
      try {
        // Fetch OAuth config from server (needed for Docker Spaces)
        const config = await fetchOAuthConfig();
        if (config?.clientId) {
          setOauthConfig(config);
          console.log('[Auth] OAuth config loaded (clientId available)');
        } else {
          console.log('[Auth] OAuth not available (no clientId from server)');
        }

        // Check if user just completed OAuth redirect
        const oauthResult = await oauthHandleRedirectIfPresent();
        if (oauthResult) {
          const { userInfo } = oauthResult;
          const userData = {
            name: userInfo.name,
            preferredUsername: userInfo.preferred_username || userInfo.name,
            avatarUrl: userInfo.picture,
          };
          setUser(userData);

          // Fetch user's liked spaces
          const likes = await fetchUserLikedSpaces(userData.preferredUsername);
          setLikedSpaceIds(likes);

          console.log(
            `[Auth] Logged in as ${userData.preferredUsername}, ${likes.size} liked spaces`
          );
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // Login: redirect to HF OAuth (passing clientId from server config)
  const login = useCallback(async () => {
    if (!oauthConfig?.clientId) {
      console.warn('[Auth] Cannot login: OAuth not configured');
      return;
    }

    try {
      const loginUrl = await oauthLoginUrl({
        clientId: oauthConfig.clientId,
        scopes: oauthConfig.scopes || 'openid profile',
      });
      window.location.href = loginUrl;
    } catch (err) {
      console.error('[Auth] Failed to get OAuth URL:', err);
    }
  }, [oauthConfig]);

  // Logout: clear state
  const logout = useCallback(() => {
    setUser(null);
    setLikedSpaceIds(new Set());
  }, []);

  // Check if a space is liked
  const isSpaceLiked = useCallback(
    (spaceId) => {
      return likedSpaceIds.has(spaceId?.toLowerCase());
    },
    [likedSpaceIds]
  );

  /**
   * Like a space via the HF parent frame postMessage protocol.
   * The parent (huggingface.co) handles auth via session cookies.
   * Like-only (no unlike) — if already liked, it's a no-op.
   */
  const toggleLike = useCallback(
    async (spaceId) => {
      const spaceIdLower = spaceId?.toLowerCase();
      if (!spaceIdLower) return;

      // Already liked → no-op (postMessage only supports like, not unlike)
      if (likedSpaceIds.has(spaceIdLower)) return;

      // Not in iframe → can't use postMessage, prompt OAuth login as fallback
      if (!isInIframe) {
        console.warn('[Auth] Not in iframe, postMessage unavailable');
        return;
      }

      // Prevent duplicate requests
      if (pendingLikes.current.has(spaceIdLower)) return;
      pendingLikes.current.add(spaceIdLower);

      // Optimistic update
      setLikedSpaceIds((prev) => {
        const next = new Set(prev);
        next.add(spaceIdLower);
        return next;
      });

      try {
        const result = await likeViaPostMessage(spaceId);

        if (result.error) {
          throw new Error(`${result.error.code}: ${result.error.message}`);
        }

        if (result.status === 'not_logged_in') {
          // User not logged in to HF → revert and prompt login
          throw new Error('not_logged_in');
        }

        // "done" or "already_liked" → success
        console.log(`[Auth] Liked ${spaceId}: ${result.status}`, result.likes != null ? `(${result.likes} likes)` : '');
      } catch (err) {
        console.error(`[Auth] Failed to like ${spaceId}:`, err.message);

        // Revert optimistic update
        setLikedSpaceIds((prev) => {
          const reverted = new Set(prev);
          reverted.delete(spaceIdLower);
          return reverted;
        });

        // If not logged in, prompt OAuth login
        if (err.message === 'not_logged_in') {
          login();
        }
      } finally {
        pendingLikes.current.delete(spaceIdLower);
      }
    },
    [likedSpaceIds, login]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isOAuthAvailable: !!oauthConfig?.clientId,
        isInIframe,
        likedSpaceIds,
        login,
        logout,
        isSpaceLiked,
        toggleLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
