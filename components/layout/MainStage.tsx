'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { JsonViewer } from '@/components/json/JsonViewer';
import { ProfileCard } from '@/components/preview/ProfileCard';
import { ProjectGrid } from '@/components/preview/ProjectGrid';
import { ContactForm } from '@/components/preview/ContactForm';
import { AiChatPreview } from '@/components/preview/AiChatPreview';
import { SocialsPreview } from '@/components/preview/SocialsPreview';
import { ResumeData } from '@/lib/types';
import { Code2, Eye } from 'lucide-react';

// Apple-style blur reveal: scale down from 1.05 → 1, blur resolves, fades in
const heroRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
      // Fires after TopBar and Sidebar have landed (~0.3s in)
      delay: 0.3,
    },
  },
};

interface MainStageProps {
  requestId: string;
  data: ResumeData;
}

export function MainStage({ requestId, data }: MainStageProps) {
  const [showCode, setShowCode] = useState(false);

  const getJsonData = () => {
    switch (requestId) {
      case 'user-profile':
        return {
          user: data.user,
          experience: data.experience_timeline,
          skills: data.skills_categories,
        };
      case 'github-repos':
        return data.github.highlighted_projects;
      case 'uplink-transmit':
        return { email: '', subject: '', message: '' };
      case 'ai-query':
        return { query: '', response: '' };
      case 'network-handshake':
        return {
          platforms: [
            { name: 'github', url: data.contact.github },
            { name: 'linkedin', url: data.contact.linkedin },
            { name: 'instagram', url: data.contact.instagram },
          ],
        };
      default:
        return data;
    }
  };

  const renderPreview = () => {
    switch (requestId) {
      case 'user-profile':
        return (
          <ProfileCard
            user={data.user}
            experienceTimeline={data.experience_timeline}
            skillsCategories={data.skills_categories}
            languageStats={data.github.stats.languages}
            startAnimation={true}
          />
        );
      case 'github-repos':
        return <ProjectGrid projects={data.github.highlighted_projects} />;
      case 'uplink-transmit':
        return <ContactForm />;
      case 'ai-query':
        return <AiChatPreview data={data} />;
      case 'network-handshake':
        return <SocialsPreview data={data} />;
      default:
        return (
          <div className="flex items-center justify-center min-h-full">
            <p className="text-slate-500">No preview available for this request.</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={heroRevealVariants}
      className="flex-1 bg-slate-950 overflow-hidden flex flex-col"
    >
      {/* Code Toggle Button */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCode(!showCode)}
          className="border-slate-700 hover:bg-slate-800 gap-2"
        >
          {showCode ? (
            <>
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs">Preview</span>
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4" />
              <span className="font-mono text-xs">Code</span>
            </>
          )}
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {showCode ? <JsonViewer data={getJsonData()} /> : renderPreview()}
      </div>
    </motion.div>
  );
}
