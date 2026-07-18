/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TravelItineraryResponse, PlannerInput } from './types.js';
import LandingHero from './components/LandingHero.tsx';
import PlannerForm from './components/PlannerForm.tsx';
import DestinationCard from './components/DestinationCard.tsx';
import TimelineUI from './components/TimelineUI.tsx';
import BudgetCharts from './components/BudgetCharts.tsx';
import PackingChecklistComp from './components/PackingChecklistComp.tsx';
import SmartMetadataPanel from './components/SmartMetadataPanel.tsx';
import EmergencySOS from './components/EmergencySOS.tsx';
import TravelMemories from './components/TravelMemories.tsx';
import { 
  Compass, ArrowLeft, Loader2, Sparkles, AlertCircle, Share2, Printer, 
  RotateCcw, ShieldAlert, Sparkle, Globe, Check, Info, Heart, Wifi, WifiOff, Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

const LOADING_QUOTES = [
  "Consulting our local intelligence network...",
  "Scouting boutique accommodations and dining gems...",
  "Calculating weather densities and optimal seasons...",
  "Tailoring daily paces and local transportation routes...",
  "Calculating carbon footprint indicators...",
  "Squeezing virtual sunscreen into packing suitcases...",
  "Double checking safety tip lists and local advisories...",
  "Polishing your bespoke TraviQue travel blueprint..."
];

export default function App() {
  const [activePage, setActivePage] = useState<'landing' | 'planner' | 'itinerary'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState<number>(0);
  const [errorText, setErrorText] = useState<string>('');
  const [itinerary, setItinerary] = useState<TravelItineraryResponse | null>(null);
  const [formInput, setFormInput] = useState<PlannerInput | null>(null);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string>('');

  // PWA Offline Caching & Connection State
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerToast("You are back online. Elite AI travel sync active!");
    };
    const handleOffline = () => {
      setIsOffline(true);
      triggerToast("You are offline. Serving fully cached PWA travel data.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // LocalStorage state restore
  useEffect(() => {
    const savedItinerary = localStorage.getItem('travique_itinerary');
    const savedInput = localStorage.getItem('travique_input');
    if (savedItinerary && savedInput) {
      try {
        setItinerary(JSON.parse(savedItinerary));
        setFormInput(JSON.parse(savedInput));
        setActivePage('itinerary');
      } catch (e) {
        console.error("Error parsing stored itinerary.");
      }
    }
  }, []);

  // Loading quotes cycle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingQuoteIndex(prev => (prev + 1) % LOADING_QUOTES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Synchronize darkMode class on documentElement for styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Trigger celebratory confetti on itinerary creation
  const celebrateBlueprint = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti bursts from left and right edges
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleGenerateBlueprint = async (input: PlannerInput) => {
    setIsLoading(true);
    setLoadingQuoteIndex(0);
    setErrorText('');

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data: TravelItineraryResponse = await response.json();
      
      // Store state
      setItinerary(data);
      setFormInput(input);
      localStorage.setItem('travique_itinerary', JSON.stringify(data));
      localStorage.setItem('travique_input', JSON.stringify(input));
      
      setActivePage('itinerary');
      setTimeout(() => {
        celebrateBlueprint();
        triggerToast("Bespoke travel itinerary compiled!");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setErrorText("A connection anomaly occurred. Please try planning again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('travique_itinerary');
    localStorage.removeItem('travique_input');
    setItinerary(null);
    setFormInput(null);
    setActivePage('planner');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My TraviQue Travel Blueprint for ${itinerary?.destination}`,
        text: `Check out my personalized travel itinerary for ${itinerary?.durationDays} days in ${itinerary?.destination}!`,
        url: window.location.href
      }).then(() => {
        triggerToast("Shared successfully!");
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("App URL copied to clipboard!");
    }
  };

  return (
    <div id="app-container" className={`min-h-screen font-sans transition-colors duration-300 relative z-0 ${
      darkMode ? 'bg-[#0F172A] text-white dark' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Mesh Background underlay for elegant Frosted Glass glow */}
      <div className="mesh-bg pointer-events-none" style={{ opacity: darkMode ? 0.45 : 0.15 }} />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold border border-slate-800 dark:border-slate-200 flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen 1: Curated Landing Page */}
      {activePage === 'landing' && (
        <LandingHero 
          onStartPlanning={() => setActivePage('planner')} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />
      )}

      {/* Screen 2: Preference Form & Param Selector */}
      {activePage === 'planner' && !isLoading && (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setActivePage('landing')}
              className={`inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-95 cursor-pointer ${
                darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
              Step 1 of 2
            </span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Configure Your Travel Blueprint</h2>
            <p className={`mt-2 text-sm max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Tell us your starting point, destination, timeline, and comfort preferences. Our AI Travel Engine will tailor a meticulous plan.
            </p>
          </div>

          <div className="glass-card p-6 md:p-10 shadow-xl">
            <PlannerForm 
              onSubmit={handleGenerateBlueprint} 
              darkMode={darkMode} 
              isLoading={isLoading} 
            />
          </div>

          {errorText && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}
        </div>
      )}

      {/* Screen 3: SKELETON LOADER SCREEN */}
      {isLoading && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-950 animate-pulse" />
            <Loader2 className="absolute w-8 h-8 text-blue-600 animate-spin" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">Crafting Travel Intelligence</h3>
            <p className={`text-sm leading-relaxed min-h-[40px] font-medium transition-all duration-300 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              "{LOADING_QUOTES[loadingQuoteIndex]}"
            </p>
          </div>

          {/* Luxury Skeleton placeholders */}
          <div className="w-full space-y-4 pt-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded-full w-3/4 mx-auto animate-pulse" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-850 rounded-full w-5/6 mx-auto animate-pulse" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-850 rounded-full w-2/3 mx-auto animate-pulse" />
          </div>
        </div>
      )}

      {/* Screen 4: COMPLETED BESPOKE ITINERARY DASHBOARD */}
      {activePage === 'itinerary' && itinerary && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <button
                onClick={() => setActivePage('planner')}
                className={`inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider mb-2 transition-all hover:scale-95 cursor-pointer ${
                  darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Adjust details</span>
              </button>
              
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Your Bespoke Trip: {itinerary.destination}
                </h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {itinerary.durationDays} Days Plan
                </span>
                
                {isOffline ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center space-x-1 border border-amber-500/20 animate-pulse">
                    <WifiOff className="w-3.5 h-3.5 shrink-0" />
                    <span>Offline Cache Active</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 border border-emerald-500/20" title="Offline-ready enabled. This itinerary is securely compiled and cached in your PWA service worker.">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>PWA Offline Cache Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Optimized travel investment of ${itinerary.budget.total.toLocaleString()} USD tailored for {formInput?.travelType || "you"}.
              </p>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className={`p-2.5 rounded-xl border transition-all hover:scale-95 cursor-pointer ${
                  darkMode 
                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Reset Planner"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={handleShare}
                className={`py-2 px-4 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-all hover:scale-95 cursor-pointer ${
                  darkMode 
                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Applet</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-1.5 shadow-md transition-all hover:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Entire Plan</span>
              </button>
            </div>
          </div>

          {/* MAIN DASHBOARD CONTENT GRID */}
          <div className="space-y-10">
            
            {/* SEGMENT 1: LANDMARK / DISTRICT SUGGESTIONS (Mandatory Feature 1) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-5 bg-blue-600 rounded-sm" />
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">1. Tailored Neighborhood & Landmark Suitability</h3>
              </div>
              <DestinationCard suggestions={itinerary.suggestions} darkMode={darkMode} />
            </div>

            {/* SEGMENT 2: DAY-WISE INTERACTIVE TIMELINE (Mandatory Feature 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-5 bg-blue-600 rounded-sm" />
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight">2. Day-wise Interactive Timeline</h3>
                </div>
                <TimelineUI itinerary={itinerary.itinerary} darkMode={darkMode} />
              </div>

              {/* SEGMENT 3: COMPACT PACKING CHECKLIST (Mandatory Feature 4) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-5 bg-blue-600 rounded-sm" />
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight">3. Packing Checklist</h3>
                </div>
                <div className="glass-card p-5 shadow-sm">
                  <PackingChecklistComp 
                    packingList={itinerary.packingList} 
                    darkMode={darkMode} 
                    destinationName={itinerary.destination} 
                  />
                </div>
              </div>
            </div>

            {/* SEGMENT 4: BUDGET BREAKDOWN CHARTS (Mandatory Feature 3) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-5 bg-blue-600 rounded-sm" />
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">4. Proportional Budget Breakdowns</h3>
              </div>
              <div className="glass-card p-6 md:p-8 shadow-sm">
                <BudgetCharts budget={itinerary.budget} darkMode={darkMode} />
              </div>
            </div>

            {/* SEGMENT 5: SMART TRAVEL METADATA PANEL (Smart Features) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-5 bg-blue-600 rounded-sm" />
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">5. AI Travel Intelligence & Advisories</h3>
              </div>
              <div className="glass-card p-6 shadow-sm">
                <SmartMetadataPanel metadata={itinerary.metadata} darkMode={darkMode} />
              </div>
            </div>

            {/* SEGMENT 6: TRAVEL REVIEWS & MEMORIES VAULT */}
            <div className="space-y-4">
              <TravelMemories darkMode={darkMode} destination={itinerary.destination} />
            </div>

          </div>
        </div>
      )}

      {/* Emergency SOS Button and Action Command Hub (Mandatory Safety Layer) */}
      <EmergencySOS itinerary={itinerary} darkMode={darkMode} />

    </div>
  );
}
