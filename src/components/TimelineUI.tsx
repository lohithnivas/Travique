import React, { useState } from 'react';
import { ItineraryDay } from '../types.js';
import { Clock, DollarSign, MapPin, Coffee, Sun, Sunset, Moon, Sparkles, ChevronDown, ChevronUp, Compass, Bus } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineUIProps {
  itinerary: ItineraryDay[];
  darkMode: boolean;
}

export default function TimelineUI({ itinerary, darkMode }: TimelineUIProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({});

  const toggleSlot = (key: string) => {
    setExpandedSlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const currentDayData = itinerary.find(d => d.dayNumber === selectedDay) || itinerary[0];

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No itinerary events scheduled.
      </div>
    );
  }

  // Helper to render timeline section details
  const renderSlotCard = (
    title: string,
    time: string,
    activity: string,
    meal: string,
    mealLabel: string,
    cost: number,
    transport: string,
    notes: string,
    icon: React.ReactNode,
    iconBg: string,
    slotKey: string
  ) => {
    const isExpanded = expandedSlots[slotKey] !== false; // Default to true

    // Extract raw hex representation of standard tailwind background colors for inline border styling
    const getThemeColor = (bgClass: string) => {
      if (bgClass.includes('amber')) return '#f59e0b';
      if (bgClass.includes('blue')) return '#3b82f6';
      if (bgClass.includes('purple')) return '#a855f7';
      return '#64748b';
    };

    const accentColor = getThemeColor(iconBg);

    return (
      <div className="relative pl-10 md:pl-12 pb-8 group">
        {/* Custom Linear-Gradient Vertical Connector */}
        <div className="timeline-line group-last:hidden" style={{ left: '15px' }} />

        {/* Glowing Timeline Node Badge */}
        <div 
          className="absolute left-0 top-1 timeline-dot text-white transition-transform duration-300 group-hover:scale-110" 
          style={{ 
            borderColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}80`
          }}
        >
          <div className="scale-75 text-white">
            {icon}
          </div>
        </div>

        {/* Frosted Glass Slot card content */}
        <div className={`glass-card p-5 transition-all duration-300 hover:shadow-lg hover:bg-white/10 dark:hover:bg-white/10`}>
          {/* Header */}
          <div 
            onClick={() => toggleSlot(slotKey)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>{title}</span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <div className="flex items-center space-x-1 text-slate-400 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{time}</span>
                </div>
              </div>
              <h4 className="font-extrabold text-sm md:text-base pr-4 leading-snug text-slate-800 dark:text-white">{activity}</h4>
            </div>

            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 transition-colors">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Content Details */}
          {isExpanded && (
            <div className="mt-4 pt-3 border-t border-slate-100/50 dark:border-white/10 space-y-3 text-xs leading-relaxed">
              {/* Meal & Dining */}
              {meal && (
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 capitalize">{mealLabel}:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium italic">"{meal}"</span>
                </div>
              )}

              {/* Transit logistics */}
              {transport && (
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                  <Bus className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold">Transport:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{transport}</span>
                </div>
              )}

              {/* Cost estimates */}
              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold">Cost:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cost > 0 ? `$${cost} USD` : 'Complimentary / Included'}
                </span>
              </div>

              {/* Advisory notes */}
              {notes && (
                <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100/50 dark:border-white/5 text-slate-500 dark:text-slate-400 flex items-start space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0 animate-spin-slow" />
                  <div>
                    <span className="font-bold">Planner Notes:</span>{' '}
                    <span>{notes}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Day Filter navigation tabs (sticky subheader) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setSelectedDay(day.dayNumber)}
            className={`py-2 px-4 rounded-xl font-extrabold text-xs shrink-0 transition-all cursor-pointer ${
              selectedDay === day.dayNumber
                ? 'bg-blue-600 text-white shadow-md'
                : darkMode
                  ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Active Day Card Overview */}
      {currentDayData && (
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
          
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Selected Itinerary</span>
          <h3 className="text-xl font-extrabold mt-1">{currentDayData.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Carefully orchestrated based on your budget, paces, and interests.
          </p>
        </div>
      )}

      {/* Vertical Timeline container */}
      <div className="pt-2">
        {currentDayData && (
          <div className="relative">
            {/* Morning */}
            {renderSlotCard(
              "Morning Adventure",
              currentDayData.morning.time,
              currentDayData.morning.activity,
              currentDayData.morning.breakfast,
              "Breakfast Recommendation",
              currentDayData.morning.cost,
              currentDayData.morning.transport,
              currentDayData.morning.notes,
              <Coffee className="w-4 h-4" />,
              "bg-amber-500",
              `d${selectedDay}-morning`
            )}

            {/* Afternoon */}
            {renderSlotCard(
              "Afternoon Exploration",
              currentDayData.afternoon.time,
              currentDayData.afternoon.activity,
              currentDayData.afternoon.lunch,
              "Lunch Recommendation",
              currentDayData.afternoon.cost,
              currentDayData.afternoon.transport,
              currentDayData.afternoon.notes,
              <Sun className="w-4 h-4" />,
              "bg-blue-500",
              `d${selectedDay}-afternoon`
            )}

            {/* Evening */}
            {renderSlotCard(
              "Evening Ambiance",
              currentDayData.evening.time,
              currentDayData.evening.activity,
              currentDayData.evening.dinner,
              "Dinner Recommendation",
              currentDayData.evening.cost,
              currentDayData.evening.transport,
              currentDayData.evening.notes,
              <Sunset className="w-4 h-4" />,
              "bg-purple-500",
              `d${selectedDay}-evening`
            )}

            {/* Night Activity */}
            {renderSlotCard(
              "Nightlife & Strolls",
              currentDayData.nightActivity.time,
              currentDayData.nightActivity.activity,
              "", // No meal for night activity
              "",
              currentDayData.nightActivity.cost,
              currentDayData.nightActivity.transport,
              currentDayData.nightActivity.notes,
              <Moon className="w-4 h-4" />,
              "bg-slate-800 dark:bg-slate-750",
              `d${selectedDay}-night`
            )}
          </div>
        )}
      </div>
    </div>
  );
}
