'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLogContext } from '@/context/LogContext';
import { ChevronUp, ChevronDown, Circle, GripHorizontal } from 'lucide-react';

export function ConsoleDrawer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { logs } = useLogContext();
  const [startY, setStartY] = useState<number | null>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current && isExpanded) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Swipe down to collapse (diff > 50px)
    if (diff > 50 && isExpanded) {
      setIsExpanded(false);
      setStartY(null);
    }
    // Swipe up to expand (diff < -50px)
    else if (diff < -50 && !isExpanded) {
      setIsExpanded(true);
      setStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  const methodColors = {
    GET: 'text-green-400',
    POST: 'text-yellow-400',
    SYSTEM: 'text-blue-400',
    ERROR: 'text-red-400'
  };

  return (
    <div className="fixed bottom-0 w-full z-50">
      {!isExpanded ? (
        // Collapsed State: Status Bar
        <div 
          className="h-10 md:h-8 bg-slate-900 border-t border-slate-800 px-3 md:px-4 flex items-center justify-between touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile: Swipe Handle */}
          <div className="md:hidden absolute top-1 left-1/2 -translate-x-1/2">
            <GripHorizontal className="w-8 h-1.5 text-slate-600" />
          </div>

          <div className="flex items-center gap-3 md:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
              <span className="text-slate-300 hidden sm:inline">System: Online</span>
              <span className="text-slate-300 sm:hidden">Online</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hidden sm:flex">
              <span>⚡</span>
              <span>Latency: 24ms</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors min-h-10 md:min-h-0 px-2"
            aria-label="Expand console"
          >
            <span className="hidden sm:inline">Console</span>
            <ChevronUp className="w-4 h-4 md:w-3 md:h-3" />
          </button>
        </div>
      ) : (
        // Expanded State: Log Viewer
        <div className="h-80 md:h-64 bg-black border-t border-slate-800 flex flex-col">
          {/* Header with Swipe Handle */}
          <div 
            className="h-10 md:h-8 bg-slate-900 border-b border-slate-800 px-3 md:px-4 flex items-center justify-between relative touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile: Swipe Handle */}
            <div className="md:hidden absolute top-1 left-1/2 -translate-x-1/2">
              <GripHorizontal className="w-8 h-1.5 text-slate-600" />
            </div>

            <span className="text-xs font-mono text-slate-300">Console Output</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors min-h-10 md:min-h-0 px-2"
              aria-label="Collapse console"
            >
              <span className="hidden sm:inline">Collapse</span>
              <ChevronDown className="w-4 h-4 md:w-3 md:h-3" />
            </button>
          </div>

          {/* Log Container */}
          <div
            ref={logContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
          >
            {logs.length === 0 ? (
              <div className="text-slate-500 text-xs font-mono">No logs yet...</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="text-xs font-mono flex items-start gap-2 md:gap-3"
                  data-method={log.method}
                >
                  <span className="text-slate-500 text-[10px] md:text-xs">[{log.timestamp}]</span>
                  <span className={`font-bold text-[10px] md:text-xs ${methodColors[log.method]}`}>
                    [{log.method}]
                  </span>
                  <span className="text-slate-300 flex-1 text-[10px] md:text-xs break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
