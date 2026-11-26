/* Caspian Journeys — mərkəzi konfiqurasiya.
   Əlaqə məlumatlarını buradan dəyiş; footer, WhatsApp, e-poçt və JSON-LD avtomatik yenilənir.
   Hazırkı dəyərlər nümunədir: contactVerified = false olduqda JSON-LD-yə əlavə olunmur.
   Telegram endpoint-i boş olduqda sayt demo rejimində işləyir və heç bir şəbəkə sorğusu göndərmir. */

window.CJ_CONFIG = {
  contactVerified: false,
  email: 'hello@caspianjourneys.az',
  phone: '+994501234567',
  phoneDisplay: '+994\u00a050\u00a0123\u00a045\u00a067',
  whatsapp: 'https://wa.me/994501234567',
  instagram: 'https://instagram.com/caspianjourneys',
  tiktok: 'https://www.tiktok.com/@caspianjourneys',
  hours: 'Hər gün 09:00 – 21:00',
  responseTime: '15 dəqiqə'
};

/* Cloudflare Worker deploy edildikdən sonra URL buraya yazılır. */
window.CJ_NOTIFY_URL = '';
