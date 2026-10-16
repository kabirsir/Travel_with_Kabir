import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { places as PLACES } from '../data/places';

const CABIN_CAPACITY = 14; 

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function CabinBooking() {
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
        for (const b of data || []) {
          let j = {};
          try { j = typeof b.notes === 'object' ? (b.notes || {}) : JSON.parse(b.notes || '{}'); } catch (_) {}
          if (!j.is_cabin_booking) continue; // Only process cabin seats

          let numbers = j.seat_numbers;
          if (Array.isArray(numbers) && numbers.length) {
            for (const n of numbers) occupied.add(Number(n));
          }
        }
        setTakenSeats(occupied);
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

  const remaining = CABIN_CAPACITY - takenSeats.size;
  const availableSeats = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= CABIN_CAPACITY; i++) {
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
      const { data: latest, error: e1 } = await supabase
        .from('bookings')
        .select('id, seats, notes')
        .eq('place_id', placeId)
        .eq('start_date', startDate);
      if (e1) throw e1;
      
      const stillTaken = new Set();
      for (const b of latest || []) {
        let j = {};
        try { j = typeof b.notes === 'object' ? (b.notes || {}) : JSON.parse(b.notes || '{}'); } catch (_) {}
        if (!j.is_cabin_booking) continue;

        let numbers = j.seat_numbers;
        if (Array.isArray(numbers) && numbers.length) {
          for (const n of numbers) stillTaken.add(Number(n));
        }
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
        notes: JSON.stringify({ seat_numbers: selectedSeats, is_cabin_booking: true })
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

  function SeatBox({ seat }) {
    const taken = takenSeats.has(seat);
    const selected = selectedSeats.includes(seat);
    const style = taken
        ? { backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#ffffff' }
        : selected
        ? { backgroundColor: 'var(--brand)', borderColor: 'transparent', color: 'var(--brand-contrast)' }
        : { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', color: '#1f2937' };
        
    return (
        <button
            type="button"
            onClick={() => toggleSeat(seat)}
            className={`rounded-md px-2 py-2 text-xs font-medium border text-center transition-colors w-10 sm:w-12 h-10 flex items-center justify-center ${taken ? 'cursor-not-allowed' : ''}`}
            style={style}
            disabled={taken}
            aria-pressed={selected}
        >
            {seat}
        </button>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 pt-24 sm:pt-28">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Grand Cabin Booking</h1>
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 h-fit">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Destination</label>
            <select value={placeId} onChange={e => setPlaceId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm bg-white">
              {PLACES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" min={new Date().toISOString().split("T")[0]} value={startDate} onChange={e => { setStartDate(e.target.value); setError(''); }} className="w-full rounded-md border px-3 py-2 text-sm" />
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
            className="mt-2 w-full rounded-md px-4 py-2 text-sm font-bold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-gradient hover:-translate-y-0.5 hover:shadow-[var(--brand)]/40 text-gray-900 border border-gray-200">
            {submitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Seat Selection <span className="text-sm font-normal text-gray-500">(Cabin Setup)</span></h2>
            <div className="text-sm text-gray-500">Remaining: {Math.max(0, remaining - selectedSeats.length)} / {CABIN_CAPACITY}</div>
          </div>
          <div className="text-xs text-gray-500 mb-6">
            Available: {availableSeats.join(', ') || 'None'}
          </div>
          <div className="space-y-4 bg-gray-50 border rounded-xl p-4 sm:p-6 w-full max-w-[320px] mx-auto shadow-inner relative">
            <div className="absolute top-2 w-full text-center left-0 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Front of Vehicle</div>
            
            {/* Row 1 (Front) */}
            <div className="flex justify-start gap-4 mt-4 w-full">
                <div className="px-2 py-2 text-xs border rounded-md text-gray-500 w-10 sm:w-12 h-10 flex items-center justify-center bg-gray-200" aria-label="Driver">DRV</div>
                <SeatBox seat={1} />
            </div>
            {/* Row 2 */}
            <div className="flex justify-between gap-2 w-full">
                <SeatBox seat={2} /> <SeatBox seat={3} /> <SeatBox seat={4} />
            </div>
            {/* Row 3 */}
            <div className="flex justify-between gap-2 w-full">
                <SeatBox seat={5} /> <SeatBox seat={6} /> <SeatBox seat={7} />
            </div>
            {/* Row 4 */}
            <div className="flex justify-between gap-2 w-full">
                <SeatBox seat={8} /> <SeatBox seat={9} /> <SeatBox seat={10} />
            </div>
            {/* Row 5 (Back Row) */}
            <div className="flex justify-between gap-1 sm:gap-2 w-full">
                <SeatBox seat={11} /> <SeatBox seat={12} /> <SeatBox seat={13} /> <SeatBox seat={14} />
            </div>

            <div className="absolute bottom-2 w-full text-center left-0 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Back</div>
          </div>
          <div className="mt-5 text-sm text-gray-700">Selected: <span className="font-semibold">{selectedSeats.sort((a, b) => a - b).join(', ') || 'None'}</span></div>
        </div>
      </div>
    </div>
  );
}
