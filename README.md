# Caspian Journeys

Bakı və İçərişəhər üzrə premium bələdçi xidməti landing page-i. Statik `HTML + CSS + JS` stack-i qorunub; framework və build addımı yoxdur.

## Arxitektura

```text
caspian-journeys/
├── index.html          # Semantik səhifə, SEO/OG/Twitter, JSON-LD, hreflang, bütün bölmələr
├── css/style.css       # Dizayn sistemi, responsive, reduced-motion, modal və A/B stillər
├── js/config.js        # Mərkəzi əlaqə məlumatları və Telegram Worker endpoint-i
├── js/i18n.js          # AZ / EN / RU vahid tərcümə lüğəti (452 açar)
├── js/main.js          # Bütün interaksiyalar, dinamik tərcümə, localStorage, PWA
├── js/notify.js        # Sorğu / rəy / bülleten / analitika bildiriş köprüsü
├── worker/             # Cloudflare Worker (Telegram Bot API proxy)
├── admin.html          # Demo admin panel: sorğular, bülleten, rəylər, analitika, status
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (v8 offline shell)
└── assets/images/      # Şəffaf loqo, xalça ornamenti, optimallaşdırılmış JPEG + WebP
```

## Qorunan dizayn sistemi

- Navy `#012544`, teal `#01848c`, qızıl `#e69c01`, ağ — əvvəlki sistemdən qorunub.
- Editorial qat: obsidian `#050f1d`, krem `#f6efe3`, azure `#2aa7c6`, terracotta `#c96f4a`.
- Kontrast üçün terracotta mətn rəngi `#a8512f` istifadə olunur (AA).
- Tipografiya: Google `Poppins`; ornament: Azərbaycan xalçasından ilhamlanan `carpet-pattern.svg`.
- Hərəkət ölçülüdür: OS `prefers-reduced-motion` və sayt daxilindəki **Animasiyaları söndür** düyməsi hamısını dayandırır.

## Funksiyalar

### Tur və planlama

- Axtarış + ərazi / müddət / maraq filtri, nəticə sayğı və **"Mənim üçün seç"** qısa yolları.
- 5 Bakı / Abşeron istiqaməti; Qobustan kartında asan marşrut, uzunluq və mövsüm.
- Məzmun yalnız Bakı / İçərişəhər, Abşeron, Qobustan və Xəzər sahili ilə məhdudlaşır; digər region istinadları və istifadə olunmayan şəkillər çıxarılıb.
- Interaktiv SVG xəritə: klik və klaviatura ilə nöqtə seçimi, tərcümə olunan detal paneli.
- Qiymət cədvəli, **daxildir / daxil deyil** qutusu, nəfər/gün/transfer/VIP hesablayıcı və 4+ nəfərə 10% qrup endirimi.
- Marşrut qurucu: maraq və gün seçiminə görə təkrarlanmayan günlük plan.
- Solo, ailə, VIP və büdcə qeydləri; uşaq və valyuta FAQ cavabları.

### İçerik və media

- 5 editorial təcrübə, 4 mövsüm, 3 bələdçi profili, 4 Bakı sahəsi üzrə qastronomiya rehberi.
- Ailə / cütlük / VIP kartları, praktik səyahət məlumatları və geniş FAQ.
- Foto lightbox və 3 **foto hekayə** (video iddiası yoxdur; reduced-motion-aware).
- Rəy və bülleten formaları; nümunə kontent açıq şəkildə qeyd olunub.
- Bütün fotolar `picture` + `srcset` + WebP (600w/1000w) ilə verilir; loqo şəffaf PNG.

### Form, dil və conversion

