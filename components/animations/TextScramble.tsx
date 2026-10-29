'use client';

import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  startAnimation?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const TOTAL_DURATION = 800; // Keep the effect short so the real text is readable almost immediately

function hasPlayed(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function markPlayed(key: string) {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    // Storage can be unavailable (private mode); the effect just replays
  }
}

/**
 * Renders the real text in the server HTML (for SEO and screen readers) and
 * plays a short scramble over it once per session. Skipped entirely when the
 * visitor prefers reduced motion.
 */
export function TextScramble({ text, className = '', speed = 60, startAnimation = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!startAnimation) return;

    const storageKey = `scramble:${text}`;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || hasPlayed(storageKey)) return;
    markPlayed(storageKey);

    let iteration = 0;
    const tickInterval = Math.min(speed, 50);
    const maxIterations = Math.max(1, Math.floor(TOTAL_DURATION / tickInterval));
    const revealSpeed = text.length / maxIterations; // Characters revealed per tick

    const interval = setInterval(() => {
      const revealedCount = Math.floor(iteration * revealSpeed);

      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            // Reveal characters left-to-right progressively
            if (index < revealedCount || char === ' ') return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration >= maxIterations) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, tickInterval);

    return () => {
      clearInterval(interval);
      setDisplayText(text);
    };
  }, [text, speed, startAnimation]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}