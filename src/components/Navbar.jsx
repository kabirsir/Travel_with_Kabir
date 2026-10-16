import { Menu, X, UserCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setSession(session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (mounted) setSession(sess);
    });
    return () => { mounted = false; sub.subscription?.unsubscribe?.(); };
  }, []);

  return (
    <header className="absolute top-0 z-50 w-full border-0 bg-transparent">
      <div className="grid grid-cols-[1fr_auto_1fr] h-20 w-full items-center px-2 sm:px-4 lg:px-6 gap-4">
        <Link to="/" className="flex items-center gap-2 max-w-[200px]" aria-label="Travel with Kabir Home">
          <img
            src="/logo1.png"
            alt="Travel with Kabir"
            className="h-16 w-auto object-contain"
            style={{ mixBlendMode: 'multiply', filter: 'contrast(1.05) brightness(1.0)', opacity: 1 }}
            onError={(e) => {
              const tried = e.currentTarget.getAttribute('data-tried') || '';
              if (!tried.includes('logo-1')) {
                e.currentTarget.setAttribute('data-tried', tried + ' logo-1');
                e.currentTarget.src = '/logo%201.png';
              } else if (!tried.includes('logo.png')) {
                e.currentTarget.setAttribute('data-tried', tried + ' logo.png');
                e.currentTarget.src = '/logo.png';
              } else if (!tried.includes('logo1.jpg')) {
                e.currentTarget.setAttribute('data-tried', tried + ' logo1.jpg');
                e.currentTarget.src = '/logo1.jpg';
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </Link>
        <nav className="hidden md:flex justify-center gap-2 text-sm font-medium rounded-full bg-white/60 backdrop-blur px-2 py-1 shadow-sm ring-1 ring-black/10 col-start-2">
          <Link to="/" className="rounded-full px-3 py-1 hover:bg-white/70 transition">Home</Link>
          <a href="#destinations" className="rounded-full px-3 py-1 hover:bg-white/70 transition">Destinations</a>
          <a href="#contact" className="rounded-full px-3 py-1 hover:bg-white/70 transition">Contact</a>
          <Link to="/gallery" className="rounded-full px-3 py-1 hover:bg-white/70 transition">Gallery</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex justify-self-end">
          <a href="#destinations" className="btn-gradient rounded-md px-3 py-2 text-sm font-semibold shadow">Book Now</a>
          {session ? (
            <Link to="/admin" className="rounded-full bg-white border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50 hover:text-[#1f2937] transition-colors shadow-sm" title="Admin Dashboard">
              <UserCircle size={24} />
            </Link>
          ) : (
            <Link to="/login" className="rounded-md border px-3 py-2 text-sm font-semibold hover:bg-gray-50 bg-white inline-block">Login</Link>
          )}
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-md p-2 text-gray-700 md:hidden justify-self-end z-50"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden flex flex-col p-6 gap-4 border-t border-gray-100">
          <nav className="flex flex-col gap-4 text-lg font-medium text-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-600 transition">Home</Link>
            <a href="#destinations" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-600 transition">Destinations</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-600 transition">Contact</a>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-600 transition">Gallery</Link>
          </nav>
          <div className="flex flex-col gap-3 mt-4">
            <a href="#destinations" onClick={() => setIsMenuOpen(false)} className="btn-gradient rounded-md px-3 py-3 text-center font-semibold shadow">Book Now</a>
            {session ? (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="rounded-md border px-3 py-3 text-center font-semibold hover:bg-gray-50 bg-white flex items-center justify-center gap-2">
                <UserCircle size={20} /> Admin Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-md border px-3 py-3 text-center font-semibold hover:bg-gray-50 bg-white inline-block">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


