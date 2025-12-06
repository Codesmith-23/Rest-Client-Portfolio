'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Instagram, ExternalLink, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialProfilePreviewProps {
  platform: 'github' | 'linkedin' | 'instagram';
  url: string;
  username?: string;
}

const platformConfig = {
  github: {
    icon: Github,
    name: 'GitHub',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    username: 'Codesmith-23'
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
    username: 'Mohammed Moinuddin Shaikh'
  },
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    glowColor: 'shadow-pink-500/20',
    username: '@____moinuddin_'
  }
};

export function SocialProfilePreview({ platform, url, username }: SocialProfilePreviewProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const displayUsername = username || config.username;

  return (
    <div className="flex items-center justify-center min-h-full p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`w-full max-w-2xl bg-slate-900/80 md:backdrop-blur-sm border-2 ${config.borderColor} shadow-2xl ${config.glowColor} overflow-hidden`}>
          <CardContent className="p-12">
            {/* Icon and Platform Name */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`${config.bgColor} p-8 rounded-full mb-6 animate-pulse-glow`}
              >
                <Icon className={`w-24 h-24 ${config.color}`} />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl font-bold ${config.color} font-mono mb-2`}
              >
                {config.name}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-lg font-mono"
              >
                {displayUsername}
              </motion.p>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} px-4 py-2 text-sm font-mono`}>
                <Circle className="w-3 h-3 mr-2 fill-current animate-pulse" />
                Profile Active
              </Badge>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-slate-300 mb-8 leading-relaxed"
            >
              Connect with me on {config.name} to see my latest work, contributions, and professional updates.
            </motion.p>

            {/* Connect Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <Button
                asChild
                size="lg"
                className={`${config.bgColor} ${config.color} border-2 ${config.borderColor} hover:${config.bgColor} hover:shadow-xl ${config.glowColor} font-bold text-lg px-8 py-6 transition-all duration-300 hover:scale-105`}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-6 h-6 mr-3" />
                  Connect on {config.name}
                  <ExternalLink className="w-5 h-5 ml-3" />
                </a>
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-8 border-t border-slate-800 text-center"
            >
              <p className="text-xs text-slate-500 font-mono">
                Click the button above to visit my {config.name} profile
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
