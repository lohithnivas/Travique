import React from 'react';
import { SuggestedDestination } from '../types.js';
import { Check, Star, Award, Compass } from 'lucide-react';

interface DestinationCardProps {
  suggestions: SuggestedDestination[];
  darkMode: boolean;
}

export default function DestinationCard({ suggestions, darkMode }: DestinationCardProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {suggestions.map((item, index) => (
        <div
          key={index}
          className="glass-card relative p-5 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 opacity-80" />

          <div className="space-y-3">
            {/* Header: Title and Match score */}
            <div className="flex items-start justify-between">
              <h4 className="font-extrabold text-base md:text-lg leading-snug text-slate-900 dark:text-white pr-4">
                {item.name}
              </h4>
              <div className="relative shrink-0 flex items-center justify-center w-11 h-11 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 font-extrabold text-sm border border-blue-100/50 dark:border-white/10 shadow-sm">
                <span>{item.matchScore}%</span>
              </div>
            </div>

            {/* Overview description */}
            <p className={`text-xs md:text-sm leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {item.overview}
            </p>

            {/* Explanatory suitability reason */}
            <div className="p-3 rounded-xl border border-slate-100/30 dark:border-white/5 bg-slate-50/40 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 flex items-start space-x-2">
              <Award className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
                <span className="font-extrabold text-slate-900 dark:text-slate-200">Why it fits:</span>{' '}
                <span>{item.suitabilityReason}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100/50 dark:border-white/10 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
              <span>Recommended Landmark</span>
            </span>
            <span className="text-blue-600 dark:text-blue-400 flex items-center space-x-0.5">
              <Check className="w-3 h-3" />
              <span>Tailored</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
