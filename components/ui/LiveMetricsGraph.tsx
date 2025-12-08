'use client'

import { motion } from 'framer-motion'

export function LiveMetricsGraph() {
  // Generate a smooth upward-trending path with realistic fluctuations
  const generatePath = () => {
    const points: { x: number; y: number }[] = []
    const width = 800 // Width of one cycle
    const height = 128
    const segments = 40
    
    let currentY = height * 0.7 // Start at 70% from top
    const targetY = height * 0.3 // End at 30% from top (upward trend)
    
    for (let i = 0; i <= segments; i++) {
      const x = (width / segments) * i
      
      // Calculate base upward trend
      const progress = i / segments
      const trendY = currentY + (targetY - currentY) * progress
      
      // Add realistic noise/fluctuations
      const noise = (Math.sin(i * 0.5) * 15) + (Math.random() * 10 - 5)
      const y = Math.max(20, Math.min(height - 20, trendY + noise))
      
      points.push({ x, y })
    }
    
    return points
  }

  const points = generatePath()
  
  // Create SVG path string
  const createPathD = (points: { x: number; y: number }[]) => {
    let d = `M ${points[0].x} ${points[0].y}`
    
    // Use quadratic curves for smooth lines
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const midX = (prev.x + curr.x) / 2
      const midY = (prev.y + curr.y) / 2
      
      d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`
    }
    
    // Connect to last point
    const last = points[points.length - 1]
    d += ` L ${last.x} ${last.y}`
    
    return d
  }

  const pathD = createPathD(points)
  
  // Create filled area path (same as line but closed at bottom)
  const createFilledPathD = (points: { x: number; y: number }[]) => {
    const linePath = createPathD(points)
    const lastPoint = points[points.length - 1]
    const firstPoint = points[0]
    
    // Close the path at the bottom
    return `${linePath} L ${lastPoint.x} 128 L ${firstPoint.x} 128 Z`
  }

  const filledPathD = createFilledPathD(points)

  return (
    <div className="h-32 w-full relative overflow-hidden bg-slate-900/50 border border-slate-800 rounded-xl">
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-slate-700">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
          METRICS: GROWTH_POSITIVE
        </span>
      </div>

      {/* Grid Lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 32"
              fill="none"
              stroke="rgb(30 41 59)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
          
          {/* Gradient for fill */}
          <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated Graph */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute inset-0 flex"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: '200%' }}
        >
          {/* Render path twice for seamless loop */}
          {[0, 1].map((index) => (
            <svg
              key={index}
              className="w-1/2 h-full"
              viewBox="0 0 800 128"
              preserveAspectRatio="none"
            >
              {/* Filled area under the line */}
              <path
                d={filledPathD}
                fill="url(#graphGradient)"
              />
              
              {/* The glowing line */}
              <path
                d={pathD}
                fill="none"
                stroke="rgb(52, 211, 153)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 4px rgb(52, 211, 153))',
                }}
              />
            </svg>
          ))}
        </motion.div>
      </div>

      {/* Overlay gradient for fade effect on edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900/50 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/50 to-transparent" />
      </div>
    </div>
  )
}
