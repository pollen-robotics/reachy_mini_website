import { Box, Container, Typography } from '@mui/material';

export default function Section({
  id,
  children,
  background = 'default',
  maxWidth = 'lg',
  sx = {},
}) {
  const bgColors = {
    default: 'background.default',
    alt: 'background.alt',
    dark: 'secondary.main',
  };

  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 10, md: 15 },
        backgroundColor: bgColors[background] || background,
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, light = false }) {
  return (
    <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 10 } }}>
      {eyebrow && (
        <Typography
          variant="overline"
          component="p"
          sx={{ color: light ? 'rgba(255,255,255,0.7)' : 'primary.main', mb: 2 }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h2"
        component="h2"
        sx={{ mb: 2.5, color: light ? 'white' : 'text.primary' }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: light ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            fontSize: 19,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

