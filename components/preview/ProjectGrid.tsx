'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import { FolderGit2 } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FolderGit2 className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-slate-100 font-mono">Featured Projects</h2>
        </div>
        <p className="text-slate-400">Explore my highlighted GitHub repositories</p>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
