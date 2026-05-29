import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import {
  Box,
  Container,
  Typography,
  InputBase,
  Avatar,
  Chip,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Link,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import Layout from '../components/Layout';
import ReachiesCarousel from '../components/ReachiesCarousel';
import { useApps } from '../context/AppsContext';
import { useAuth } from '../context/AuthContext';
import InstallModal from '../components/InstallModal';

/**
 * Render text with highlighted match ranges from Fuse.js.
 * indices is an array of [start, end] pairs.
 */
function HighlightText({ text, indices }) {
  if (!text) return null;
  if (!indices || indices.length === 0) return text;

  // Only keep matches that span at least 2 characters
  const significant = indices.filter(([start, end]) => end - start >= 1);
  if (significant.length === 0) return text;

  // Merge overlapping / adjacent ranges and sort
  const sorted = [...significant].sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    if (sorted[i][0] <= prev[1] + 1) {
      prev[1] = Math.max(prev[1], sorted[i][1]);
    } else {
      merged.push(sorted[i]);
    }
  }

  const parts = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (cursor < start) {
      parts.push(<span key={`t${cursor}`}>{text.slice(cursor, start)}</span>);
    }
    parts.push(
      <span
        key={`h${start}`}
        style={{
          backgroundColor: 'rgba(255, 149, 0, 0.18)',
          color: '#b36b00',
          borderRadius: 2,
          padding: '0 1px',
        }}
      >
        {text.slice(start, end + 1)}
      </span>
    );
    cursor = end + 1;
  }
  if (cursor < text.length) {
    parts.push(<span key={`t${cursor}`}>{text.slice(cursor)}</span>);
  }
  return <>{parts}</>;
}

// App Card Component (memoized to avoid re-renders when only search changes)
const AppCard = memo(function AppCard({ app, onInstallClick, isLiked, onToggleLike, isLoggedIn, matchData }) {
  const isOfficial = app.isOfficial;
  const isPythonApp = app.extra?.isPythonApp !== false; // Default to true for backwards compatibility
  const cardData = app.extra?.cardData || {};
  const author = app.extra?.author || app.id?.split('/')?.[0] || null;
  const baseLikes = app.extra?.likes || 0;
  const lastModified = app.extra?.lastModified || null;
  const emoji = cardData.emoji || (isPythonApp ? '📦' : '🌐');
  const spaceUrl = app.url || `https://huggingface.co/spaces/${app.id}`;
  
  // Compute displayed likes: adjust based on like state vs original data
  const displayedLikes = baseLikes + (isLiked ? 1 : 0);
  
  const formattedDate = lastModified 
    ? new Date(lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const handleCardClick = () => {
    if (isPythonApp) {
      onInstallClick?.(app);
    } else {
      // Web app: open Space in new tab
      window.open(spaceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPythonApp) {
      onInstallClick?.(app);
    } else {
      window.open(spaceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        border: isOfficial ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          borderColor: isOfficial ? 'rgba(59, 130, 246, 0.4)' : 'rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Top Bar with Author, Official Badge, and Likes */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Author + Official Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          {author && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  bgcolor: isOfficial ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isOfficial ? '#FF9500' : '#1a1a1a',
                  flexShrink: 0,
                }}
              >
                {author.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#666666',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <HighlightText text={author} indices={matchData?._searchAuthor} />
              </Typography>
            </Box>
          )}
          
          {/* Official Badge - inline with author */}
          {isOfficial && (
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
              label="Official"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 149, 0, 0.1)',
                color: '#FF9500',
                fontWeight: 600,
                fontSize: 10,
                height: 20,
                flexShrink: 0,
                '& .MuiChip-icon': {
                  color: '#FF9500',
                  ml: 0.5,
                },
                '& .MuiChip-label': {
                  px: 0.75,
                },
              }}
            />
          )}
          
          {/* Web App Badge */}
          {!isPythonApp && (
            <Chip
              label="Web"
              size="small"
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                fontWeight: 600,
                fontSize: 10,
                height: 20,
                flexShrink: 0,
                '& .MuiChip-label': {
                  px: 0.75,
                },
              }}
            />
          )}
        </Box>
        
        {/* Likes - Interactive */}
        <Tooltip
          title={isLoggedIn ? '' : 'Sign in to like this app'}
          arrow
          placement="top"
          disableHoverListener={isLoggedIn}
        >
          <Box
            component="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike?.(app.id);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
              p: 0.5,
              borderRadius: '6px',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(236, 72, 153, 0.08)',
              },
            }}
          >
            {isLiked ? (
              <FavoriteIcon sx={{ fontSize: 16, color: '#ec4899' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16, color: '#666666' }} />
            )}
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isLiked ? '#ec4899' : '#666666',
              }}
            >
              {displayedLikes}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
      
      {/* Content */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Title + Emoji Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.3px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            <HighlightText
              text={app.name || app.id?.split('/').pop()}
              indices={matchData?.name}
            />
          </Typography>
          
          <Typography
            component="span"
            sx={{
              fontSize: 28,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {emoji}
          </Typography>
        </Box>
        
        {/* Description */}
        <Typography
          sx={{
            fontSize: 13,
            color: '#666666',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 2,
            flex: 1,
          }}
        >
          <HighlightText
            text={cardData.short_description || app.description || 'No description'}
            indices={matchData?._searchDescription}
          />
        </Typography>
        
        {/* Date + Install Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Date */}
          {formattedDate ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: '#999' }} />
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#999',
                }}
              >
                {formattedDate}
              </Typography>
            </Box>
          ) : (
            <Box />
          )}
          
          {/* Action Button */}
          <Button
            variant="text"
            size="small"
            endIcon={isPythonApp 
              ? <DownloadIcon sx={{ fontSize: 14 }} />
              : <OpenInNewIcon sx={{ fontSize: 14 }} />
            }
            onClick={handleButtonClick}
            sx={{
              py: 0.5,
              px: 1.5,
              borderRadius: '8px',
              color: isPythonApp ? '#FF9500' : '#6366f1',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'none',
              '&:hover': {
                bgcolor: isPythonApp ? 'rgba(255, 149, 0, 0.08)' : 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            {isPythonApp ? 'Install' : 'Open'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
});

// Isolated search input — typing only re-renders this component, not the whole page
const SearchInput = memo(function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      onSearch('');
      return;
    }
    debounceRef.current = setTimeout(() => onSearch(value.trim()), 200);
    return () => clearTimeout(debounceRef.current);
  }, [value, onSearch]);

  return (
    <>
      <SearchIcon sx={{ fontSize: 22, color: '#999' }} />
      <InputBase
        placeholder="Search apps by name, description, tags..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          flex: 1,
          fontSize: 15,
          fontWeight: 500,
          color: '#333',
          '& input::placeholder': {
            color: '#999',
            opacity: 1,
          },
        }}
      />
      {value && (
        <IconButton
          onClick={() => { setValue(''); onSearch(''); }}
          size="small"
          sx={{ color: '#999' }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}
    </>
  );
});

