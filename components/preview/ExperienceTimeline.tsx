'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExperienceEntry } from '@/lib/types';
import { Layers, Cloud, Smartphone, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Map each role title to a Lucide icon + accent colour
const ROLE_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  'Freelance Full-Stack Engineer': {
    icon: Layers,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  'AWS Cloud Capstone Trainee': {
    icon: Cloud,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  'Mobile Development Intern': {
    icon: Smartphone,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
};

const DEFAULT_META = {
  icon: Layers,
  color: 'text-slate-400',
  bg: 'bg-slate-500/10',
  border: 'border-slate-500/30',
};

// ─── Animation variants ────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 18 },
  },
};

const lineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function TimelineNode({ color }: { color: string }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Outer ring */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-slate-950 ${color.replace('text-', 'ring-')} bg-slate-950`}
      >
        {/* Inner pulse dot */}
        <span
          className={`w-3 h-3 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}
        />
      </div>
    </div>
  );
}

interface TimelineCardProps {
  entry: ExperienceEntry;
  isLast: boolean;
}

function TimelineCard({ entry, isLast }: TimelineCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  const meta = ROLE_META[entry.title] ?? DEFAULT_META;
  const Icon = meta.icon;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="flex gap-4 md:gap-6"
    >
      {/* ── Left column: node + line ── */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <TimelineNode color={meta.color} />
        {!isLast && (
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="w-px flex-1 mt-2 bg-gradient-to-b from-slate-600 to-transparent min-h-[3rem]"
          />
        )}
      </div>

      {/* ── Right column: card ── */}
      <div className="flex-1 pb-10">
        <div
          className={`rounded-xl border ${meta.border} bg-slate-900/60 backdrop-blur-sm overflow-hidden`}
        >
          {/* Card header */}
          <div className={`px-5 py-4 border-b ${meta.border} ${meta.bg}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${meta.bg} border ${meta.border}`}
                >
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 leading-tight">
                    {entry.title}
                  </h3>
                  <p className={`text-sm font-mono font-medium mt-0.5 ${meta.color}`}>
                    {entry.company}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-xs border-slate-600 text-slate-400 whitespace-nowrap self-start mt-0.5"
              >
                {entry.date}
              </Badge>
            </div>
          </div>

          {/* Bullet points */}
          <div className="px-5 py-4">
            <ul className="space-y-3">
              {entry.points.map((point, i) => (
                <li key={i} className={`flex flex-row items-start gap-2 text-sm text-gray-300 leading-relaxed ${meta.color}`}>
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="text-slate-300">{point}</span>
                </li>
              ))}
            </ul>

            {/* Optional live link */}
            {entry.link && entry.linkText && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-semibold font-mono px-4 py-2 rounded-lg border transition-all duration-200 ${meta.border} ${meta.color} ${meta.bg} hover:brightness-125 hover:shadow-lg`}
                >
                  <ExternalLink className="w-4 h-4" />
                  {entry.linkText}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
}

export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <div className="w-full">
      {/* Timeline */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {entries.map((entry, index) => (
          <TimelineCard
            key={entry.title}
            entry={entry}
            isLast={index === entries.length - 1}
          />
        ))}
      </motion.div>
    </div>
  );
}
