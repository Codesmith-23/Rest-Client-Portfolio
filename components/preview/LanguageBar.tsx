import React from 'react';
import { Language } from '@/lib/types';

interface LanguageBarProps {
  languages: Language[];
}

export function LanguageBar({ languages }: LanguageBarProps) {
  return (
    <div className="w-full space-y-3">
      {/* Visual Bar */}
      <div className="flex h-4 rounded-full overflow-hidden border border-slate-700 shadow-inner">
        {languages.map((language, index) => (
          <div
            key={index}
            className="relative group transition-all duration-200 hover:brightness-110"
            style={{
              width: `${language.percent}%`,
              backgroundColor: language.color,
            }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-slate-700 shadow-lg">
              <div className="font-semibold">{language.name}</div>
              <div className="text-slate-400">{language.percent}%</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {languages.map((language, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-slate-700"
              style={{ backgroundColor: language.color }}
            />
            <span className="text-xs text-slate-400">
              {language.name} <span className="text-slate-500">({language.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
