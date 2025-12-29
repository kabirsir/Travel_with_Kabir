import { Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [session, setSession] = useState(null);

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

  async function onSignIn(e) {
    e?.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally { setLoading(false); }
  }

  async function onSignUp(e) {
    e?.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (!data.session) {
        setInfo("Check your email to confirm your account, then sign in.");
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally { setLoading(false); }
  }

  async function onSignOut() {
    setError(""); setInfo(""); setLoading(true);
    try {
      await supabase.auth.signOut();
      setInfo("Signed out successfully.");
    } catch (err) {
      setError(err.message || "Failed to sign out");
    } finally { setLoading(false); }
  }

  return (
    <section id="login" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-center text-2xl font-bold text-gray-900">{session ? 'You\'re already signed in' : (mode === 'signin' ? 'Sign in' : 'Create account')}</h2>
          <p className="mb-4 text-center text-sm text-gray-600">Access and manage your bookings</p>

          {error && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-red-700 text-sm">{error}</div>}
          {info && <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800 text-sm">{info}</div>}

          {!session && (
          <form className="space-y-4" onSubmit={mode==='signin'?onSignIn:onSignUp}>
            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your name" className="w-full rounded-md border px-3 py-2 text-sm" required />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <Mail size={18} className="text-gray-500" />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                <Lock size={18} className="text-gray-500" />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{loading ? (mode==='signin'?'Signing in...':'Creating...') : (mode==='signin'?'Sign in':'Create account')}</button>
          </form>
          )}

          {session && (
            <div className="space-y-3">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-emerald-800 text-sm">You are signed in. You can go to the Admin panel or sign out.</div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/admin')} className="flex-1 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">Go to Admin</button>
                <button onClick={onSignOut} disabled={loading} className="flex-1 rounded-md border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 bg-white text-white">Sign out</button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-700">
            {!session && (
              <>
                {mode === 'signin' ? (
                  <button onClick={()=>{setMode('signup'); setError(''); setInfo('');}} className=" text-white">Create an account</button>
                ) : (
                  <button onClick={()=>{setMode('signin'); setError(''); setInfo('');}} className=" text-white">Already have an account? Sign in</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
