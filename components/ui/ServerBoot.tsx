'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldCheck, Cpu, Radio } from 'lucide-react';

interface ServerBootProps {
  onComplete: () => void;
}

const bootPhases = [
  {
    id: 1,
    icon: Database,
    text: 'Validating Schemas & Data Integrity...',
    duration: 3000,
  },
  {
    id: 2,
    icon: ShieldCheck,
    text: 'Auth Protocols & SQL Guards Active.',
    duration: 3000,
  },
  {
    id: 3,
    icon: Cpu,
    text: 'Optimizing Server Logic & Caching...',
    duration: 3000,
  },
  {
    id: 4,
    icon: Radio,
    text: 'Resolving Remote Host...',
    subText: 'Host Verified: Mohammed Moinuddin Shaikh.',
    subText2: 'Initializing Secure Interface...',
    finalText: 'Connection Established.',
    duration: 4000,
  },
];

export function ServerBoot({ onComplete }: ServerBootProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [subPhase, setSubPhase] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    // Check if user has already seen the animation
    const hasVisited = sessionStorage.getItem('server_boot_visited');
    if (hasVisited === 'true') {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / 130); // 13 seconds total
      });
    }, 100);

    // Phase progression
    const phaseTimers: NodeJS.Timeout[] = [];
    let totalTime = 0;

    bootPhases.forEach((phase, index) => {
      phaseTimers.push(
        setTimeout(() => {
          setCurrentPhase(index);
          setSubPhase(0);

          // Special handling for phase 4 (identity verification with 3 sub-phases)
          if (index === 3) {
            setTimeout(() => setSubPhase(1), 1000);
            setTimeout(() => setSubPhase(2), 2000);
            setTimeout(() => setSubPhase(3), 3000);
          }
        }, totalTime)
      );
      totalTime += phase.duration;
    });

    // Complete sequence
    const completeTimer = setTimeout(() => {
      handleComplete();
    }, totalTime);

    return () => {
      clearInterval(progressInterval);
      phaseTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(completeTimer);
    };
  }, []);

  useEffect(() => {
    // Keyboard listener for ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem('server_boot_visited', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleTouch = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      handleSkip();
    }
    
    setLastTapTime(now);
  };

  const handleComplete = () => {
    sessionStorage.setItem('server_boot_visited', 'true');
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  if (!isVisible) return null;

  const phase = bootPhases[currentPhase];
  const Icon = phase?.icon;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      onClick={handleTouch}
    >
      {/* Circuit Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #22c55e 1px, transparent 1px),
            linear-gradient(to bottom, #22c55e 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated Grid Drift */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-full h-[2px] bg-gradient-to-b from-transparent via-green-400/30 to-transparent"
          animate={{
            top: ['-2px', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.8) 100%)',
        }}
      />
      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Icon and Text */}
        <AnimatePresence mode="wait">
          {phase && (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Icon */}
              <motion.div
                animate={{
                  rotate: phase.id === 3 ? 360 : 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="p-6 rounded-full bg-green-500/10 border-2 border-green-500/30"
              >
                <Icon className="w-16 h-16 text-green-400" />
              </motion.div>

              {/* Text */}
              <div className="text-center space-y-3 max-w-md">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base md:text-xl font-mono text-green-400 tracking-wide"
                >
                  {phase.text}
                </motion.p>

                {/* Phase 4 Sub-phases */}
                {phase.id === 4 && subPhase >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm md:text-lg font-mono text-green-400 font-semibold"
                  >
                    {phase.subText}
                  </motion.p>
                )}

                {phase.id === 4 && subPhase >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm md:text-lg font-mono text-cyan-400"
                  >
                    {phase.subText2}
                  </motion.p>
                )}

                {phase.id === 4 && subPhase >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-lg md:text-2xl font-mono font-bold text-green-300"
                  >
                    {phase.finalText}
                  </motion.p>
                )}
              </div>

              {/* Loading Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-green-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress Percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-sm font-mono text-green-400/70">
          {Math.round(progress)}% Complete
        </p>
      </motion.div>

      {/* Skip Instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-8 left-0 right-0 text-center"
      >
        <p className="text-xs tracking-widest text-slate-500 font-mono">
          <span className="md:hidden">DOUBLE TAP TO SKIP</span>
          <span className="hidden md:inline">Press [ESC] to Skip</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
