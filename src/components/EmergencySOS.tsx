import React, { useState, useEffect, useRef } from 'react';
import { TravelItineraryResponse } from '../types.js';
import { 
  ShieldAlert, Volume2, VolumeX, Navigation, Map, Phone, X, ExternalLink, 
  Copy, Check, Activity, LifeBuoy, Search, AlertTriangle, Send, Shield, Info, Heart
} from 'lucide-react';

interface EmergencySOSProps {
  itinerary: TravelItineraryResponse | null;
  darkMode: boolean;
}

interface CrisisGuide {
  id: string;
  title: string;
  category: 'medical' | 'physical' | 'environment';
  steps: string[];
  warning: string;
}

const GLOBAL_EMERGENCY_DEFAULTS = [
  { country: 'Universal (EU/Standard)', police: '112', ambulance: '112', fire: '112', general: '112' },
  { country: 'United States & Canada', police: '911', ambulance: '911', fire: '911', general: '911' },
  { country: 'United Kingdom', police: '999', ambulance: '999', fire: '999', general: '112' },
  { country: 'Japan', police: '110', ambulance: '119', fire: '119', general: '110/119' },
  { country: 'Australia', police: '000', ambulance: '000', fire: '000', general: '000' },
  { country: 'India', police: '100', ambulance: '102', fire: '101', general: '112' }
];

const CRISIS_GUIDES: CrisisGuide[] = [
  {
    id: 'cpr',
    title: 'Cardiac Arrest / CPR',
    category: 'medical',
    steps: [
      'Call emergency ambulance services immediately.',
      'Place heel of one hand in the center of the chest, place other hand on top.',
      'Push hard and fast: 100 to 120 compressions per minute (depth of 2 inches).',
      'If trained, perform 2 rescue breaths after every 30 compressions.',
      'Continue compressions until professional medical help arrives or an AED is ready.'
    ],
    warning: 'Do not interrupt chest compressions for more than 10 seconds.'
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    category: 'medical',
    steps: [
      'Apply direct, firm pressure on the wound using a sterile cloth, bandage, or clean hand.',
      'Keep continuous pressure for at least 5-10 minutes without checking.',
      'Elevate the injured limb above heart level if possible.',
      'If blood leaks through, apply another layer of bandage on top; do not remove the original.',
      'If bleeding continues severely, apply a tourniquet 2-3 inches above the wound (never on a joint).'
    ],
    warning: 'Never apply tourniquets directly over a joint or wound.'
  },
  {
    id: 'choking',
    title: 'Choking (Heimlich Maneuver)',
    category: 'medical',
    steps: [
      'Stand behind the person, wrap your arms around their waist.',
      'Make a fist with one hand, place the thumb-side slightly above their belly button.',
      'Grasp your fist with your other hand.',
      'Perform quick, sharp, upward and inward thrusts into the abdomen.',
      'If the person loses consciousness, lower them gently to the floor and start CPR.'
    ],
    warning: 'For infants, use 5 back blows followed by 5 chest thrusts instead.'
  },
  {
    id: 'threat',
    title: 'Active Physical Threat / Threat of Violence',
    category: 'physical',
    steps: [
      'RUN: Escape immediately if there is a safe path. Leave belongings behind.',
      'HIDE: If escape is impossible, lock and barricade yourself in a secure room. Silence all electronics.',
      'FIGHT: As an absolute last resort, act with maximum aggression and use improvised weapons.',
      'Stay behind solid barriers and do not leave until official authorities declare it safe.'
    ],
    warning: 'Keep your hands fully visible and obey all law enforcement directions when they arrive.'
  },
  {
    id: 'weather',
    title: 'Extreme Weather Response',
    category: 'environment',
    steps: [
      'Flash Floods: Move to the highest ground possible. Avoid walking/driving through standing or moving water.',
      'Severe Storms/Tornadoes: Seek shelter in an interior room, basement, or closet on the lowest level.',
      'Extreme Heatstroke: Move the person into shade, apply cool wet towels, and supply small sips of cool water.'
    ],
    warning: 'Do not enter metal structures or touch plumbing during severe electrical lightning storms.'
  }
];

