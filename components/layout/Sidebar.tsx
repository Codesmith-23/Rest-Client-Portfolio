'use client';

import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLogContext } from '@/context/LogContext';

interface SidebarProps {
  currentRequest: string;
  onRequestSelect: (requestId: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  currentRequest,
  onRequestSelect,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [isV1Expanded, setIsV1Expanded] = useState(true);
  const { addLog } = useLogContext();

  const handleRequestClick = (requestId: string, url: string) => {
    addLog('GET', `${url} - 200 OK`);
    onRequestSelect(requestId);
    onMobileClose(); // Close mobile sidebar after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300',
          'md:translate-x-0', // Always visible on desktop
          isMobileOpen ? 'translate-x-0' : '-translate-x-full' // Toggle on mobile
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-slate-100">API Endpoints</h2>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* v1 (Stable) Folder */}
            <div className="mb-2">
              <button
                onClick={() => setIsV1Expanded(!isV1Expanded)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
              >
                {isV1Expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-slate-400" />
                <span>v1 (Stable)</span>
              </button>

              {/* Request Items */}
              {isV1Expanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {/* User */}
                  <RequestItem
                    id="user-profile"
                    label="User"
                    method="GET"
                    isActive={currentRequest === 'user-profile'}
                    onClick={() => handleRequestClick('user-profile', '/v1/profile')}
                  />
                  
                  {/* Projects */}
                  <RequestItem
                    id="github-repos"
                    label="Projects"
                    method="GET"
                    isActive={currentRequest === 'github-repos'}
                    onClick={() => handleRequestClick('github-repos', '/v1/github/repos')}
                  />
                  
                  {/* AI Query - Independent Route */}
                  <RequestItem
                    id="ai-query"
                    label="AI Query"
                    method="POST"
                    isActive={currentRequest === 'ai-query'}
                    onClick={() => handleRequestClick('ai-query', '/v1/ai/query')}
                    methodColor="purple"
                  />
                  
                  {/* Establish Connection - Social Networks */}
                  <RequestItem
                    id="network-handshake"
                    label="Establish Connection"
                    method="POST"
                    isActive={currentRequest === 'network-handshake'}
                    onClick={() => handleRequestClick('network-handshake', '/v1/network/handshake')}
                    methodColor="purple"
                  />
                  
                  {/* Direct Uplink - Email Form */}
                  <RequestItem
                    id="uplink-transmit"
                    label="Direct Uplink"
                    method="POST"
                    isActive={currentRequest === 'uplink-transmit'}
                    onClick={() => handleRequestClick('uplink-transmit', '/v1/uplink/transmit')}
                    methodColor="yellow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface RequestItemProps {
  id: string;
  label: string;
  method: 'GET' | 'POST';
  isActive: boolean;
  onClick: () => void;
  methodColor?: 'purple' | 'yellow' | 'default';
}

function RequestItem({ label, method, isActive, onClick, methodColor = 'default' }: RequestItemProps) {
  const getMethodColor = () => {
    if (methodColor === 'purple') {
      return 'bg-purple-500/20 text-purple-400';
    }
    if (methodColor === 'yellow') {
      return 'bg-yellow-500/20 text-yellow-400';
    }
    return method === 'GET'
      ? 'bg-green-500/20 text-green-400'
      : 'bg-blue-500/20 text-blue-400';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors',
        isActive
          ? 'bg-slate-700 text-slate-100'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      )}
    >
      <span
        className={cn(
          'text-xs font-semibold px-1.5 py-0.5 rounded',
          getMethodColor()
        )}
      >
        {method}
      </span>
      <span>{label}</span>
    </button>
  );
}
