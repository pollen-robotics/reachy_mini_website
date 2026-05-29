import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';

import Layout from '../components/Layout';

// Platform configuration
const PLATFORMS = {
  'darwin-aarch64': {
    name: 'macOS',
    subtitle: 'Apple Silicon',
    arch: 'M1, M2, M3, M4',
    format: '.dmg',
  },
  'windows-x86_64': {
    name: 'Windows',
    subtitle: '64-bit',
    arch: 'x86_64',
    format: '.msi',
  },
  'linux-x86_64': {
    name: 'Linux',
    subtitle: 'Debian/Ubuntu',
    arch: 'x86_64',
    format: '.deb',
  },
};

// URL to fetch latest release info (using GitHub API for CORS support)
const GITHUB_RELEASES_API = 'https://api.github.com/repos/pollen-robotics/reachy-mini-desktop-app/releases/latest';
const GITHUB_RELEASES_LIST_API = 'https://api.github.com/repos/pollen-robotics/reachy-mini-desktop-app/releases?per_page=10';


// Detect user's platform
function detectPlatform() {
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';

  if (/Mac/.test(platform) || /Mac/.test(ua)) {
    return 'darwin-aarch64';
  }
  if (/Win/.test(platform) || /Windows/.test(ua)) {
    return 'windows-x86_64';
  }
  if (/Linux/.test(platform) || /Linux/.test(ua)) {
    return 'linux-x86_64';
  }
  return 'darwin-aarch64';
}

function isMobileDevice() {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Parse release body and extract clean changes
function parseReleaseChanges(body) {
  if (!body) return [];
  
  const changes = [];
  const lines = body.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, headers, and meta content
    if (!trimmed) continue;
    if (trimmed.startsWith('##')) continue; // Skip all headers (## What's Changed, etc.)
    if (trimmed.startsWith('**Full Changelog**')) continue;
    if (trimmed.startsWith('**New Contributors**')) continue;
    if (trimmed.includes('made their first contribution')) continue;
    if (trimmed.startsWith('<!--') || trimmed.endsWith('-->')) continue;
    if (trimmed === 'See the assets to download this version and install.') continue;
    
    // Parse change lines (starting with * or -)
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      let change = trimmed.replace(/^[\*\-]\s*/, '');
      
      // Extract the description from markdown links: "fix: description by @user in https://..."
      // We want to keep: "fix: description"
      const byMatch = change.match(/^(.+?)\s+by\s+@\w+/i);
      if (byMatch) {
        change = byMatch[1].trim();
      }
      
      // Remove trailing "in https://..." links
      change = change.replace(/\s+in\s+https:\/\/[^\s]+$/i, '');
      
      // Clean up any remaining markdown link syntax [text](url) -> text
      change = change.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      
      // Skip if it's just a contributor line or empty after cleaning
      if (change && change.length > 3 && !change.includes('first contribution')) {
        changes.push(change);
      }
    }
  }
  
  return changes;
}

// Platform Icons - all use external SVG files with white fill
function AppleIcon() {
  return (
    <Box
      component="img"
      src="/assets/apple-logo.svg"
      alt="Apple"
      sx={{ width: 32, height: 32 }}
    />
  );
}

function WindowsIcon() {
  return (
    <Box
      component="img"
      src="/assets/windows-logo.svg"
      alt="Windows"
      sx={{ width: 32, height: 32 }}
    />
  );
}

function LinuxIcon() {
  return (
    <Box
      component="img"
      src="/assets/linux-logo.svg"
      alt="Linux"
      sx={{ width: 32, height: 32 }}
    />
  );
}

// Get platform icon component
function getPlatformIcon(platformKey) {
  if (platformKey.includes('darwin')) return <AppleIcon />;
  if (platformKey.includes('windows')) return <WindowsIcon />;
  if (platformKey.includes('linux')) return <LinuxIcon />;
  return null;
}

