import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  Fade,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

import Layout from '../components/Layout';
import PageHero from '../components/PageHero';

// FAQ Data
const faqSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      {
        question: 'How do I connect to Reachy Mini from Python?',
        answer: `To control Reachy Mini, you mainly use the ReachyMini class from the reachy_mini package:

\`\`\`python
from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # your code here
    ...
\`\`\`

This connects to the Reachy Mini daemon and initializes motors and sensors.`,
        tags: ['SDK', 'Python'],
      },
      {
        question: 'Do I need to start the daemon manually?',
        answer: `Yes. All examples assume you have already started the Reachy Mini daemon:
- Either via command line: \`reachy-mini-daemon\`
- Or via Python: \`reachy_mini.daemon.app.main\``,
        tags: ['SDK'],
      },
      {
        question: 'How long does assembly usually take?',
        answer: 'Most testers report 1.5–2 hours, with some up to 4 hours depending on experience.',
        tags: ['Hardware'],
      },
      {
        question: "The dashboard at http://localhost:8000 doesn't work — what should I check?",
        answer: `Typical checks:
1. You are using a proper Python virtual environment (.venv)
2. You installed/updated the Reachy Mini SDK: \`pip install -U reachy-mini\`
3. The daemon is running`,
        tags: ['SDK'],
      },
    ],
  },
  {
    id: 'movement',
    title: 'Moving the Robot',
    items: [
      {
        question: "How do I move Reachy Mini's head to a specific pose?",
        answer: `Use goto_target with a pose created by create_head_pose:

\`\`\`python
from reachy_mini import ReachyMini
from reachy_mini.utils import create_head_pose

with ReachyMini() as mini:
    mini.goto_target(head=create_head_pose(y=-10, mm=True))
\`\`\``,
        tags: ['Movement', 'SDK'],
      },
      {
        question: "What's the difference between goto_target and set_target?",
        answer: `**goto_target:** Interpolates motion over a duration (default 0.5s). Supports different interpolation methods (linear, minjerk, ease, cartoon). Ideal for smooth, timed motions.

**set_target:** Sets the target immediately, without interpolation. Suited for high-frequency control (e.g. sinusoidal trajectories, teleoperation).`,
        tags: ['Movement', 'SDK'],
      },
      {
        question: 'How do I move head, body, and antennas at the same time?',
        answer: `Use goto_target with multiple named arguments:

\`\`\`python
mini.goto_target(
    head=create_head_pose(y=-10, mm=True),
    antennas=np.deg2rad([45, 45]),
    duration=2.0,
    body_yaw=np.deg2rad(30),
)
\`\`\``,
        tags: ['Movement'],
      },
    ],
  },
  {
    id: 'apps',
    title: 'Making & Sharing Apps',
    items: [
      {
        question: 'How do I Make a Reachy Mini app?',
        answer: `Check this tutorial : https://huggingface.co/blog/pollen-robotics/make-and-publish-your-reachy-mini-apps`,
        tags: ['SDK', 'Python'],
      },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware & Motion Limits',
    items: [
      {
        question: 'What are the safety limits of the head and body?',
        answer: `Physical & software limits include:
- Body yaw: [-180°, 180°]
- Head pitch/roll: [-40°, 40°]
- Head yaw: [-180°, 180°]
- Difference (body_yaw - head_yaw): [-65°, 65°]

If you command a pose outside these limits, Reachy Mini will automatically clamp to the nearest safe pose.`,
        tags: ['Hardware'],
      },
    ],
  },
  {
    id: 'sensors',
    title: 'Sensors & Media',
    items: [
      {
        question: 'How do I grab camera frames from Reachy Mini?',
        answer: `Use the media object:

\`\`\`python
with ReachyMini() as mini:
    frame = mini.media.get_frame()
    # frame is a numpy array
\`\`\``,
        tags: ['Vision', 'SDK'],
      },
      {
        question: 'How do I access microphone audio samples?',
        answer: `\`\`\`python
with ReachyMini() as mini:
    sample = mini.media.get_audio_sample()
\`\`\``,
        tags: ['Audio'],
      },
    ],
  },
  {
    id: 'motors',
    title: 'Motors & Compliancy',
    items: [
      {
        question: 'How do I enable, disable, or make motors compliant?',
        answer: `Three main methods:

1. **enable_motors**: Powers motors ON. Robot holds position.
2. **disable_motors**: Powers motors OFF. Robot is limp.
3. **make_motors_compliant**: Motors ON but soft. Good for teaching-by-demonstration.`,
        tags: ['Hardware', 'SDK'],
      },
    ],
  },
];

// Tag color - all primary
const tagColor = { bg: 'rgba(255, 149, 0, 0.1)', color: '#FF9500', border: 'rgba(255, 149, 0, 0.25)' };

