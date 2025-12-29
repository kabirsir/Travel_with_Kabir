export default function Terms() {
  return (
    <section id="terms" className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-extrabold text-gray-900">Terms & Policies</h2>
        <p className="mb-6 text-sm leading-6 text-gray-700">
          Please read these terms carefully. By using our services, you agree to the following terms and policies.
        </p>

        <div className="space-y-6 text-sm leading-6 text-gray-800">
          <div>
            <h3 className="mb-2 font-bold text-gray-900">1. Bookings & Payments</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>All bookings are confirmed upon receipt of payment as per invoice.</li>
              <li>Prices may vary based on availability, currency fluctuation, and seasonal surcharges.</li>
              <li>Outstanding balances must be cleared before travel documents are issued.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-gray-900">2. Cancellations & Refunds</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Cancellation requests must be submitted in writing.</li>
              <li>Refunds (if applicable) follow supplier policies and may exclude non-refundable fees.</li>
              <li>No-shows are non-refundable.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-gray-900">3. Changes & Rescheduling</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Date or traveler changes are subject to availability and change fees.</li>
              <li>Airline/hotel policy will prevail where applicable.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-gray-900">4. Traveler Responsibility</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Ensure passport validity, visas, vaccinations, and travel insurance where required.</li>
              <li>Arrive at the pickup/airport on time; delays may forfeit services.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-gray-900">5. Privacy Policy</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>We collect minimal personal data to process bookings and enhance services.</li>
              <li>Data is not sold to third parties; it may be shared with suppliers strictly for service delivery.</li>
              <li>You may request access, correction, or deletion of your data by contacting us.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-gray-900">6. Liability</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>We act as agents for airlines, hotels, and operators; their terms apply.</li>
              <li>We are not liable for delays, cancellations, or events beyond reasonable control.</li>
            </ul>
          </div>

          <p className="text-xs text-gray-600">
            For detailed terms or clarifications, please contact us at <a href="mailto:info@travelwithkabir.pk" className="underline">info@travelwithkabir.pk</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
