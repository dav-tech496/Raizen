'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Lock, LogOut, Hotel, Car, ChevronDown, ChevronUp, Save } from 'lucide-react'

const ADMIN_PASSWORD = 'raizen2026'

interface HotelRow {
  id: string
  name: string
  price_category: string | null
  address: string | null
  destination_id: string
}

interface RoomRow {
  id: string
  hotel_id: string
  room_type: string
  price_per_night: number
  capacity: number | null
}

interface TransportRow {
  id: string
  destination_id: string
  route: string
  vehicle_type: string
  price_regular: number
  price_weekend: number | null
  price_holiday: number | null
  note: string | null
}

interface Destination {
  id: string
  name: string
  slug: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [hotels, setHotels] = useState<HotelRow[]>([])
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [transport, setTransport] = useState<TransportRow[]>([])
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'hotels' | 'transport'>('hotels')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // New hotel form
  const [newHotel, setNewHotel] = useState({ name: '', price_category: 'mid-range', address: '', destination_id: '' })
  // New room form
  const [newRoom, setNewRoom] = useState<{ hotel_id: string; room_type: string; price_per_night: string; capacity: string }>({ hotel_id: '', room_type: '', price_per_night: '', capacity: '' })
  // New transport form
  const [newTransport, setNewTransport] = useState({ destination_id: '', route: '', vehicle_type: '', price_regular: '', price_weekend: '', price_holiday: '', note: '' })

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  async function loadData() {
    setLoading(true)
    const supabase = createClient()
    const [{ data: dests }, { data: hotelRows }, { data: roomRows }, { data: transportRows }] = await Promise.all([
      supabase.from('destinations').select('id, name, slug').order('name'),
      supabase.from('hotels').select('id, name, price_category, address, destination_id').order('name'),
      supabase.from('hotel_rooms').select('id, hotel_id, room_type, price_per_night, capacity').order('price_per_night'),
      supabase.from('transport').select('*').order('route'),
    ])
    setDestinations(dests ?? [])
    setHotels(hotelRows ?? [])
    setRooms(roomRows ?? [])
    setTransport(transportRows ?? [])
    if (dests && dests.length > 0) {
      setNewHotel(h => ({ ...h, destination_id: dests[0].id }))
      setNewTransport(t => ({ ...t, destination_id: dests[0].id }))
    }
    setLoading(false)
  }

  useEffect(() => { if (authed) loadData() }, [authed])

  // ── HOTEL ACTIONS ──
  async function addHotel() {
    if (!newHotel.name || !newHotel.destination_id) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('hotels').insert({
      name: newHotel.name,
      price_category: newHotel.price_category,
      address: newHotel.address || null,
      destination_id: newHotel.destination_id,
      verified: true,
    })
    if (!error) {
      setNewHotel(h => ({ ...h, name: '', address: '' }))
      await loadData()
    }
    setSaving(false)
  }

  async function deleteHotel(id: string) {
    if (!confirm('Delete this hotel and all its rooms?')) return
    const supabase = createClient()
    await supabase.from('hotels').delete().eq('id', id)
    await loadData()
  }

  // ── ROOM ACTIONS ──
  async function addRoom() {
    if (!newRoom.hotel_id || !newRoom.room_type || !newRoom.price_per_night) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('hotel_rooms').insert({
      hotel_id: newRoom.hotel_id,
      room_type: newRoom.room_type,
      price_per_night: parseInt(newRoom.price_per_night),
      capacity: newRoom.capacity ? parseInt(newRoom.capacity) : null,
    })
    if (!error) {
      setNewRoom(r => ({ ...r, room_type: '', price_per_night: '', capacity: '' }))
      await loadData()
    }
    setSaving(false)
  }

  async function deleteRoom(id: string) {
    const supabase = createClient()
    await supabase.from('hotel_rooms').delete().eq('id', id)
    await loadData()
  }

  // ── TRANSPORT ACTIONS ──
  async function addTransport() {
    if (!newTransport.route || !newTransport.vehicle_type || !newTransport.price_regular || !newTransport.destination_id) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('transport').insert({
      destination_id: newTransport.destination_id,
      route: newTransport.route,
      vehicle_type: newTransport.vehicle_type,
      price_regular: parseInt(newTransport.price_regular),
      price_weekend: newTransport.price_weekend ? parseInt(newTransport.price_weekend) : null,
      price_holiday: newTransport.price_holiday ? parseInt(newTransport.price_holiday) : null,
      note: newTransport.note || null,
    })
    if (!error) {
      setNewTransport(t => ({ ...t, route: '', vehicle_type: '', price_regular: '', price_weekend: '', price_holiday: '', note: '' }))
      await loadData()
    }
    setSaving(false)
  }

