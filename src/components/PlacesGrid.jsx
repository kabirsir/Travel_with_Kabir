import PlaceCard from "./PlaceCard.jsx";

export default function PlacesGrid({ places, onView }) {
  return (
    <section id="destinations" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">&quot;Popular Destinations&quot;</h2>
            <p className="mt-1 text-sm text-gray-600">&quot;Browse and view details, then book your seats.&quot;</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}
