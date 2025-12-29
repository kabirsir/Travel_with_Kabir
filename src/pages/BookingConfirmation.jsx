import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

const BUS_CAPACITY = 32; // align with bus layout

export default function BookingConfirmation() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [assignedSeats, setAssignedSeats] = useState([]);
  const [availability, setAvailability] = useState({ taken: 0, remaining: BUS_CAPACITY });

  useEffect(() => {
    // Ensure page starts at the top when arriving here
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data: bk, error: e1 } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();
        if (e1) throw e1;
        setBooking(bk);

        const { data: all, error: e2 } = await supabase
          .from('bookings')
          .select('id, seats, created_at')
          .eq('place_id', bk.place_id)
          .eq('start_date', bk.start_date)
          .order('created_at', { ascending: true });
        if (e2) throw e2;

        let sumAll = 0;
        for (const b of all) {
          if (b.id !== bk.id) {
            sumAll += b.seats;
          }
        }
        const totalWithCurrent = sumAll + bk.seats;
        const remaining = Math.max(0, BUS_CAPACITY - totalWithCurrent);

        // Prefer explicit seat numbers saved in booking.notes
        let parsedNumbers = [];
        if (bk?.notes) {
          try {
            const j = JSON.parse(bk.notes);
            if (Array.isArray(j?.seat_numbers)) {
              parsedNumbers = j.seat_numbers.map(Number).filter(n => Number.isFinite(n));
            }
          } catch (_) {}
        }

        let seats;
        if (parsedNumbers.length > 0) {
          seats = [...new Set(parsedNumbers)].sort((a, b) => a - b);
        } else {
          // Fallback: contiguous allocation after existing seats
          const startSeat = sumAll + 1;
          seats = Array.from({ length: bk.seats }, (_, i) => startSeat + i);
        }

        setAssignedSeats(seats);
        setAvailability({ taken: totalWithCurrent, remaining });
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl p-6">Loading booking...</div>;
  if (error) return <div className="mx-auto max-w-3xl p-6 text-red-600">{error}</div>;
  if (!booking) return <div className="mx-auto max-w-3xl p-6">Booking not found.</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 pt-24 sm:pt-28">
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed</h1>
      <p className="text-gray-700 mb-6">Your booking ID is <span className="font-mono">{booking.id}</span></p>

      <div className="grid gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold mb-2">Trip Details</h2>
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Place:</span> {booking.place_id}</div>
            <div><span className="font-medium">Start Date:</span> {booking.start_date}</div>
            <div><span className="font-medium">Seats Booked:</span> {booking.seats}</div>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold mb-2">Assigned Seats</h2>
          <div className="text-sm text-gray-700">{assignedSeats.join(', ') || 'TBD'}</div>
        </div>

        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold mb-2">Availability</h2>
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Capacity:</span> {BUS_CAPACITY}</div>
            <div><span className="font-medium">Taken:</span> {availability.taken}</div>
            <div><span className="font-medium">Remaining:</span> {availability.remaining}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="btn-gradient rounded-md px-4 py-2 text-sm font-semibold shadow">Back to Home</Link>
          <Link to="/gallery" className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-gray-50">View Gallery</Link>
        </div>
      </div>
    </div>
  );
}