// Extract all unique tags from FAQ data
const allTags = [...new Set(faqSections.flatMap((s) => s.items.flatMap((i) => i.tags)))].sort();

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Filter FAQ items based on search and tag
  const filteredSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          // Tag filter
          if (selectedTag && !item.tags.includes(selectedTag)) {
            return false;
          }
          // Search filter
          if (query) {
            return (
              item.question.toLowerCase().includes(query) ||
              item.answer.toLowerCase().includes(query) ||
              item.tags.some((tag) => tag.toLowerCase().includes(query))
            );
          }
          return true;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, selectedTag]);

  const totalResults = filteredSections.reduce((acc, section) => acc + section.items.length, 0);
  const totalItems = faqSections.reduce((acc, section) => acc + section.items.length, 0);
  const hasActiveFilter = searchQuery.trim() || selectedTag;

  const handleTagClick = (tag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <Layout transparentHeader>
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Reachy Mini — from setup to advanced programming."
        accentColor="#8b5cf6"
        stickers={[
          { src: '/assets/reachies/explorer.png', size: 240, top: 20, right: 120, rotation: 8 },
          { src: '/assets/reachies/magician.png', size: 200, bottom: 0, left: 140, rotation: -10 },
        ]}
        primitives={[
          { type: 'ring', color: '#8b5cf6', size: 80, top: 80, left: 200 },
          { type: 'squareOutline', color: '#ec4899', size: 60, bottom: 50, right: 180, rotation: 15 },
        ]}
      />

      {/* Search + HuggingChat CTA */}
      <Box
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 100,
          backgroundColor: 'background.default',
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md">
          {/* Search + AI Button row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            
            {/* HuggingChat CTA Button */}
            <Button
              variant="outlined"
              color="primary"
              href="https://huggingface.co/chat/"
              target="_blank"
              startIcon={<Box sx={{ fontSize: 18 }}>🤗</Box>}
              endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              sx={{
                flexShrink: 0,
                px: 3,
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: 'nowrap',
                borderRadius: 3,
              }}
            >
              Ask AI
            </Button>
          </Stack>

          {/* Tag filters */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 2 }}
          >
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s ease',
                  backgroundColor:
                    selectedTag === tag
                      ? tagColor.color
                      : tagColor.bg,
                  color:
                    selectedTag === tag
                      ? 'white'
                      : tagColor.color,
                  border: `1px solid ${
                    selectedTag === tag
                      ? tagColor.color
                      : tagColor.border
                  }`,
                  '&:hover': {
                    backgroundColor:
                      selectedTag === tag
                        ? tagColor.color
                        : tagColor.bg,
                    transform: 'translateY(-1px)',
                  },
                }}
              />
            ))}
          </Stack>

          {/* Filter status */}
          <Fade in={hasActiveFilter}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {totalResults} of {totalItems} question{totalItems !== 1 ? 's' : ''}
                </Typography>
                {selectedTag && (
                  <Chip
                    label={selectedTag}
                    size="small"
                    onDelete={() => setSelectedTag(null)}
                    sx={{
                      fontSize: 11,
                      height: 24,
                      backgroundColor: tagColor.bg,
                      color: tagColor.color,
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': {
                        color: tagColor.color,
                        '&:hover': {
                          color: tagColor.color,
                        },
                      },
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="body2"
                onClick={clearFilters}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Clear all
              </Typography>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* FAQ Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        {filteredSections.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontSize: 56, mb: 2, opacity: 0.4 }}>🔍</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              No results found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filters
            </Typography>
            <Chip
              label="Clear filters"
              onClick={clearFilters}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
              }}
            />
          </Box>
        ) : (
          filteredSections.map((section) => (
            <Box key={section.id} sx={{ mb: 6 }}>
              {/* Section header */}
              <Typography variant="h4" sx={{ mb: 3 }}>{section.title}</Typography>

              {/* FAQ items */}
              {section.items.map((item, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box>
                      <Typography fontWeight={600} sx={{ mb: 1 }}>
                        {item.question}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {item.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                            sx={{
                              fontSize: 11,
                              height: 22,
                              cursor: 'pointer',
                              backgroundColor: tagColor.bg,
                              color: tagColor.color,
                              border: `1px solid ${
                                selectedTag === tag
                                  ? tagColor.color
                                  : 'transparent'
                              }`,
                              fontWeight: 600,
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                backgroundColor: tagColor.bg,
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        '& pre': {
                          m: 0,
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 2,
                          p: 2,
                          overflowX: 'auto',
                        },
                        '& code': {
                          fontFamily: 'monospace',
                          fontSize: 13,
                          lineHeight: 1.7,
                        },
                        '& code:not(pre code)': {
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          display: 'inline-block',
                        },
                        '& ul': {
                          pl: 3,
                          mb: 1.5,
                          color: 'text.secondary',
                        },
                        '& li': {
                          mb: 0.5,
                          lineHeight: 1.7,
                        },
                      }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          p: ({ children }) => (
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                              {children}
                            </Typography>
                          ),
                          pre: ({ children }) => <Box component="pre">{children}</Box>,
                          code: ({ inline, className, children, ...props }) =>
                            inline ? (
                              <Box component="code" {...props}>
                                {children}
                              </Box>
                            ) : (
                              <Box component="code" className={className} {...props}>
                                {children}
                              </Box>
                            ),
                          a: ({ children, ...props }) => (
                            <Box
                              component="a"
                              {...props}
                              sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {children}
                            </Box>
                          ),
                          ul: ({ children }) => <Box component="ul">{children}</Box>,
                          li: ({ children }) => <Box component="li">{children}</Box>,
                        }}
                      >
                        {item.answer}
                      </ReactMarkdown>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))
        )}
      </Container>

      {/* Still have questions? - Discord CTA */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Box
            component="a"
            href="https://discord.gg/2bAhWfXme9"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 3,
              p: { xs: 4, md: 5 },
              borderRadius: 4,
              background: '#0f0f1a',
              border: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                component="img"
                src="/assets/discord-logo.svg"
                alt="Discord"
                sx={{ width: 48, height: 48, opacity: 0.9 }}
              />
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                  Need more help?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                  Join our Discord to chat with +9.000 makers and the Pollen team.
                </Typography>
              </Box>
            </Stack>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Join Discord →
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}
