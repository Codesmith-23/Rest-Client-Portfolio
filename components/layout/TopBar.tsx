'use client';

import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  url: string;
  method: 'GET' | 'POST';
  onMobileMenuToggle: () => void;
}

export function TopBar({ url, method, onMobileMenuToggle }: TopBarProps) {
  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center gap-3 px-4">
      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 hover:bg-slate-800 rounded transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>

      {/* Method Badge */}
      <span
        className={cn(
          'text-sm font-semibold px-3 py-1.5 rounded',
          method === 'GET'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        )}
      >
        {method}
      </span>

      {/* URL Input (Read-only) */}
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 bg-slate-800 text-slate-200 px-4 py-2 rounded border border-slate-700 focus:outline-none focus:border-slate-600 font-mono text-sm"
      />
    </div>
  );
}
