# Caspian Journeys — Review Board

**Tarix:** 2026-11-26
**Hedef:** https://omarbabaiev.github.io/caspian-journeys/
**Metod:** real browser testi (desktop, 700px viewport) + `index.html` / `css/style.css` / `js/main.js` / `admin.html` / `manifest.json` / `sw.js` kod yoxlaması
**Ümumi qiymət:** 7.0/10

## Qısa xülasə

Sayt vizual olaraq güclü, interaktiv hissəları (filter, xəritə, hesablayıcı, marşrut qurucu) real olaraq işləyir və konsol xətası yoxdur. Ən böyük risk **etibar və localization** qatındadır: RU/EN rejimində əsas kart başlıqları və düymələr azərbaycanca qalır, əlaqə məlumatları placeholder-dir, real bildiriş kanalı (Telegram Worker) hələ aktiv deyil. Satış funnel-i "sorğu göndər" nöqtəsində `mailto:`-ya dayanır və büdcə/müddət gözləntiləri qeyri-müəyyəndir. Bu düzəlişlər edilsə, sayt 8.5/10 səviyyəsinə çıxa bilər.

## Qiymət cədvəli

| Ölçü | Qiymət | Qeyd |
| --- | --- | --- |
| Satış / conversion | 6.0/10 | CTA çox, follow-up yox, əlaqə placeholder |
| Marketing / mesaj | 5.5/10 | Güclü hero, lakin SEO metadata və tərcümə zəif |
| UI / vizual | 7.5/10 | Editorial dil tutarlı, bir neçə kontrast və content-loop problemi |
| Accessibility | 6.5/10 | Etiketlər/aria-live yaxşı, modal focus trap yox, eyebrow kontrastı aşağı |
| Performance | 6.0/10 | 2.6 MB unik image, WebP/srcset yox, logo PNG 226 KB |
| Kontent / etibar | 6.5/10 | Unikal kontent var, amma rəy və əlaqə məlumatları nümunə |

## Top 10 prioritet düzəliş

| # | Problem | Severity | Reviewer | Effort | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | RU/EN rejimində kart başlıqları, düymələr, footer və modal AZ qalır | P1 | Beynəlxalq turist | M | RU testində H1/H2 rus, H3-lər AZ: `Bakı & İçərişəhər`, `Daha çox istiqamət göstər` |
| 2 | Real əlaqə məlumatları placeholder (`hello@caspianjourneys.az`, `+994 50 000 00 00`, generic sosial linklər) | P0 | Satış / VIP | S | `index.html:498-500`, footer və floating WhatsApp |
| 3 | Telegram bildiriş endpoint-i boşdur, `CJNotify.enabled = false` | P1 | Yerli bələdçi | S | `js/config.js`, browser evaluate: `notifyUrl=""` |
| 4 | `.eyebrow` kontrastı 3.59:1 (12.48px, 800) — WCAG AA uğursuz | P1 | Senior UI / Ekran oxuyucu | S | computed color `rgb(201,111,74)` on white |
| 5 | Marşrut qurucu 3 gün üçün eyni fəaliyyəti təkrarlayır | P1 | Senior UI / Ailə | M | builder output: `Gün 01/02/03 — İçərişəhər, Qız qalası...` |
| 6 | Rezervasiya yalnız `mailto:` ilə bitir; təsdiq/telefon/SLA yoxdur | P1 | Satış | M | `js/main.js:733-746`, success modal |
| 7 | `Filmi izlə` / `Video hekayələr` əslində şəkil slayderidir | P2 | Senior UI / Marketing | S | video modalda `video-stage-img`, `<video>` yoxdur |
| 8 | Kanonik URL, JSON-LD, Twitter card yox; `og:image` relative | P2 | Marketing | S | `<head>` yoxlaması, `og:image="assets/images/dest-baku.jpg"` |
| 9 | Şəkil çəkisi və format: 2.6 MB unik JPEG, 652 KB ən böyük, WebP/srcset yox | P2 | Performance / Dağ turisti | M | PerformanceResourceTiming, 16 resource entry ≈ 5.8 MB |
| 10 | Modalarda focus trap yox (Tab dialogdan çıxa bilər) | P1 | Ekran oxuyucu | S | `openModal` close button-a focus edir, trap yox |

## Konsensus

