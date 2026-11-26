/* Caspian Journeys — Telegram bildiriş köprüsü.
   Endpoint boşdursa heç bir şəbəkə sorğusu edilmir (demo rejimi). */
(function () {
  'use strict';

  const endpoint = String(window.CJ_NOTIFY_URL || '').trim();
  let queue = [];

  function post(type, payload) {
    if (!endpoint) return;
    const body = JSON.stringify({ type: type, payload: payload });
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) return;
      } catch (_) { /* fetch-ə keç */ }
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true
    }).catch(function () { /* bildiriş kritik deyil */ });
  }

  window.CJNotify = {
    enabled: Boolean(endpoint),
    send: post,
    event: function (name, detail) {
      queue.push({ name: name, detail: detail || {}, at: new Date().toISOString() });
      if (queue.length >= 12) window.CJNotify.flush();
    },
    flush: function () {
      if (!endpoint || !queue.length) return;
      const events = queue;
      queue = [];
      post('analytics', { events: events, page: window.location.href });
    }
  };

  window.setInterval(function () { window.CJNotify.flush(); }, 30000);
  window.addEventListener('pagehide', function () { window.CJNotify.flush(); });
}());
