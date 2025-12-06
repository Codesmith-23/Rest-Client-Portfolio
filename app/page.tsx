'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MainStage } from '@/components/layout/MainStage';
import { ServerBoot } from '@/components/ui/ServerBoot';
import { getResumeData, getRequestById } from '@/lib/data';

export default function Home() {
  const resumeData = getResumeData();
  const [currentRequestId, setCurrentRequestId] = useState('user-profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(false);

  const currentRequest = getRequestById(currentRequestId);

  const handleRequestSelect = (requestId: string) => {
    // No longer auto-redirecting for social links
    // They now show a profile card instead
    setCurrentRequestId(requestId);
    setIsMobileSidebarOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      {/* Server Boot Screen */}
      {!isSystemReady && (
        <ServerBoot onComplete={() => setIsSystemReady(true)} />
      )}

      {/* Main Application */}
      <div className="flex h-screen bg-slate-950">
        <Sidebar
          currentRequest={currentRequestId}
          onRequestSelect={handleRequestSelect}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Main content area with left margin on desktop to account for fixed sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64 pb-10 md:pb-8">
          <TopBar
            url={currentRequest?.url || ''}
            method={currentRequest?.method || 'GET'}
            onMobileMenuToggle={handleMobileMenuToggle}
          />
          
          <MainStage
            requestId={currentRequestId}
            data={resumeData}
            isSystemReady={isSystemReady}
          />
        </div>
      </div>
    </>
  );
}