- Tam validasiyalı sorğu: ad, telefon, tarix, nəfər, maraq və büdcə məcburidir.
- Canlı kanal statusu formada açıq göstərilir. Demo rejimində e-poçt proqramı **avtomatik açılmır**; istifadəçi modalda özü "E-poçtla göndər" düyməsinə basır.
- Uğur modalı, `.ics` təqvim faylı, WhatsApp / Facebook / X paylaşımı və copy-link.
- Sorğulara `status: 'Yeni'` əlavə olunur; admin panel statusu dəyişə bilir.
- AZ / EN /RU: statik mətn, placeholder, alt, aria-label, dinamik xəritə/hesablayıcı/qurucu/Modal/status mətnləri tərcümə olunur.
- Dil `localStorage` və `?lang=` ilə qorunur; `html lang` və `hreflang` düzgün dəyişir.
- Modalarda focus trap, `inert` fon və focus geri qayıdışı var.

### PWA və admin

- `manifest.json` + 192/512 px ikonlar + `cj-shell-v8` service worker.
- `admin.html`: sorğular, bülleten, rəylər, analitika; status dəyişikliyi, silmə və təmizləmə.
- Məlumatlar yalnız cihazın browser-indədir: `cj_bookings`, `cj_newsletter`, `cj_reviews`, `cj_events`, `cj_lang`, `cj_ab`, `cj_motion`.

## Canlı hosting

Sayt GitHub Pages üzərində ictimai və şifresizdir:

- `https://omarbabaiev.github.io/caspian-journeys/`
- Demo admin: `https://omarbabaiev.github.io/caspian-journeys/admin.html`
- Repo: `https://github.com/omarbabaiev/caspian-journeys`

`gh-pages` branch-i Pages mənbəyidir; `main`-ə göndərilən dəyişiklik `gh-pages`-ə də push olunur.

## Əlaqə məlumatları və doğrulama

Hazırkı e-poçt, telefon, WhatsApp və sosial linklər **nümunədir** və footer-də açıq qeyd olunur. Hamısı `js/config.js` faylından idarə olunur. Real məlumat daxil edildikdə:

1. `js/config.js` dəyərlərini dəyiş.
2. `contactVerified: true` et — o zaman əlaqə məlumatları JSON-LD `TravelAgency` obyektinə də əlavə olunur.
3. Dəyişikliyi `main` və `gh-pages` branch-lərinə push et.

Doğrulanmamış kontaktlar strukturlaşdırılmış məlumatda göstərilmir ki, axtarış motorları nümunə nömrəni real biznes məlumatı kimi oxumasın.

## Telegram bildirişləri

Bot token-i **heç vaxt** statik JS-ə yazmaq olmaz. `worker/telegram-notify.js` Cloudflare Worker olaraq token-i secret-də saxlayır və yalnız sayt origin-dən gələn POST sorğularını qəbul edir.

```bash
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler deploy
```

Deploy-dan sonra Worker URL-i `js/config.js` faylında `window.CJ_NOTIFY_URL` dəyərinə yazılır. Endpoint boş olduqda sayt demo rejimində işləyir, heç bir şəbəkə sorğusu getmir və form bunu istifadəçiyə açıq bildirir.

Göndərilənlər: rezervasiya sorğusu, yeni rəy, bülleten abunəsi və analitika paketi (`logEvent`). Canlı kanal qoşulduqda ilk cavab SLA-sı 15 dəqiqə, fərdi marşrut isə bir iş günüdür; demo rejimində bu vəd verilmir.

## Yoxlamalar

```bash
npx html-validate index.html admin.html
node --check js/main.js
node --check js/i18n.js
node --check js/config.js
node --check js/notify.js
node --check sw.js
node --input-type=module --check < worker/telegram-notify.js
python3 -m json.tool manifest.json
python3 -m http.server 8000
```

Build addımı yoxdur: layihə statik HTML/CSS/JS olduğu üçün `npm build` tələb olunmur.

## Hələ dəyişilməli məlumatlar

- Real e-poçt, telefon/WhatsApp və biznes sosial profilləri (`js/config.js`).
- Real rəy sahibləri və mətnləri; hazırkı profillər nümunədir.
- Cloudflare Worker token/chat ID və `CJ_NOTIFY_URL` — hazırda yoxdur, demo rejimi aktivdir.
- Şəkillər Wikimedia Commons mənbəlidir; kreditlər footer-də qeyd olunub.
