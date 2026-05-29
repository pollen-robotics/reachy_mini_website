import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AppsProvider } from './context/AppsContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Download from './pages/Download';
import FAQ from './pages/FAQ';
import Apps from './pages/Apps';
import Buy from './pages/Buy';
import GettingStarted from './pages/GettingStarted';
import Build from './pages/Build';

/**
 * Handle hash-to-path redirect for HuggingFace Spaces iframe embedding.
 *
 * HF propagates the parent page's hash to the iframe on initial load.
 * For example, visiting huggingface.co/reachy-mini#/apps will load the
 * iframe at *.hf.space/#/apps. This component reads that hash and
 * converts it to a BrowserRouter path (e.g. /apps).
 */
function HashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    // Match hash routes like #/apps, #/download, #apps, #download, etc.
    if (hash && hash.length > 1) {
      // Support both #/apps and #apps formats
      const path = hash.startsWith('#/') ? hash.slice(1) : `/${hash.slice(1)}`;
      // Use replaceState to cleanly remove hash without triggering navigation
      window.history.replaceState(null, '', window.location.pathname);
      navigate(path, { replace: true });
    }
  }, [navigate]);

  return null;
}

/**
 * Sync the current route back to the HF parent page via postMessage.
 * This updates the URL in the browser address bar so users can
 * copy/share deep links (e.g. huggingface.co/reachy-mini#/apps).
 *
 * Also handles scrollTo query parameter for anchor-like behavior.
 */
function RouteSync() {
  const location = useLocation();

  useEffect(() => {
    // Sync current path to parent frame hash (for HF Spaces embedding)
    const isInIframe = window.parent !== window;
    if (isInIframe && location.pathname !== '/') {
      window.parent.postMessage(
        { hash: `#${location.pathname}` },
        'https://huggingface.co'
      );
    } else if (isInIframe && location.pathname === '/') {
      // Clear hash when on home page
      window.parent.postMessage({ hash: '' }, 'https://huggingface.co');
    }

    // Handle scrollTo query parameter
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');

    if (scrollTo) {
      // Retry mechanism to wait for element to be rendered
      const scrollToElement = (retries = 0) => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (retries < 10) {
          setTimeout(() => scrollToElement(retries + 1), 100);
        }
      };
      setTimeout(() => scrollToElement(), 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppsProvider>
          <BrowserRouter>
            <HashRedirect />
            <RouteSync />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/getting-started" element={<GettingStarted />} />
              <Route path="https://huggingface.co/docs/reachy_mini/" element={<Build />} />
              <Route path="/download" element={<Download />} />
              <Route path="https://huggingface.co/docs/reachy_mini/troubleshooting" element={<FAQ />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/buy" element={<Buy />} />
              {/* Catch-all: redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
