// hooks/useWeather.ts
// Fetches real-time weather from OpenWeatherMap free tier.
// Requires NEXT_PUBLIC_OPENWEATHER_API_KEY in .env.local

import { useState, useEffect } from 'react'

export interface WeatherData {
  temp: number        // Celsius
  description: string // e.g. "clear sky"
  icon: string        // emoji mapped from OWM icon code
  humidity: number
  loading: boolean
  error: boolean
}

const COORDS: Record<string, { lat: number; lon: number }> = {
  ngwesaung:     { lat: 17.00, lon: 94.77 },
  'chaung-thar': { lat: 17.05, lon: 94.55 },
}

// Map OWM icon codes to emoji
function iconToEmoji(icon: string): string {
  if (icon.startsWith('01')) return '☀️'   // clear sky
  if (icon.startsWith('02')) return '🌤'   // few clouds
  if (icon.startsWith('03')) return '⛅️'  // scattered clouds
  if (icon.startsWith('04')) return '☁️'   // broken/overcast
  if (icon.startsWith('09')) return '🌧'   // shower rain
  if (icon.startsWith('10')) return '🌦'   // rain
  if (icon.startsWith('11')) return '⛈'   // thunderstorm
  if (icon.startsWith('13')) return '❄️'   // snow
  if (icon.startsWith('50')) return '🌫'   // mist
  return '🌡'
}

export function useWeather(destinationSlug: string): WeatherData {
  const [data, setData] = useState<WeatherData>({
    temp: 0,
    description: '',
    icon: '🌡',
    humidity: 0,
    loading: true,
    error: false,
  })

  useEffect(() => {
    const coords = COORDS[destinationSlug]
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    if (!coords || !apiKey) {
      setData((d) => ({ ...d, loading: false, error: true }))
      return
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed')
        return res.json()
      })
      .then((json) => {
        setData({
          temp: Math.round(json.main.temp),
          description: json.weather?.[0]?.description ?? '',
          icon: iconToEmoji(json.weather?.[0]?.icon ?? ''),
          humidity: json.main.humidity,
          loading: false,
          error: false,
        })
      })
      .catch(() => {
        setData((d) => ({ ...d, loading: false, error: true }))
      })
  }, [destinationSlug])

  return data
}
