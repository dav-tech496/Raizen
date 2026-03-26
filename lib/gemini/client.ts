// lib/gemini/client.ts
// Server-side only — never import in Client Components

import { GoogleGenerativeAI } from '@google/generative-ai'

export function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing GEMINI_API_KEY.\n' +
      'Add it in Vercel → Project → Settings → Environment Variables.'
    )
  }
  return new GoogleGenerativeAI(apiKey)
}

export function getGeminiModel(modelName = 'gemini-1.5-flash') {
  return createGeminiClient().getGenerativeModel({ model: modelName })
}
