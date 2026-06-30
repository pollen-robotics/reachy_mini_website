import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BuildIcon from '@mui/icons-material/Build';

import Layout from '../components/Layout';
import DecorativeShape from '../components/DecorativeShape';

// Product data
const products = {
  wireless: {
    name: 'Reachy Mini',
    tagline: 'The complete experience',
    price: 499,
    badge: 'Wireless',
    badgeColor: '#0ea5e9',
    description: 'Self-contained robot with on-board compute. Works wirelessly or wired, perfect for standalone projects and demos. <strong>Ships in 60 days</strong>.',
    buyLink: 'https://store.pollen-robotics.com/products/reachy-mini-wireless-version',
    image: '/assets/reachy-wireless.png',
    featured: true,
  },
  lite: {
    name: 'Reachy Mini Lite',
    tagline: 'Perfect to get started',
    price: 399,
    badge: 'Lite',
    badgeColor: '#f59e0b',
    description: 'Connect to your computer via USB. Same expressive robot, powered by your machine. Ideal for development and learning. <strong>Ships in 30 days</strong>.',
    buyLink: 'https://store.pollen-robotics.com/products/reachy-mini-lite-version',
    image: '/assets/reachy-lite.png',
    featured: false,
  },
};

// Comparison features
const comparisonFeatures = [
  { name: 'Motors & Mechanics', wireless: '9 servo motors', lite: '9 servo motors' },
  { name: 'Head Movement', wireless: '6 DOF (pitch, roll, yaw, x, y, z)', lite: '6 DOF (pitch, roll, yaw, x, y, z)' },
  { name: 'Body Rotation', wireless: '±160°', lite: '±160' },
  { name: 'Antennas', wireless: '2 animated antennas', lite: '2 animated antennas' },
  { name: 'Camera', wireless: 'Wide angle', lite: 'Wide angle' },
  { name: 'Microphones', wireless: '4 microphones array', lite: '4 microphones array' },
  { name: 'Speaker', wireless: '5W speaker', lite: '5W speaker' },
  { name: 'On-board Compute', wireless: 'Raspberry Pi CM 4 (16GB storage)', lite: false },
  { name: 'Accelerometer', wireless: 'Built-in IMU', lite: false },
  { name: 'Wi-Fi Connectivity', wireless: 'Wi-Fi', lite: false },
  { name: 'Standalone Mode', wireless: true, lite: false },
  { name: 'USB Connection', wireless: true, lite: true },
  { name: 'Power', wireless: 'Battery powered + power supply (7.3V / 5A)', lite: 'Power supply (7.3V / 5A)' },
];

// What's in the box
const boxContents = [
  { icon: '🤖', title: 'Plastic Parts', description: 'All structural components are injection molded and ready to assemble' },
  { icon: '⚙️', title: 'Motors & Electronics', description: '9 servo motors, control board, and two electronic boards' },
  { icon: '📷', title: 'Camera Module', description: 'Wide-angle camera for vision applications' },
  { icon: '🔊', title: 'Audio System', description: '4 microphones array + 5W speaker for voice interaction' },
  { icon: '🔧', title: 'Hardware Kit', description: 'All screws, cables, and tools included' },
  { icon: '📖', title: 'Documentation', description: 'Step-by-step assembly guide and quickstart materials' },
];

// FAQ data
const faqItems = [
  {
    question: 'What is the difference between Wireless and Lite?',
    answer: 'The Wireless version includes a Raspberry Pi CM 4 built-in, allowing it to run standalone without a computer. The Lite version connects to your Mac, Linux, or Windows computer via USB and uses your computer for processing. Both versions have the same mechanical design and audio/video capabilities.',
  },
  {
    question: 'How long does assembly take?',
    answer: 'Most users report 1.5–2 hours for assembly. The kit comes with pre-printed parts and clear step-by-step video instructions. No soldering required!',
  },
  {
    question: 'What about customs and import taxes?',
    answer: 'All orders ship DAP (Delivered At Place). Shipping costs and any local import duties, taxes, or customs fees are the responsibility of the buyer and are not included in the product price.',
  },
  {
    question: 'Can I upgrade from Lite to Wireless later?',
    answer: 'The electronics architecture is different between versions, so a direct upgrade isn\'t possible. However, you can always purchase the Wireless version separately if you want standalone capabilities.',
  },
  {
    question: 'What software is included?',
    answer: 'All software is open-source and free. You get access to the Python SDK, desktop dashboard, and the entire library of community-built applications on Hugging Face Spaces.',
  },
];

