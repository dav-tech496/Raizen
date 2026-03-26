import { NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destination, days, budget, travelerType, lang } = body

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, days, budget' },
        { status: 400 }
      )
    }

    const model = getGeminiModel()
    const isEn = lang !== 'mm'

    const prompt = isEn
      ? `You are a Myanmar travel expert. Create a ${days}-day trip summary for ${destination}.
Budget: ${Number(budget).toLocaleString()} MMK per day per person. Traveler type: ${travelerType}.
Respond ONLY with valid JSON (no markdown fences), using this exact shape:
{"summary":"2-3 sentence overview","highlights":["h1","h2","h3"],"tips":["t1","t2"],"bestActivities":["a1","a2","a3"]}`
      : `မြန်မာနိုင်ငံ ခရီးသွား ကျွမ်းကျင်သူ အဖြစ် ${destination} တွင် ${days} ရက်ကြာ ခရီးစဉ် အကျဉ်းချုပ် ရေးပေးပါ။
ဘတ်ဂျက်: တစ်ရက် တစ်ဦး ${Number(budget).toLocaleString()} ကျပ်။ ခရီးသည်: ${travelerType}။
JSON သာ ပြန်ပေးပါ (markdown မပါ):
{"summary":"အကျဉ်းချုပ်","highlights":["အချက်၁","အချက်၂","အချက်၃"],"tips":["အကြံ၁","အကြံ၂"],"bestActivities":["လှုပ်ရှားမှု၁","လှုပ်ရှားမှု၂","လှုပ်ရှားမှု၃"]}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()

    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ raw: text })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    console.error('[ai-plan]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
