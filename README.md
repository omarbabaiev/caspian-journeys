# Caspian Journeys

Azərbaycan üzrə premium bələdçi xidməti landing page-i. Mövcud statik `HTML + CSS + JS` stack-i qorunub; framework əlavə edilməyib.

## Arxitektura

```text
caspian-journeys/
├── index.html          # Semantik səhifə, SEO/OG, hreflang, ikon sprite, bütün bölmələr
├── css/style.css       # Dizayn sistemi, responsive, reduced-motion, A/B variant
├── js/main.js          # Bütün interaksiyalar, i18n, localStorage, PWA registration
├── admin.html          # Demo admin panel (Sorğular / Bülleten / Rəylər / Analitika)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (cache-first asset, network-first navigation)
└── assets/images/      # Loqo, xalça ornamenti, optimallaşdırılmış real fotolar, PWA ikonları
```

## Qorunan dizayn sistemi

- Navy `#012544`, teal `#01848c`, qızıl `#e69c01`, ağ — əvvəlki sistemdən qorunub.
- Yeni editorial qat: obsidian `#050f1d`, krem `#f6efe3`, azure `#2aa7c6`, terracotta `#c96f4a`.
- Tipografiya: Google `Poppins` (300–800, italic), başlıqlarda 600 çəki.
- Ornament: Azərbaycan xalçasından ilhamlanan `carpet-pattern.svg`.
- Hərəkət ölçülü: parallax, scroll reveal, xəritə/marşrut animasiyası, hover mikro-interaksiyalar; hamısı `prefers-reduced-motion` ilə söndürülür.

## Funksiyalar

### Tur və planlama
- Axtarış + region / müddət / maraq filtri və nəticə sayğı
- “Daha çox istiqamət göstər” (Xınalıq, Yanar Dağ, Qalaaltı, Hirkan, Abşeron, Naxçivan)
- Interaktiv SVG xəritə: klik və klaviatura ilə nöqtə seçimi, detal paneli
- Qiymət cədvəli və nəfər/gün/transfer/VIP üzrə təxmini hesablayıcı
- Marşrut qurucu: maraq və gün seçiminə görə günlük plan generasiyası
- Günlük itinerary arxivi (şəhər / dağ / kulinariya günü)

### İçerik və media
- 5 əsas + 7 əlavə istiqamət, 5 editorial təcrübə kartı
- 4 mövsüm turu, 3 bələdçi profili, 4 region üzrə kulinariya rehberi
- Ailə / cütlük / VIP kartları, 5 praktik səyahət məlumatı, FAQ (6 sual)
- Şirkət hekayəsi, mükafat/tərəfdaşlıq, səyahət jurnalı
- Foto lightbox və 3 video hekayə (4 kadrlı slider, avto-keçid, reduced-motion-aware)
- Rəy “daha çox göstər” və istifadəçi rəyi əlavə etmə formu

### Form, dil və conversion
- Tam validasiyalı sorğu formu: ad, telefon, tarix, nəfər, maraq, büdcə
- Uğur modalı, hazır `mailto:`, `.ics` takvim faylı
- Sorğu, rəy, bülleten və analytics hadisələri `localStorage`-a yazılır (admin panel oxuyur)
- AZ / EN / RU real tərcümə, `html lang`, `hreflang`, dil seçimi `localStorage` və `?lang=` ilə qorunur
- WhatsApp, Facebook, X paylaşımı və copy-link
- Sticky mobil CTA, yuxarı qayıt, scroll progress, üzən WhatsApp
- A/B test: hero CTA rəng variantı hadisə olaraq qeyd olunur
- Newsletter abunəsi (lokal demo)

### PWA və admin
- `manifest.json` + 192/512 px ikonlar + service worker (offline shell)
- `admin.html`: sorğular, bülleten, rəylər, analitika; silmə və təmizləmə əməliyyatları
- Məlumatlar yalnız cihazın browser-indədir (`cj_bookings`, `cj_newsletter`, `cj_reviews`, `cj_events`, `cj_lang`, `cj_ab`)

## Backend inteqrasiya nöqtələri

Statik mühitdə aşağıdakılar interfeys + lokal analoq olaraq qurulub:

- Rezervasiya → `cj_bookings` (admin panelə düşür)
- CRM → sorğu obyekti hazır formatda; real CRM üçün `booking` submit Handler-ə API çağırışı əlavə olunur
- Ödəniş → büdcə seçimi və ödəniş şərtləri FAQ-da; Stripe/PayPal linki CTA-ya bağlana bilər
- Canlı chat → WhatsApp Business / Tawk.to üçün hazır düymələr
- Video fon → hazırda cinematic image + story modulu; `hero-video` üçün media faylı əlavə edilərsə dəyişdirilə bilər

## Yoxlamalar

```bash
npx --yes html-validate index.html   # pass
node --check js/main.js              # pass
CSS brace balance                    # pass (428/428)
python3 -m http.server 8000          # local server
```

Build addımı yoxdur: layihə statik HTML/CSS/JS olduğu üçün `npm build` tələb olunmur.

## Dəyişilməli məlumatlar

- E-poçt: `hello@caspianjourneys.az`
- Telefon / WhatsApp: `+994 50 000 00 00`
- Sosial: `instagram.com`, `tiktok.com`
- Rəy sahibləri və mətnləri nümunədir; real rəylərlə əvəz edilməlidir.
- Şəkillər Wikimedia Commons mənbəlidir; şəkil kreditləri footer-də qeyd olunub.
