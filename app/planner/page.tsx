'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface HotelRoom {
  room_type: string;
  price_per_night: number;
  capacity: number | null;
}
interface Hotel {
  id: string;
  name: string;
  price_category: string;
  price_per_night_mmk: number | null;
  hotel_rooms: HotelRoom[];
}
interface Transport {
  route: string;
  vehicle_type: string;
  price_regular: number;
  price_weekend: number | null;
  note: string | null;
}
interface Destination {
  id: string;
  name: string;
  slug: string;
}

const DAYS_OPTIONS = [2, 3, 4, 5, 7];
const BUDGET_MIN = 30000;
const BUDGET_MAX = 1000000;
const BUDGET_PRESETS = [
  { label: 'Budget', value: 100000 },
  { label: 'Mid-Range', value: 200000 },
  { label: 'Premium', value: 400000 },
  { label: 'Luxury', value: 700000 },
];

function getBudgetLabel(val: number) {
  if (val <= 100000) return 'Budget';
  if (val <= 250000) return 'Mid-Range';
  if (val <= 500000) return 'Premium';
  return 'Luxury';
}

// Filter hotels by budget (price_per_night within 0–1.5× budget)
function filterHotelsByBudget(hotels: Hotel[], budgetPerDay: number) {
  return hotels.filter((h) => {
    const rooms = h.hotel_rooms ?? [];
    if (rooms.length === 0) return (h.price_per_night_mmk ?? 0) <= budgetPerDay * 1.5;
    const minPrice = Math.min(...rooms.map((r) => r.price_per_night));
    return minPrice <= budgetPerDay * 1.5;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string>('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(200000);
  const [travelAs, setTravelAs] = useState<'solo' | 'couple' | 'family'>('couple');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transport, setTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  // Load available destinations on mount
  useEffect(() => {
    supabase
      .from('destinations')
      .select('id, name, slug')
      .in('slug', ['ngwesaung', 'chaung-thar'])
      .then(({ data }) => {
        const sorted = (data ?? []).sort((a, b) =>
          a.slug === 'ngwesaung' ? -1 : b.slug === 'ngwesaung' ? 1 : 0
        );
        setDestinations(sorted);
        if (sorted.length > 0) setSelectedDestId(sorted[0].id);
      });
  }, []);

  async function handlePlan() {
    if (!selectedDestId) return;
    setLoading(true);
    setHasResult(false);

    // Fetch hotels for selected destination only
    const { data: hotelData } = await supabase
      .from('hotels')
      .select('id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)')
      .eq('destination_id', selectedDestId)
      .order('price_per_night_mmk', { ascending: true, nullsFirst: false });

    // Fetch transport for selected destination
    const { data: transportData } = await supabase
      .from('transport')
      .select('route, vehicle_type, price_regular, price_weekend, note')
      .eq('destination_id', selectedDestId)
      .limit(1)
      .single();

    setHotels(filterHotelsByBudget((hotelData ?? []) as Hotel[], budget));
    setTransport(transportData as Transport | null);
    setLoading(false);
    setHasResult(true);
  }

  const selectedDest = destinations.find((d) => d.id === selectedDestId);
  const budgetLabel = getBudgetLabel(budget);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">

      {/* ── Header banner ── */}
      <div className="bg-red-700 dark:bg-red-800 px-4 pt-6 pb-6">
        <p className="text-xs font-bold text-red-200 uppercase tracking-widest mb-1">Trip Planner</p>
        <h1 className="text-2xl font-bold text-white">Plan Your Myanmar Trip</h1>
        <p className="text-sm text-red-100 mt-1">
          Tell us your preferences and we&apos;ll show matched hotels and bus ticket prices.
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── Destination ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Destination
          </p>
          <div className="space-y-2">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => { setSelectedDestId(dest.id); setHasResult(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  selectedDestId === dest.id
                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedDestId === dest.id ? 'border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedDestId === dest.id && (
                      <span className="w-2 h-2 rounded-full bg-red-600 block" />
                    )}
                  </span>
                  <span className={`font-semibold text-sm ${
                    selectedDestId === dest.id ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {dest.name}
                  </span>
                </div>
                {selectedDestId === dest.id && (
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Available Now
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Number of Days ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Number of Days
          </p>
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  days === d
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{days} days selected</p>
        </div>

        {/* ── Budget ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Daily Budget Per Person (MMK)
            </p>
            <span className="text-[11px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
              {budgetLabel}
            </span>
          </div>
          {/* Preset buttons */}
          <div className="flex gap-1.5 mb-4">
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setBudget(p.value)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  budgetLabel === p.label
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {/* Amount display */}
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {budget.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 ml-1">MMK / day</span>
          </div>
          {/* Slider */}
          <input
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={10000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>30K MMK</span>
            <span>1000K MMK</span>
          </div>
        </div>

        {/* ── Traveling As ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Traveling As
          </p>
          <div className="flex gap-2">
            {(['solo', 'couple', 'family'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTravelAs(t)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm capitalize transition-all ${
                  travelAs === t
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t === 'solo' ? '🧍 Solo' : t === 'couple' ? '👫 Couple' : '👨‍👩‍👧 Family'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Plan Button ── */}
        <button
          onClick={handlePlan}
          disabled={loading || !selectedDestId}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-sm"
        >
          {loading ? 'Finding your trip…' : 'Plan Trip →'}
        </button>

        {/* ── Results ── */}
        {hasResult && selectedDest && (
          <div className="space-y-4 mt-2">

            {/* Transport */}
            {transport && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  🚌 Bus Ticket — {transport.route}
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Weekday</p>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {transport.price_regular.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">MMK</span>
                    </p>
                  </div>
                  {transport.price_weekend && (
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Weekend</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {transport.price_weekend.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">MMK</span>
                      </p>
                    </div>
                  )}
                </div>
                {transport.note && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{transport.note}</p>
                )}
              </div>
            )}

            {/* Hotels */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                🏨 Matched Hotels in {selectedDest.name}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                {hotels.length > 0
                  ? `${hotels.length} hotels within your ${budget.toLocaleString()} MMK/day budget`
                  : 'No hotels matched your budget — try increasing your daily budget.'}
              </p>

              {hotels.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-2">😔</p>
                  <p className="text-sm text-gray-500">Try a higher budget to see more options.</p>
                  <button
                    onClick={() => setBudget(Math.min(budget + 100000, BUDGET_MAX))}
                    className="mt-3 text-sm text-red-600 font-semibold"
                  >
                    Increase budget +100K
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {hotels.map((hotel) => {
                    const rooms = hotel.hotel_rooms ?? [];
                    const minPrice = rooms.length > 0
                      ? Math.min(...rooms.map((r) => r.price_per_night))
                      : hotel.price_per_night_mmk;
                    const totalMin = minPrice != null ? minPrice * days : null;

                    return (
                      <div key={hotel.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{hotel.name}</h4>
                            <span className="text-[10px] capitalize text-gray-400">{hotel.price_category}</span>
                          </div>
                          <div className="text-right shrink-0">
                            {minPrice != null && (
                              <p className="text-[11px] text-gray-400">
                                From <span className="font-bold text-red-600 dark:text-red-400">{minPrice.toLocaleString()}</span> MMK/night
                              </p>
                            )}
                            {totalMin != null && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                ~{totalMin.toLocaleString()} MMK for {days}d
                              </p>
                            )}
                          </div>
                        </div>
                        {rooms.length > 0 && (
                          <div className="space-y-1">
                            {rooms.map((room) => (
                              <div key={room.room_type} className="flex items-center justify-between text-xs py-0.5 border-t border-gray-50 dark:border-gray-800/60">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0" />
                                  {room.room_type}
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200 ml-2 shrink-0">
                                  {room.price_per_night.toLocaleString()} MMK
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trip summary */}
            <div className="bg-red-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold text-base mb-3">Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-100">Destination</span>
                  <span className="font-semibold">{selectedDest.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Duration</span>
                  <span className="font-semibold">{days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Daily Budget</span>
                  <span className="font-semibold">{budget.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Traveling As</span>
                  <span className="font-semibold capitalize">{travelAs}</span>
                </div>
                {transport && (
                  <div className="flex justify-between border-t border-red-500 pt-2 mt-2">
                    <span className="text-red-100">Bus Ticket (one way)</span>
                    <span className="font-semibold">{transport.price_regular.toLocaleString()} MMK</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-red-500 pt-2 mt-1">
                  <span className="text-red-100">Hotels matched</span>
                  <span className="font-semibold">{hotels.length} options</span>
                </div>
              </div>
            </div>

            {/* View full details link */}
            <Link
              href={`/destinations/${selectedDest.slug}`}
              className="block w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-center font-semibold py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              View Full {selectedDest.name} Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
