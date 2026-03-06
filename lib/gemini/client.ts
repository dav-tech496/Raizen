import { GoogleGenerativeAI } from '@google/generative-ai'
import { ItineraryAIResponse } from '@/types'

export async function generateItinerary(
  destination: string,
  days: number,
  budget: number
): Promise<ItineraryAIResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

  const genAI = new GoogleGenerativeAI(apiKey)

  const TRANSPORT_COST = 150000 // Fixed one-way trip cost for Ngwe Saung
  const hotelBudget = Math.floor((budget - TRANSPORT_COST) * 0.60)
  const foodBudget = Math.floor((budget - TRANSPORT_COST) * 0.20)
  const activitiesBudget = Math.floor((budget - TRANSPORT_COST) * 0.15)
  const miscBudget = budget - TRANSPORT_COST - hotelBudget - foodBudget - activitiesBudget

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  })

  const prompt = `You are an expert Myanmar travel planner. Create a ${days}-day itinerary for ${destination}, Myanmar.

IMPORTANT BUDGET RULES — use EXACTLY these numbers in your response:
- transport: ${TRANSPORT_COST} (fixed one-trip bus/van cost, do NOT change this)
- hotel: ${hotelBudget}
- food: ${foodBudget}
- activities: ${activitiesBudget}
- misc: ${miscBudget}
- total_estimated_budget: ${budget}

Return ONLY a valid JSON object with NO markdown, NO code fences, NO extra text:
{
  "destination": "${destination}",
  "total_days": ${days},
  "total_estimated_budget": ${budget},
  "currency": "MMK",
  "budget_breakdown": {
    "transport": ${TRANSPORT_COST},
    "hotel": ${hotelBudget},
    "food": ${foodBudget},
    "activities": ${activitiesBudget},
    "misc": ${miscBudget}
  },
  "daily_plans": [
    {
      "day": 1,
      "title": "<evocative day title>",
      "activities": [
        {
          "time": "08:00",
          "activity": "<specific activity>",
          "location": "<real place in ${destination}>",
          "cost": <number in MMK>,
          "notes": "<practical local tip>"
        }
      ],
      "estimated_cost": <total MMK for this day>
    }
  ],
  "safety_tips": ["<tip1>", "<tip2>", "<tip3>"],
  "best_time_to_visit": "<months and reason>",
  "local_tips": ["<tip1>", "<tip2>", "<tip3>"]
}

Include 4-6 activities per day. Use real place names in ${destination}. All costs in MMK.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Strip any accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed: ItineraryAIResponse = JSON.parse(cleaned)

  if (!parsed.destination || !Array.isArray(parsed.daily_plans)) {
    throw new Error('Invalid itinerary structure returned by AI')
  }

  // Force the transport value to be exactly 150000 regardless of AI output
  parsed.budget_breakdown.transport = TRANSPORT_COST

  return parsed
}
