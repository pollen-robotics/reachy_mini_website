// Consent-gated analytics bootstrap.
//
// Google Tag Manager is NOT loaded from index.html anymore: it would fire
// before the user consents, which is not GDPR-compliant. Instead we inject
// it here only once the user has opted into the "analytics" category.
//
// Plausible (cookieless, privacy-friendly) stays in index.html and does not
// require consent.

import { hasConsentFor, onConsentChange } from './consent';

const GTM_CONTAINER_ID = 'GTM-WKKZHMJJ';

let gtmLoaded = false;

function loadGoogleTagManager() {
  if (gtmLoaded || typeof window === 'undefined') return;
  if (document.getElementById('gtm-script')) {
    gtmLoaded = true;
    return;
  }
  gtmLoaded = true;

  // Standard GTM snippet, injected only after consent.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}

// Call once at app startup. Loads GTM if consent already exists, then keeps
// listening so a later opt-in takes effect without a page reload.
export function initConsentedAnalytics() {
  if (hasConsentFor('analytics')) {
    loadGoogleTagManager();
  }
  onConsentChange(() => {
    if (hasConsentFor('analytics')) {
      loadGoogleTagManager();
    }
    // Note: if the user withdraws consent after GTM loaded, we cannot fully
    // unload it at runtime — a page reload clears it since it is no longer
    // auto-injected. This is the standard behaviour for tag managers.
  });
}
