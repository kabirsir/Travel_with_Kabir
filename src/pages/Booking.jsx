import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { places as PLACES } from '../data/places';

const BUS_CAPACITY = 24; // 8 rows x (1 seat + aisle + 2 seats)
const ROWS = 8;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Booking() {
  const query = useQuery();
  const navigate = useNavigate();

  const [placeId, setPlaceId] = useState(query.get('place') || PLACES?.[0]?.id || '');
  const [startDate, setStartDate] = useState(query.get('date') || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [takenSeats, setTakenSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const place = PLACES.find(p => p.id === placeId);

  // Ensure page starts at top when visiting Booking
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (!placeId || !startDate) return;
      setLoading(true);
      setError('');
      try {
        const { data, error: e } = await supabase
          .from('bookings')
          .select('id, seats, notes')
          .eq('place_id', placeId)
          .eq('start_date', startDate)
          .order('created_at');
        if (e) throw e;

        const occupied = new Set();
        let total = 0;
        for (const b of data || []) {
          let numbers = undefined;
          if (b?.notes) {
            try { 
              const j = typeof b.notes === 'object' ? b.notes : JSON.parse(b.notes); 
              if (j.is_car_booking || j.is_cabin_booking) continue;
              numbers = j?.seat_numbers; 
            } catch (_) { }
          }
          if (Array.isArray(numbers) && numbers.length) {
            for (const n of numbers) occupied.add(Number(n));
          } else {
            // fallback: allocate first-N for this booking
            const start = total + 1;
            for (let s = start; s < start + (b.seats || 0); s++) occupied.add(s);
          }
          total += (b.seats || 0);
        }
        setTakenSeats(occupied);
        // remove any newly taken from current selections
        setSelectedSeats((prev) => prev.filter(s => !occupied.has(s)));
      } catch (err) {
        setError(err.message || 'Failed to load availability');
      } finally {
        setLoading(false);
      }
    }
    setTakenSeats(new Set());
    setSelectedSeats([]);
    if (placeId && startDate) loadAvailability();
  }, [placeId, startDate]);

  const remaining = BUS_CAPACITY - takenSeats.size;
  const availableSeats = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= BUS_CAPACITY; i++) {
      if (!takenSeats.has(i)) arr.push(i);
    }
    return arr;
  }, [takenSeats]);

  function toggleSeat(seat) {
    if (takenSeats.has(seat)) return;
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  }

  async function submitBooking(e) {
    e?.preventDefault();
    if (!placeId || !startDate || !fullName || !phone || !email || selectedSeats.length === 0) {
      setError('Please fill in all details and select at least one seat before confirming.');
      return;
    }
    
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Cannot book for past dates. Please select a future date.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // ensure seats still available
      const { data: latest, error: e1 } = await supabase
        .from('bookings')
        .select('id, seats, notes')
        .eq('place_id', placeId)
        .eq('start_date', startDate);
      if (e1) throw e1;
      const stillTaken = new Set();
      let total = 0;
      for (const b of latest || []) {
        let numbers = undefined;
        if (b?.notes) {
          try { 
            const j = typeof b.notes === 'object' ? b.notes : JSON.parse(b.notes); 
            if (j.is_car_booking || j.is_cabin_booking) continue;
            numbers = j?.seat_numbers; 
          } catch (_) { }
        }
        if (Array.isArray(numbers) && numbers.length) {
          for (const n of numbers) stillTaken.add(Number(n));
        } else {
          const start = total + 1;
          for (let s = start; s < start + (b.seats || 0); s++) stillTaken.add(s);
        }
        total += (b.seats || 0);
      }
      const conflict = selectedSeats.some(s => stillTaken.has(s));
      if (conflict) throw new Error('Some selected seats were just taken. Please reselect.');

      const payload = {
        full_name: fullName,
        phone,
        email: email || null,
        seats: selectedSeats.length,
        start_date: startDate,
        place_id: placeId,
        notes: JSON.stringify({ seat_numbers: selectedSeats })
      };

      const { data, error: e2 } = await supabase
        .from('bookings')
        .insert([payload])
        .select('id')
        .single();
      if (e2) throw e2;

      navigate(`/booking/${data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 pt-24 sm:pt-28">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Book Your Seats</h1>
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Destination</label>
            <select value={placeId} onChange={e => setPlaceId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {PLACES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={startDate} min={new Date().toISOString().split("T")[0]} onChange={e => { setStartDate(e.target.value); setError(''); }} className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>

          <button disabled={submitting}
            onClick={submitBooking}
            className="w-full rounded-md px-4 py-2 text-sm font-bold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-gradient hover:-translate-y-0.5 hover:shadow-[var(--brand)]/40 text-gray-900 border border-gray-200">
            {submitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Seat Selection</h2>
            <div className="text-sm" style={{ color: '#6b7280' }}>Remaining: {Math.max(0, remaining - selectedSeats.length)} / {BUS_CAPACITY}</div>
          </div>
          <div className="text-xs" style={{ color: '#6b7280' }}>
            Available: {availableSeats.join(', ') || 'None'}
          </div>
          <div className="space-y-2">
            {Array.from({ length: ROWS }, (_, r) => {
              const s1 = r * 3 + 1;
              const rowSeats = [s1, s1 + 1, s1 + 2];
              return (
                <div key={r} className="grid grid-cols-4 gap-2 items-center w-full max-w-[240px] mx-auto">
                  {rowSeats.slice(0, 1).map(seat => {
                    const taken = takenSeats.has(seat);
                    const selected = selectedSeats.includes(seat);
                    const style = taken
                      ? { backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#ffffff' }
                      : selected
                        ? { backgroundColor: 'var(--brand)', borderColor: 'transparent', color: 'var(--brand-contrast)' }
                        : { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', color: '#1f2937' };
                    return (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => toggleSeat(seat)}
                        className={`rounded-md px-2 py-2 text-xs font-medium border text-center transition-colors ${taken ? 'cursor-not-allowed' : ''}`}
                        style={style}
                        disabled={taken}
                        aria-pressed={selected}
                      >
                        {seat}
                      </button>
                    )
                  })}
                  <div aria-hidden className="" />
                  {rowSeats.slice(1, 3).map(seat => {
                    const taken = takenSeats.has(seat);
                    const selected = selectedSeats.includes(seat);
                    const style = taken
                      ? { backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#ffffff' }
                      : selected
                        ? { backgroundColor: 'var(--color-brand-600)', borderColor: 'transparent', color: 'var(--brand-contrast)' }
                        : { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', color: '#1f2937' };
                    return (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => toggleSeat(seat)}
                        className={`rounded-md px-2 py-2 text-xs font-medium border text-center transition-colors ${taken ? 'cursor-not-allowed' : ''}`}
                        style={style}
                        disabled={taken}
                        aria-pressed={selected}
                      >
                        {seat}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-sm text-gray-700">Selected: {selectedSeats.sort((a, b) => a - b).join(', ') || 'None'}</div>
        </div>
      </div>

      {place && (
        <div className="mt-6 rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Trip Overview</h3>
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Place:</span> {place.name}</div>
            <div><span className="font-medium">Duration:</span> {place.duration}</div>
            <div><span className="font-medium">Charges:</span> {place.charges}</div>
          </div>
        </div>
      )}
    </div>
  );
}
