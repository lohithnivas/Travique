import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Star, HelpCircle, Shield, Plane, ArrowRight, Sun, Moon, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function LandingHero({ onStartPlanning, darkMode, setDarkMode }: LandingHeroProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const popularDestinations = [
    { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop', desc: 'Temple trails, cherry blossoms, and culinary art.', rating: 4.9, cost: '$$$' },
    { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600&auto=format&fit=crop', desc: 'Whitewashed houses, cliffside dining, and ocean sunsets.', rating: 4.8, cost: '$$$$' },
    { name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', desc: 'Northern lights, geothermal spas, and volcanic peaks.', rating: 4.9, cost: '$$$$' },
    { name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop', desc: 'Cliffside coastal drives, colorful towns, and ocean breezes.', rating: 4.9, cost: '$$$$' },
  ];

  const faqs = [
    { q: 'How does TraviQue generate personalized plans?', a: 'TraviQue combines state-of-the-art Generative AI with real-world travel parameters (budget, travel type, pace, and transport) to compose itineraries that feel hand-crafted by professional travel agencies.' },
    { q: 'Can I customize the plan after it is generated?', a: 'Absolutely! You can interactively track and check off your checklist, print the itinerary, export details, adjust options, or rebuild a brand-new itinerary at any time.' },
    { q: 'Is there an offline mode?', a: 'Yes! You can download your customized checklist or print the complete timeline to PDF/paper so you can access your travel itinerary even without mobile data.' },
    { q: 'What happens if the AI server is busy?', a: 'TraviQue features a smart full-stack Fallback Mode that dynamically generates highly realistic, fully customized schedules for any destination instantly.' },
  ];

  return (
    <div id="landing-hero" className="w-full">
      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              TraviQue
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Features</a>
            <a href="#destinations" className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Destinations</a>
            <a href="#faq" className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>FAQ</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              id="nav-start-btn"
              onClick={onStartPlanning}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
            >
              <span>Build Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 transition-all duration-300">
        {/* Full-width Background Image Overlay matching the user's uploaded design */}
        <div 
          className="absolute inset-0 bg-cover bg-center -z-20 transition-all duration-500"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1920&auto=format&fit=crop)',
          }}
        />
        {/* High contrast glass tint backdrop filter to keep all text crystal clear */}
        <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-slate-950/95 backdrop-blur-[2px]' 
            : 'bg-gradient-to-b from-slate-50/85 via-slate-50/80 to-slate-50/95 backdrop-blur-[2px]'
        }`} />

        {/* Animated ambient background spots */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wider uppercase mb-6 bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Generation Travel AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Travel Smarter.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Explore Better.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Instantly generate highly personalized, custom travel itineraries powered by premium AI. Perfectly structured timelines, budget estimates, smart packing checklists, and localized tourist tips.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="hero-cta-btn"
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-indigo-500/20 shadow-blue-600/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 text-base cursor-pointer"
            >
              <span>Plan Your Free Trip</span>
              <Plane className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className={`w-full sm:w-auto px-8 py-4 border font-semibold rounded-2xl transition-all text-center ${
                darkMode 
                  ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-white' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              How it works
            </a>
          </motion.div>

          {/* Premium Mockup / Interactive showcase card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 md:mt-20 max-w-5xl mx-auto"
          >
            <div className={`p-1 rounded-3xl border shadow-2xl overflow-hidden bg-gradient-to-br ${
              darkMode ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-200 to-slate-300 border-white'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200&auto=format&fit=crop" 
                alt="Beautiful hot air balloons floating over mountains" 
                className="w-full h-[300px] md:h-[450px] object-cover rounded-2.5xl filter brightness-90 hover:brightness-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className={`py-20 border-t border-b transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              A Complete Suite of Smart Travel Features
            </h2>
            <p className={`mt-4 text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Every tool and metric you need to explore with absolute confidence, compiled into a single streamlined dashboard.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Suggestion Card */}
            <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">1. Curated Landmarks</h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Discover top-tier specific destinations, scenic districts, or local hidden spots. Includes complete explanations of suitability.
              </p>
            </div>

            {/* Timeline Card */}
            <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">2. Timeline Itinerary</h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                A premium interactive timeline organizing your days, covering Breakfast, Lunch, Dinner, Activities, costs, and logistics.
              </p>
            </div>

            {/* Budget Card */}
            <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">3. Budget Estimate</h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Clear budget category cards with interactive visualizations. Perfect to control and optimize your travel investment.
              </p>
            </div>

            {/* Checklist Card */}
            <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">4. Interactive Packing</h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Highly adaptive dynamic checklist tailored precisely to your destination's weather, pace, and interests. Fully printable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className={`py-20 transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Curated Dream Destinations</h2>
              <p className={`mt-2 text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Popular locales highly tailored with seasonal summaries and premium reviews.
              </p>
            </div>
            <button
              onClick={onStartPlanning}
              className="mt-4 md:mt-0 inline-flex items-center space-x-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Build custom plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((dest, i) => (
              <div key={i} className="glass-card group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 py-1 px-2.5 rounded-full text-xs font-bold shadow-md text-slate-800 dark:text-white flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{dest.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{dest.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {dest.cost}
                    </span>
                  </div>
                  <p className={`mt-2 text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {dest.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className={`py-20 border-t transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center justify-center space-x-2">
              <HelpCircle className="w-8 h-8 text-blue-500" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className={`mt-2 text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to know about planning trips with TraviQue.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="glass-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left font-bold flex justify-between items-center text-sm md:text-base"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg ml-2">{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && (
                  <div className={`px-6 pb-5 pt-1 text-xs md:text-sm border-t leading-relaxed transition-all ${
                    darkMode ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-150'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-lg text-slate-800 dark:text-white">TraviQue</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">| Travel Smarter. Explore Better.</span>
          </div>
          <div className="flex space-x-6 text-xs font-semibold">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#destinations" className="hover:underline">Destinations</a>
            <a href="#faq" className="hover:underline">FAQ</a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            &copy; 2026 TraviQue Inc. All rights reserved. Built as a premium commercial grade planner.
          </p>
        </div>
      </footer>
    </div>
  );
}
