export default function PlaceCard({ place, onView }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={place.thumbnailUrl}
          alt={place.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
        <p className="line-clamp-2 text-sm text-gray-600">{place.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-semibold">{place.charges}</span>
          <button onClick={() => onView(place)} className="btn-gradient rounded-md px-3 py-1.5 text-sm font-semibold shadow">View details</button>
        </div>
      </div>
    </div>
  );
}

