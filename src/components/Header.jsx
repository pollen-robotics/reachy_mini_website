import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const navItems = [
  { label: 'Get Started', href: '/getting-started' },
  { label: 'Download', href: '/download' },
  { label: 'Apps', href: '/apps' },
  { label: 'Create', href: 'https://huggingface.co/docs/reachy_mini/index', external: true },
  { label: 'FAQ', href: 'https://huggingface.co/docs/reachy_mini/troubleshooting', external: true },
  { label: 'Community', href: 'https://discord.gg/2bAhWfXme9', external: true },
];

export default function Header({ transparent = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Track scroll position for header compacting
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  // Determine colors based on transparent mode and scroll state
  const isTransparentMode = transparent && !scrolled;
  const textColor = isTransparentMode ? 'white' : 'text.primary';
  const bgColor = isTransparentMode 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.85)';
  const backdropFilter = isTransparentMode 
    ? 'none' 
    : 'saturate(180%) blur(20px)';

  const drawer = (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/assets/logo.svg"
            alt="Reachy Mini"
            sx={{ width: 28, height: 28 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Reachy Mini
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ '& .MuiListItem-root': { mb: 0.5 } }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={item.external ? 'a' : RouterLink}
              to={item.external ? undefined : item.href}
              href={item.external ? item.href : undefined}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={() => handleNavClick(item)}
              sx={{ 
                py: 1.5, 
                px: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                    {item.external && (
                      <OpenInNewIcon sx={{ fontSize: 14, opacity: 0.5 }} />
                    )}
                  </Box>
                } 
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ mt: 3 }}>
          <Button
            component={RouterLink}
            to="/buy"
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Order Now
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          backgroundColor: bgColor,
          backdropFilter: backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          borderBottom: isTransparentMode ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between', 
              px: scrolled ? { xs: 1, md: 1.5, lg: 2 } : { xs: 2, md: 3, lg: 4 },
              py: scrolled ? { xs: 1, md: 1.5 } : { xs: 2, md: 3.5 },
              minHeight: scrolled ? { xs: 56, md: 64 } : { xs: 64, md: 88 },
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: scrolled ? 1 : 1.5,
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Box
                component="img"
                src="/assets/reachy-icon.svg"
                alt="Reachy Mini"
                sx={{
                  width: scrolled ? 52 : 60,
                  height: scrolled ? 52 : 60,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: textColor,
                  letterSpacing: '-0.03em',
                  fontSize: scrolled ? { xs: 18, md: 19 } : { xs: 20, md: 22 },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Reachy Mini
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                aria-label="open menu"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: textColor,
                  backgroundColor: isTransparentMode ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isTransparentMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 4, lg: 5 } }}>
                {/* Nav Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 3, lg: 4 } }}>
                  {navItems.map((item) => (
                    item.external ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: textColor,
                          textDecoration: 'none',
                          fontSize: 15,
                          fontWeight: 500,
                          opacity: 0.85,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          transition: 'opacity 0.2s',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        {item.label}
                        <OpenInNewIcon sx={{ fontSize: 13, opacity: 0.6 }} />
                      </Link>
                    ) : (
                      <Typography
                        key={item.label}
                        component={RouterLink}
                        to={item.href}
                        onClick={() => handleNavClick(item)}
                        sx={{
                          color: textColor,
                          textDecoration: location.pathname === item.href ? 'underline' : 'none',
                          textUnderlineOffset: 6,
                          textDecorationThickness: 2,
                          fontSize: 15,
                          fontWeight: location.pathname === item.href ? 600 : 500,
                          opacity: location.pathname === item.href ? 1 : 0.85,
                          transition: 'opacity 0.2s',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        {item.label}
                      </Typography>
                    )
                  ))}
                </Box>

                {/* CTA Button */}
                <Button
                  component={RouterLink}
                  to="/buy"
                  variant={scrolled ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 2,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    ...(isTransparentMode && {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.light',
                        backgroundColor: 'rgba(255,149,0,0.1)',
                      },
                    }),
                  }}
                >
                  Order Now
                </Button>
              </Box>
            )}
          </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed AppBar - only show if not transparent */}
      {!transparent && <Toolbar sx={{ minHeight: { xs: 64, md: 88 } }} />}
    </>
  );
}
