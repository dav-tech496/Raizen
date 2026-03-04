import { GoogleGenerativeAI } from '@google/generative-ai'
import { ItineraryAIResponse } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_INSTRUCTION = `You are Raizen, an expert Myanmar travel planner with deep local knowledge.
You MUST return ONLY valid JSON — no markdown, no explanation, no code fences, no extra text whatsoever.
Always use Myanmar Kyat (MMK) for all pricing. 1 USD ≈ 2,100 MMK.
Provide realistic, current pricing based on actual Myanmar costs.
Be specific about real locations, restaurants, temples, and activities in Myanmar.`

export async function generateItinerary(
  destination: string,
  days: number,
  budget: number
): Promise<ItineraryAIResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  })

  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}, Myanmar.
Total budget: ${budget.toLocaleString()} MMK

Return a JSON object with EXACTLY this structure:
{
  "destination": "${destination}",
  "total_days": ${days},
  "total_estimated_budget": <number in MMK>,
  "currency": "MMK",
  "budget_breakdown": {
    "transport": <number>,
    "hotel": <number>,
    "food": <number>,
    "activities": <number>,
    "misc": <number>
  },
  "daily_plans": [
    {
      "day": 1,
      "title": "<evocative day title>",
      "activities": [
        {
          "time": "08:00",
          "activity": "<specific activity name>",
          "location": "<real place name in ${destination}>",
          "cost": <number in MMK>,
          "notes": "<practical local tip>"
        }
      ],
      "estimated_cost": <total MMK for day>
    }
  ],
  "safety_tips": ["<tip1>", "<tip2>", "<tip3>"],
  "best_time_to_visit": "<months and reason>",
  "local_tips": ["<tip1>", "<tip2>", "<tip3>"]
}

Include 4-6 activities per day. Make all details realistic and specific to Myanmar.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  const parsed: ItineraryAIResponse = JSON.parse(cleaned)

  if (!parsed.destination || !parsed.daily_plans || !Array.isArray(parsed.daily_plans)) {
    throw new Error('Invalid itinerary structure from AI')
  }

  return parsed
}
