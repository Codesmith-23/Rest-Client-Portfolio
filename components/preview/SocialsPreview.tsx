'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Instagram, ExternalLink, Circle, Code2, Users, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResumeData } from '@/lib/types';
import { useIsMobile, useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface SocialsPreviewProps {
  data: ResumeData;
}

const socialPlatforms = [
  {
    id: 'github',
    icon: Github,
    name: 'GitHub',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    hoverGlow: 'hover:shadow-emerald-500/40',
    username: 'Codesmith-23',
    description: 'Audit source code',
    subtitle: 'Visual telemetry',
    icon2: Code2,
    urlKey: 'github' as const
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    hoverGlow: 'hover:shadow-blue-500/40',
    username: 'Mohammed Moinuddin Shaikh',
    description: 'Professional network',
    subtitle: 'Career trajectory',
    icon2: Users,
    urlKey: 'linkedin' as const
  },
  {
    id: 'instagram',
    icon: Instagram,
    name: 'Instagram',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    glowColor: 'shadow-pink-500/20',
    hoverGlow: 'hover:shadow-pink-500/40',
    username: '@____moinuddin_',
    description: 'Visual feed',
    subtitle: 'Personal updates',
    icon2: Camera,
    urlKey: 'instagram' as const
  }
];

// Generate floating node data (reduced count for mobile performance)
const generateNodes = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3',
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    xRange: [0, Math.random() * 150 - 75, Math.random() * -150 + 75, 0],
    yRange: [0, Math.random() * -150 + 75, Math.random() * 150 - 75, 0],
    duration: 10 + Math.random() * 5,
    delay: Math.random() * 2
  }));
};

export function SocialsPreview({ data }: SocialsPreviewProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Generate nodes based on device and motion preference
  const floatingNodes = generateNodes(isMobile || prefersReducedMotion ? 5 : 20);

  return (
    <div className="h-full w-full flex flex-col items-start md:items-center justify-start md:justify-center relative overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 md:p-6 pt-20 md:pt-6 pb-32">
      {/* Network Background - Floating Data Nodes */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {floatingNodes.map((node) => (
            <motion.div
              key={node.id}
              className={`absolute ${node.size} bg-slate-700 rounded-full opacity-40`}
              style={{
                left: `${node.initialX}%`,
                top: `${node.initialY}%`,
              }}
              animate={{
                x: node.xRange,
                y: node.yRange,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: node.delay,
              }}
            />
            ))}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-green-400 font-mono mb-2 md:mb-3">
          NETWORK_HANDSHAKE
        </h2>
        <p className="text-slate-400 text-sm md:text-lg font-mono">
          Establish connection to external platforms
        </p>
      </motion.div>

      {/* Social Cards - Responsive Layout */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-center flex-wrap justify-center max-w-6xl relative z-10">
        {socialPlatforms.map((platform, index) => {
          const Icon = platform.icon;
          const Icon2 = platform.icon2;
          const url = data.contact[platform.urlKey];

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.15, duration: prefersReducedMotion ? 0 : 0.5 }}
              className="w-[90%] md:w-80 max-w-sm mx-auto"
            >
              <Card 
                className={`bg-slate-900/80 md:backdrop-blur-sm border-2 ${platform.borderColor} shadow-xl ${platform.glowColor} hover:-translate-y-2 transition-all duration-300 ${platform.hoverGlow} group`}
              >
                <CardContent className="p-4 md:p-8">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${platform.bgColor} p-4 rounded-lg`}>
                      <Icon className={`w-8 h-8 ${platform.color}`} />
                    </div>
                    <Badge className={`${platform.bgColor} ${platform.color} border ${platform.borderColor} font-mono text-xs`}>
                      <Circle className="w-2 h-2 mr-1 fill-current animate-pulse" />
                      ACTIVE
                    </Badge>
                  </div>

                  {/* Platform Name */}
                  <h3 className={`text-xl md:text-2xl font-bold ${platform.color} font-mono mb-2`}>
                    {platform.name}
                  </h3>

                  {/* Username */}
                  <p className="text-slate-400 font-mono text-xs md:text-sm mb-3 md:mb-4 whitespace-normal break-words h-auto">
                    {platform.username}
                  </p>

                  {/* Description */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Icon2 className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">{platform.description}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono pl-6">
                      {platform.subtitle}
                    </p>
                  </div>

                  {/* Connect Button */}
                  <Button
                    asChild
                    className={`w-full ${platform.bgColor} ${platform.color} border ${platform.borderColor} hover:${platform.bgColor} hover:shadow-lg ${platform.glowColor} font-mono font-bold transition-all duration-300 group-hover:scale-105`}
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      Connect
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-slate-500 font-mono">
          Click any card to establish external connection
        </p>
      </motion.div>
    </div>
  );
}
