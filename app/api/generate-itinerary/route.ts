import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateItinerary } from '@/lib/gemini/client'

const RequestSchema = z.object({
  destination: z.string().min(2).max(100),
  days: z.number().int().min(1).max(30),
  budget: z.number().int().min(200000).max(100000000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = RequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { destination, days, budget } = validation.data
    const itinerary = await generateItinerary(destination, days, budget)
    return NextResponse.json({ itinerary }, { status: 200 })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[generate-itinerary] Error:', message)

    // Show friendly message for common errors
    let userMessage = 'Failed to generate itinerary. Please try again.'
    if (message.includes('429') || message.includes('quota') || message.includes('Too Many Requests')) {
      userMessage = 'The AI service is temporarily over capacity. Please wait a few minutes and try again.'
    } else if (message.includes('API_KEY') || message.includes('api key') || message.includes('not configured')) {
      userMessage = 'AI service configuration error. Please contact support.'
    } else if (message.includes('GEMINI_API_KEY')) {
      userMessage = 'AI service is not configured correctly.'
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    )
  }
}