// Parse release assets and map to platforms
// This is the single source of truth for platform → download URL mapping
function parseReleasePlatforms(assets) {
  if (!assets) return {};
  
  const platforms = {};
  
  assets.forEach(asset => {
    const name = asset.name.toLowerCase();
    const url = asset.browser_download_url;
    
    // Skip signature files entirely
    if (name.endsWith('.sig')) return;
    
    // macOS Apple Silicon - prefer .dmg
    if (name.includes('arm64.dmg')) {
      platforms['darwin-aarch64'] = { url };
    } else if (name.includes('darwin-aarch64') && !platforms['darwin-aarch64']) {
      platforms['darwin-aarch64'] = { url };
    }
    
    // Windows - .msi
    if (name.endsWith('.msi')) {
      platforms['windows-x86_64'] = { url };
    }
    
    // Linux - .deb
    if (name.endsWith('.deb')) {
      platforms['linux-x86_64'] = { url };
    }
  });
  
  return platforms;
}

// Get download URL for a specific platform from release
function getDownloadUrlForPlatform(release, platform) {
  if (!release?.assets || !platform) return release?.html_url;
  
  const platforms = parseReleasePlatforms(release.assets);
  return platforms[platform]?.url || release?.html_url;
}

// Platform Card component
function PlatformCard({ platformKey, url, isActive, onClick }) {
  const platform = PLATFORMS[platformKey];
  const isBeta = platformKey.includes('windows') || platformKey.includes('linux');

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        background: isActive 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
          : 'rgba(255, 255, 255, 0.03)',
        border: '1px solid',
        borderColor: isActive ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: isActive ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-4px)',
          boxShadow: isActive 
            ? '0 12px 40px rgba(59, 130, 246, 0.2)'
            : '0 12px 40px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Beta tag for Windows and Linux */}
      {isBeta && (
        <Chip
          label="Beta"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            color: '#3b82f6',
            fontSize: 10,
            fontWeight: 700,
            height: 20,
            '& .MuiChip-label': { px: 1 },
          }}
        />
      )}
      
      <CardContent
        component="a"
        href={url}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          textDecoration: 'none',
          color: 'inherit',
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        <Box sx={{ 
          width: 56, 
          height: 56, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}>
          {getPlatformIcon(platformKey)}
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}
          >
            {platform?.name}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {platform?.subtitle}
          </Typography>
        </Box>

        <Chip
          label={platform?.format}
          size="small"
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
            fontWeight: 600,
            height: 24,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function Download() {
  const [releaseData, setReleaseData] = useState(null);
  const [allReleases, setAllReleases] = useState([]);
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllReleases, setShowAllReleases] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    setDetectedPlatform(detectPlatform());
    setIsMobile(isMobileDevice());
    
    // Fetch latest release info from GitHub API
    async function fetchReleases() {
      try {
        // Fetch latest release for download buttons
        const latestResponse = await fetch(GITHUB_RELEASES_API);
        
        // Fetch all releases for changelog
        const allResponse = await fetch(GITHUB_RELEASES_LIST_API);
        
        if (latestResponse.ok) {
          const data = await latestResponse.json();
          
          // Transform GitHub API response to our format
          const version = data.tag_name?.replace('v', '') || '';
          const platforms = parseReleasePlatforms(data.assets);
          
          setReleaseData({
            version,
            pub_date: data.published_at,
            platforms,
          });
        } else {
          setError('Failed to fetch release info');
        }
        
        // Set all releases for changelog
        if (allResponse.ok) {
          const releases = await allResponse.json();
          setAllReleases(releases.filter(r => !r.draft));
        }
      } catch (err) {
        console.error('Error fetching release:', err);
        setError('Failed to fetch release info');
      } finally {
        setLoading(false);
      }
    }
    
    fetchReleases();
  }, []);

  if (loading) {
    return (
      <Layout transparentHeader>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#000' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      </Layout>
    );
  }

  if (error || !releaseData) {
    return (
      <Layout transparentHeader>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#000', color: 'white', gap: 3 }}>
          <Typography variant="h5">Unable to load release info</Typography>
          <Button 
            variant="outlined" 
            href="https://github.com/pollen-robotics/reachy-mini-desktop-app/releases"
            target="_blank"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            View releases on GitHub
          </Button>
        </Box>
      </Layout>
    );
  }

  const currentPlatform = PLATFORMS[detectedPlatform];
  const currentUrl = releaseData?.platforms[detectedPlatform]?.url;

  return (
    <Layout transparentHeader>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #000 0%, #0a0a12 50%, #0f0f1a 100%)',
          color: 'white',
          pt: 14,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient orbs - spread across the page */}
        <Box
          sx={{
            position: 'absolute',
            top: 100,
            left: '-10%',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            right: '-15%',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 100,
            left: '20%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(255, 149, 0, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* App icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <Box
                  component="img"
                  src="/assets/reachy-icon.svg"
                  alt="Reachy Mini Control"
                  sx={{ width: 64, height: 64 }}
                />
              </Box>
            </Box>

            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Reachy Mini Control
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontWeight: 400,
                mb: 3,
                maxWidth: 450,
                mx: 'auto',
              }}
            >
              The official desktop app to control, program, and play with your Reachy Mini.
            </Typography>

            {/* Version info */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              alignItems="center"
              sx={{ mb: 5 }}
            >
              <Chip
                icon={<Box sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%', ml: 1 }} />}
                label={`v${releaseData?.version}`}
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Released {formatDate(releaseData?.pub_date)}
              </Typography>
            </Stack>

            {/* Primary download button or mobile notice */}
            {isMobile ? (
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  border: '1px solid rgba(255, 149, 0, 0.3)',
                  borderRadius: 3,
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                <DesktopWindowsIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.5)', mb: 1.5 }} />
                <Typography 
                  variant="body1" 
                  sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, mb: 1 }}
                >
                  Desktop only
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Reachy Mini Control is a desktop application available for macOS, Windows, and Linux. Please visit this page from a computer to download it.
                </Typography>
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  href={currentUrl}
                  startIcon={<DownloadIcon />}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: 17,
                    fontWeight: 600,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #FF9500 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(255, 149, 0, 0.35)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 48px rgba(59, 130, 246, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Download for {currentPlatform?.name}
                </Button>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    mt: 2,
                    fontSize: 13,
                  }}
                >
                  {currentPlatform?.subtitle} • {currentPlatform?.format?.replace('.', '').toUpperCase()} package
                </Typography>

                {/* Beta Warning for Windows and Linux */}
                {(detectedPlatform?.startsWith('windows') || detectedPlatform?.includes('linux')) && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2.5,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 2,
                      maxWidth: 500,
                      mx: 'auto',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        fontWeight: 500,
                      }}
                    >
                      {detectedPlatform?.startsWith('windows') 
                        ? <>⚠️ Windows version is currently in Beta - installation requires <strong style={{ color: 'rgba(255,255,255,0.9)' }}>administrator privileges</strong>.</>
                        : <>⚠️ Linux version is currently in Beta - please report any issues on <a href="https://github.com/pollen-robotics/reachy-mini-desktop-app/issues" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>GitHub</a> or <a href="https://discord.gg/HDrGY9eJHt" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Discord</a>.</>
                      }
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* App screenshot */}
            <Box
              component="img"
              src="/assets/desktop-app-screenshot--white.png"
              alt="Reachy Mini Control Dashboard"
              sx={{
                mt: 6,
                width: '100%',
                maxWidth: 700,
                mx: 'auto',
                display: 'block',
                borderRadius: '12px',
              }}
            />
          </Box>

          {/* All platforms - hidden on mobile */}
          {!isMobile && (
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="overline"
                sx={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  display: 'block', 
                  textAlign: 'center',
                  mb: 3,
                  letterSpacing: 2,
                }}
              >
                Available for all platforms
              </Typography>

              <Grid container spacing={2}>
                {['darwin-aarch64', 'windows-x86_64', 'linux-x86_64'].map((key) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={key}>
                    <PlatformCard
                      platformKey={key}
                      url={releaseData?.platforms[key]?.url}
                      isActive={key === detectedPlatform}
                      onClick={() => setDetectedPlatform(key)}
                    />
                  </Grid>
                ))}
              </Grid>
              
            </Box>
          )}

          {/* Features / What's included */}
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 4,
              p: 4,
              mb: 6,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ mb: 3, color: 'white', fontWeight: 600 }}
            >
              What's included
            </Typography>
            
            <Grid container spacing={2}>
              {[
                '3D visualization of your robot',
                'Real-time motor control',
                'App Store with 30+ apps',
                'Camera & microphone access',
                'Record & playback movements',
                'Full SDK integration',
              ].map((feature, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {feature}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Requirements */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}
            >
              Requires macOS 11+, Windows 10+, or Debian/Ubuntu Linux
            </Typography>
            
            {/* Privacy notice - subtle */}
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.3)', 
                fontSize: 11,
                display: 'block',
                mb: 2,
              }}
            >
              📊 Anonymous usage data is collected to improve the app.{' '}
              <Box 
                component="a" 
                href="https://github.com/pollen-robotics/reachy-mini-desktop-app/blob/main/docs/TELEMETRY.md"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'rgba(255, 149, 0, 0.6)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'rgba(255, 149, 0, 0.8)' }
                }}
              >
                Learn more
              </Box>
            </Typography>
            
            <Button
              variant="text"
              size="small"
              href="https://github.com/pollen-robotics/reachy-mini-desktop-app/releases"
              target="_blank"
              endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                '&:hover': { color: 'white' },
              }}
            >
              View all releases on GitHub
            </Button>
          </Box>

          {/* Release Notes */}
          {allReleases.length > 0 && (
            <Box
              id="release-notes"
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 4,
                p: 4,
                scrollMarginTop: '100px', // Offset for fixed header
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ mb: 3, color: 'white', fontWeight: 600 }}
              >
                Release Notes
              </Typography>
              
              <Stack spacing={2.5}>
                {(showAllReleases ? allReleases : allReleases.slice(0, 5))
                  .map((release) => {
                    const changes = parseReleaseChanges(release.body);
                    return (
                      <Box 
                        key={release.id}
                        sx={{
                          borderLeft: '2px solid rgba(255, 149, 0, 0.4)',
                          pl: 3,
                          py: 0.5,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mb: changes.length > 0 ? 1 : 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ color: 'white', fontWeight: 600 }}
                          >
                            {release.tag_name}
                          </Typography>
                          <Chip
                            label={formatDate(release.published_at)}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'rgba(255,255,255,0.5)',
                              fontSize: 10,
                              height: 20,
                            }}
                          />
                          {release.prerelease && (
                            <Chip
                              label="Pre-release"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 149, 0, 0.15)',
                                color: '#FF9500',
                                fontSize: 10,
                                height: 20,
                              }}
                            />
                          )}
                          {/* Download icon - direct download for detected platform */}
                          <Tooltip title={`Download ${release.tag_name}`} arrow>
                            <IconButton
                              component="a"
                              href={getDownloadUrlForPlatform(release, detectedPlatform)}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                padding: 0.5,
                                ml: 'auto',
                                '&:hover': {
                                  color: '#FF9500',
                                  backgroundColor: 'rgba(255, 149, 0, 0.1)',
                                },
                              }}
                            >
                              <DownloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        
                        {changes.length > 0 && (
                          <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                            {changes.map((change, i) => (
                              <Box 
                                component="li" 
                                key={i}
                                sx={{ 
                                  color: 'rgba(255,255,255,0.6)',
                                  fontSize: 13,
                                  lineHeight: 1.6,
                                  position: 'relative',
                                  '&::before': {
                                    content: '"•"',
                                    position: 'absolute',
                                    left: -14,
                                    color: 'rgba(255, 149, 0, 0.6)',
                                  }
                                }}
                              >
                                {change}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
              </Stack>
              
              {allReleases.length > 5 && (
                <Button
                  variant="text"
                  onClick={() => setShowAllReleases(!showAllReleases)}
                  endIcon={showAllReleases ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ 
                    mt: 2,
                    color: 'rgba(255,255,255,0.5)',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {showAllReleases ? 'Show less' : 'Show older releases'}
                </Button>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Layout>
  );
}
