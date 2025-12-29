import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function AdminLogin() {
  const navigate = useNavigate();
  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setSession(session);
      if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
        navigate('/admin', { replace: true });
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
        navigate('/admin', { replace: true });
      }
    });
    return () => { mounted = false; sub.subscription?.unsubscribe?.(); };
  }, [navigate, ADMIN_EMAIL]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!ADMIN_EMAIL) {
      setError('Admin email is not configured. Set VITE_ADMIN_EMAIL in your environment.');
      return;
    }
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('Only the designated admin email can sign in here.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const isAdminSignedIn = !!session && session.user?.email?.toLowerCase() === ADMIN_EMAIL;
  const isNonAdminSignedIn = !!session && session.user?.email?.toLowerCase() !== ADMIN_EMAIL;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="mb-4 text-center text-sm text-gray-600">Only the designated admin can sign in here</p>

          {error && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-red-700 text-sm">{error}</div>
          )}

          {isNonAdminSignedIn && (
            <div className="space-y-3">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800 text-sm">
                You are signed in as <b>{session?.user?.email}</b>, which is not the admin account.
              </div>
              <button onClick={signOut} className="w-full rounded-md border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 bg-white text-white">Sign out</button>
            </div>
          )}

          {!isAdminSignedIn && !isNonAdminSignedIn && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Admin Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" className="w-full rounded-md border px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-md border px-3 py-2 text-sm" required />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-md bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in as Admin'}</button>
            </form>
          )}

          {isAdminSignedIn && (
            <div className="space-y-3">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-emerald-800 text-sm">
                You are already signed in as admin.
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/admin')} className="flex-1 rounded-md bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">Go to Admin Panel</button>
                <button onClick={signOut} className="flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 bg-white text-white">Sign out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
