'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MainStage } from '@/components/layout/MainStage';
import { getResumeData, getRequestById } from '@/lib/data';

// Stagger container: children animate in sequence with a 0.15s gap
const layoutVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

export default function Home() {
  const resumeData = getResumeData();
  const [currentRequestId, setCurrentRequestId] = useState('user-profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const currentRequest = getRequestById(currentRequestId);

  // Close the drawer and hand focus back to the menu button
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
    // offsetParent is null when the button is hidden (desktop), so focus stays put there
    if (menuButtonRef.current?.offsetParent) menuButtonRef.current.focus();
  }, []);

  const handleRequestSelect = (requestId: string) => {
    setCurrentRequestId(requestId);
    closeMobileSidebar();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <motion.div
      className="flex h-screen bg-slate-950"
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
    >
      <Sidebar
        currentRequest={currentRequestId}
        onRequestSelect={handleRequestSelect}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 pb-10 md:pb-8">
        <TopBar
          url={currentRequest?.url || ''}
          method={currentRequest?.method || 'GET'}
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileSidebarOpen}
          menuButtonRef={menuButtonRef}
        />

        <MainStage
          requestId={currentRequestId}
          data={resumeData}
        />
      </div>
    </motion.div>
  );
}