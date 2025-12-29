import { useEffect, useMemo, useState } from 'react';
import supabase from '../lib/supabaseClient';

function StatusBadge({ status }) {
  const cls = status === 'confirmed'
    ? 'bg-green-100 text-green-700 border-green-200'
    : status === 'cancelled'
      ? 'bg-red-100 text-red-700 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>
  );
}

function SectionHeader({ title, count, right }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}{typeof count === 'number' ? ` (${count})` : ''}</h2>
      {right}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [authMode] = useState('signin');
  const [signupInfo] = useState('');
  const [tab, setTab] = useState('bookings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setSession(session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => { mounted = false; sub.subscription?.unsubscribe?.(); };
  }, []);

  async function handleSignIn(e) {
    e?.preventDefault();
    setAuthError('');
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message || 'Failed to sign in');
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  // Admin sign-up disabled intentionally: only one admin managed via VITE_ADMIN_EMAIL

  async function loadBookings() {
    setLoading(true);
    setError('');
    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      const { data, error: e } = await query;
      if (e) throw e;
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) loadBookings();
  }, [session]);

  async function updateStatus(id, next) {
    setLoading(true);
    setError('');
    try {
      const { error: e } = await supabase.from('bookings').update({ status: next }).eq('id', id);
      if (e) throw e;
      await loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  }

  async function deleteBooking(id) {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    setLoading(true);
    setError('');
    try {
      const { error: e } = await supabase.from('bookings').delete().eq('id', id);
      if (e) throw e;
      await loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to delete booking');
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(b =>
        String(b.full_name || '').toLowerCase().includes(qq) ||
        String(b.phone || '').toLowerCase().includes(qq) ||
        String(b.email || '').toLowerCase().includes(qq) ||
        String(b.place_id || '').toLowerCase().includes(qq)
      );
    }
    return list;
  }, [bookings, q, statusFilter]);

  const users = useMemo(() => {
    // Derive users from bookings until an auth user list exists
    const map = new Map();
    for (const b of bookings) {
      const key = (b.email && b.email.trim()) || (b.phone && `phone:${b.phone.trim()}`) || `name:${b.full_name}`;
      if (!map.has(key)) map.set(key, { key, name: b.full_name || 'Unknown', email: b.email || '', phone: b.phone || '', bookings: 0, seats: 0 });
      const u = map.get(key);
      u.bookings += 1;
      u.seats += (b.seats || 0);
    }
    return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings);
  }, [bookings]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 pt-24 sm:pt-28">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Admin Panel</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
      )}

      {!session && (
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 text-center">
          <h2 className="mb-1 text-center text-xl font-semibold">Admin Access</h2>
          <p className="mb-4 text-center text-sm text-gray-600">Only the designated admin can access this panel.</p>
          <a href="/admin-login" className="inline-block rounded-md px-4 py-2 text-sm font-semibold shadow bg-[var(--brand)] text-white border border-transparent">Go to Admin Login</a>
        </div>
      )}

      {/* If signed in but not admin */}
      {session && session.user?.email?.toLowerCase() !== ADMIN_EMAIL && (
        <div className="mb-4 rounded-md border bg-white p-4 text-sm">
          <div className="mb-2 text-red-700">Access denied: This account is not authorized to view the Admin Panel.</div>
          <div className="flex items-center justify-between">
            <div className="text-gray-700">Signed in as <span className="font-medium">{session.user?.email}</span></div>
            <button onClick={handleSignOut} className="rounded-md border px-3 py-1 font-medium bg-white hover:bg-gray-50 text-white">Sign out</button>
          </div>
        </div>
      )}

      {/* If signed in and is admin */}
      {session && session.user?.email?.toLowerCase() === ADMIN_EMAIL && (
        <div className="mb-4 flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm">
          <div className="text-gray-700">Signed in as <span className="font-medium">{session.user?.email}</span></div>
          <button onClick={handleSignOut} className="rounded-md border px-3 py-1 font-medium bg-white hover:bg-gray-50 text-white">Sign out</button>
        </div>
      )}

      {session && session.user?.email?.toLowerCase() === ADMIN_EMAIL && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <button onClick={() => setTab('bookings')} className={`rounded-md px-3 py-1.5 text-sm font-medium border ${tab === 'bookings' ? 'bg-[var(--brand)] text-white border-transparent' : 'bg-white hover:bg-gray-50 text-white'}`}>Bookings</button>
            <button onClick={() => setTab('users')} className={`rounded-md px-3 py-1.5 text-sm font-medium border ${tab === 'users' ? 'bg-[var(--brand)] text-white border-transparent' : 'bg-white hover:bg-gray-50 text-white'}`}>Users</button>
          </div>
          <div className="flex flex-col sm:flex-row sm:ml-auto items-stretch sm:items-center gap-2 mt-2 sm:mt-0">
            {tab === 'bookings' && (
              <>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="rounded-md border px-3 py-1.5 text-sm w-full sm:w-auto" />
                <div className="flex gap-2">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm flex-1 sm:flex-none">
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={loadBookings} className="rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 flex-1 sm:flex-none text-white">Refresh</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {session && session.user?.email?.toLowerCase() === ADMIN_EMAIL && tab === 'bookings' && (
        <div className="space-y-3">
          <SectionHeader title="All Bookings" count={filteredBookings.length} />
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Created</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Customer</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Contact</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Trip</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Seats</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-700">{new Date(b.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 text-sm text-gray-900 font-medium">{b.full_name}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">
                      <div>{b.phone}</div>
                      {b.email && <div className="text-gray-500 text-xs">{b.email}</div>}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">
                      <div className="font-medium">{b.place_id}</div>
                      <div className="text-xs text-gray-500">{b.start_date}</div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">{b.seats}</td>
                    <td className="px-3 py-2 text-sm"><StatusBadge status={b.status} /></td>
                    <td className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <button disabled={loading || b.status === 'confirmed'} onClick={() => updateStatus(b.id, 'confirmed')} className="rounded-md px-3 py-1 text-xs font-semibold text-white disabled:opacity-60 bg-green-600 hover:bg-green-700">Accept</button>
                        <button disabled={loading || b.status === 'cancelled'} onClick={() => updateStatus(b.id, 'cancelled')} className="rounded-md px-3 py-1 text-xs font-semibold text-white disabled:opacity-60 bg-amber-600 hover:bg-amber-700">Cancel</button>
                        <button disabled={loading} onClick={() => deleteBooking(b.id)} className="rounded-md px-3 py-1 text-xs font-semibold text-white disabled:opacity-60 bg-red-600 hover:bg-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-500">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {session && session.user?.email?.toLowerCase() === ADMIN_EMAIL && tab === 'users' && (
        <div className="space-y-3">
          <SectionHeader title="Users (derived from bookings)" count={users.length} right={<button onClick={loadBookings} className="rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 text-white">Refresh</button>} />
          <div className="grid gap-3 md:grid-cols-2">
            {users.map(u => (
              <div key={u.key} className="rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    {u.email && <div className="text-sm text-gray-600">{u.email}</div>}
                    {u.phone && <div className="text-sm text-gray-600">{u.phone}</div>}
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <div><span className="font-medium">Bookings:</span> {u.bookings}</div>
                    <div><span className="font-medium">Seats:</span> {u.seats}</div>
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center text-sm text-gray-500 p-8 border rounded-lg bg-white">No users yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
