import { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, Stack } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

// Floating Sticker with scroll parallax
function FloatingSticker({ src, size, top, left, right, bottom, rotation = 0, floatRange = 12, floatSpeed = 5500, scrollFactor = 0.03 }) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrame;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const offset = Math.sin((elapsed / floatSpeed) * Math.PI * 2) * floatRange;
      setFloatOffset(offset);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [floatSpeed, floatRange]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const springProps = useSpring({
    transform: `translateY(${floatOffset + scrollY * scrollFactor}px) rotate(${rotation}deg)`,
    config: { mass: 3, tension: 80, friction: 40 },
  });

  return (
    <animated.img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width: size,
        height: 'auto',
        pointerEvents: 'none',
        zIndex: 2,
        ...springProps,
      }}
    />
  );
}

// Floating Primitive Shape
function FloatingPrimitive({ type = 'circle', color, size, top, left, right, bottom, rotation = 0, floatRange = 8, floatSpeed = 5000, scrollFactor = 0.02 }) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrame;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const offset = Math.sin((elapsed / floatSpeed) * Math.PI * 2) * floatRange;
      setFloatOffset(offset);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [floatSpeed, floatRange]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const springProps = useSpring({
    transform: `translateY(${floatOffset + scrollY * scrollFactor}px) rotate(${rotation}deg)`,
    config: { mass: 2, tension: 100, friction: 35 },
  });

  const shapeStyles = {
    circle: { borderRadius: '50%', background: color, opacity: 0.15 },
    ring: { borderRadius: '50%', background: 'transparent', border: `2px solid ${color}`, opacity: 0.2 },
    square: { borderRadius: size * 0.15, background: color, opacity: 0.12 },
    squareOutline: { borderRadius: size * 0.15, background: 'transparent', border: `2px solid ${color}`, opacity: 0.18 },
  };

  return (
    <animated.div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 1,
        ...shapeStyles[type],
        ...springProps,
      }}
    />
  );
}

/**
 * Standardized Page Hero component
 * @param {string} eyebrow - Small text above title (optional)
 * @param {string} title - Main title
 * @param {string} subtitle - Description text
 * @param {React.ReactNode} children - Additional content (buttons, etc.)
 * @param {Array} stickers - Array of sticker configs [{ src, size, top, left, right, bottom, rotation }]
 * @param {Array} primitives - Array of primitive configs [{ type, color, size, top, left, right, bottom, rotation }]
 * @param {string} accentColor - Primary accent color for the page (used in gradient orbs)
 */
export default function PageHero({ 
  eyebrow, 
  title, 
  subtitle, 
  children, 
  stickers = [], 
  primitives = [],
  accentColor = '#764ba2',
  icon,
}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
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
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 60%)`,
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
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating stickers */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {stickers.map((sticker, i) => (
          <FloatingSticker
            key={i}
            src={sticker.src}
            size={sticker.size || 200}
            top={sticker.top}
            left={sticker.left}
            right={sticker.right}
            bottom={sticker.bottom}
            rotation={sticker.rotation || 0}
            floatRange={sticker.floatRange || 12}
            floatSpeed={sticker.floatSpeed || 5500 + i * 500}
            scrollFactor={sticker.scrollFactor || 0.03}
          />
        ))}
      </Box>

      {/* Floating primitives */}
      {primitives.map((prim, i) => (
        <FloatingPrimitive
          key={i}
          type={prim.type || 'circle'}
          color={prim.color || accentColor}
          size={prim.size || 80}
          top={prim.top}
          left={prim.left}
          right={prim.right}
          bottom={prim.bottom}
          rotation={prim.rotation || 0}
          floatRange={prim.floatRange || 8}
          floatSpeed={prim.floatSpeed || 5000 + i * 400}
          scrollFactor={prim.scrollFactor || 0.02}
        />
      ))}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 3,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}99 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: `0 8px 32px ${accentColor}40`,
            }}
          >
            {icon}
          </Box>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <Chip
            label={eyebrow}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.9)',
              mb: 3,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.05em',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 36, md: 52 },
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Additional content (buttons, etc.) */}
        {children && (
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            {children}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

