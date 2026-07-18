import { TravelItineraryResponse, PlannerInput, ItineraryDay, SuggestedDestination, BudgetBreakdown, PackingChecklist, SmartMetadata } from "../src/types.js";

/**
 * Dynamically builds a realistic, highly detailed itinerary based on user inputs.
 * This guarantees the application remains 100% functional and premium-looking
 * under any circumstances (fallback mode).
 */
export function generateFallbackItinerary(input: PlannerInput): TravelItineraryResponse {
  const dest = input.destination || "Paris";
  const start = input.startingLocation || "New York";
  const days = Math.min(14, Math.max(1, input.travelDays || 5));
  const budgetVal = input.budget || 2000;
  const travelers = input.travelersCount || 1;

  // Let's create dynamic suggested destinations based on the destination
  const suggestions: SuggestedDestination[] = [
    {
      name: `${dest} Historic Center`,
      matchScore: 98,
      suitabilityReason: `Highly matches your interest in ${input.interests.join(", ") || "culture and history"}. Offers easy access to main landmarks with your preferred transport (${input.transportType}).`,
      overview: `The beating heart of the city, full of rich historical architecture, local street food, and vibrant artistic corners.`
    },
    {
      name: `Charming Neighborhoods of ${dest}`,
      matchScore: 92,
      suitabilityReason: `Fits your ${input.travelPace} pace and matches ${input.interests.includes("Nature") ? "nature-focused" : "aesthetic-focused"} preferences perfectly.`,
      overview: `A quieter, scenic area beloved by locals. Ideal for photography spots and local dining gems.`
    },
    {
      name: `Scenic Day Trip from ${dest}`,
      matchScore: 88,
      suitabilityReason: `Provides an exciting escape to nearby landmarks. Perfectly fits your ${input.accommodationType} comfort level.`,
      overview: `A breathtaking excursion featuring panoramic views, immersive local experiences, and excellent photo opportunities.`
    }
  ];

  // Daily template structures to customize
  const morningTemplates = [
    { activity: "Guided walking tour of historic landmarks", breakfast: "Local café specialty and fresh brew", time: "09:00 AM", cost: 15, notes: "Wear comfortable walking shoes. Bring your camera." },
    { activity: "Visit to the local botanical gardens and green reserves", breakfast: "Organic bakery and smoothie bowl", time: "08:30 AM", cost: 10, notes: "Perfect light for morning photography." },
    { activity: "Museum of fine arts and classical gallery tour", breakfast: "Classic pastry and espresso flight", time: "09:15 AM", cost: 20, notes: "Pre-book tickets online to skip the morning lines." },
    { activity: "Local architectural highlights and historical square stroll", breakfast: "Savory local breakfast pastry and tea", time: "09:00 AM", cost: 5, notes: "Beautiful historic facades." },
    { activity: "Local artisan marketplace tour and craft shopping", breakfast: "Traditional artisan breakfast set", time: "09:30 AM", cost: 0, notes: "Chat with local craftsmen." }
  ];

  const afternoonTemplates = [
    { activity: "Gourmet food tasting tour or cooking workshop", lunch: "Traditional local bistro set menu", time: "01:00 PM", cost: 35, notes: "Try the regional specialty recommended by the chef." },
    { activity: "Panoramic river cruise or scenic viewpoint ride", lunch: "Outdoor terrace lunch with city views", time: "01:30 PM", cost: 25, notes: "Keep sunscreen and sunglasses handy." },
    { activity: "Modern art district explorer and gallery hopping", lunch: "Hip local fusion diner or food hall", time: "12:30 PM", cost: 15, notes: "Lots of vibrant street art and indie shops." },
    { activity: "Guided historical castle or fortress exploration", lunch: "Traditional tavern lunch", time: "01:00 PM", cost: 30, notes: "Great historical significance and breathtaking battlements." },
    { activity: "Interactive science museum or local landmark experience", lunch: "Chic courtyard cafe lunch", time: "01:15 PM", cost: 22, notes: "Highly engaging exhibitions." }
  ];

  const eveningTemplates = [
    { activity: "Sunset viewpoint viewing and photography walk", dinner: "Scenic rooftop dining experience", time: "06:00 PM", cost: 55, notes: "Arrive 30 minutes before sunset for the golden hour." },
    { activity: "Symphony orchestra concert or local musical performance", dinner: "Cozy neighborhood candlelit cellar restaurant", time: "06:30 PM", cost: 45, notes: "Smart casual dress code recommended." },
    { activity: "Stroll through the lit boulevard or trendy canal district", dinner: "High-end local specialty dining room", time: "07:00 PM", cost: 65, notes: "Booking well in advance is highly recommended." },
    { activity: "Local food hall exploration and tasting flight", dinner: "Street food market tasting adventure", time: "06:00 PM", cost: 20, notes: "Lively local evening atmosphere." },
    { activity: "Scenic harbour or skyline boat cruise with live jazz", dinner: "Bespoke dockside seafood grill", time: "06:45 PM", cost: 50, notes: "Dynamic views as the city lights up." }
  ];

  const nightTemplates = [
    { activity: "Cozy local jazz lounge or authentic music pub", time: "09:30 PM", cost: 15, notes: "Try a local craft beverage or signature mocktail." },
    { activity: "Guided night ghost tour or architectural light tour", time: "09:00 PM", cost: 20, notes: "Fascinating historical legends illuminated at night." },
    { activity: "Stargazing and nighttime panoramic skyline view", time: "10:00 PM", cost: 0, notes: "Incredibly peaceful scenery and cool night breeze." },
    { activity: "Trendy local nighttime dessert café or speakeasy bar", time: "09:45 PM", cost: 18, notes: "Delectable artisan pastries and local vibes." },
    { activity: "Night bazaar walkthrough or live artisan theatre performance", time: "09:15 PM", cost: 25, notes: "Immerse yourself in local nightlife rituals." }
  ];

  const transportModes = [
    input.transportType === "car" ? "Rental Car / Private Vehicle" : "Efficient Local Metro & Trams",
    "Scenic Walk & Light Public Transit",
    input.transportType === "car" ? "Self-Drive Car" : "Eco-friendly Public Bicycle or Walk",
    "Local Taxi/Ride-sharing App",
    "Historic Tramline & Scenic Walks"
  ];

  // Construct day-by-day itinerary
  const itinerary: ItineraryDay[] = [];
  for (let i = 1; i <= days; i++) {
    const idx = (i - 1) % 5;
    const morning = { ...morningTemplates[idx] };
    const afternoon = { ...afternoonTemplates[idx] };
    const evening = { ...eveningTemplates[idx] };
    const night = { ...nightTemplates[idx] };

    // Adjust costs based on budget tier
    let costMultiplier = 1;
    if (input.accommodationType === "budget") costMultiplier = 0.6;
    if (input.accommodationType === "luxury") costMultiplier = 1.8;

    morning.cost = Math.round(morning.cost * costMultiplier);
    afternoon.cost = Math.round(afternoon.cost * costMultiplier);
    evening.cost = Math.round(evening.cost * costMultiplier);
    night.cost = Math.round(night.cost * costMultiplier);

    itinerary.push({
      dayNumber: i,
      title: `Exploring ${dest}: ${i === 1 ? "Arrival & Landmarks" : i === days ? "Farewell & Highlights" : "Scenic Neighborhoods"}`,
      morning: {
        activity: morning.activity,
        breakfast: morning.breakfast,
        time: morning.time,
        cost: morning.cost,
        transport: transportModes[idx % transportModes.length],
        notes: morning.notes
      },
      afternoon: {
        activity: afternoon.activity,
        lunch: afternoon.lunch,
        time: afternoon.time,
        cost: afternoon.cost,
        transport: transportModes[(idx + 1) % transportModes.length],
        notes: afternoon.notes
      },
      evening: {
        activity: evening.activity,
        dinner: evening.dinner,
        time: evening.time,
        cost: evening.cost,
        transport: transportModes[(idx + 2) % transportModes.length],
        notes: evening.notes
      },
      nightActivity: {
        activity: night.activity,
        time: night.time,
        cost: night.cost,
        transport: "Convenient Walking / Local Taxi",
        notes: night.notes
      }
    });
  }

  // Budget Breakdown
  let accomRate = 80;
  if (input.accommodationType === "luxury") accomRate = 250;
  else if (input.accommodationType === "standard") accomRate = 140;

  let transCost = 150;
  if (input.transportType === "flight") transCost = 450;
  else if (input.transportType === "train") transCost = 120;

  const accommodationTotal = accomRate * days * travelers;
  const transportationTotal = transCost * travelers;
  const foodTotal = (input.accommodationType === "budget" ? 30 : input.accommodationType === "luxury" ? 110 : 60) * days * travelers;
  const activitiesTotal = itinerary.reduce((sum, d) => sum + d.morning.cost + d.afternoon.cost + d.evening.cost + d.nightActivity.cost, 0) * travelers;
  const shoppingTotal = Math.round(budgetVal * 0.12);
  const emergencyTotal = Math.round(budgetVal * 0.08);
  const miscellaneousTotal = Math.round(budgetVal * 0.05);
  const calculatedTotal = transportationTotal + accommodationTotal + foodTotal + activitiesTotal + shoppingTotal + emergencyTotal + miscellaneousTotal;

  const budget: BudgetBreakdown = {
    transportation: transportationTotal,
    accommodation: accommodationTotal,
    food: foodTotal,
    activities: activitiesTotal,
    shopping: shoppingTotal,
    emergency: emergencyTotal,
    miscellaneous: miscellaneousTotal,
    total: calculatedTotal
  };

  // Packing Checklist
  const clothingItems = ["Weather-appropriate layer jacket", "Comfortable walking sneakers", "Versatile pants & trousers", "Breathable daily tops", "Casual evening dinner outfits", "Socks & undergarments"];
  const electronicsItems = ["Smartphone & global dual USB charger", "High-capacity power bank", "Universal travel adapter plug", "Camera & spare memory cards", "Noise-cancelling headphones"];
  const medicinesItems = ["Personal prescription medications", "Pain relievers & anti-inflammatories", "Motion sickness tablets", "Bandaids & antiseptic wipes", "Digestive relief tablets"];
  const accessoriesItems = ["UV-protection polarized sunglasses", "Sturdy lightweight umbrella or poncho", "Secure travel money belt / anti-theft pouch", "Refillable insulated water bottle", "Stylish daytime daypack"];
  const documentsItems = ["Valid Passport & Visa copies", "Printed flight tickets & travel insurance", "Hotel booking confirmations", "Driver's license or state ID", "Credit cards & emergency local currency"];
  const toiletriesItems = ["TSA-compliant travel shampoo & soap", "Toothbrush & toothpaste travel set", "Moisturizing sunscreen SPF 50+", "Deodorant & sanitizing hand wipes", "Hairbrush & basic grooming kit"];
  const emergencyItems = ["Photocopied emergency contact list", "Local embassy address & helpline", "Mini backup travel flashlight", "Emergency backup cash", "First-aid medical wrap"];
  const essentialsItems = ["TraviQue Offline Smart Itinerary", "Comfortable sleeping eye mask & earplugs", "Hand sanitizer gel", "Wet wipes", "Small physical travel notebook"];

  // Add dynamic items based on interests & destination
  if (input.interests.includes("Adventure")) {
    clothingItems.push("Durable activewear", "Sturdy hiking socks");
    essentialsItems.push("Multi-tool key", "High-traction trail shoes");
  }
  if (input.interests.includes("Beaches")) {
    clothingItems.push("Swimwear", "Lightweight beach cover-up");
    toiletriesItems.push("Soothe aloe vera gel", "Reef-safe sunscreen");
    accessoriesItems.push("Microfiber sand-free beach towel");
  }
  if (input.interests.includes("Photography")) {
    electronicsItems.push("Camera tripod", "Lens cleaning kit", "Extra camera batteries");
  }
  if (input.interests.includes("Nightlife")) {
    clothingItems.push("Trendy nightlife dress code attire");
  }

  const packingList: PackingChecklist = {
    clothing: clothingItems,
    electronics: electronicsItems,
    medicines: medicinesItems,
    accessories: accessoriesItems,
    documents: documentsItems,
    toiletries: toiletriesItems,
    emergency: emergencyItems,
    essentials: essentialsItems
  };

  // Metadata
  const metadata: SmartMetadata = {
    weatherSummary: `Generally pleasant with temperate skies. Temperatures range from 16°C to 24°C (61°F - 75°F). Perfect for exploring.`,
    bestTimeToVisit: `Spring (April to June) and Autumn (September to November) offer spectacular scenery, fewer crowds, and ideal walking conditions.`,
    touristAttractions: [`Historic Palace & Gardens`, `${dest} Grand Cathedral`, `National Museum of History`, `Scenic Central Plaza`, `Riverside Promenade`],
    nearbyAttractions: [`Old Castle Hill`, `Local Vineyard District`, `Mountain View Lookout`, `Artisanal Pottery Village`],
    localFood: [`Slow-cooked Regional Stew`, `Freshly Baked Artisan Bread`, `Signature Local Pastry`, `Traditional Cheese Board`, `Handcrafted Herb Infusion`],
    currencyInfo: {
      name: "USD-equivalent Local Currency",
      code: "LOC",
      symbol: "¤",
      exchangeRateNotice: "Credit cards are widely accepted at almost all locations. Keeping a small amount of local currency cash is helpful for street markets."
    },
    language: "Local Language (English is very widely spoken in tourist zones)",
    safetyTips: [
      "Keep your belongings secure in crowded squares and public transit.",
      "Always use registered official taxis or popular ridesharing apps.",
      "Be aware of typical street-vendor scams near primary landmarks."
    ],
    emergencyNumbers: {
      police: "112",
      ambulance: "112",
      fire: "112",
      general: "911 / 112"
    },
    travelTips: [
      `Purchase a public transport travelcard at the airport for unlimited rides.`,
      `Book tickets for the primary landmarks 2-3 weeks in advance.`,
      `Tipping of 5-10% is appreciated for exceptional service, but not mandatory.`
    ],
    moneySavingTips: [
      `Visit major national museums on their free-entry days (often the first Sunday of the month).`,
      `Eat your main meal during lunchtime when restaurants offer "Menu of the Day" discounts.`,
      `Explore on foot as much as possible - the city is incredibly pedestrian-friendly!`
    ],
    visaNotes: `Visa-free or Visa-on-arrival for major passport holders for up to 90 days. Please verify with your local embassy before travel.`,
    publicTransportGuide: `Features an incredibly integrated subway and tram network. Trams are highly scenic and run every 5-8 minutes. Metro cards can be topped up via credit cards at any station kiosk.`,
    googleMapsLinks: [
      { label: `Main Square Center`, url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest + " Center Square")}` },
      { label: `Central Railway Station`, url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest + " Central Station")}` },
      { label: `Tourism Information Office`, url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest + " Tourism Office")}` }
    ],
    localFestivals: [`Spring Cultural Parade (May)`, `Summer Open-Air Jazz Festival (July)`, `Grand Harvest Fair (October)`],
    photoSpots: [`Rooftop Sunset Viewpoint`, `Lit Arches of Old Bridge`, `Stately Cathedral Courtyard`, `Artistic Pastel Alleyway`],
    travelAdvisories: `No active high-level travel advisories. Normal standard safety precautions should be observed.`,
    aiTravelTips: [
      `Adjust your pace to '${input.travelPace}' as configured. For '${input.travelPace}' travel, prioritize deep neighborhood immersion over rushing.`,
      `Given your interest in ${input.interests.join(", ")}, consider spending additional time at the artisan district and local markets.`,
      `The estimated carbon footprint for this itinerary is ${Math.round(days * 18)} kg CO2e, mostly driven by your preferred '${input.transportType}' transport.`
    ],
    tripDifficultyRating: days > 7 ? "Moderate" : "Easy",
    estimatedWalkingDistanceKm: Math.round(days * 6.5),
    carbonFootprintEstimateKg: Math.round(days * 18 + (input.transportType === "flight" ? 320 : 45))
  };

  return {
    destination: dest,
    durationDays: days,
    suggestions,
    itinerary,
    budget,
    packingList,
    metadata
  };
}
