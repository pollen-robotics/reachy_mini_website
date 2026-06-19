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
  useMediaQuery,
  useTheme,
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

const PRIVACY_URL = 'https://www.pollen-robotics.com/privacy-policy/';

export default function CookieConsent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            left: { xs: 12, sm: 24 },
            right: { xs: 12, sm: 24 },
            bottom: { xs: 12, sm: 24 },
            maxWidth: 560,
            mx: 'auto',
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5, fontSize: 18 }}>
                We value your privacy
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                We use cookies to ensure the site works and, with your consent,
                to measure audience and improve your experience. You can accept,
                reject, or choose which cookies to allow. Read our{' '}
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

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ width: '100%' }}
            >
              {/* Equal prominence for accept/reject to avoid dark patterns. */}
              <Button
                variant="contained"
                onClick={handleAcceptAll}
                fullWidth={isMobile}
                sx={{ flex: 1 }}
              >
                Accept all
              </Button>
              <Button
                variant="outlined"
                onClick={handleRejectAll}
                fullWidth={isMobile}
                sx={{ flex: 1 }}
              >
                Reject all
              </Button>
              <Button
                variant="text"
                onClick={openPreferences}
                fullWidth={isMobile}
                sx={{ flex: 1, color: 'text.secondary' }}
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
