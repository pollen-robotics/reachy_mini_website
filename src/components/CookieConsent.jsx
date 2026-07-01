import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  IconButton,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  CONSENT_CATEGORIES,
  acceptAll,
  rejectAll,
  saveConsent,
  getConsent,
  hasMadeChoice,
  OPEN_PREFERENCES_EVENT,
} from '../utils/consent';

const PRIVACY_URL = 'https://store.pollen-robotics.com/policies/privacy-policy';

export default function CookieConsent() {
  // Banner is shown only when the user has not made a valid choice yet.
  const [bannerOpen, setBannerOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [selection, setSelection] = useState(() => getConsent());

  useEffect(() => {
    setBannerOpen(!hasMadeChoice());
  }, []);

  // Allow other parts of the app (e.g. footer link) to reopen preferences.
  useEffect(() => {
    const handler = () => {
      setSelection(getConsent());
      setPrefsOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  const handleSavePreferences = () => {
    saveConsent(selection);
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  const openPreferences = () => {
    setSelection(getConsent());
    setPrefsOpen(true);
  };

  const toggleCategory = (id) => (event) => {
    setSelection((prev) => ({ ...prev, [id]: event.target.checked }));
  };

  return (
    <>
      <Slide direction="up" in={bannerOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          sx={{
            position: 'fixed',
            zIndex: (t) => t.zIndex.snackbar + 10,
            left: { xs: 12, sm: 'auto' },
            right: { xs: 12, sm: 24 },
            bottom: { xs: 12, sm: 24 },
            width: { sm: 380 },
            maxWidth: 'calc(100% - 24px)',
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                component="img"
                src="/assets/reachy-eating-a-cookie.svg"
                alt=""
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  mt: 0.25,
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ mb: 0.25, fontSize: 16 }}>
                  We value your privacy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.45 }}
                >
                  We use cookies to run the site and, with your consent, measure
                  audience. Read our{' '}
                  <Link
                    href={PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main' }}
                  >
                    privacy policy
                  </Link>
                  .
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              {/* Equal prominence for accept/reject to avoid dark patterns. */}
              <Button
                variant="contained"
                size="small"
                onClick={handleAcceptAll}
                sx={{ flex: 1 }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRejectAll}
                sx={{ flex: 1 }}
              >
                Reject
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={openPreferences}
                sx={{ flex: 1, color: 'text.secondary', minWidth: 0 }}
              >
                Customize
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Slide>

      <Dialog
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="cookie-preferences-title"
      >
        <DialogTitle
          id="cookie-preferences-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1.5,
          }}
        >
          Cookie preferences
          <IconButton
            aria-label="Close"
            onClick={() => setPrefsOpen(false)}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Manage your consent for each category of cookies. Strictly necessary
            cookies are always active. You can change these choices at any time.
          </Typography>

          <Stack spacing={2.5}>
            {CONSENT_CATEGORIES.map((category) => (
              <Box key={category.id}>
                <FormControlLabel
                  sx={{ alignItems: 'flex-start', m: 0 }}
                  control={
                    <Switch
                      checked={category.required ? true : !!selection[category.id]}
                      disabled={category.required}
                      onChange={toggleCategory(category.id)}
                      sx={{ mt: -0.5 }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.label}
                        {category.required && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: 'text.secondary' }}
                          >
                            (always on)
                          </Typography>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {category.description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={handleRejectAll} variant="outlined" sx={{ flex: 1 }}>
            Reject all
          </Button>
          <Button
            onClick={handleSavePreferences}
            variant="text"
            sx={{ flex: 1, color: 'text.secondary' }}
          >
            Save choices
          </Button>
          <Button onClick={handleAcceptAll} variant="contained" sx={{ flex: 1 }}>
            Accept all
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
