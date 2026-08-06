'use client';

import { useState } from 'react';
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

  const currentRequest = getRequestById(currentRequestId);

  const handleRequestSelect = (requestId: string) => {
    setCurrentRequestId(requestId);
    setIsMobileSidebarOpen(false);
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
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 pb-10 md:pb-8">
        <TopBar
          url={currentRequest?.url || ''}
          method={currentRequest?.method || 'GET'}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        <MainStage
          requestId={currentRequestId}
          data={resumeData}
        />
      </div>
    </motion.div>
  );
}