  async function deleteTransport(id: string) {
    if (!confirm('Delete this transport route?')) return
    const supabase = createClient()
    await supabase.from('transport').delete().eq('id', id)
    await loadData()
  }

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card border border-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Lock className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary">Admin Panel</h1>
              <p className="text-muted text-xs">Raizen — Hotels & Transport</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-primary text-sm outline-none focus:border-amber-400 transition-colors ${passwordError ? 'border-red-400' : 'border-theme'}`}
            />
            {passwordError && <p className="text-red-400 text-xs">Incorrect password</p>}
            <button onClick={handleLogin} className="w-full py-3 gradient-gold text-stone-900 font-bold rounded-xl text-sm">
              Enter Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen bg-surface text-primary pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-card px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">Raizen Admin</h1>
          <p className="text-muted text-xs">Manage hotels & transport</p>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'hotels' ? 'gradient-gold text-stone-900' : 'bg-surface-2 border border-theme text-secondary hover:text-primary'}`}
              >
                <Hotel className="w-4 h-4" /> Hotels
              </button>
              <button
                onClick={() => setActiveTab('transport')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'transport' ? 'gradient-gold text-stone-900' : 'bg-surface-2 border border-theme text-secondary hover:text-primary'}`}
              >
                <Car className="w-4 h-4" /> Transport
              </button>
            </div>

            {/* ── HOTELS TAB ── */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                {/* Add hotel form */}
                <div className="bg-card border border-card rounded-3xl p-6">
                  <h2 className="font-bold text-base mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400" /> Add New Hotel</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      value={newHotel.name}
                      onChange={e => setNewHotel(h => ({ ...h, name: e.target.value }))}
                      placeholder="Hotel name *"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <select
                      value={newHotel.destination_id}
                      onChange={e => setNewHotel(h => ({ ...h, destination_id: e.target.value }))}
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input
                      value={newHotel.address}
                      onChange={e => setNewHotel(h => ({ ...h, address: e.target.value }))}
                      placeholder="Address"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <select
                      value={newHotel.price_category}
                      onChange={e => setNewHotel(h => ({ ...h, price_category: e.target.value }))}
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      {['budget', 'mid-range', 'premium', 'luxury', 'boutique', 'villa'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={addHotel} disabled={saving} className="px-5 py-2.5 gradient-gold text-stone-900 font-semibold rounded-xl text-sm flex items-center gap-2 disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Add Hotel'}
                  </button>
                </div>

                {/* Hotel list */}
                <div className="space-y-4">
                  {hotels.map(hotel => {
                    const hotelRooms = rooms.filter(r => r.hotel_id === hotel.id)
                    const dest = destinations.find(d => d.id === hotel.destination_id)
                    const isExpanded = expandedHotel === hotel.id

                    return (
                      <div key={hotel.id} className="bg-card border border-card rounded-2xl overflow-hidden">
                        {/* Hotel header */}
                        <div className="flex items-center justify-between px-5 py-4">
                          <button onClick={() => setExpandedHotel(isExpanded ? null : hotel.id)} className="flex items-center gap-3 flex-1 text-left">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                            <div>
                              <div className="font-bold text-sm text-primary">{hotel.name}</div>
                              <div className="text-muted text-xs">{dest?.name} · {hotel.price_category} · {hotelRooms.length} rooms</div>
                            </div>
                          </button>
                          <button onClick={() => deleteHotel(hotel.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Rooms list + add room */}
                        {isExpanded && (
                          <div className="border-t border-theme px-5 pb-5 pt-4">
                            {hotelRooms.length > 0 && (
                              <div className="space-y-2 mb-4">
                                {hotelRooms.map(room => (
                                  <div key={room.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
                                    <div>
                                      <div className="text-sm font-medium text-primary">{room.room_type}</div>
                                      <div className="text-xs text-muted">{room.price_per_night.toLocaleString()} MMK/night{room.capacity ? ` · ${room.capacity} pax` : ''}</div>
                                    </div>
                                    <button onClick={() => deleteRoom(room.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Add room form */}
                            <div className="border border-dashed border-theme rounded-xl p-4">
                              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Add Room Type</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                                <input
                                  value={newRoom.hotel_id === hotel.id ? newRoom.room_type : ''}
                                  onChange={e => setNewRoom({ hotel_id: hotel.id, room_type: e.target.value, price_per_night: newRoom.hotel_id === hotel.id ? newRoom.price_per_night : '', capacity: newRoom.hotel_id === hotel.id ? newRoom.capacity : '' })}
                                  placeholder="Room type *"
                                  className="px-3 py-2 rounded-lg bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                                />
                                <input
                                  type="number"
                                  value={newRoom.hotel_id === hotel.id ? newRoom.price_per_night : ''}
                                  onChange={e => setNewRoom(r => ({ ...r, hotel_id: hotel.id, price_per_night: e.target.value }))}
                                  placeholder="Price / night (MMK) *"
                                  className="px-3 py-2 rounded-lg bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                                />
                                <input
                                  type="number"
                                  value={newRoom.hotel_id === hotel.id ? newRoom.capacity : ''}
                                  onChange={e => setNewRoom(r => ({ ...r, hotel_id: hotel.id, capacity: e.target.value }))}
                                  placeholder="Capacity (pax)"
                                  className="px-3 py-2 rounded-lg bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                                />
                              </div>
                              <button
                                onClick={() => { setNewRoom(r => ({ ...r, hotel_id: hotel.id })); addRoom() }}
                                disabled={saving || newRoom.hotel_id !== hotel.id || !newRoom.room_type || !newRoom.price_per_night}
                                className="px-4 py-2 gradient-gold text-stone-900 font-semibold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-40"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Room
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── TRANSPORT TAB ── */}
            {activeTab === 'transport' && (
              <div className="space-y-6">
                {/* Add transport form */}
                <div className="bg-card border border-card rounded-3xl p-6">
                  <h2 className="font-bold text-base mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-400" /> Add Transport Route</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <select
                      value={newTransport.destination_id}
                      onChange={e => setNewTransport(t => ({ ...t, destination_id: e.target.value }))}
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    >
                      {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input
                      value={newTransport.route}
                      onChange={e => setNewTransport(t => ({ ...t, route: e.target.value }))}
                      placeholder="Route (e.g. Yangon → Ngwe Saung) *"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      value={newTransport.vehicle_type}
                      onChange={e => setNewTransport(t => ({ ...t, vehicle_type: e.target.value }))}
                      placeholder="Vehicle type (e.g. Standard Car) *"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      type="number"
                      value={newTransport.price_regular}
                      onChange={e => setNewTransport(t => ({ ...t, price_regular: e.target.value }))}
                      placeholder="Regular price (MMK) *"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      type="number"
                      value={newTransport.price_weekend}
                      onChange={e => setNewTransport(t => ({ ...t, price_weekend: e.target.value }))}
                      placeholder="Fri–Sat price (MMK)"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      type="number"
                      value={newTransport.price_holiday}
                      onChange={e => setNewTransport(t => ({ ...t, price_holiday: e.target.value }))}
                      placeholder="Holiday price (MMK)"
                      className="px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      value={newTransport.note}
                      onChange={e => setNewTransport(t => ({ ...t, note: e.target.value }))}
                      placeholder="Note (optional)"
                      className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-theme text-primary text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <button onClick={addTransport} disabled={saving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Add Route'}
                  </button>
                </div>

                {/* Transport list */}
                <div className="space-y-3">
                  {transport.map(t => {
                    const dest = destinations.find(d => d.id === t.destination_id)
                    return (
                      <div key={t.id} className="bg-card border border-card rounded-2xl p-5 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-primary">{t.route}</div>
                          <div className="text-muted text-xs mt-0.5">{dest?.name} · {t.vehicle_type}</div>
                          <div className="flex gap-3 mt-3 flex-wrap">
                            <div className="bg-surface-2 rounded-lg px-3 py-1.5 text-center">
                              <div className="text-amber-400 font-bold text-sm">{t.price_regular.toLocaleString()}</div>
                              <div className="text-muted text-xs">Regular</div>
                            </div>
                            {t.price_weekend && (
                              <div className="bg-surface-2 rounded-lg px-3 py-1.5 text-center">
                                <div className="text-amber-400 font-bold text-sm">{t.price_weekend.toLocaleString()}</div>
                                <div className="text-muted text-xs">Fri–Sat</div>
                              </div>
                            )}
                            {t.price_holiday && (
                              <div className="bg-surface-2 rounded-lg px-3 py-1.5 text-center">
                                <div className="text-amber-400 font-bold text-sm">{t.price_holiday.toLocaleString()}</div>
                                <div className="text-muted text-xs">Holiday</div>
                              </div>
                            )}
                          </div>
                          {t.note && <p className="text-muted text-xs mt-2 italic">{t.note}</p>}
                        </div>
                        <button onClick={() => deleteTransport(t.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
