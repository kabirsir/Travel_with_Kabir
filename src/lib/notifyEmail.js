export async function sendEmailWebhook(type, payload) {
  const url = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
  } catch (_) {
    // ignore email errors on client
  }
}

export async function sendBookingEmail(payload) {
  return sendEmailWebhook('booking_confirmation', payload);
}

export async function sendStatusUpdateEmail(payload, newStatus) {
  const type = newStatus === 'confirmed' ? 'booking_accepted' : 'booking_cancelled';
  return sendEmailWebhook(type, { ...payload, status: newStatus });
}

export default sendBookingEmail;