export default function EmergencySOS({ itinerary, darkMode }: EmergencySOSProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  
  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsError, setGpsError] = useState<string>('');

  // Emergency contact configurations
  const [selectedDefaultCountry, setSelectedDefaultCountry] = useState(0);

  // Search filter for Crisis guides
  const [guideSearch, setGuideSearch] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('cpr');

  // Copy helper indicators
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Emergency Contact message custom input
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Web Audio Context refs for siren synthesizing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);

  // Stop siren on unmount
  useEffect(() => {
    return () => {
      stopSirenEngine();
    };
  }, []);

  const startSirenEngine = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        alert("Web Audio API not supported in this browser.");
        return;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Use a custom waveform for high piercing volume (triangle works great)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;

      // Sound pattern alternating between two piercing high-pitched alarms
      let flag = false;
      alarmIntervalRef.current = window.setInterval(() => {
        if (oscRef.current && audioCtxRef.current) {
          const targetFreq = flag ? 1100 : 700;
          oscRef.current.frequency.exponentialRampToValueAtTime(targetFreq, audioCtxRef.current.currentTime + 0.25);
          flag = !flag;
        }
      }, 350);

      setIsSirenPlaying(true);
    } catch (err) {
      console.error("Siren synthesis failed", err);
    }
  };

  const stopSirenEngine = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    setIsSirenPlaying(false);
  };

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      stopSirenEngine();
    } else {
      startSirenEngine();
    }
  };

  // Fetch current GPS Coordinates
  const fetchLiveGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError("Access to Geolocation was denied. Check browser preferences.");
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError("GPS position currently unavailable.");
            break;
          case error.TIMEOUT:
            setGpsError("Location request timed out.");
            break;
          default:
            setGpsError("Could not retrieve GPS coordinates.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto fetch location once opened
  useEffect(() => {
    if (isOpen && !coords && !gpsError) {
      fetchLiveGPS();
    }
  }, [isOpen]);

  const copyCoordinates = () => {
    if (!coords) return;
    const text = `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)} (Accuracy: ${coords.accuracy}m)`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Pre-compiled emergency message generator
  const getSOSMessage = () => {
    const destinationText = itinerary ? ` in ${itinerary.destination}` : '';
    const locationText = coords 
      ? `Approximate Coordinates: Lat ${coords.lat.toFixed(6)}, Lng ${coords.lng.toFixed(6)} (Error +/- ${coords.accuracy}m). Maps: https://www.google.com/maps?q=${coords.lat},${coords.lng}`
      : 'Location details unavailable.';
    return `EMERGENCY SOS MESSAGE!\nI am experiencing an emergency distress situation${destinationText}.\nI need immediate assistance.\n\n${locationText}\n- Sent via TraviQue Smart SOS System`;
  };

  const copySOSMessage = () => {
    navigator.clipboard.writeText(getSOSMessage());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Filter first-aid guides
  const filteredGuides = CRISIS_GUIDES.filter(guide => 
    guide.title.toLowerCase().includes(guideSearch.toLowerCase()) ||
    guide.category.toLowerCase().includes(guideSearch.toLowerCase())
  );

  // Retrieve current active emergency contacts
  const getActiveContacts = () => {
    if (itinerary && itinerary.metadata && itinerary.metadata.emergencyNumbers) {
      return {
        source: `Local ${itinerary.destination} Network`,
        police: itinerary.metadata.emergencyNumbers.police,
        ambulance: itinerary.metadata.emergencyNumbers.ambulance,
        fire: itinerary.metadata.emergencyNumbers.fire,
        general: itinerary.metadata.emergencyNumbers.general
      };
    }
    const defaultCountry = GLOBAL_EMERGENCY_DEFAULTS[selectedDefaultCountry];
    return {
      source: `${defaultCountry.country} Defaults`,
      police: defaultCountry.police,
      ambulance: defaultCountry.ambulance,
      fire: defaultCountry.fire,
      general: defaultCountry.general
    };
  };

  const activeContacts = getActiveContacts();

  return (
    <>
      {/* 1. Pulsating Crimson Floating SOS Button (Stops user's eyes immediately) */}
      <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end">
        {isSirenPlaying && (
          <span className="mb-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest shadow-md">
            Siren Broadcasting
          </span>
        )}
        <button
          id="sos-trigger"
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center text-white bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 shadow-2xl cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden ${
            isSirenPlaying ? 'animate-bounce' : ''
          }`}
          style={{
            boxShadow: isSirenPlaying 
              ? '0 0 25px rgba(239, 68, 68, 0.8)' 
              : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}
        >
          {/* Pulsating background ring */}
          <span className="absolute inset-0 bg-white/20 rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
          <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 animate-pulse shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">SOS</span>
        </button>
      </div>

      {/* 2. SOS Crisis Command Center Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className={`glass-card w-full max-w-4xl relative overflow-hidden border border-red-500/30 flex flex-col max-h-[90vh] ${
            darkMode ? 'bg-slate-900/90 text-white' : 'bg-white/95 text-slate-900'
          }`}
          style={{
            boxShadow: isSirenPlaying 
              ? '0 20px 50px rgba(239, 68, 68, 0.3)' 
              : '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}>
            
            {/* Top Danger Accent Ribbon */}
            <div className="h-2 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400" />

            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl animate-pulse">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold poppins flex items-center space-x-2">
                    <span>Emergency SOS Hub</span>
                    <span className="text-xs bg-red-600/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-red-500/20">Active Protection</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Immediate diagnostic, physical survival, and dialing assistance utilities.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  stopSirenEngine();
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Modal Grid Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* COLUMN 1, ROW 1: AUDIBLE SIREN & PHYSICAL BEACON */}
                <div className="glass-card p-5 border border-red-500/20 bg-red-500/5 dark:bg-red-500/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <Activity className="w-4.5 h-4.5" />
                      <span>Audible Emergency Distress Beacon</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Plays a physical sweeping alternating high-frequency alarm through the speakers to alert nearby rescuers, bystanders, or frighten predators.
                    </p>
                  </div>

                  {/* Pulsating Visual Ring linked to Siren State */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative">
                      {isSirenPlaying && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ transform: 'scale(1.8)' }} />
                          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" style={{ transform: 'scale(1.4)' }} />
                        </>
                      )}
                      <button
                        onClick={handleToggleSiren}
                        className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-300 relative z-10 ${
                          isSirenPlaying
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-xl'
                            : 'bg-slate-800 dark:bg-slate-700 hover:bg-red-600 hover:shadow-lg'
                        }`}
                      >
                        {isSirenPlaying ? (
                          <>
                            <VolumeX className="w-8 h-8 mb-1.5 animate-bounce" />
                            <span>Mute Siren</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-8 h-8 mb-1.5" />
                            <span>Emit Siren</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-slate-400 font-semibold italic">
                    Note: Turn up device volume to maximum. Works completely offline.
                  </p>
                </div>

                {/* COLUMN 1, ROW 2: LIVE GEOLOCATION COORDINATES */}
                <div className="glass-card p-5 border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <Navigation className="w-4.5 h-4.5" />
                      <span>Smart GPS Location Tracker</span>
                    </h3>
                    <button
                      onClick={fetchLiveGPS}
                      disabled={gpsLoading}
                      className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-2 py-1 rounded-lg hover:opacity-80 disabled:opacity-50"
                    >
                      {gpsLoading ? 'Locating...' : 'Refresh GPS'}
                    </button>
                  </div>

                  {gpsError && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-center space-x-1.5">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                      <span>{gpsError}</span>
                    </div>
                  )}

                  {coords ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-100/10 text-center">
                          <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">Latitude</span>
                          <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-1 font-mono">
                            {coords.lat.toFixed(6)}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-100/10 text-center">
                          <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">Longitude</span>
                          <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-1 font-mono">
                            {coords.lng.toFixed(6)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Accuracy Radius: <strong className="text-blue-500">+/- {coords.accuracy} meters</strong></span>
                        <span className="text-[10px] italic">Sourced via Satellite GPS</span>
                      </div>

                      {/* Coordinates Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={copyCoordinates}
                          className="py-2 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 hover:opacity-80 cursor-pointer"
                        >
                          {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCoords ? 'Coords Copied' : 'Copy Coordinates'}</span>
                        </button>

                        <a
                          href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 hover:opacity-90 cursor-pointer"
                        >
                          <Map className="w-3.5 h-3.5" />
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin mb-2" />
                      <span className="text-xs font-semibold">Resolving live satellite coordinates...</span>
                    </div>
                  )}
                </div>

              </div>

              {/* SECTION: DYNAMIC SPEED DIAL NUMBERS */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                      <Phone className="w-4.5 h-4.5 text-emerald-500" />
                      <span>Local Authority Speed-Dial Direct Services</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Emergency connection coordinates. Sourced based on active itinerary location context.
                    </p>
                  </div>

                  {/* Manual Selector if no itinerary context is active */}
                  {!itinerary && (
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">Preset Country:</span>
                      <select
                        value={selectedDefaultCountry}
                        onChange={(e) => setSelectedDefaultCountry(parseInt(e.target.value))}
                        className={`text-[11px] font-bold p-1 rounded border outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {GLOBAL_EMERGENCY_DEFAULTS.map((country, idx) => (
                          <option key={idx} value={idx}>{country.country}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Police Dial */}
                  <a
                    href={`tel:${activeContacts.police}`}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 hover:border-red-500/40 hover:bg-red-500/5 transition-all flex flex-col justify-between relative group text-center"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">1. Local Police</span>
                    <span className="block font-black text-lg md:text-xl text-red-600 dark:text-red-400 mt-1 font-mono group-hover:scale-105 transition-transform">
                      {activeContacts.police}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-2 block bg-slate-100 dark:bg-slate-900 py-1 rounded-md">
                      Dial Authority
                    </span>
                  </a>

                  {/* Ambulance Dial */}
                  <a
                    href={`tel:${activeContacts.ambulance}`}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 hover:border-red-500/40 hover:bg-red-500/5 transition-all flex flex-col justify-between relative group text-center"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">2. Medical Ambulance</span>
                    <span className="block font-black text-lg md:text-xl text-red-600 dark:text-red-400 mt-1 font-mono group-hover:scale-105 transition-transform">
                      {activeContacts.ambulance}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-2 block bg-slate-100 dark:bg-slate-900 py-1 rounded-md">
                      Dial Dispatch
                    </span>
                  </a>

                  {/* Fire Dispatch Dial */}
                  <a
                    href={`tel:${activeContacts.fire}`}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 hover:border-red-500/40 hover:bg-red-500/5 transition-all flex flex-col justify-between relative group text-center"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">3. Fire Brigade</span>
                    <span className="block font-black text-lg md:text-xl text-red-600 dark:text-red-400 mt-1 font-mono group-hover:scale-105 transition-transform">
                      {activeContacts.fire}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-2 block bg-slate-100 dark:bg-slate-900 py-1 rounded-md">
                      Dial Department
                    </span>
                  </a>

                  {/* General / Consul Support */}
                  <a
                    href={`tel:${activeContacts.general}`}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex flex-col justify-between relative group text-center"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">4. General Support</span>
                    <span className="block font-black text-lg md:text-xl text-blue-600 dark:text-blue-400 mt-1 font-mono group-hover:scale-105 transition-transform">
                      {activeContacts.general}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-2 block bg-slate-100 dark:bg-slate-900 py-1 rounded-md">
                      Consult Help
                    </span>
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 text-[11px] text-slate-400 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>
                    Contacts dynamically synced with <strong>{activeContacts.source}</strong>. Click any item above to initiate standard telephone dialing services directly on your active smartphone or cellular device.
                  </span>
                </div>
              </div>

              {/* SECTION: OFFLINE FIRST-AID AND CRISIS SURVIVAL MANUAL */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                      <LifeBuoy className="w-4.5 h-4.5 text-blue-500" />
                      <span>Crisis Action & Immediate First-Aid Deck</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Fully offline-compatible instructions for treating casualties, performing rescue procedures, and managing threats.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-56 shrink-0">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={guideSearch}
                      onChange={(e) => setGuideSearch(e.target.value)}
                      placeholder="Filter guidelines..."
                      className={`w-full pl-8 pr-3 py-1 text-[11px] font-bold rounded-lg border outline-none ${
                        darkMode 
                          ? 'border-white/10 bg-slate-950 text-white focus:border-red-500' 
                          : 'border-slate-200 bg-white text-slate-800 focus:border-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* First aid guide list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Column Accordion selection list */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredGuides.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => setExpandedGuideId(guide.id)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                          expandedGuideId === guide.id
                            ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 font-extrabold'
                            : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            guide.category === 'medical' 
                              ? 'bg-rose-500' 
                              : guide.category === 'physical'
                                ? 'bg-orange-500'
                                : 'bg-blue-500'
                          }`} />
                          <span className="text-xs truncate">{guide.title}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">
                          {guide.category}
                        </span>
                      </button>
                    ))}

                    {filteredGuides.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4">No matching crisis guides.</p>
                    )}
                  </div>

                  {/* Right Column: Display Expanded Details with High Contrast Visual steps */}
                  <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 flex flex-col justify-between">
                    {expandedGuideId && CRISIS_GUIDES.find(g => g.id === expandedGuideId) ? (() => {
                      const guide = CRISIS_GUIDES.find(g => g.id === expandedGuideId)!;
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Active Instruction
                            </span>
                            <span className="text-[10px] bg-red-600/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                              Life-Saving Guide
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-white/10 pb-1.5">
                            {guide.title}
                          </h4>

                          <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>

                          {guide.warning && (
                            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-600 dark:text-red-400 font-bold flex items-start space-x-1.5 mt-2">
                              <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <div>
                                <span className="uppercase tracking-widest block font-black text-[9px]">CRITICAL WARNING:</span>
                                <span>{guide.warning}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })() : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 text-center">
                        <Activity className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
                        <span className="text-xs font-semibold">Select a survival guide card from the list</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* SECTION: INTEGRATED EMERGENCY SOS COMPOSER & BROADCAST */}
              <div className="glass-card p-5 space-y-4">
                <h3 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                  <Send className="w-4.5 h-4.5 text-blue-500" />
                  <span>Draft emergency Broadcast Message</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We have prepared an automated safety packet. You can copy this emergency text with your coordinates to paste into WhatsApp, Line, or your phone's SMS app. You can also specify an emergency contact's number below to generate direct SMS dial tags.
                </p>

                <div className="space-y-3">
                  {/* Generated SOS message box */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-100/10 font-mono text-[11px] leading-relaxed text-slate-300 relative">
                    <pre className="whitespace-pre-wrap select-all">{getSOSMessage()}</pre>
                  </div>

                  {/* SOS action triggers */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-400 font-bold shrink-0">Emergency Contact Phone:</span>
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="e.g. +14155552671"
                        className={`text-xs font-semibold p-1.5 px-3 rounded-lg border outline-none w-full sm:w-44 ${
                          darkMode 
                            ? 'border-white/10 bg-slate-950 text-white' 
                            : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={copySOSMessage}
                        className="py-2 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 text-xs font-bold flex items-center space-x-1.5 hover:opacity-85 cursor-pointer w-full sm:w-auto justify-center"
                      >
                        {copiedMessage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedMessage ? 'Message Copied!' : 'Copy Safety Message'}</span>
                      </button>

                      {emergencyContactPhone && (
                        <a
                          href={`sms:${emergencyContactPhone}?body=${encodeURIComponent(getSOSMessage())}`}
                          className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center space-x-1.5 hover:opacity-90 cursor-pointer w-full sm:w-auto justify-center"
                        >
                          <Send className="w-4 h-4" />
                          <span>Broadcast SMS</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer warning advice */}
            <div className="p-4 bg-red-500/10 border-t border-red-500/20 text-center text-[11px] font-extrabold text-red-600 dark:text-red-400 flex items-center justify-center space-x-2">
              <ShieldAlert className="w-4 h-4 animate-bounce shrink-0" />
              <span>WARNING: If you are in active severe physical danger or require urgent rescue, prioritize calling local authorities immediately.</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