- Bütün reviewer-lər interaktivliyi (filter, xəritə, hesablayıcı) müsbət qiymətləndirdi.
- Əlaqə məlumatlarının placeholder olması satış, marketing və VIP baxımından ümumi blokerdir.
- RU/EN qismi tərcümə ən çox gözə dəyən keyfiyyət problemidir.
- Şəkil keyfiyyeti yaxşıdır, lakin çəki/format optimallaşdırılmayıb.

## Ziddiyyətlər

- **Satış mütexxəssisi** CTA sayını artırmağı (sticky + floating) conversion üçün müsbət sayır; **Senior UI designer** isə eyni elementləri vizual izdiham və yaşlı istifadəçi üçün maneə hesab edir. Kompromis: sticky CTA saxlanılsın, floating WhatsApp yalnız mobildə və 2 saniyə gecikmə ilə göstərilsin.
- **Marketing mütexxəssisi** "500+ qonaq / 4.9/5" rəqəmlərini sosial sübut kimi saxlamağı təklif edir; **Beynəlxalq turist** və **Senior UI designer** bunun doğrulanmadığı üçün etibar riski olduğunu deyir. Kompromis: rəqəmlər real mənbə ilə əvəz olunana qədər "500+" yazısını "yerli bələdçilərlə" kimi neytral ifadəyə dəyişmək.

## Artıq yaxşı olanlar

- Semantik HTML: 1 `<h1>`, ardıcıl `<h2>/<h3>`, duplicate ID yox, broken anchor yox, `html-validate` keçir.
- Konsol xətası yox; şəkillər scroll zamanı yüklənir (`naturalWidth > 0`).
- Filter real işləyir: `Şəki` axtarışı → `1 marşrut tapıldı`, reset → 12.
- Xəritə nöqtələri `tabindex="0"`, `role="button"`, `aria-label` ilə klaviatura üçün əlçatandır; detal paneli `aria-live`.
- Form statusları, filter count, calculator output, builder output `aria-live`/`role=status` ilə elan olunur.
- `prefers-reduced-motion` və reveal fallback var; JS olmasa belə kontent görünür.
- Demo admin panel (`admin.html`) localStorage məlumatlarını oxuyur və bunu açıq şəkildə qeyd edir.
- Şəffaf loqo və ondan generasiya olunmuş PWA ikonları tutarlıdır.

## Reviewer detalları

### Satış mütexxəssisi

1. **[P0] Placeholder əlaqə:** footer və WhatsApp düyməsi `+994 50 000 00 00` istifadə edir. Evidence: `index.html:498-500`, `index.html:467`. Fix: real nömrə/email/WhatsApp Business qoyulmalı, social linklər real profilə bağlanmalı.
2. **[P1] Tarix məcburi deyil:** booking formda `date` və `interest`/`budget` optional. Evidence: `index.html:458-460`. Fix: ən azı tarix və maraq dairəsini tələb et, "tarix yoxdursa sorğu ilə" variantını açıq et.
3. **[P1] Nə daxildir?** Büdcə seçimi var, lakin qiymətə nələrin daxil olduğu (bələdçi, transfer, giriş biletləri, yemək) yoxdur. Evidence: pricing/booking bölmələri. Fix: hər paketə "daxildir / daxil deyil" siyahısı əlavə et.
4. **[P1] `mailto:` ilə bitən funnel:** sorğu localStorage-a yazılır, sonra e-poçt proqramı açılır; istifadəçi göndərməsə lead itir. Evidence: `js/main.js:733-746`. Fix: Worker üzərindən real göndəriş + "biz 15 dəqiqə ərzində yazacağıq" mesajı.
5. **[P2] CTA izdihamı:** hero, nav, sticky CTA, floating WhatsApp, form CTA eyni vaxtda görünür. Fix: əsas CTA-nı bir saxla, ikinciləri kontekstual göstər.

### Reklam / marketing mütexxəssisi

