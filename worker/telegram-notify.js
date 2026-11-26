/* Cloudflare Worker: Caspian Journeys → Telegram Bot API
   Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
   Usage: POST { type: 'booking'|'review'|'newsletter'|'analytics', payload: {...} }
*/

const ALLOWED_ORIGINS = [
  'https://omarbabaiev.github.io',
  'http://localhost:8000',
  'http://localhost:8773'
];

const esc = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const line = (label, value) => value ? `<b>${esc(label)}:</b> ${esc(value)}\n` : '';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, corsHeaders(origin))
  });
}

function formatMessage(type, payload) {
  const p = payload || {};
  const when = new Date().toLocaleString('az-AZ', { timeZone: 'Europe/Baku' });

  if (type === 'booking') {
    return '<b>🌊 Caspian Journeys — yeni sorğa</b>\n' +
      line('Ad', p.name) +
      line('Telefon / WhatsApp', p.phone) +
      line('Tarix', p.date) +
      line('Nəfər', p.people) +
      line('Maraq', p.interest) +
      line('Büdcə', p.budget) +
      `\n<i>${esc(when)}</i>`;
  }

  if (type === 'review') {
    return '<b>⭐ Yeni rəy</b>\n' +
      line('Ad', p.name) +
      line('Ölkə', p.country) +
      line('Tur', p.tour) +
      line('Mətn', p.text) +
      `\n<i>${esc(when)}</i>`;
  }

  if (type === 'newsletter') {
    return '<b>✉️ Yeni abunəçi</b>\n' + line('E-poçt', p.email) + `\n<i>${esc(when)}</i>`;
  }

  if (type === 'analytics') {
    const events = Array.isArray(p.events) ? p.events : [];
    const names = events.map((e) => esc(e && e.name || 'event')).join(', ') || 'hadisə yoxdur';
    return '<b>📊 Caspian Journeys analitika</b>\n' +
      line('Hadisələr', names) +
      line('Sayı', events.length) +
      line('Səhifə', p.page) +
      `\n<i>${esc(when)}</i>`;
  }

  return '<b>Caspian Journeys</b>\n' + line('Hadisə', type) + `\n<pre>${esc(JSON.stringify(p).slice(0, 1200))}</pre>`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allowed ? origin : ALLOWED_ORIGINS[0]) });
    }
    if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, origin);
    if (!allowed) return json({ ok: false, error: 'Origin not allowed' }, 403, origin);

    let body;
    try { body = await request.json(); } catch (_) { return json({ ok: false, error: 'Invalid JSON' }, 400, origin); }

    const type = String(body.type || 'event').slice(0, 40);
    const text = formatMessage(type, body.payload);
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return json({ ok: false, error: 'Telegram secrets missing' }, 500, origin);

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const result = await tg.json().catch(() => ({}));
    if (!tg.ok || !result.ok) {
      return json({ ok: false, error: (result && result.description) || 'Telegram error' }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  }
};
