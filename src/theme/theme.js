import { createTheme } from '@mui/material/styles';

// Theme aligned with Tauri app
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF9500',
      light: '#FFB340',
      dark: '#E08500',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6fc4',
      dark: '#5a3a7e',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
      alt: '#f5f5f7',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: 'clamp(48px, 10vw, 96px)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.05,
    },
    h2: {
      fontSize: 'clamp(32px, 5vw, 56px)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h3: {
      fontSize: '32px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '22px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '17px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '15px',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    overline: {
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowX: 'hidden',
        },
        body: {
          overflowX: 'hidden',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 980,
          padding: '12px 28px',
          fontSize: '16px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '17px',
        },
        sizeSmall: {
          padding: '10px 20px',
          fontSize: '14px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF9500 0%, #FFB340 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E08500 0%, #FF9500 100%)',
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 0, 0, 0.12)',
          '&:hover': {
            borderColor: '#1d1d1f',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(250, 250, 250, 0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 980,
          fontWeight: 600,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f7',
          borderRadius: '12px',
          '&.Mui-expanded': {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          display: 'block',
        },
        svg: {
          display: 'block',
          overflow: 'visible',
        },
        circle: {
          strokeLinecap: 'round',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 500,
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '300px',
          lineHeight: 1.6,
        },
        arrow: {
          color: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },
  },
});

export default theme;
