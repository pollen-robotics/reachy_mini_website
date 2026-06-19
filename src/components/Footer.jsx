import { Box, Container, Typography, Link, Stack, IconButton, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { openCookiePreferences } from '../utils/consent';

const socialLinks = [
  { icon: GitHubIcon, href: 'https://github.com/pollen-robotics', label: 'GitHub' },
  { icon: XIcon, href: 'https://x.com/pollenrobotics', label: 'X (Twitter)' },
  { icon: LinkedInIcon, href: 'https://www.linkedin.com/company/pollen-robotics', label: 'LinkedIn' },
  { icon: YouTubeIcon, href: 'https://www.youtube.com/pollen-robotics', label: 'YouTube' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a0b',
        color: 'white',
        pt: 4,
        pb: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />

      <Box
        component="img"
        src="/assets/sleeping-reachy.svg"
        alt=""
        sx={{
          position: 'absolute',
          bottom: 20,
          right: { xs: 10, md: 40 },
          width: { xs: 60, md: 80 },
          opacity: 0.15,
          pointerEvents: 'none',
          display: { xs: 'none', lg: 'block' },
        }}
      />

      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                size="small"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <social.icon fontSize="small" />
              </IconButton>
            ))}
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'center' }}
            spacing={1.5}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 13 }}>
              © 2025 Reachy Mini. Open source under Apache 2.0 license.
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 13 }}>
                Proudly brought by
              </Typography>
              <Link
                href="https://www.pollen-robotics.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'white' },
                }}
              >
                Pollen Robotics
              </Link>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 13 }}>×</Typography>
              <Link
                href="https://huggingface.co/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'white' },
                }}
              >
                🤗 Hugging Face
              </Link>
            </Stack>

            <Stack direction="row" spacing={3}>
              <Link
                href="https://github.com/pollen-robotics/reachy_mini/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'none',
                  fontSize: 12,
                  '&:hover': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              >
                License
              </Link>
              <Link
                href="https://www.pollen-robotics.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'none',
                  fontSize: 12,
                  '&:hover': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              >
                Privacy
              </Link>
              <Link
                href="https://www.pollen-robotics.com/terms-of-use/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'none',
                  fontSize: 12,
                  '&:hover': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              >
                Terms
              </Link>
              <Link
                component="button"
                type="button"
                onClick={openCookiePreferences}
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  p: 0,
                  '&:hover': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              >
                Cookie settings
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
