'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JsonViewer } from '@/components/json/JsonViewer';
import { ProfileCard } from '@/components/preview/ProfileCard';
import { ProjectGrid } from '@/components/preview/ProjectGrid';
import { ContactForm } from '@/components/preview/ContactForm';
import { AiChatPreview } from '@/components/preview/AiChatPreview';
import { SocialsPreview } from '@/components/preview/SocialsPreview';
import { ResumeData } from '@/lib/types';
import { Code2, Eye } from 'lucide-react';

interface MainStageProps {
  requestId: string;
  data: ResumeData;
  isSystemReady?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export function MainStage({ requestId, data, isSystemReady = false, isLoading = false, error = null }: MainStageProps) {
  const [showCode, setShowCode] = useState(false);
  
  // Determine which data to show based on request type
  const getJsonData = () => {
    switch (requestId) {
      case 'user-profile':
        return {
          user: data.user,
          experience: data.experience,
          skills: data.skills_categories
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
            { name: 'instagram', url: data.contact.instagram }
          ]
        };
      default:
        return data;
    }
  };

  // Render preview content based on request type
  const renderPreview = () => {
    switch (requestId) {
      case 'user-profile':
        return (
          <ProfileCard 
            user={data.user} 
            experience={data.experience}
            skillsCategories={data.skills_categories}
            languageStats={data.github.stats.languages}
            startAnimation={isSystemReady}
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-slate-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="max-w-md p-6 bg-slate-900 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">Error</h3>
          <p className="text-slate-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col">
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
        {showCode ? (
          <JsonViewer data={getJsonData()} />
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
}
