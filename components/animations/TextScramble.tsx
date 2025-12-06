'use client';

import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  startAnimation?: boolean;
}

export function TextScramble({ text, className = '', speed = 60, startAnimation = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(''); // Start empty
  const [isAnimating, setIsAnimating] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  useEffect(() => {
    // Don't start animation until startAnimation is true
    if (!startAnimation) {
      setDisplayText('');
      return;
    }

    setIsAnimating(true);
    let iteration = 0;
    const totalDuration = 2500; // 2.5 seconds total
    const tickInterval = 60; // 60ms between ticks (slower, more readable)
    const maxIterations = Math.floor(totalDuration / tickInterval);
    const revealSpeed = text.length / maxIterations; // Characters revealed per tick
    
    const interval = setInterval(() => {
      const revealedCount = Math.floor(iteration * revealSpeed);
      
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            // Reveal characters left-to-right progressively
            if (index < revealedCount) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration++;
      
      if (iteration >= maxIterations) {
        setDisplayText(text);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [text, speed, startAnimation]);

  return <span className={className}>{displayText}</span>;
}
