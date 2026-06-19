// GDPR-compliant cookie consent management.
//
// Design goals:
// - No non-essential scripts (e.g. Google Tag Manager) run before opt-in.
// - "Necessary" category is always on (strictly required for the site to work).
// - Choices are versioned so we can re-ask consent when the policy changes.
// - Consent can be read, updated and withdrawn at any time.

const STORAGE_KEY = 'rm_cookie_consent';

// Bump this when the cookie policy or categories change to re-prompt users.
export const CONSENT_VERSION = 1;

// Categories shown to the user. `necessary` is locked on and cannot be refused.
export const CONSENT_CATEGORIES = [
  {
    id: 'necessary',
    label: 'Strictly necessary',
    description:
      'Required for the website to function (e.g. remembering your cookie choices). Cannot be disabled.',
    required: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'Helps us understand how the site is used so we can improve it (Google Tag Manager). Privacy-friendly, cookieless analytics may still run.',
    required: false,
  },
];

const EVENT_NAME = 'rm:consent-change';

function defaultConsent() {
  return CONSENT_CATEGORIES.reduce((acc, c) => {
    acc[c.id] = !!c.required;
    return acc;
  }, {});
}

// Returns the stored consent record, or null if the user has never chosen
// (or if the stored version is outdated and must be re-collected).
export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasMadeChoice() {
  return getStoredConsent() !== null;
}

// Returns the current per-category consent map (necessary always true).
export function getConsent() {
  const stored = getStoredConsent();
  if (!stored) return defaultConsent();
  return { ...defaultConsent(), ...stored.categories };
}

export function hasConsentFor(categoryId) {
  return !!getConsent()[categoryId];
}

// Persists the user's choice and notifies listeners (analytics loaders, UI...).
export function saveConsent(categories) {
  const normalized = { ...defaultConsent(), ...categories };
  // `necessary` is enforced regardless of input.
  normalized.necessary = true;

  const record = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: normalized,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode, etc.) — choice just won't persist.
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: record }));
  }
  return record;
}

export function acceptAll() {
  return saveConsent(
    CONSENT_CATEGORIES.reduce((acc, c) => {
      acc[c.id] = true;
      return acc;
    }, {})
  );
}

export function rejectAll() {
  return saveConsent(defaultConsent());
}

// Clears the stored choice so the banner is shown again.
export function resetConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  }
}

// Subscribe to consent changes. Returns an unsubscribe function.
export function onConsentChange(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Custom event other components can dispatch to (re)open the preferences UI.
export const OPEN_PREFERENCES_EVENT = 'rm:open-cookie-preferences';

export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
  }
}
