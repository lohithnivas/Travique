import React, { useState } from 'react';
import { PlannerInput } from '../types.js';
import { MapPin, Calendar, DollarSign, Users, ChevronRight, HelpCircle, Eye, RefreshCw, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface PlannerFormProps {
  onSubmit: (input: PlannerInput) => void;
  darkMode: boolean;
  isLoading: boolean;
}

const INTERESTS_PRESETS = [
  'Adventure', 'Food', 'Nature', 'Shopping', 'Photography', 'Historical', 
  'Nightlife', 'Wildlife', 'Mountains', 'Beaches', 'Culture', 'Luxury'
];

export default function PlannerForm({ onSubmit, darkMode, isLoading }: PlannerFormProps) {
  const [startingLocation, setStartingLocation] = useState('New York');
  const [destination, setDestination] = useState('Tokyo');
  const [travelDays, setTravelDays] = useState(5);
  const [budget, setBudget] = useState(2500);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelType, setTravelType] = useState<PlannerInput['travelType']>('couple');
  const [interests, setInterests] = useState<string[]>(['Culture', 'Food', 'Photography']);
  const [transportType, setTransportType] = useState<PlannerInput['transportType']>('flight');
  const [accommodationType, setAccommodationType] = useState<PlannerInput['accommodationType']>('standard');
  const [travelPace, setTravelPace] = useState<PlannerInput['travelPace']>('balanced');
  
  const [validationError, setValidationError] = useState('');

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleQuickPreset = (start: string, dest: string, days: number, budg: number, pace: PlannerInput['travelPace']) => {
    setStartingLocation(start);
    setDestination(dest);
    setTravelDays(days);
    setBudget(budg);
    setTravelPace(pace);
  };

  const handleReset = () => {
    setStartingLocation('New York');
    setDestination('Paris');
    setTravelDays(5);
    setBudget(2000);
    setTravelersCount(1);
    setTravelType('solo');
    setInterests(['Culture', 'Food']);
    setTransportType('flight');
    setAccommodationType('standard');
    setTravelPace('balanced');
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingLocation.trim()) {
      setValidationError('Starting location is required.');
      return;
    }
    if (!destination.trim()) {
      setValidationError('Destination is required.');
      return;
    }
    if (travelDays < 1 || travelDays > 14) {
      setValidationError('Travel days must be between 1 and 14 days.');
      return;
    }
    if (budget < 100) {
      setValidationError('Budget must be at least $100.');
      return;
    }
    if (travelersCount < 1) {
      setValidationError('Please specify at least 1 traveler.');
      return;
    }
    if (interests.length === 0) {
      setValidationError('Please select at least 1 interest to tailor your experience.');
      return;
    }

    setValidationError('');
    onSubmit({
      startingLocation,
      destination,
      travelDays,
      budget,
      travelersCount,
      travelType,
      interests,
      transportType,
      accommodationType,
      travelPace
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Dynamic Summary Cards / Live Preview */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
          <Eye className="w-4 h-4 animate-pulse" />
          <span>Live Planning Estimate</span>
        </div>
        <p className={`text-sm leading-relaxed font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Planning a <span className="text-blue-600 dark:text-blue-400">{travelDays}-day</span> {travelPace} {travelType} voyage to <span className="text-blue-600 dark:text-blue-400">{destination || "..."}</span> from {startingLocation || "..."} with <span className="text-indigo-600 dark:text-indigo-400">{accommodationType}</span> lodging and {transportType} transport. Tailored interests: {interests.join(', ') || 'None selected yet'}.
        </p>
      </div>

      {/* Grid of basic parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starting Location */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Starting Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
              placeholder="e.g. London, United Kingdom"
              className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border font-semibold outline-none transition-all ${
                darkMode 
                  ? 'border-slate-800 bg-slate-950 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                  : 'border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Destination City / Region
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris, France"
              className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border font-semibold outline-none transition-all ${
                darkMode 
                  ? 'border-slate-800 bg-slate-950 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                  : 'border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Counters & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Days */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Duration (Days)</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{travelDays} Days</span>
          </label>
          <div className={`flex items-center justify-between p-2 rounded-xl border ${
            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setTravelDays(Math.max(1, travelDays - 1))}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg cursor-pointer"
            >
              -
            </button>
            <span className="font-extrabold text-base">{travelDays}</span>
            <button
              type="button"
              onClick={() => setTravelDays(Math.min(14, travelDays + 1))}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Number of Travelers</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{travelersCount} Guests</span>
          </label>
          <div className={`flex items-center justify-between p-2 rounded-xl border ${
            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg cursor-pointer"
            >
              -
            </button>
            <span className="font-extrabold text-base">{travelersCount}</span>
            <button
              type="button"
              onClick={() => setTravelersCount(Math.min(10, travelersCount + 1))}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-lg cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Max Budget (USD)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">${budget.toLocaleString()}</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Math.max(100, Number(e.target.value) || 100))}
              className={`w-full pl-9 pr-4 py-3 text-sm rounded-xl border font-semibold outline-none transition-all ${
                darkMode 
                  ? 'border-slate-800 bg-slate-950 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                  : 'border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Select lists for Type, Transport, Pace, Accommodation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Travel Type */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Travel Type & Companion
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['solo', 'couple', 'friends', 'family'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTravelType(type)}
                className={`py-2 px-1 text-xs capitalize rounded-xl font-bold border transition-all cursor-pointer ${
                  travelType === type 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : darkMode 
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transport */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Transportation Preference
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['flight', 'train', 'bus', 'car'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTransportType(mode)}
                className={`py-2 px-1 text-xs capitalize rounded-xl font-bold border transition-all cursor-pointer ${
                  transportType === mode 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : darkMode 
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Accommodation Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['budget', 'standard', 'luxury'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setAccommodationType(tier)}
                className={`py-2 px-2 text-xs capitalize rounded-xl font-bold border transition-all cursor-pointer ${
                  accommodationType === tier 
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md' 
                    : darkMode 
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Pace */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-slate-500 dark:text-slate-400">
            Travel Pace
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['relaxed', 'balanced', 'fast'] as const).map((pace) => (
              <button
                key={pace}
                type="button"
                onClick={() => setTravelPace(pace)}
                className={`py-2 px-2 text-xs capitalize rounded-xl font-bold border transition-all cursor-pointer ${
                  travelPace === pace 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                    : darkMode 
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pace}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Multi select interests */}
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase mb-3 text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Select Interests (Multi-Select)</span>
          <span className="text-slate-400 text-[10px] lowercase italic">Choose at least one</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS_PRESETS.map((item) => {
            const isSelected = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-sm' 
                    : darkMode 
                      ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation error display */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
          {validationError}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={handleReset}
          className={`px-4 py-3 rounded-xl border font-semibold text-xs transition-all flex items-center space-x-1 hover:scale-95 cursor-pointer ${
            darkMode 
              ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3.5 px-6 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/10 cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Travel Preferences...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Generate Travel Blueprint</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Quick Suggestion Shortcuts */}
      <div className="pt-2">
        <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Or try a curated starting template:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickPreset('New York', 'Paris', 5, 2000, 'balanced')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
              darkMode ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Romantic Paris (5 Days)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Los Angeles', 'Kyoto', 7, 3500, 'relaxed')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
              darkMode ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Serene Kyoto (7 Days)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('London', 'Reykjavik', 4, 1800, 'fast')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
              darkMode ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Icelandic Lights (4 Days)
          </button>
        </div>
      </div>
    </form>
  );
}