1. **[P1] Metadata çatışmazlığı:** canonical yox, JSON-LD (`LocalBusiness`/`TouristAttraction`) yox, Twitter card yox, `og:image` relative. Evidence: `<head>` yoxlaması. Fix: absolute OG URL, canonical, LocalBusiness schema.
2. **[P2] hreflang relative:** `?lang=az` kimi relative URL-lər hreflang üçün zəif siqnaldır. Fix: `https://omarbabaiev.github.io/caspian-journeys/?lang=az` istifadə et.
3. **[P1] Qismi localization:** RU rejimində H3-lər, düymələr, FAQ başlıqları AZ qalır. Evidence: browser evaluate headings. Fix: bütün görünən string-ləri `data-i18n` dictionary-sinə köçür.
4. **[P2] Doğrulanmamış sosial sübut:** `500+ qonaq`, `4.9/5`, guide profilləri nümunədir. Fix: real rəy və ya "nümunə" etiketi.
5. **[P2] Sosial linklər boş:** `instagram.com`, `tiktok.com` generic. Fix: real biznes profilləri və UTM-lərlə paylaşım linkləri.

### Senior UI designer

1. **[P1] Kontrast:** `.eyebrow` 12.48px/800, `rgb(201,111,74)` üzərində 3.59:1 — AA (4.5:1) altında. Fix: terracotta-nı `#a8512f` kimi daha tünd tonla dəyiş və ya 14px+ böyüt.
2. **[P1] Builder content loop:** 3 gün seçdikdə eyni cümlə təkrarlanır. Evidence: builder output. Fix: gün indeksinə görə müxtəlif fəaliyyət massivi.
3. **[P2] "Video" gözlentisi yanlış:** `Filmi izlə` və `Video hekayələr` şəkil slayderi açır. Fix: ya real `<video>` qoy, ya da düyməni `Hekayəni izlə` adlandır.
4. **[P2] Asset çəkisi:** logo PNG 226 KB, 5 JPEG ~370–652 KB, `srcset`/WebP yox. Fix: logo PNG-8/svq, fotolar WebP + `srcset`, hero üçün `sizes`.
5. **[P2] Modal focus trap yox:** `Tab` dialog arxasındakı elementlərə keçə bilər. Fix: `inert` və ya focus trap əlavə et.

### Solo turist (ilk dəfə Bakıya, iOS 390px)

1. **[P2] Tək turist üçün qiymət yox:** büdcə diapazonları ümumi, "solo supplement" izah edilməyib.
2. **[P2] Təhlükəsizlik siqnalı zəif:** 24/7 dəstək yazısı var, lakin nəyin daxil olduğu (yəqin transfer, nömrə) məlum deyil.
3. **[P3] 12 kart çox:** ilk 5 kart + "daha çox" yaxşıdır, lakin axtarış olmadan qərar vermək çətin. Fix: "Mənim üçün seç" qısa sorğusu.
4. **[P2] WhatsApp placeholder:** tək turist üçün ən sürətli kanal işləmir.
5. **[P3] Offline xəritə yox:** SW shell-i cache-ləyir, lakin xəritə detalları offline görünmür (not verified offline test).

### Ailəli turist (2 uşaq)

1. **[P2] "Ailələr üçün" kart bir cümlə:** uşaq yaşı, kölgə fasiləsi, yemək variantları kartlarda görünmür; FAQ-dа var, amma gizli.
2. **[P2] Tarix məcburi deyil:** uşaq planı üçün tarix olmadan dəqiq təklif verilmir.
3. **[P2] Builder təkrarı:** 3 günlük plan eyni fəaliyyətlə uşaq üçün darıxdırıcı olacaq.
4. **[P3] Qiymət uşaq üçün aydın deyil:** FAQ-da "0–5 yaş pulsuz" var, lakin 6+ yaş üçün qiymət yox.

### Dağ / macəra turisti

1. **[P1] Çətinlik dərəcəsi yox:** Şahdağ/Xınalıq kartlarında fiziki səviyyə, yüksəklik, mövsüm, avadanlıq yoxdur.
2. **[P2] Hava/plan məlumatı yox:** "Dağ və Xəzər" mövsüm kartı ümumi; yağış/ qar üçün ehtiyat plan yox.
3. **[P2] 652 KB şəkil:** Şahdağ images for low-bandwidth problem; `srcset` olmadığı üçün mobil eyni ölçülü fayl endirir.
4. **[P3] Xəritə vaxt verir, marşrut uzunluğu vermir:** "3 saat" var, km/elevation yox.

### VIP / korporativ müştəri

