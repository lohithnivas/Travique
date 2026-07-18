import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { generateFallbackItinerary } from "./server/fallbackData.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI server-side with user secrets key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully.");
  } catch (error) {
    console.error("Error initializing GoogleGenAI:", error);
  }
} else {
  console.log("GEMINI_API_KEY not found or is placeholder. App will run in Fallback Mode.");
}

// Full-stack API routes FIRST
app.post("/api/planner", async (req, res) => {
  const input = req.body;

  // 1. Inputs Validation
  if (!input || !input.destination) {
    return res.status(400).json({ error: "Destination is required." });
  }

  const travelDays = Math.min(14, Math.max(1, Number(input.travelDays) || 3));
  input.travelDays = travelDays;

  // 2. Try using the Gemini API if initialized
  if (ai) {
    try {
      console.log(`Generating AI Travel Itinerary for ${input.destination}...`);
      
      const systemInstruction = `You are TraviQue, an elite luxury travel planner and technology travel expert. 
Generate a premium, hyper-personalized, realistic travel itinerary matching the user's specific desires exactly.
You must return a valid JSON object matching the exact structure of TravelItineraryResponse.
Be realistic, highly detailed, and culturally aware of the destination.

Mandatory formatting requirements:
- Duration: ${travelDays} days.
- Format: Return JSON only. No markdown ticks, no extra text.
- Do not use any placeholders. Everything must be fully written out.`;

      const prompt = `Generate a travel itinerary matching these preferences:
- Starting Location: ${input.startingLocation}
- Destination: ${input.destination}
- Duration: ${travelDays} Days
- Travel travelers count: ${input.travelersCount}
- Budget Tier/Level: $${input.budget} USD Max
- Travel Style/Type: ${input.travelType} (solo, couple, friends, family)
- Interests: ${input.interests.join(", ")}
- Transport Preference: ${input.transportType}
- Accommodation Level: ${input.accommodationType} (budget, standard, luxury)
- Travel Pace: ${input.travelPace} (relaxed, balanced, fast)

Return a structured JSON object containing:
1. destination: exact destination name
2. durationDays: ${travelDays}
3. suggestions: array of 3 suggested specific districts, neighborhood, or excursions with name, matchScore (0-100), suitabilityReason, and overview
4. itinerary: array of ${travelDays} elements, each day containing:
   - dayNumber: integer
   - title: concise heading for the day
   - morning: { activity, breakfast, time, cost, transport, notes }
   - afternoon: { activity, lunch, time, cost, transport, notes }
   - evening: { activity, dinner, time, cost, transport, notes }
   - nightActivity: { activity, time, cost, transport, notes }
5. budget: budget breakdown in USD with transportation, accommodation, food, activities, shopping, emergency, miscellaneous, and total. Make sure these sum up to total and fit the budget level.
6. packingList: categories: clothing, electronics, medicines, accessories, documents, toiletries, emergency, essentials (with arrays of strings for specific pack items)
7. metadata: {
     weatherSummary,
     bestTimeToVisit,
     touristAttractions (array),
     nearbyAttractions (array),
     localFood (array),
     currencyInfo: { name, code, symbol, exchangeRateNotice },
     language,
     safetyTips (array),
     emergencyNumbers: { police, ambulance, fire, general },
     travelTips (array),
     moneySavingTips (array),
     visaNotes,
     publicTransportGuide,
     googleMapsLinks: Array of objects with label and url, e.g. [{label: "Main Station", url: "https://www.google.com/maps/search/?api=1&query=..."}]
     localFestivals (array),
     photoSpots (array),
     travelAdvisories,
     aiTravelTips (array),
     tripDifficultyRating ("Easy" | "Moderate" | "Strenuous"),
     estimatedWalkingDistanceKm (number),
     carbonFootprintEstimateKg (number)
   }`;

      // Call Gemini API with schema verification
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              durationDays: { type: Type.INTEGER },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    matchScore: { type: Type.INTEGER },
                    suitabilityReason: { type: Type.STRING },
                    overview: { type: Type.STRING }
                  },
                  required: ["name", "matchScore", "suitabilityReason", "overview"]
                }
              },
              itinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    morning: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        breakfast: { type: Type.STRING },
                        time: { type: Type.STRING },
                        cost: { type: Type.INTEGER },
                        transport: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["activity", "breakfast", "time", "cost", "transport", "notes"]
                    },
                    afternoon: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        lunch: { type: Type.STRING },
                        time: { type: Type.STRING },
                        cost: { type: Type.INTEGER },
                        transport: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["activity", "lunch", "time", "cost", "transport", "notes"]
                    },
                    evening: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        dinner: { type: Type.STRING },
                        time: { type: Type.STRING },
                        cost: { type: Type.INTEGER },
                        transport: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["activity", "dinner", "time", "cost", "transport", "notes"]
                    },
                    nightActivity: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        time: { type: Type.STRING },
                        cost: { type: Type.INTEGER },
                        transport: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["activity", "time", "cost", "transport", "notes"]
                    }
                  },
                  required: ["dayNumber", "title", "morning", "afternoon", "evening", "nightActivity"]
                }
              },
              budget: {
                type: Type.OBJECT,
                properties: {
                  transportation: { type: Type.INTEGER },
                  accommodation: { type: Type.INTEGER },
                  food: { type: Type.INTEGER },
                  activities: { type: Type.INTEGER },
                  shopping: { type: Type.INTEGER },
                  emergency: { type: Type.INTEGER },
                  miscellaneous: { type: Type.INTEGER },
                  total: { type: Type.INTEGER }
                },
                required: ["transportation", "accommodation", "food", "activities", "shopping", "emergency", "miscellaneous", "total"]
              },
              packingList: {
                type: Type.OBJECT,
                properties: {
                  clothing: { type: Type.ARRAY, items: { type: Type.STRING } },
                  electronics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  medicines: { type: Type.ARRAY, items: { type: Type.STRING } },
                  accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
                  documents: { type: Type.ARRAY, items: { type: Type.STRING } },
                  toiletries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emergency: { type: Type.ARRAY, items: { type: Type.STRING } },
                  essentials: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["clothing", "electronics", "medicines", "accessories", "documents", "toiletries", "emergency", "essentials"]
              },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  weatherSummary: { type: Type.STRING },
                  bestTimeToVisit: { type: Type.STRING },
                  touristAttractions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nearbyAttractions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  localFood: { type: Type.ARRAY, items: { type: Type.STRING } },
                  currencyInfo: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      code: { type: Type.STRING },
                      symbol: { type: Type.STRING },
                      exchangeRateNotice: { type: Type.STRING }
                    },
                    required: ["name", "code", "symbol"]
                  },
                  language: { type: Type.STRING },
                  safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emergencyNumbers: {
                    type: Type.OBJECT,
                    properties: {
                      police: { type: Type.STRING },
                      ambulance: { type: Type.STRING },
                      fire: { type: Type.STRING },
                      general: { type: Type.STRING }
                    },
                    required: ["police", "ambulance", "fire", "general"]
                  },
                  travelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  moneySavingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  visaNotes: { type: Type.STRING },
                  publicTransportGuide: { type: Type.STRING },
                  googleMapsLinks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        url: { type: Type.STRING }
                      },
                      required: ["label", "url"]
                    }
                  },
                  localFestivals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  photoSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
                  travelAdvisories: { type: Type.STRING },
                  aiTravelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tripDifficultyRating: { type: Type.STRING },
                  estimatedWalkingDistanceKm: { type: Type.NUMBER },
                  carbonFootprintEstimateKg: { type: Type.NUMBER }
                },
                required: [
                  "weatherSummary", "bestTimeToVisit", "touristAttractions", "nearbyAttractions", "localFood", 
                  "currencyInfo", "language", "safetyTips", "emergencyNumbers", "travelTips", "moneySavingTips", 
                  "visaNotes", "publicTransportGuide", "googleMapsLinks", "localFestivals", "photoSpots", 
                  "travelAdvisories", "aiTravelTips", "tripDifficultyRating", "estimatedWalkingDistanceKm", "carbonFootprintEstimateKg"
                ]
              }
            },
            required: ["destination", "durationDays", "suggestions", "itinerary", "budget", "packingList", "metadata"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsedData = JSON.parse(responseText);
        console.log("AI Travel Itinerary generated and verified successfully!");
        return res.json(parsedData);
      }
      throw new Error("Empty response text from Gemini.");
    } catch (error) {
      console.error("Gemini API error. Triggering Fallback Mode: ", error);
      // Let it go to fallback below
    }
  }

  // Fallback Mode (seamless, guarantees zero errors during demonstration)
  console.log("Serving request via dynamic Fallback Mode...");
  const fallbackData = generateFallbackItinerary(input);
  return res.json(fallbackData);
});

// Setup Vite Dev Server / Static files depending on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite middleware in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static assets in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TraviQue server running at http://localhost:${PORT}`);
  });
}

startServer();
