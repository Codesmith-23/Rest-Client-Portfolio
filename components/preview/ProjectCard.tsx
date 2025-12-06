'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { useLogContext } from '@/context/LogContext';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { addLog } = useLogContext();

  const handleMouseEnter = () => {
    addLog('SYSTEM', `Pre-fetching asset: ${project.name}`);
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={handleMouseEnter}
      animate={{
        scale: [1, 1.02, 1]
      }}
      transition={{
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2
        }
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        borderColor: '#22c55e',
        boxShadow: '0px 10px 30px -10px rgba(34, 197, 94, 0.4)',
        transition: {
          duration: 0.2,
          ease: 'easeOut'
        }
      }}
      className="group relative bg-slate-900 border-2 border-slate-800 rounded-lg h-full flex flex-col shadow-2xl shadow-green-500/10 overflow-hidden"
    >
      <Card className="h-full flex flex-col bg-transparent border-0">
        {/* Moving Spotlight Background */}
        <div className="absolute inset-0 animate-spotlight pointer-events-none" />
        {/* Cover Image */}
        {project.image && (
          <div className="relative h-48 w-full bg-slate-800 overflow-hidden z-10">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-xl text-slate-100 font-bold font-mono">{project.name}</CardTitle>
          <CardDescription className="text-slate-400 text-sm leading-relaxed mt-2">
            {project.description}
          </CardDescription>
        </CardHeader>
      
      <CardContent className="flex-1 pt-0 relative z-10">
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700 font-mono"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* API Route Preview (conditional) */}
        {project.endpoints && project.endpoints.length > 0 && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700" data-testid="api-route-preview">
            <p className="text-xs text-slate-400 mb-2 font-mono">API Route Preview</p>
            <div className="space-y-1">
              {project.endpoints.map((endpoint, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs font-mono">
                  <span className={
                    endpoint.method === 'GET' ? 'text-green-400' :
                    endpoint.method === 'POST' ? 'text-yellow-400' :
                    endpoint.method === 'PUT' ? 'text-blue-400' :
                    'text-red-400'
                  }>
                    {endpoint.method}
                  </span>
                  <span className="text-slate-300">{endpoint.path}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Buttons in Footer */}
      <CardFooter className="flex gap-2 justify-end pt-4 border-t border-slate-800 relative z-10">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-slate-700 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600"
        >
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2" />
            Repo
          </a>
        </Button>
        
        {project.demo_url !== null && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-700 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600"
          >
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
      </Card>
    </motion.div>
  );
}
