'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HotelRoom { room_type: string; price_per_night: number; capacity: number | null; }
interface Hotel { id: string; name: string; price_category: string; price_per_night_mmk: number | null; hotel_rooms: HotelRoom[]; }
interface Transport { route: string; vehicle_type: string; price_regular: number; price_weekend: number | null; note: string | null; }
interface Destination { id: string; name: string; slug: string; }

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

function filterHotelsByBudget(hotels: Hotel[], budgetPerDay: number) {
  return hotels.filter((h) => {
    const rooms = h.hotel_rooms ?? [];
    if (rooms.length === 0) return (h.price_per_night_mmk ?? 0) <= budgetPerDay * 1.5;
    const minPrice = Math.min(...rooms.map((r) => r.price_per_night));
    return minPrice <= budgetPerDay * 1.5;
  });
}

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
  const sliderRef = useRef<HTMLInputElement>(null);

  // Live green fill on slider
  function updateSliderFill(value: number) {
    const el = sliderRef.current;
    if (!el) return;
    const pct = ((value - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
    el.style.background = `linear-gradient(to right, #16a34a ${pct}%, #e5e7eb ${pct}%)`;
  }

  useEffect(() => {
    updateSliderFill(budget);
  }, [budget]);

  // Load only ngwesaung and chaung-thar
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

    // Fetch hotels for THIS destination only
    const { data: hotelData } = await supabase
      .from('hotels')
      .select('id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)')
      .eq('destination_id', selectedDestId)
      .order('price_per_night_mmk', { ascending: true, nullsFirst: false });

    // Fetch transport for THIS destination only
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
    <div className="min-h-screen bg-rose-50 dark:bg-gray-950 pb-28">

      {/* ── Header — dark green like screenshot ── */}
      <div className="bg-[#1a2e1a] dark:bg-gray-900 px-4 pt-5 pb-7">
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Trip Planner</p>
        <h1 className="text-2xl font-bold text-white leading-tight">Plan Your Myanmar Trip</h1>
        <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
          Tell us your preferences and we&apos;ll show matched hotels and bus ticket prices.
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── Destination ── */}
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Destination
          </p>
          <div className="space-y-2">
            {destinations.map((dest) => {
              const active = selectedDestId === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => { setSelectedDestId(dest.id); setHasResult(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                    active
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-red-600 block" />}
                    </span>
                    <span className={`font-semibold text-sm ${
                      active ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {dest.name}
                    </span>
                  </div>
                  {active && (
                    <span className="text-[10px] bg-red-600 text-white px-2.5 py-1 rounded-full font-bold">
                      Available Now
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Number of Days ── */}
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Number of Days
          </p>
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border ${
                  days === d
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{days} days selected</p>
        </div>

        {/* ── Daily Budget ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Daily Budget Per Person (MMK)
            </p>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">{budgetLabel}</span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            {/* Preset buttons */}
            <div className="flex gap-1.5 mb-4">
              {BUDGET_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setBudget(p.value)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all border ${
                    budgetLabel === p.label
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Amount display */}
            <div className="text-center mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {budget.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 ml-1.5">MMK / day</span>
            </div>

            {/* Slider — green fill tracks thumb */}
            <style>{`
              .raizen-slider {
                -webkit-appearance: none;
                appearance: none;
                height: 6px;
                border-radius: 9999px;
                outline: none;
                cursor: pointer;
                width: 100%;
              }
              .raizen-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 3px solid #16a34a;
                cursor: pointer;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
              }
              .raizen-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 3px solid #16a34a;
                cursor: pointer;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
              }
            `}</style>
            <input
              ref={sliderRef}
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={10000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="raizen-slider"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>30K MMK</span>
              <span>1000K MMK</span>
            </div>
          </div>
        </div>

        {/* ── Traveling As ── */}
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Traveling As
          </p>
          <div className="flex gap-2">
            {(['solo', 'couple', 'family'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTravelAs(t)}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all border ${
                  travelAs === t
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
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
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-sm"
        >
          {loading ? 'Finding your trip…' : 'Plan Trip →'}
        </button>

        {/* ── Results ── */}
        {hasResult && selectedDest && (
          <div className="space-y-4 pt-1">

            {/* Transport card */}
            {transport && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">
                  🚌 Bus Ticket — {transport.route}
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1 bg-rose-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Weekday</p>
                    <p className="font-bold text-gray-900 dark:text-white text-base">
                      {transport.price_regular.toLocaleString()}
                      <span className="text-[10px] font-normal text-gray-400 ml-0.5">MMK</span>
                    </p>
                  </div>
                  {transport.price_weekend && (
                    <div className="flex-1 bg-rose-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wide">Weekend</p>
                      <p className="font-bold text-gray-900 dark:text-white text-base">
                        {transport.price_weekend.toLocaleString()}
                        <span className="text-[10px] font-normal text-gray-400 ml-0.5">MMK</span>
                      </p>
                    </div>
                  )}
                </div>
                {transport.note && (
                  <p className="text-xs text-gray-400 mt-2">{transport.note}</p>
                )}
              </div>
            )}

            {/* Hotels card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                🏨 Hotels in {selectedDest.name}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {hotels.length > 0
                  ? `${hotels.length} hotels within your ${budget.toLocaleString()} MMK/day budget`
                  : 'No hotels matched — try increasing your budget.'}
              </p>

              {hotels.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-2">😔</p>
                  <p className="text-sm text-gray-500">Try a higher budget to see more options.</p>
                  <button
                    onClick={() => setBudget(Math.min(budget + 100000, BUDGET_MAX))}
                    className="mt-3 text-sm text-red-600 font-semibold underline"
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
                              <p className="text-[11px] text-gray-500">
                                From <span className="font-bold text-red-600">{minPrice.toLocaleString()}</span> MMK
                              </p>
                            )}
                            {totalMin != null && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                ~{totalMin.toLocaleString()} MMK / {days}d
                              </p>
                            )}
                          </div>
                        </div>
                        {rooms.length > 0 && (
                          <div className="space-y-1 mt-1">
                            {rooms.map((room) => (
                              <div key={room.room_type} className="flex items-center justify-between text-xs py-0.5 border-t border-gray-50 dark:border-gray-800">
                                <span className="text-gray-500 flex items-center gap-1.5">
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

            {/* Trip Summary */}
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
                  <div className="flex justify-between border-t border-red-500 pt-2 mt-1">
                    <span className="text-red-100">Bus (one way)</span>
                    <span className="font-semibold">{transport.price_regular.toLocaleString()} MMK</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-red-500 pt-2 mt-1">
                  <span className="text-red-100">Hotels matched</span>
                  <span className="font-semibold">{hotels.length} options</span>
                </div>
              </div>
            </div>

            {/* View full details */}
            <Link
              href={`/destinations/${selectedDest.slug}`}
              className="block w-full text-center text-sm font-semibold text-red-600 py-3 border border-red-200 dark:border-red-900 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              View Full {selectedDest.name} Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
