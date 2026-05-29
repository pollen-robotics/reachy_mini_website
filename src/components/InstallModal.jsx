import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ComputerIcon from '@mui/icons-material/Computer';
import { useAuth } from '../context/AuthContext';

function InstallModal({ open, onClose, app }) {
  const { isLoggedIn, isSpaceLiked, toggleLike } = useAuth();
  // Detect Linux users
  const isLinux = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const platform = navigator.platform?.toLowerCase() || '';
    const userAgent = navigator.userAgent?.toLowerCase() || '';
    return platform.includes('linux') || userAgent.includes('linux');
  }, []);

  if (!app) return null;
  
  const appName = app.name || app.id?.split('/').pop();
  const cardData = app.extra?.cardData || {};
  const emoji = cardData.emoji || '📦';
  const description = cardData.short_description || app.description || 'No description';
  const deepLinkUrl = `reachymini://install/${appName}`;
  const spaceUrl = app.url || `https://huggingface.co/spaces/${app.id}`;
  
  const author = app.extra?.author || app.id?.split('/')?.[0] || null;
  const isOfficial = app.isOfficial;
  const baseLikes = app.extra?.likes || 0;
  const isLiked = isSpaceLiked(app.id);
  const displayedLikes = baseLikes + (isLiked ? 1 : 0);
  const lastModified = app.extra?.lastModified || null;
  const formattedDate = lastModified
    ? new Date(lastModified).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  
  const handleInstall = () => {
    window.location.href = deepLinkUrl;
    setTimeout(() => onClose(), 500);
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          maxWidth: 520,
          minWidth: { xs: 'auto', sm: 480 },
          width: '100%',
          mx: 2,
          overflow: 'visible',
          bgcolor: '#fff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {/* Close button outside modal */}
      <IconButton
        onClick={onClose}
        disableRipple
        sx={{
          position: 'absolute',
          top: 0,
          right: -44,
          color: 'rgba(255,255,255,0.8)',
          p: 0.5,
          '&:hover': { color: '#fff', bgcolor: 'transparent' },
        }}
      >
        <CloseIcon sx={{ fontSize: 24 }} />
      </IconButton>

      <DialogContent sx={{ p: 0, overflow: 'hidden', borderRadius: '20px' }}>
        {/* Header */}
        <Box sx={{ p: 3 }}>

          {/* App row */}
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            {/* Emoji */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '18px',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                flexShrink: 0,
              }}
            >
              {emoji}
            </Box>
            
            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0, pr: 4 }}>
              {/* Title */}
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 1,
                  lineHeight: 1.2,
                }}
              >
                {appName}
              </Typography>
              
              {/* Meta row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {author && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: '#e0e0e0',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#666',
                      }}
                    >
                      {author.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, color: '#666', fontFamily: 'monospace' }}>
                      {author}
                    </Typography>
                  </Box>
                )}
                {isOfficial && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                    label="Official"
                    size="small"
                    sx={{
                      height: 24,
                      bgcolor: 'rgba(255, 149, 0, 0.1)',
                      color: '#FF9500',
                      fontWeight: 600,
                      fontSize: 11,
                      '& .MuiChip-icon': { color: '#FF9500', ml: 0.5 },
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                )}
              </Box>
              
              {/* Stats row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Tooltip
                  title={isLoggedIn ? '' : 'Sign in to like this app'}
                  arrow
                  placement="top"
                  disableHoverListener={isLoggedIn}
                >
                  <Box
                    component="button"
                    onClick={() => toggleLike(app.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      border: 'none',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      p: 0.5,
                      m: -0.5,
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: 'rgba(236, 72, 153, 0.08)',
                      },
                    }}
                  >
                    {isLiked ? (
                      <FavoriteIcon sx={{ fontSize: 14, color: '#ec4899' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 14, color: '#999' }} />
                    )}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: isLiked ? '#ec4899' : '#999',
                        fontWeight: isLiked ? 600 : 400,
                      }}
                    >
                      {displayedLikes}
                    </Typography>
                  </Box>
                </Tooltip>
                {formattedDate && (
                  <Typography sx={{ fontSize: 12, color: '#aaa' }}>
                    Updated {formattedDate}
                  </Typography>
                )}
              </Box>
              
              {/* Description - intégrée au bloc info */}
              <Typography
                sx={{
                  fontSize: 13.5,
                  color: '#666',
                  lineHeight: 1.6,
                  mt: 1.5,
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: 1, bgcolor: '#f0f0f0', mx: 3 }} />

        {/* Desktop App Requirement Block */}
        <Box sx={{ p: 3 }}>
          {/* All platforms: Normal install flow */}
          <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2.5,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 149, 0, 0.05)',
                border: '1px solid rgba(255, 149, 0, 0.12)',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 149, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ComputerIcon sx={{ fontSize: 24, color: '#FF9500' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    mb: 0.75,
                  }}
                >
                  Reachy Mini Desktop App required
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.6,
                    mb: 1.5,
                  }}
                >
                  No robot? <Link
                    href="#"
                    sx={{
                      color: '#FF9500',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Try it in simulation mode
                  </Link> – no hardware needed!
                </Typography>
                <Link
                  href="/download"
                  sx={{
                    display: 'inline-block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#FF9500',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Download the desktop app →
                </Link>
              </Box>
            </Box>
          
          {/* Linux Beta Notice */}
          {isLinux && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: '10px',
                bgcolor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: '#3b82f6',
                  fontWeight: 500,
                  textAlign: 'center',
                  '& a': {
                    color: '#3b82f6',
                    textDecoration: 'underline',
                    fontWeight: 600,
                  },
                }}
              >
                Linux support is currently in Beta — please report any issues on{' '}
                <a href="https://github.com/pollen-robotics/reachy-mini-desktop-app/issues" target="_blank" rel="noopener noreferrer">GitHub</a>
                {' '}or{' '}
                <a href="https://discord.gg/HDrGY9eJHt" target="_blank" rel="noopener noreferrer">Discord</a>.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            href={spaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              borderColor: '#ddd',
              color: '#555',
              fontWeight: 600,
              fontSize: 14,
              textTransform: 'none',
              textDecoration: 'none',
              gap: 0.75,
              '&:hover': { borderColor: '#bbb', bgcolor: '#fafafa' },
            }}
          >
            App Page
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </Button>
          
          <Button
            variant="contained"
            onClick={handleInstall}
            startIcon={<DownloadIcon sx={{ fontSize: 20 }} />}
            sx={{
              flex: 1.5,
              py: 1.5,
              borderRadius: '12px',
              bgcolor: '#FF9500',
              fontWeight: 600,
              fontSize: 14,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#e68600',
                boxShadow: '0 4px 12px rgba(255, 149, 0, 0.35)',
              },
            }}
          >
            Install
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default InstallModal;
