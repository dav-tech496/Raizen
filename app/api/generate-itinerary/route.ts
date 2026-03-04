import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateItinerary } from '@/lib/gemini/client'

const RequestSchema = z.object({
  destination: z.string().min(2).max(100),
  days: z.number().int().min(1).max(30),
  budget: z.number().int().min(10000).max(100000000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = RequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { destination, days, budget } = validation.data
    const itinerary = await generateItinerary(destination, days, budget)

    return NextResponse.json({ itinerary }, { status: 200 })
  } catch (error) {
    console.error('[generate-itinerary]', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AI returned invalid format. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    )
  }
}
