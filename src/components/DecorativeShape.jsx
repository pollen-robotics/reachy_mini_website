import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

/**
 * Decorative shape component to be placed near specific UI elements
 * Position it relative to a parent container with position: relative
 */
export default function DecorativeShape({ 
  color = '#FF9500',
  size = 80,
  top,
  left,
  right,
  bottom,
  type = 'circle', // circle, square, ring, dot
  rotation = 0,
  opacity = 0.12,
  floatRange = 6,
  floatSpeed = 5000,
  scrollFactor = 0.03,
  zIndex = 0,
}) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Floating animation loop
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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Spring animation for smooth movement
  const springProps = useSpring({
    transform: `translateY(${floatOffset + scrollY * scrollFactor}px) rotate(${rotation}deg)`,
    config: {
      mass: 2,
      tension: 120,
      friction: 30,
    },
  });

  const baseStyles = {
    position: 'absolute',
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex,
  };

  // Shape variants
  const shapeStyles = {
    circle: {
      borderRadius: '50%',
      background: color,
      opacity,
    },
    ring: {
      borderRadius: '50%',
      background: 'transparent',
      border: `2px solid ${color}`,
      opacity: opacity * 1.5,
    },
    square: {
      borderRadius: size * 0.15,
      background: color,
      opacity,
    },
    squareOutline: {
      borderRadius: size * 0.15,
      background: 'transparent',
      border: `2px solid ${color}`,
      opacity: opacity * 1.5,
    },
    dot: {
      borderRadius: '50%',
      background: color,
      opacity: opacity * 2,
    },
  };

  return (
    <animated.div
      style={{
        ...baseStyles,
        ...springProps,
        ...shapeStyles[type],
      }}
    />
  );
}

// Pre-configured shape combinations for common use cases
export function ShapeCluster({ position = 'topRight', colors = ['#FF9500', '#764ba2'] }) {
  const positions = {
    topRight: { top: -20, right: -30 },
    topLeft: { top: -20, left: -30 },
    bottomRight: { bottom: -20, right: -30 },
    bottomLeft: { bottom: -20, left: -30 },
  };

  const pos = positions[position];

  return (
    <>
      <DecorativeShape
        color={colors[0]}
        size={100}
        type="ring"
        opacity={0.1}
        floatRange={8}
        floatSpeed={5000}
        {...pos}
      />
      <DecorativeShape
        color={colors[1]}
        size={40}
        type="circle"
        opacity={0.15}
        floatRange={5}
        floatSpeed={4000}
        top={pos.top !== undefined ? pos.top + 60 : undefined}
        bottom={pos.bottom !== undefined ? pos.bottom + 60 : undefined}
        left={pos.left !== undefined ? pos.left + 80 : undefined}
        right={pos.right !== undefined ? pos.right + 80 : undefined}
      />
    </>
  );
}

