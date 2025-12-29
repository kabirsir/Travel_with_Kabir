import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, CalendarDays, Route, Wallet, Bus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlaceModal({ open, place, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-3xl">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-xl bg-white shadow-xl">
                <button onClick={onClose} className="absolute right-3 top-3 inline-flex rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Close">
                  <X size={18} />
                </button>
                {place && (
                  <div className="grid gap-0 sm:grid-cols-2">
                    <div className="relative">
                      <img
                        src={place.thumbnailUrl}
                        alt={place.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <Dialog.Title className="text-2xl font-bold text-gray-900">{place.name}</Dialog.Title>
                      <p className="mt-1 text-sm text-gray-600">{place.shortDescription}</p>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                        <div className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                          <Wallet size={16} className="text-brand-600" />
                          <span className="font-medium">Charges:</span>
                          <span>{place.charges}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                          <CalendarDays size={16} className="text-brand-600" />
                          <span className="font-medium">Duration:</span>
                          <span>{place.duration}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                          <Bus size={16} className="text-brand-600" />
                          <span className="font-medium">Traveling Allowance:</span>
                          <span>{place.travelingAllowance}</span>
                        </div>
                        <div className="rounded-md bg-gray-50 px-3 py-2">
                          <div className="mb-1 inline-flex items-center gap-2">
                            <Route size={16} className="text-brand-600" />
                            <span className="font-medium">Route:</span>
                          </div>
                          <div className="text-gray-700">{Array.isArray(place.routes) ? place.routes.join(" → ") : place.routes}</div>
                        </div>
                        <div className="rounded-md bg-gray-50 px-3 py-2">
                          <div className="mb-1 font-medium">Facilities</div>
                          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {place.facilities?.map((f, idx) => (
                              <li key={idx} className="inline-flex items-center gap-2 text-gray-700">
                                <CheckCircle2 size={16} className="text-brand-600" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-md bg-gray-50 px-3 py-2">
                          <div className="mb-2 font-medium">Reviews</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=48&q=80&auto=format&fit=crop" alt="reviewers" className="h-7 w-7 rounded-full ring-2 ring-white" />
                                <img src="https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=48&q=80&auto=format&fit=crop" alt="reviewers" className="h-7 w-7 rounded-full ring-2 ring-white" />
                                <img src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=48&q=80&auto=format&fit=crop" alt="reviewers" className="h-7 w-7 rounded-full ring-2 ring-white" />
                              </div>
                              <div className="text-sm text-gray-700"><span className="mr-1 text-yellow-500">★★★★★</span>4.8 (120+ reviews)</div>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">“Amazing views and a well-organized trip. Highly recommended for first-timers!”</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          onClick={() => {
                            onClose?.();
                            navigate(`/booking?place=${encodeURIComponent(place?.id || '')}`);
                          }}
                          className="btn-gradient w-full rounded-md px-4 py-2 text-sm font-semibold shadow">
                          Book Seats
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