1. **[P0] Placeholder əlaqə və generic sosial linklər:** VIP müştəri üçün ən güclü etibar əlaməti yoxdur.
2. **[P1] VIP yalnız dropdown option:** "VIP transfer" interest seçimidir; ayrı səhifə, şərtlər, avtomobil sinfi yoxdur.
3. **[P2] Cavab vaxtı yoxdur:** "24/7 dəstək" yazılır, lakin SLA (məs. 15 dəq.) göstərilmir.
4. **[P2] Rəylər nümunə:** adlarreal görünsə də, mənbə doğrulanmayıb.

### Yaşlı istifadəçi (böyük yaş)

1. **[P1] Kiçik və aşağı kontrastlı eyebrow:** 12.48px, 3.59:1 oxumağı çətinləşdirir.
2. **[P2] Footer 12.8px mətn:** əsas mətn 14 px civarında, footer daha kiçikdir.
3. **[P2] Hərəkət:** reveal animasiyası OS "reduce motion" ilə söndürülür, lakin saytda öz "animasiyanı söndür" seçimi yox.
4. **[P3] Üzən elementlər:** sticky CTA + WhatsApp kiçik ekranda mətn üstünə düşə bilər (not verified at 390px real device).

### Ekran oxuyucu istifadəçisi (WCAG)

1. **[P1] Modal focus trap yox:** `role="dialog"`/`aria-modal="true"` olsa da, Tab dialogdan kənara gedə bilər.
2. **[P1] RU rejimində `html lang="ru"` olmasına baxmayaraq H3-lər AZ:** ekran oxuyucu azərbaycanca sözləri rus fonetikası ilə oxuyur.
3. **[P3] Yaxşı tərəf:** map point-lərin `role="button"`, `tabindex="0"`, `aria-label` var; statuslar `aria-live`.
4. **[P3] Yaxşı tərəf:** dekorativ hero şəklinin `alt=""` olması düzgündür; qalan şəkillərdə alt var.
5. **[P3] Təklif:** lightbox açılanda caption `aria-live` ilə elan edilsə, daha yaxşı olar.

### Yerli bələdçi / tərəfdaş

1. **[P1] Real bildiriş yox:** `window.CJ_NOTIFY_URL=""`, `CJNotify.enabled=false`; sorğular yalnız localStorage-da qalır.
2. **[P1] Admin panel cihaza bağlı:** məlumatlar yalnız həmin brauzerdə; başqa cihazdan görünmür.
3. **[P2] Lead status yox:** admin panelda "yeni / əlaqə saxlanıldı / bağlandı" kimi status dəyişikliyi yoxdur.
4. **[P3] Yaxşı tərəf:** admin panel sorğu, bülleten, rəy və analitikanı ayrı tablarda göstərir.

### Bütçəyə həssas gənc turist

1. **[P2] Büdcə aralığı qeyri-müəyyən:** `100–200 / 200–500 / 500+ AZN` seçimləri var, amma "nə daxildir?" yox.
2. **[P2] Qrup endirimi yox:** hesablayıcı nəfər sayını artırır, lakin 4+ nəfər üçün endirim göstərmir.
3. **[P3] Hesablayıcı müsbət:** 3 nəfər/2 gün/transfer → `310–410 AZN` real qiymət hissi verir.
4. **[P3] "500+" rəqəmi şübhəli:** doğrulanmadığı üçün büdcəli istifadəçi etibar etməyə bilər.

### Beynəlxalq turist (EN/RU)

1. **[P1] RU qismi tərcümə:** H3-lər (`Bakı & İçərişəhər`, `Kulinariya`, `Elçin`), düymələr (`Daha çox istiqamət göstər`), modal başlığı (`Sorğun hazır!`) və footer AZ qalır.
2. **[P2] Praktik məlumat tərcüməsiz:** `Viza və giriş`, `Nağd pul və ödəniş` kimi accordion məzmunları RU-da AZ görünür.
3. **[P2] Valyuta/format qeydi yoxdur:** qiymətlər AZN, lakin xarici kart/nağd pul haqqında qeyd yox.
4. **[P3] Yaxşı tərəf:** `?lang=en|ru` və localStorage seçimi işləyir, `html lang` düzgün dəyişir, hreflang linkləri var.

## Test qeydləri

