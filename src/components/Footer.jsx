import heroBg from "../assets/b-g.jpg";
export default function Footer() {
  return (
    <footer id="contact" className="bg-transparent">
      <div className="relative w-full px-4 py-10 sm:px-6 lg:px-8 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/10">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            transform: "scale(1.05)",
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(255, 248, 201, 0.25)' }} />
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 text-2xl font-extrabold text-gray-900">Travel with Kabir<span className="ml-1 align-top text-xs font-bold">®</span> <span className="text-sm font-semibold text-gray-500">Travels</span></div>
            <p className="text-sm leading-6 text-gray-700">
              At Travel with Kabir, we focus on personalized and meaningful travel experiences. Every trip is
              planned with passion and care for our clients.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-bold text-gray-900">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#home" className="hover:text-brand-700">Home</a></li>
              <li><a href="#about" className="hover:text-brand-700">About Us</a></li>
              <li><a href="#destinations" className="hover:text-brand-700">Domestic Tours</a></li>
              <li><a href="#terms" className="hover:text-brand-700">Terms and Policies</a></li>
              <li><a href="#feedback" className="hover:text-brand-700">Feedback & Complaint</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-bold text-gray-900">CONTACT US</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>03174600575</li>
              <li>03432201058</li>
              <li><a href="mailto:info@travelwithkabir.pk" className="hover:text-brand-700">info@travelwithkabir.pk</a></li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a href="https://wa.me/923174600575" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.46.02.12 5.36.14 11.96c0 2.1.56 4.15 1.63 5.95L0 24l6.25-1.72a11.84 11.84 0 0 0 5.81 1.52h.01c6.6 0 11.96-5.36 11.98-11.96a11.94 11.94 0 0 0-3.53-8.36ZM12.06 21.8h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.21-3.71 1.02 1-3.62-.24-.37a9.84 9.84 0 0 1-1.52-5.28C2.18 6.45 6.64 2 12.06 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 7c-.02 5.42-4.48 9.88-9.88 9.9Zm5.7-7.4c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.52-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53h-.6c-.2 0-.54.08-.82.39-.28.31-1.08 1.06-1.08 2.57 0 1.5 1.1 2.95 1.26 3.16.16.2 2.18 3.33 5.28 4.67.74.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.83-.75 2.09-1.48.26-.73.26-1.36.18-1.48-.07-.1-.26-.18-.57-.34Z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-yellow-500 text-white hover:opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white hover:bg-blue-700">f</a>
              <a href="#" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L16 12l-6.4 3.5Z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white hover:bg-sky-600">t</a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="py-3 text-center text-xs font-semibold"
        style={{ backgroundImage: 'linear-gradient(90deg, var(--twk-light-green), var(--twk-light-blue))' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 px-4 sm:flex-row sm:gap-3">
          <span>All Rights Reserved {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-3">
            <a href="/terms.html" className="underline hover:opacity-90">Terms</a>
            <a href="/privacy.html" className="underline hover:opacity-90">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
