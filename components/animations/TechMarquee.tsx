'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const techStack = [
  { name: 'React', icon: 'Atom' },
  { name: 'Node.js', icon: 'Server' },
  { name: 'Python', icon: 'Snake' },
  { name: 'AWS', icon: 'Cloud' },
  { name: 'Docker', icon: 'Container' },
  { name: 'Database', icon: 'Database' },
  { name: 'Git', icon: 'GitBranch' },
  { name: 'Code', icon: 'Code' },
];

export function TechMarquee() {
  return (
    <div className="relative overflow-hidden w-full py-6">
      {/* Fade masks on left and right */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      
      {/* Scrolling container */}
      <div className="flex">
        <motion.div
          className="flex min-w-full gap-16"
          animate={{
            x: "-50%",
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {/* DUPLICATE the array to ensure no gaps */}
          {[...techStack, ...techStack].map((tech, i) => {
            const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tech.icon] || LucideIcons.Code;
            return (
              <div key={i} className="shrink-0">
                <IconComponent className="w-12 h-12 text-slate-500 opacity-80" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