- Browser: `https://omarbabaiev.github.io/caspian-journeys/?review=board` — title, H1, 17 H2, 1 H1; console error yox; `swController=true`.
- Əvvəlcə localStorage-da `cj_lang=ru` olduğu üçün səhifə RU açıldı; AZ düyməsi ilə `html lang="az"` və H1 azərbaycanca oldu.
- `Şəki` filter → `1 marşrut tapıldı`; reset → `12 marşrut tapıldı`; `#load-places` → 7 əlavə kart göründü.
- Calc: `people=3, days=2, transfer=true` → `Təxmini: 310 – 410 AZN`.
- Builder: 3 gün / 1 maraq → eyni fəaliyyət 3 dəfə təkrarlandı.
- Booking boş submit → 3 sahə `.is-invalid`, status mesajı aria-live ilə göründü.
- Review + newsletter valid submit → localStorage `cj_reviews=1`, `cj_newsletter=1`, `cj_events=31`; admin panel bunları oxudu.
- Video modal və lightbox açıldı; lightbox `src=exp-cuisine.jpg`, caption `Azərbaycan süfrəsi`.
- Resource timing: 16 image entry, unik təxminən 2.6 MB ən böyük fayl `dest-shahdag.jpg` 652 KB; logo `226 KB`.
- Not verified: real mobil cihaz 390px viewport, offline xəritə, valid booking submit-nin `mailto:` navigasiyası və `.ics` faylının açılması, Telegram mesajının faktiki çatdırılması (endpoint boş).

---

## Düzəliş statusu (2026-11-26, son yoxlama)

Əsas iradların hamısı üzərində iş aparılıb; qalan iki maddə istifadəçi tərəfindən real məlumat/token təmin olunmadığı üçün **açıq və şəffaf demo rejimi** kimi saxlanılıb.

| # | İrad | Status | Sübut |
| --- | --- | --- | --- |
| 1 | RU/EN qismi tərcümə | ✅ Həll | 474 açarlı `js/i18n.js`; H1, kartlar, düymələr, FAQ, footer, modal, xəritə, hesablayıcı və qurucu EN/RU-da test olundu. |
| 2 | Placeholder əlaqə | ⚠️ Demo, etibarlı | Bütün əlaqə `js/config.js`-də; footer-də “Əlaqə məlumatları nümunədir”; doğrulanmamış məlumat JSON-LD-yə düşmür (`contactVerified: false`). |
| 3 | Telegram endpoint boş | ⚠️ Demo, etibarlı | Worker kodu hazır; endpoint boş olduqda şəbəkə sorğusu yoxdur və forma bunu açıq bildirir. |
| 4 | `.eyebrow` kontrastı | ✅ Həll | `--terracotta-ink: #a8512f`, AA. |
| 5 | Builder təkrarı | ✅ Həll | 3 gün üçün 9 fərqli fəaliyyət sətiri. |
| 6 | `mailto:` funnel / SLA | ✅ Həll | Avtomatik navigasiya yoxdur; modalda istifadəçi idarəli e-poçt düyməsi, `.ics`, honest SLA, `status: 'Yeni'`. |
| 7 | Video iddiası | ✅ Həll | “Hekayəni izlə” → foto hekayə, kamera ikonu, slayder terminologiyası. |
| 8 | Metadata | ✅ Həll | Absolute OG/Twitter/canonical/hreflang + `TravelAgency` JSON-LD. |
| 9 | Şəkil çəkisi | ✅ Həll | JPEG-lər kompress olundu, loqo 226 KB → ~24 KB, 600w/1000w WebP + `srcset`; lokal test WebP 200. |
| 10 | Modal focus trap | ✅ Həll | `inert` fon, Tab dövrü, Escape, focus modal daxilində başlayır və geri qayıdır. |

Reviewer detallarından əlavə həll olunanlar: çətinlik/məsafə/mövsüm badge-ləri, daxildir/daxil deyil qutusu, solo və uşaq qiyməti FAQ, qrup endirimi, qısa seçim düymələri, mobildə gecikməli WhatsApp, animasiya düyməsi, footer oxunaqlılığı, lead statusu, VIP avtomobil sinfi və şərtləri.

**Yenidən qiymət:** 8.5/10 — yalnız real əlaqə məlumatları və canlı Telegram kanalı əlavə olunduqda 9+/10 mümkündür. Texniki yoxlamalar: `html-validate`, bütün `node --check`, JSON/CSS yoxlaması, desktop + 390px iframe, EN/RU, filter/calculator/builder/booking/review/newsletter/admin və modal focus testləri keçdi; konsol xətası yoxdur.
