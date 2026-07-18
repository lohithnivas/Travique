/**
 * TraviQue Type System
 */

export interface PlannerInput {
  startingLocation: string;
  destination: string;
  travelDays: number;
  budget: number; // Max budget in USD
  travelersCount: number;
  travelType: 'solo' | 'couple' | 'friends' | 'family';
  interests: string[]; // e.g., Adventure, Food, Nature, etc.
  transportType: 'flight' | 'train' | 'bus' | 'car';
  accommodationType: 'budget' | 'standard' | 'luxury';
  travelPace: 'relaxed' | 'balanced' | 'fast';
}

export interface SuggestedDestination {
  name: string;
  matchScore: number; // Percentage, e.g., 95
  suitabilityReason: string; // Why this destination fits the preferences
  overview: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  morning: {
    activity: string;
    breakfast: string;
    time: string;
    cost: number;
    transport: string;
    notes: string;
  };
  afternoon: {
    activity: string;
    lunch: string;
    time: string;
    cost: number;
    transport: string;
    notes: string;
  };
  evening: {
    activity: string;
    dinner: string;
    time: string;
    cost: number;
    transport: string;
    notes: string;
  };
  nightActivity: {
    activity: string;
    time: string;
    cost: number;
    transport: string;
    notes: string;
  };
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities: number;
  shopping: number;
  emergency: number;
  miscellaneous: number;
  total: number;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: 'clothing' | 'electronics' | 'medicines' | 'accessories' | 'documents' | 'toiletries' | 'emergency' | 'essentials';
  packed: boolean;
}

export interface PackingChecklist {
  clothing: string[];
  electronics: string[];
  medicines: string[];
  accessories: string[];
  documents: string[];
  toiletries: string[];
  emergency: string[];
  essentials: string[];
}

export interface SmartMetadata {
  weatherSummary: string;
  bestTimeToVisit: string;
  touristAttractions: string[];
  nearbyAttractions: string[];
  localFood: string[];
  currencyInfo: {
    name: string;
    code: string;
    symbol: string;
    exchangeRateNotice?: string;
  };
  language: string;
  safetyTips: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    general: string;
  };
  travelTips: string[];
  moneySavingTips: string[];
  visaNotes: string;
  publicTransportGuide: string;
  googleMapsLinks: Array<{ label: string; url: string }>;
  localFestivals: string[];
  photoSpots: string[];
  travelAdvisories: string;
  aiTravelTips: string[];
  tripDifficultyRating: 'Easy' | 'Moderate' | 'Strenuous';
  estimatedWalkingDistanceKm: number;
  carbonFootprintEstimateKg: number;
}

export interface TravelItineraryResponse {
  destination: string;
  durationDays: number;
  suggestions: SuggestedDestination[];
  itinerary: ItineraryDay[];
  budget: BudgetBreakdown;
  packingList: PackingChecklist;
  metadata: SmartMetadata;
}
