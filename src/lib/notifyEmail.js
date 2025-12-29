export async function sendBookingEmail(payload) {
  const url = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'booking_confirmation', payload }),
    });
  } catch (_) {
    // ignore email errors on client
  }
}

export default sendBookingEmail;
