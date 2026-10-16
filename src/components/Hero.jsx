import { Mountain, MapPin } from "lucide-react";
import heroBg from "../assets/M-B-HD.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden h-screen flex items-center"
      style={{}}
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-[80px] pb-8 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
            <Mountain size={16} /> Explore Pakistan's North
          </div>
          <h1 className="font-arial-black text-4xl tracking-tight sm:text-5xl text-center">
            <span style={{ color: "var(--brand-contrast)", textShadow: "2px 2px 10px rgba(255, 248, 201, 0.8), -1px -1px 4px rgba(255,255,255,0.5)" }}>Travel with Kabir</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg font-bold">
            Discover breathtaking valleys, alpine meadows, crystal lakes, and adventure—book your
            seats for curated trips to the most iconic destinations in the Northern Areas of Pakistan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#destinations" className="btn-gradient rounded-md px-5 py-2.5 text-sm font-semibold shadow transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95">
              Explore Destinations
            </a>
            <a href="#contact" className="btn-gradient inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95">
              <MapPin size={18} /> Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

