import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { places as PLACES } from '../data/places';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const CAR_OPTIONS = [
  { id: 'sedan', name: 'Sedan (e.g. Corolla/Civic)', maxSeats: 4 },
  { id: 'suv', name: 'SUV/Prado', maxSeats: 7 },
  { id: 'apv', name: 'Suzuki APV', maxSeats: 7 },
];

export default function CarBooking() {
  const query = useQuery();
  const navigate = useNavigate();

  const [placeId, setPlaceId] = useState(query.get('place') || PLACES?.[0]?.id || '');
  const [startDate, setStartDate] = useState(query.get('date') || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [carType, setCarType] = useState(CAR_OPTIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const place = PLACES.find(p => p.id === placeId);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  async function submitBooking(e) {
    e?.preventDefault();
    if (!placeId || !startDate || !fullName || !phone || !email || !carType) {
      setError('Please fill in all details before confirming the car booking.');
      return;
    }
    
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Cannot book for past dates. Please select a future date.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const selectedCar = CAR_OPTIONS.find(c => c.id === carType);
      const payload = {
        full_name: fullName,
        phone,
        email: email || null,
        seats: selectedCar.maxSeats,
        start_date: startDate,
        place_id: placeId,
        notes: JSON.stringify({ is_car_booking: true, car_type: selectedCar.name })
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
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 pt-24 sm:pt-28">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Book a Car</h1>
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
            <label className="block text-sm font-medium mb-1">Select Car Type</label>
            <select value={carType} onChange={e => setCarType(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {CAR_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Max {c.maxSeats} persons)</option>
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

          <button disabled={loading}
            onClick={submitBooking}
            className="mt-3 w-full rounded-md px-4 py-2 text-sm font-bold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-gradient hover:-translate-y-0.5 hover:shadow-[var(--brand)]/40 text-gray-900 border border-gray-200">
            {loading ? 'Submitting...' : 'Confirm Car Booking'}
          </button>
        </div>

        {place && (
          <div className="rounded-lg border bg-white p-4 h-fit">
            <div className="relative h-48 w-full overflow-hidden rounded-md mb-4 bg-gray-100">
              <img src={place.thumbnailUrl} alt={place.name} className="h-full w-full object-cover" />
            </div>
            <h3 className="font-semibold mb-2">Trip Overview</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="font-medium">Place:</span> {place.name}</div>
              <div><span className="font-medium">Duration:</span> {place.duration}</div>
              <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                Note: Car booking prices vary depending on the selected car type and current fuel rates. Our team will contact you on the provided phone number to confirm the final charges.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
