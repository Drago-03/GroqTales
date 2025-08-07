'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const GalaxyBackground = () => {
  const [stars, setStars] = useState<
    Array<{ x: number; y: number; size: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    // Generate way more random stars with different colors
    const colors = ['#ffffff', '#ffd700', '#ff8f00', '#ff69b4', '#4169e1'] as const;
    const newStars = Array.from({ length: 200 }, () => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 8,
        color: colors[colorIndex] ?? '#ffffff',
      };
    });
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/90 to-purple-950/90">
        {/* Add a subtle noise texture */}
        <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
      </div>

      {/* The Sun */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-radial from-yellow-500 via-orange-500 to-transparent blur-md"
        style={{ top: '10%', left: '-5%' }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Solar flares */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-400/50 via-orange-500/30 to-transparent"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* The Moon */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-gradient-radial from-gray-200 via-gray-300 to-transparent blur-sm"
        style={{ top: '30%', right: '15%' }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Planets */}
      {/* Mars-like planet */}
      <motion.div
        className="absolute w-36 h-36 rounded-full bg-gradient-radial from-red-600 via-red-800 to-transparent blur-md"
        style={{ bottom: '20%', right: '25%' }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Saturn-like planet with rings */}
      <div className="absolute w-48 h-48" style={{ top: '40%', left: '20%' }}>
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-radial from-yellow-200 via-yellow-600 to-transparent blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-48 h-12 bg-gradient-radial from-orange-300/50 via-yellow-500/30 to-transparent rounded-full -rotate-12 top-10 -left-8 blur-sm"
          animate={{
            rotate: [-12, 6, -12],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Ice Giant */}
      <motion.div
        className="absolute w-28 h-28 rounded-full bg-gradient-radial from-cyan-400 via-blue-600 to-transparent blur-md"
        style={{ top: '60%', left: '60%' }}
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated stars with different colors */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Meteors originating from left side with improved physics */}
      {Array.from({ length: 12 }).map((_, i) => {
        // Randomly choose between top-left corner and left edge starting positions
        const isFromCorner = Math.random() > 0.5;
        const startX = -50; // Start outside viewport
        const startY = isFromCorner ? -50 : Math.random() * 70; // Either corner or along left edge

        return (
          <motion.div
            key={`meteor-${i}`}
            className="absolute"
            style={{
              top: `${startY}%`,
              left: `${startX}px`,
              zIndex: 2,
              transform: `rotate(${isFromCorner ? 45 : 35}deg)`, // Steeper angle from corner
            }}
          >
            {/* Meteor Head - Enhanced Glowing Core */}
            <motion.div
              className="absolute rounded-full bg-white"
              style={{
                width: `${10 + Math.random() * 6}px`,
                height: `${10 + Math.random() * 6}px`,
                boxShadow: `
                  0 0 15px #fff,
                  0 0 25px #fff,
                  0 0 35px #f59e0b,
                  0 0 45px #f59e0b
                `,
                zIndex: 3,
              }}
              animate={{
                x: [
                  0,
                  typeof window !== 'undefined'
                    ? window.innerWidth * 1.2
                    : 1200,
                ],
                y: [
                  0,
                  typeof window !== 'undefined'
                    ? isFromCorner
                      ? window.innerHeight * 0.8
                      : window.innerHeight * 0.5
                    : 600,
                ],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.1, 0.9], // Slight scale change for depth perception
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
                ease: [0.1, 0.01, 0.9, 0.99], // Enhanced easing for realistic acceleration
              }}
            />

            {/* Enhanced Primary Trail with Physics-based Length */}
            <motion.div
              className="absolute"
              style={{
                width: '200px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #fff)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.7)',
                borderRadius: '2px',
                transformOrigin: 'left center',
                zIndex: 2,
              }}
              animate={{
                x: [
                  0,
                  typeof window !== 'undefined'
                    ? window.innerWidth * 1.2
                    : 1200,
                ],
                y: [
                  0,
                  typeof window !== 'undefined'
                    ? isFromCorner
                      ? window.innerHeight * 0.8
                      : window.innerHeight * 0.5
                    : 600,
                ],
                opacity: [0, 0.9, 0.9, 0],
                scaleX: [0.3, 1.3, 0.6], // More dynamic trail length based on velocity
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
                ease: [0.1, 0.01, 0.9, 0.99],
              }}
            />

            {/* Particle Trail */}
            {Array.from({ length: 6 }).map((_, particleIndex) => (
              <motion.div
                key={`particle-${particleIndex}`}
                className="absolute rounded-full bg-orange-200"
                style={{
                  width: `${3 + Math.random() * 2}px`,
                  height: `${3 + Math.random() * 2}px`,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)',
                }}
                animate={{
                  x: [-particleIndex * 20, window.innerWidth * 1.2],
                  y: [
                    -particleIndex * (isFromCorner ? 20 : 10),
                    isFromCorner
                      ? window.innerHeight * 0.8
                      : window.innerHeight * 0.5,
                  ],
                  opacity: [0, 0.7, 0.7, 0],
                  scale: [1, 0.5, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                  ease: [0.1, 0.01, 0.9, 0.99],
                }}
              />
            ))}
          </motion.div>
        );
      })}

      {/* Larger, Slower Meteors with Improved Physics */}
      {Array.from({ length: 3 }).map((_, i) => {
        const isFromCorner = i === 0; // First meteor always from corner for consistency
        const startX = -100; // Start further outside viewport
        const startY = isFromCorner ? -100 : Math.random() * 50;

        return (
          <motion.div
            key={`large-meteor-${i}`}
            className="absolute"
            style={{
              top: `${startY}px`,
              left: `${startX}px`,
              zIndex: 3,
              transform: `rotate(${isFromCorner ? 45 : 35}deg)`,
            }}
          >
            {/* Large Meteor Core */}
            <motion.div
              className="absolute rounded-full bg-gradient-to-br from-orange-200 to-red-500"
              style={{
                width: '28px',
                height: '28px',
                boxShadow: `
                  0 0 30px #fff,
                  0 0 50px #f59e0b,
                  0 0 70px #dc2626
                `,
              }}
              animate={{
                x: [0, window.innerWidth * 1.5],
                y: [
                  0,
                  isFromCorner ? window.innerHeight : window.innerHeight * 0.6,
                ],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 0.8, 1], // Enhanced pulsing for depth
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 5,
                ease: [0.1, 0.01, 0.9, 0.99], // Enhanced easing for realistic acceleration
              }}
            />

            {/* Large Meteor Trail */}
            <motion.div
              className="absolute"
              style={{
                width: '350px',
                height: '12px',
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent)',
                boxShadow: '0 0 60px rgba(255, 255, 255, 0.5)',
                borderRadius: '6px',
                filter: 'blur(3px)',
              }}
              animate={{
                x: [0, window.innerWidth * 1.5],
                y: [
                  0,
                  isFromCorner ? window.innerHeight : window.innerHeight * 0.6,
                ],
                opacity: [0, 0.95, 0.95, 0],
                scaleX: [0.3, 1.6, 0.7], // More dynamic trail length
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 5,
                ease: [0.1, 0.01, 0.9, 0.99],
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