// Tags to exclude from category filters
const EXCLUDED_TAGS = new Set([
  'reachy_mini', 'reachy-mini', 'reachy_mini_python_app',
  'static', 'docker', 'region:us', 'region:eu',
]);

// Format a tag name for display (e.g. "reachy_mini_game" → "Reachy Mini Game")
function formatTagName(tag) {
  if (tag.startsWith('sdk:')) {
    const sdk = tag.replace('sdk:', '');
    return sdk.charAt(0).toUpperCase() + sdk.slice(1).toLowerCase();
  }
  return tag
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Main Apps Page
export default function Apps() {
  // Get apps from context (cached globally)
  const { apps, loading, error } = useApps();
  const { user, isLoggedIn, isOAuthAvailable, login, logout, isSpaceLiked, toggleLike } = useAuth();
  const [officialOnly, setOfficialOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchResults, setSearchResults] = useState(null); // null = no search, [] = no matches
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef(null);

  // Initialize search Web Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/searchWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'RESULTS') {
        setSearchResults(e.data.results);
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  // Send apps to worker to build index whenever apps change
  useEffect(() => {
    if (workerRef.current && apps.length > 0) {
      workerRef.current.postMessage({ type: 'INDEX', apps });
    }
  }, [apps]);

  // Callback from SearchInput component (already debounced)
  const handleSearch = useCallback((query) => {
    if (!query) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    workerRef.current?.postMessage({ type: 'SEARCH', query });
  }, []);
  
  // Install modal state
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const handleInstallClick = (app) => {
    setSelectedApp(app);
    setInstallModalOpen(true);
  };
  
  const handleCloseInstallModal = () => {
    setInstallModalOpen(false);
    setSelectedApp(null);
  };

  const handleToggleLike = useCallback(
    (spaceId) => {
      toggleLike(spaceId);
    },
    [toggleLike]
  );

  // Extract available categories from app tags, sorted by count (top 8)
  const categories = useMemo(() => {
    const categoryMap = new Map();

    // Use only apps matching current mode (official toggle)
    const baseApps = officialOnly ? apps.filter((a) => a.isOfficial) : apps;

    baseApps.forEach((app) => {
      const rootTags = app.extra?.tags || [];
      const cardDataTags = app.extra?.cardData?.tags || [];
      const allTags = [...new Set([...rootTags, ...cardDataTags])];
      const sdk = app.extra?.sdk || app.extra?.cardData?.sdk;

      allTags.forEach((tag) => {
        if (
          tag &&
          typeof tag === 'string' &&
          !tag.startsWith('region:') &&
          !EXCLUDED_TAGS.has(tag.toLowerCase())
        ) {
          categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
        }
      });

      // Add SDK as category if not already covered by a tag
      if (sdk && typeof sdk === 'string') {
        const hasMatchingTag = allTags.some(
          (t) => t && typeof t === 'string' && t.toLowerCase() === sdk.toLowerCase()
        );
        if (!hasMatchingTag) {
          const sdkKey = `sdk:${sdk}`;
          categoryMap.set(sdkKey, (categoryMap.get(sdkKey) || 0) + 1);
        }
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)))
      .slice(0, 8);
  }, [apps, officialOnly]);

  // Filter apps based on worker search results, official toggle, and category
  const filteredApps = useMemo(() => {
    let result = apps;

    // Filter by official
    if (officialOnly) {
      result = result.filter((app) => app.isOfficial === true);
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((app) => {
        const rootTags = app.extra?.tags || [];
        const cardDataTags = app.extra?.cardData?.tags || [];
        const allTags = [...new Set([...rootTags, ...cardDataTags])];
        const sdk = app.extra?.sdk || app.extra?.cardData?.sdk;

        if (selectedCategory.startsWith('sdk:')) {
          return sdk === selectedCategory.replace('sdk:', '');
        }
        const tagMatch = allTags.some(
          (t) => t && typeof t === 'string' && t.toLowerCase() === selectedCategory.toLowerCase()
        );
        const sdkMatch =
          sdk && typeof sdk === 'string' && sdk.toLowerCase() === selectedCategory.toLowerCase();
        return tagMatch || sdkMatch;
      });
    }

    // Apply fuzzy search results from worker
    if (searchResults !== null) {
      const scoreMap = new Map(searchResults.map((r) => [r.id, r.score]));
      const matchedIds = new Set(searchResults.map((r) => r.id));
      result = result.filter((app) => matchedIds.has(app.id));
      result.sort((a, b) => (scoreMap.get(a.id) || 1) - (scoreMap.get(b.id) || 1));
      return result;
    }

    // Default sort: by likes (descending)
    result.sort((a, b) => (b.extra?.likes || 0) - (a.extra?.likes || 0));

    return result;
  }, [apps, officialOnly, selectedCategory, searchResults]);

  // Build a map of app ID → match highlight data
  const matchDataMap = useMemo(() => {
    if (!searchResults) return null;
    const map = new Map();
    for (const r of searchResults) {
      map.set(r.id, r.matches);
    }
    return map;
  }, [searchResults]);

  const isFiltered = searchResults !== null || officialOnly || selectedCategory;

  return (
    <Layout transparentHeader>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          pt: { xs: 16, md: 18 },
          pb: { xs: 10, md: 12 },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '5%',
            width: 350,
            height: 350,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 4, md: 6 },
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Reachies Carousel */}
            <Box sx={{ flexShrink: 0 }}>
              <ReachiesCarousel
                width={200}
                height={200}
                interval={2500}
                fadeInDuration={400}
                fadeOutDuration={150}
                zoom={1.6}
                verticalAlign="60%"
              />
            </Box>

            {/* Text content */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  mb: 2,
                  borderRadius: 50,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    fontSize: 11,
                  }}
                >
                  Powered by
                </Typography>
                <Box component="img" src="/assets/hf-logo.svg" alt="Hugging Face" sx={{ height: 14 }} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: 36, md: 52 },
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Applications
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontWeight: 400, 
                  maxWidth: 550,
                  lineHeight: 1.7,
                }}
              >
                Discover apps built by the community and official apps from Pollen Robotics. 
                Install them directly from the Reachy Mini desktop app.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 1, position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2,
            mb: 2,
            borderRadius: '16px',
            bgcolor: 'white',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <SearchInput onSearch={handleSearch} />

          {/* Separator */}
          <Box sx={{ width: '1px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />

          {/* Apps count */}
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: isFiltered ? '#FF9500' : '#999',
              px: 1.5,
              py: 0.5,
              borderRadius: '8px',
              bgcolor: isFiltered ? 'rgba(255, 149, 0, 0.1)' : 'rgba(0, 0, 0, 0.03)',
            }}
          >
            {isFiltered ? `${filteredApps.length}/${apps.length}` : apps.length}
          </Typography>

          {/* Separator */}
          <Box sx={{ width: '1px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />

          {/* Official toggle */}
          <FormControlLabel
            control={
              <Checkbox
                checked={officialOnly}
                onChange={(e) => setOfficialOnly(e.target.checked)}
                size="small"
                sx={{
                  color: '#999',
                  '&.Mui-checked': {
                    color: '#FF9500',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666' }}>
                Official only
              </Typography>
            }
            sx={{ m: 0 }}
          />

          {/* Auth: Login / User (only show when OAuth is available) */}
          {isOAuthAvailable && (
            <Box sx={{ width: '1px', height: '24px', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
          )}

          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={user?.avatarUrl}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  fontWeight: 600,
                  bgcolor: '#FF9500',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#333',
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.preferredUsername || user?.name}
              </Typography>
              <Tooltip title="Sign out">
                <IconButton onClick={logout} size="small" sx={{ color: '#999' }}>
                  <LogoutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : isOAuthAvailable ? (
            <Button
              onClick={login}
              variant="text"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13,
                color: '#333',
                gap: 0.75,
                px: 1.5,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Box
                component="img"
                src="/assets/hf-logo.svg"
                alt=""
                sx={{ height: 16 }}
              />
              Sign in
            </Button>
          ) : null}
        </Box>
      </Container>

      {/* Category Tags */}
      {!loading && categories.length > 0 && (
        <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Tags
            </Typography>

            {/* "All" chip */}
            <Chip
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>All</span>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: !selectedCategory ? '#FF9500' : '#999',
                      opacity: 0.8,
                    }}
                  >
                    ({officialOnly ? apps.filter((a) => a.isOfficial).length : apps.length})
                  </Typography>
                </Box>
              }
              onClick={() => setSelectedCategory(null)}
              size="small"
              sx={{
                height: 28,
                fontSize: 12,
                fontWeight: !selectedCategory ? 700 : 500,
                bgcolor: !selectedCategory
                  ? 'rgba(255, 149, 0, 0.12)'
                  : 'rgba(0, 0, 0, 0.04)',
                color: !selectedCategory ? '#FF9500' : '#666',
                border: !selectedCategory
                  ? '1px solid rgba(255, 149, 0, 0.4)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: !selectedCategory
                    ? 'rgba(255, 149, 0, 0.18)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
                '& .MuiChip-label': { px: 1.5 },
              }}
            />

            {/* Category chips */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <Chip
                  key={cat.name}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{formatTagName(cat.name)}</span>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isSelected ? '#FF9500' : '#999',
                          opacity: 0.8,
                        }}
                      >
                        ({cat.count})
                      </Typography>
                    </Box>
                  }
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  size="small"
                  sx={{
                    height: 28,
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    bgcolor: isSelected
                      ? 'rgba(255, 149, 0, 0.12)'
                      : 'rgba(0, 0, 0, 0.04)',
                    color: isSelected ? '#FF9500' : '#666',
                    border: isSelected
                      ? '1px solid rgba(255, 149, 0, 0.4)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: isSelected
                        ? 'rgba(255, 149, 0, 0.18)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
              );
            })}
          </Box>
        </Container>
      )}

      {/* Apps Grid */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF9500' }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredApps.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontSize: 48, mb: 2 }}>🔍</Typography>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No apps found
            </Typography>
            <Typography sx={{ color: '#999' }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filteredApps.map((app, index) => (
              <AppCard
                key={app.id || index}
                app={app}
                onInstallClick={handleInstallClick}
                isLiked={isSpaceLiked(app.id)}
                onToggleLike={handleToggleLike}
                isLoggedIn={isLoggedIn}
                matchData={matchDataMap?.get(app.id) || null}
              />
            ))}
          </Box>
        )}
      </Container>
      
      {/* Install Modal */}
      <InstallModal
        open={installModalOpen}
        onClose={handleCloseInstallModal}
        app={selectedApp}
      />
    </Layout>
  );
}