// Hero Section
function HeroSection() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        pt: { xs: 14, md: 18 },
        pb: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <DecorativeShape
        color="#FF9500"
        size={200}
        type="ring"
        top={-60}
        right={-40}
        opacity={0.08}
        floatRange={15}
      />
      <DecorativeShape
        color="#0ea5e9"
        size={80}
        type="circle"
        top={120}
        right={180}
        opacity={0.12}
        floatRange={8}
        floatSpeed={4000}
      />
      <DecorativeShape
        color="#f59e0b"
        size={50}
        type="square"
        bottom={60}
        left={80}
        rotation={15}
        opacity={0.1}
        floatRange={6}
        floatSpeed={5000}
      />

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, display: 'block', letterSpacing: '0.15em' }}
          >
            Open Source Robot Kit
          </Typography>
          
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Buy Reachy Mini
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            An expressive companion robot designed for human interaction, creative coding, and AI experimentation. Assemble in 2 hours, code in Python, endless possibilities.
          </Typography>

          {/* <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Chip
              icon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
              label="Free worldwide shipping"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 13,
                fontWeight: 500,
                px: 1,
              }}
            />
            <Chip
              icon={<InventoryIcon sx={{ fontSize: 18 }} />}
              label="Ships in 3-5 days"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 13,
                fontWeight: 500,
                px: 1,
              }}
            />
            <Chip
              icon={<SupportAgentIcon sx={{ fontSize: 18 }} />}
              label="1-year warranty"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 13,
                fontWeight: 500,
                px: 1,
              }}
            />
          </Stack> */}
        </Box>
      </Container>
    </Box>
  );
}

// Product Cards Section
function ProductCardsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
      <Grid container spacing={4} justifyContent="center">
        {Object.entries(products).map(([key, product]) => (
          <Grid key={key} size={{ xs: 12, md: 6 }} sx={{ maxWidth: 500 }}>
            <Card
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                border: product.featured ? '2px solid' : '1px solid',
                borderColor: product.featured ? '#FF9500' : 'divider',
                transform: hoveredCard === key ? 'translateY(-8px)' : 'none',
                boxShadow: hoveredCard === key 
                  ? '0 20px 60px rgba(0, 0, 0, 0.15)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              {product.featured && (
                <Chip
                  label="Most Popular"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#FF9500',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                />
              )}

              <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Badge */}
                <Chip
                  label={product.badge}
                  size="small"
                  sx={{
                    width: 'fit-content',
                    mb: 2,
                    backgroundColor: `${product.badgeColor}20`,
                    color: product.badgeColor,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />

                {/* Title & Tagline */}
                <Typography variant="h3" sx={{ mb: 0.5, fontSize: '28px' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.tagline}
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 48,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: 'text.primary',
                    }}
                  >
                    ${product.price}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }}
                  >
                    USD
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6, flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Key highlights */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {key === 'wireless' ? (
                    <>
                      <FeatureRow icon="✓" text="On-board Raspberry Pi CM 4" highlight />
                      <FeatureRow icon="✓" text="Wi-Fi + USB connectivity" highlight />
                      <FeatureRow icon="✓" text="Built-in IMU" highlight />
                    </>
                  ) : (
                    <>
                      <FeatureRow icon="✓" text="Same expressive design" />
                      <FeatureRow icon="✓" text="Connect via USB to computer" />
                      <FeatureRow icon="✓" text="Perfect for development" />
                    </>
                  )}
                </Stack>

                {/* CTA Button */}
                <Button
                  variant={product.featured ? 'contained' : 'outlined'}
                  size="large"
                  fullWidth
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon />}
                  sx={product.featured ? {
                    bgcolor: '#FF9500',
                    '&:hover': { bgcolor: '#e68600' },
                  } : {}}
                >
                  Buy {product.badge} — ${product.price}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lead time & shipping notice */}
      <Box sx={{ textAlign: 'center', mt: 5, mb: 6 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Current Lead time: 90 days after purchase
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7, mt: 1 }}
        >
          <strong>Shipping and import duties:</strong> all orders ship DAP (Delivered At Place).
          <br />
          Shipping costs and any local import duties, taxes, or customs fees are the responsibility of the buyer and are not included in the product price.
        </Typography>
      </Box>
    </Container>
  );
}

