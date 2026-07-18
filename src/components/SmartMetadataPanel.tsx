import React, { useState } from 'react';
import { SmartMetadata } from '../types.js';
import { 
  Shield, AlertTriangle, CloudSun, MapPin, Landmark, Heart, Info, 
  Map, Phone, Compass, Footprints, Leaf, Calendar, Camera, Utensils, 
  Wallet, Languages, Plane, HelpCircle, Flame, Gift
} from 'lucide-react';

interface SmartMetadataPanelProps {
  metadata: SmartMetadata;
  darkMode: boolean;
}

export default function SmartMetadataPanel({ metadata, darkMode }: SmartMetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<'essentials' | 'exploration' | 'tips'>('essentials');

  if (!metadata) return null;

  return (
    <div className="space-y-6">
      {/* Tab navigation headers */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('essentials')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'essentials'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Essentials & Logistics
        </button>
        <button
          onClick={() => setActiveTab('exploration')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'exploration'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Exploration & Food
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'tips'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Advisories & AI Tips
        </button>
      </div>

      {/* Tab content area */}
      <div className="pt-2">
        {/* ESSENTIALS TAB */}
        {activeTab === 'essentials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currency and Language */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Wallet className="w-5 h-5 text-emerald-500" />
                <span>Currency & Language</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Currency System:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">
                    {metadata.currencyInfo.name} ({metadata.currencyInfo.code} - {metadata.currencyInfo.symbol})
                  </span>
                  {metadata.currencyInfo.exchangeRateNotice && (
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{metadata.currencyInfo.exchangeRateNotice}</p>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Language Guide:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200 flex items-center space-x-1.5 mt-0.5">
                    <Languages className="w-4 h-4 text-indigo-500" />
                    <span>{metadata.language}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency & Support */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Phone className="w-5 h-5 text-rose-500" />
                <span>Emergency Contact Numbers</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Police</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">{metadata.emergencyNumbers.police}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Ambulance</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">{metadata.emergencyNumbers.ambulance}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Fire Dept</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">{metadata.emergencyNumbers.fire}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">General</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5 block">{metadata.emergencyNumbers.general}</span>
                </div>
              </div>
            </div>

            {/* Public Transport & Visa Notes */}
            <div className={`p-5 rounded-2xl border space-y-4 md:col-span-2 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Plane className="w-5 h-5 text-blue-500" />
                <span>Logistical Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] mb-1">Public Transit Guide:</span>
                  <p className="text-slate-700 dark:text-slate-300">{metadata.publicTransportGuide}</p>
                </div>
                <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-4">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] mb-1">Visa Regulations:</span>
                  <p className="text-slate-700 dark:text-slate-300">{metadata.visaNotes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPLORATION TAB */}
        {activeTab === 'exploration' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attractions list */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Landmark className="w-5 h-5 text-blue-500" />
                <span>Must-Visit Attractions</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {metadata.touristAttractions.map((attr, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>
              {metadata.nearbyAttractions && metadata.nearbyAttractions.length > 0 && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Nearby Day Trips:</span>
                  <ul className="space-y-1.5">
                    {metadata.nearbyAttractions.map((near, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{near}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Culinary & Food details */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Utensils className="w-5 h-5 text-orange-500" />
                <span>Culinary & Local Foods</span>
              </h4>
              <p className="text-xs text-slate-400 italic">
                Highly recommended regional specialties and culinary creations:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {metadata.localFood.map((food, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-xs text-center font-bold text-slate-700 dark:text-slate-300">
                    {food}
                  </div>
                ))}
              </div>
            </div>

            {/* Festivals, Photo Spots & Google Maps */}
            <div className={`p-5 rounded-2xl border space-y-4 md:col-span-2 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Local Festivals */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Local Festivals</span>
                  </span>
                  <ul className="space-y-1 text-xs">
                    {metadata.localFestivals.map((fest, i) => (
                      <li key={i} className="text-slate-750 dark:text-slate-300 font-semibold">• {fest}</li>
                    ))}
                  </ul>
                </div>

                {/* Photo Spots */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Camera className="w-4 h-4 text-cyan-500" />
                    <span>Best Photography Spots</span>
                  </span>
                  <ul className="space-y-1 text-xs">
                    {metadata.photoSpots.map((spot, i) => (
                      <li key={i} className="text-slate-750 dark:text-slate-300 font-semibold">• {spot}</li>
                    ))}
                  </ul>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Map className="w-4 h-4 text-emerald-500" />
                    <span>Quick Navigation Links</span>
                  </span>
                  <div className="space-y-1.5">
                    {metadata.googleMapsLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block py-1.5 px-3 rounded-lg border text-[11px] font-bold text-blue-600 dark:text-blue-400 border-blue-200/50 bg-blue-50/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-center transition-all truncate"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADVISORIES & TIPS TAB */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Footprint & Ratings */}
            <div className={`p-5 rounded-2xl border grid grid-cols-3 gap-4 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Carbon Impact</span>
                <Leaf className="w-5 h-5 text-emerald-500 mx-auto my-1" />
                <span className="block font-extrabold text-sm mt-1 text-emerald-600">{metadata.carbonFootprintEstimateKg} kg</span>
                <span className="block text-[8px] text-slate-400">CO2 equivalent</span>
              </div>

              <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Walking Dist.</span>
                <Footprints className="w-5 h-5 text-indigo-500 mx-auto my-1" />
                <span className="block font-extrabold text-sm mt-1 text-indigo-600">{metadata.estimatedWalkingDistanceKm} km</span>
                <span className="block text-[8px] text-slate-400">Total distance</span>
              </div>

              <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Trip Difficulty</span>
                <Flame className="w-5 h-5 text-orange-500 mx-auto my-1" />
                <span className="block font-extrabold text-xs mt-1 text-orange-600 dark:text-orange-400">{metadata.tripDifficultyRating}</span>
                <span className="block text-[8px] text-slate-400">Pace index</span>
              </div>
            </div>

            {/* Weather & Climate */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <CloudSun className="w-5 h-5 text-yellow-500" />
                <span>Weather Summary & Climate</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {metadata.weatherSummary}
              </p>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Best Season:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{metadata.bestTimeToVisit}</span>
              </div>
            </div>

            {/* Travel Advisories & Safety */}
            <div className={`p-5 rounded-2xl border space-y-3 md:col-span-2 ${
              darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Safety Precautions</span>
                  </h5>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {metadata.safetyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-1">
                        <span className="text-blue-500 font-bold shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-4">
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Global Travel Advisories</span>
                  </h5>
                  <p className="text-slate-700 dark:text-slate-300">{metadata.travelAdvisories}</p>
                </div>
              </div>
            </div>

            {/* AI Travel Tips & Money Saving */}
            <div className={`p-5 rounded-2xl border space-y-3 md:col-span-2 bg-gradient-to-br ${
              darkMode ? 'from-blue-950/20 to-indigo-950/20 border-blue-900/40' : 'from-blue-50/20 to-indigo-50/20 border-blue-100'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Compass className="w-5 h-5 text-blue-600 animate-spin-slow" />
                <span>TraviQue Custom AI Recommendations</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-indigo-500 block uppercase tracking-wider text-[10px] mb-1">Tailored Smart Advices:</span>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    {metadata.aiTravelTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-indigo-500 font-bold">★</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-4">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[10px] mb-1">Local Money-Saving Hacks:</span>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    {metadata.moneySavingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-cyan-500 font-bold">✔</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
