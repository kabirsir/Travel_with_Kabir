import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { sendBookingEmail } from "../lib/notifyEmail";

export default function BookingForm({ place, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    seats: 1,
    startDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function updateField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.seats || !form.startDate) return;
    
    const selectedDate = new Date(form.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Cannot book for past dates. Please select a future date.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: form.fullName,
        phone: form.phone,
        email: form.email || null,
        seats: Number(form.seats),
        start_date: form.startDate,
        place_id: place?.id || null,
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;

      if (form.email) {
        try { await sendBookingEmail({ id: data.id, ...payload }); } catch (_) {}
      }

      onSuccess?.({ ...form, placeId: place?.id, id: data.id });
      navigate(`/booking/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
        <input name="fullName" value={form.fullName} onChange={updateField} required className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
        <input name="phone" value={form.phone} onChange={updateField} required className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" value={form.email} onChange={updateField} required className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Number of Seats</label>
        <input type="number" min="1" max="50" name="seats" value={form.seats} onChange={updateField} required className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
        <input type="date" min={new Date().toISOString().split("T")[0]} name="startDate" value={form.startDate} onChange={updateField} required className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn-gradient w-full rounded-md px-4 py-2 text-sm font-semibold shadow disabled:opacity-60">
          {submitting ? "Submitting..." : `Book ${place?.name ? "for " + place.name : "now"}`}
        </button>
      </div>
    </form>
  );
}