// Feature row helper
function FeatureRow({ icon, text, highlight = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ color: highlight ? '#FF9500' : 'success.main', fontWeight: 600 }}>
        {icon}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}

// Comparison Table Section
function ComparisonSection() {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.alt' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Compare Versions
          </Typography>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Full Feature Comparison
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Both versions share the same mechanical design and audio/video capabilities. 
            The main difference is the on-board compute.
          </Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              minWidth: 720,
            }}
          >
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.alt' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 15, py: 2.5 }}>
                    Feature
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 15, py: 2.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <Chip label="Wireless" size="small" sx={{ bgcolor: '#0ea5e920', color: '#0ea5e9', fontWeight: 600 }} />
                      <Typography fontWeight={700}>$499</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 15, py: 2.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <Chip label="Lite" size="small" sx={{ bgcolor: '#f59e0b20', color: '#f59e0b', fontWeight: 600 }} />
                      <Typography fontWeight={700}>$399</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonFeatures.map((feature, index) => (
                  <TableRow 
                    key={feature.name}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Typography fontWeight={500}>{feature.name}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <FeatureValue value={feature.wireless} />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <FeatureValue value={feature.lite} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
}

// Feature value helper
function FeatureValue({ value }) {
  if (value === true) {
    return <CheckIcon sx={{ color: 'success.main', fontSize: 22 }} />;
  }
  if (value === false) {
    return <CloseIcon sx={{ color: 'text.disabled', fontSize: 22 }} />;
  }
  return <Typography variant="body2" color="text.secondary">{value}</Typography>;
}

// What's in the Box Section
function WhatsInTheBoxSection() {
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Complete Kit
          </Typography>
          <Typography variant="h3" sx={{ mb: 2 }}>
            What's in the Box
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to build your Reachy Mini. No 3D printer or soldering required.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {boxContents.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ fontSize: 40, mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={RouterLink}
            to="/getting-started"
            variant="outlined"
            startIcon={<BuildIcon />}
          >
            View Assembly Guide
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.alt' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Questions?
          </Typography>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Frequently Asked
          </Typography>
        </Box>

        <Stack spacing={2}>
          {faqItems.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Still have questions?
          </Typography>
          <Button
            variant="text"
            href="https://discord.gg/2bAhWfXme9"
            target="_blank"
            endIcon={<OpenInNewIcon />}
          >
            Ask on Discord
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Final CTA Section
function FinalCTASection() {
  return (
    <Box
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DecorativeShape
        color="#FF9500"
        size={150}
        type="ring"
        top={-50}
        left={-30}
        opacity={0.1}
        floatRange={10}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Ready to build your Reachy Mini?
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, maxWidth: 500, mx: 'auto' }}
        >
          Join hundreds of makers, developers, and AI enthusiasts who are already creating with Reachy Mini.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            href={products.wireless.buyLink}
            target="_blank"
            endIcon={<OpenInNewIcon />}
            sx={{
              bgcolor: '#FF9500',
              px: 4,
              '&:hover': { bgcolor: '#e68600' },
            }}
          >
            Buy Wireless — $499
          </Button>
          <Button
            variant="outlined"
            size="large"
            href={products.lite.buyLink}
            target="_blank"
            endIcon={<OpenInNewIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              px: 4,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Buy Lite — $399
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

// Main Buy Page
export default function Buy() {
  return (
    <Layout transparentHeader>
      <HeroSection />
      <ProductCardsSection />
      <ComparisonSection />
      <WhatsInTheBoxSection />
      <FAQSection />
      <FinalCTASection />
    </Layout>
  );
}
