// Caspian Journeys — bütün landing page interaksiyaları

document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  /* ---------- localStorage köməkçiləri (demo admin panel üçün) ---------- */
  const readStore = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  };
  const writeStore = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* storage yoxdursa sus */ }
  };
  const logEvent = (name, detail = {}) => {
    const events = readStore('cj_events');
    events.push({ name, detail, at: new Date().toISOString() });
    writeStore('cj_events', events.slice(-200));
    if (window.CJNotify && window.CJNotify.event) window.CJNotify.event(name, detail);
  };

  /* ---------- İl və A/B test ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  let abVariant = 'a';
  try {
    abVariant = localStorage.getItem('cj_ab') || (Math.random() < 0.5 ? 'a' : 'b');
    localStorage.setItem('cj_ab', abVariant);
  } catch (_) { /* ignore */ }
  document.body.classList.add(`ab-variant-${abVariant}`);
  logEvent('ab_assign', { variant: abVariant });

  /* ---------- Scroll: header, WhatsApp, progress, hero paralaksı ---------- */
  const header = $('.site-header');
  const heroBg = $('.hero-bg');
  const waButton = $('.floating-wa');
  const backTop = $('#back-to-top');
  const progress = $('#scroll-progress');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-scrolled', y > 30);
    if (waButton && y > 260) waButton.classList.add('is-visible');
    if (backTop) backTop.classList.toggle('is-visible', y > 700);
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;

    if (heroBg && !reduceMotion && y < window.innerHeight * 1.2) {
      heroBg.style.transform = `translate3d(0, ${Math.min(y * 0.12, 110)}px, 0) scale(1.08)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: scrollBehavior }));
  }

  /* ---------- Mobil menyu ---------- */
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach((link) => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }));
  }

  /* ---------- Aktiv nav ---------- */
  const navLinks = nav ? $$('a[href^="#"]', nav) : [];
  const sections = navLinks.map((l) => $(l.getAttribute('href'))).filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealItems = $$('.reveal');
  $$('.destination-grid, .feature-grid, .review-grid, .experience-grid, .season-grid, .journal-grid, .video-grid, .guide-profiles').forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.style.transitionDelay = `${Math.min(index, 5) * 65}ms`;
    });
  });

  if (revealItems.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* Ekranda olan, lakin observer tərəfindən qaçırılmış elementlər üçün ehtiyat. */
  window.setTimeout(() => {
    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 1.2) {
        item.classList.add('is-visible');
      }
    });
  }, 900);

  /* ---------- Çox dilli keçid (AZ / EN / RU) ---------- */
  const I18N = {
    az: {
      nav_tours: 'Turlar', nav_dest: 'İstiqamətlər', nav_about: 'Haqqımızda', nav_reviews: 'Rəylər', nav_contact: 'Əlaqə',
      cta_plan: 'Turunu planla', cta_routes: 'Marşrutlara bax', cta_film: 'Filmi izlə',
      proof_guests: 'qonaq', proof_rating: 'rəy', proof_routes: 'marşrut',
      hero_title: 'Azərbaycanı sadəcə görmə. <em>Onu yaşa.</em>',
      hero_lead: 'Yerli bələdçilərlə hazırlanmış fərdi, rahat və unudulmaz səyahətlər.',
      dest_eyebrow: 'Populyar istiqamətlər', dest_title: 'Hər marşrutun öz hekayəsi var.',
      dest_lead: 'Bakının daş küçələrindən Qafqaz zirvələrinə — sənə uyğun gələn yeri seç, qalanını biz qurarıq.',
      map_eyebrow: 'Xəritə', map_title: 'Marşrutu özün qur.',
      about_eyebrow: 'Niyə Caspian Journeys', about_title: 'Sənin səyahətin, sənin qaydaların.',
      price_eyebrow: 'Qiymətlər', price_title: 'Aydın qiymət, gizli xərc yoxdur.',
      builder_eyebrow: 'Səyahət qurucu', builder_title: 'Öz marşrutunu yığ.',
      tours_eyebrow: 'Seçilmiş tur paketi', tours_title: '3 günlük Azərbaycan dadı.',
      exp_eyebrow: 'Təcrübələr', exp_title: 'Görmək yetməz, hiss etmək lazım.',
      season_eyebrow: 'Mövsümlər', season_title: 'Azərbaycan dörd dəfə gözəldir.',
      guides_eyebrow: 'Komanda', guides_title: 'Səni tanıyan bələdçi.',
      food_eyebrow: 'Dad rehberi', food_title: 'Azərbaycanı süfrədən tanı.',
      prep_eyebrow: 'Səyahətə hazırlıq', prep_title: 'Bilərsən, rahat olar.',
      reviews_eyebrow: 'Rəylər', reviews_title: 'Onlar artıq yolda idi.',
      faq_eyebrow: 'Suallar', faq_title: 'Tez-tez soruşulanlar.',
      story_eyebrow: 'Bizim hekayə', story_title: 'Xəritəni deyil, ölkəni sevdiririk.',
      journal_eyebrow: 'Səyahət jurnalı', journal_title: 'Yola çıxmadan əvvəl oxu.',
      video_eyebrow: 'Video hekayələr', video_title: 'Onlar öz ağızından danışır.',
      news_eyebrow: 'Bülleten', news_title: 'Yeni marşrutlardan ilk sən xəbər tut.',
      final_eyebrow: 'Başla', final_title: 'Növbəti hekayən Azərbaycanda başlasın.'
    },
    en: {
      nav_tours: 'Tours', nav_dest: 'Destinations', nav_about: 'About', nav_reviews: 'Reviews', nav_contact: 'Contact',
      cta_plan: 'Plan my tour', cta_routes: 'Explore routes', cta_film: 'Watch film',
      proof_guests: 'guests', proof_rating: 'rating', proof_routes: 'routes',
      hero_title: 'Do not just see Azerbaijan. <em>Live it.</em>',
      hero_lead: 'Personal, seamless and unforgettable journeys designed with local guides.',
      dest_eyebrow: 'Popular destinations', dest_title: 'Every route has its own story.',
      dest_lead: 'From the stone streets of Baku to Caucasus peaks — pick your place, we build the rest.',
      map_eyebrow: 'Map', map_title: 'Build your own route.',
      about_eyebrow: 'Why Caspian Journeys', about_title: 'Your journey, your rules.',
      price_eyebrow: 'Pricing', price_title: 'Clear prices, no hidden costs.',
      builder_eyebrow: 'Trip builder', builder_title: 'Assemble your route.',
      tours_eyebrow: 'Signature package', tours_title: '3 days of Azerbaijani flavour.',
      exp_eyebrow: 'Experiences', exp_title: 'Seeing is not enough — feel it.',
      season_eyebrow: 'Seasons', season_title: 'Azerbaijan is beautiful four times a year.',
      guides_eyebrow: 'Team', guides_title: 'A guide who knows you.',
      food_eyebrow: 'Food guide', food_title: 'Discover Azerbaijan through its table.',
      prep_eyebrow: 'Before you go', prep_title: 'Know it, relax.',
      reviews_eyebrow: 'Reviews', reviews_title: 'They have already been on the road.',
      faq_eyebrow: 'Questions', faq_title: 'Frequently asked questions.',
      story_eyebrow: 'Our story', story_title: 'We make you love the country, not the map.',
      journal_eyebrow: 'Travel journal', journal_title: 'Read before you set off.',
      video_eyebrow: 'Video stories', video_title: 'They tell it themselves.',
      news_eyebrow: 'Newsletter', news_title: 'Be first to hear about new routes.',
      final_eyebrow: 'Start', final_title: 'Let your next story begin in Azerbaijan.'
    },
    ru: {
      nav_tours: 'Туры', nav_dest: 'Направления', nav_about: 'О нас', nav_reviews: 'Отзывы', nav_contact: 'Контакты',
      cta_plan: 'Спланировать тур', cta_routes: 'Смотреть маршруты', cta_film: 'Смотреть фильм',
      proof_guests: 'гостей', proof_rating: 'оценка', proof_routes: 'маршрутов',
      hero_title: 'Не просто увидеть Азербайджан. <em>Прожить его.</em>',
      hero_lead: 'Личные, комфортные и незабываемые путешествия с местными гидами.',
      dest_eyebrow: 'Популярные направления', dest_title: 'У каждого маршрута своя история.',
      dest_lead: 'От каменных улиц Баку до вершин Кавказа — выберите место, остальное сделаем мы.',
      map_eyebrow: 'Карта', map_title: 'Соберите свой маршрут.',
      about_eyebrow: 'Почему Caspian Journeys', about_title: 'Ваше путешествие, ваши правила.',
      price_eyebrow: 'Цены', price_title: 'Ясная цена без скрытых доплат.',
      builder_eyebrow: 'Конструктор поездки', builder_title: 'Соберите свой маршрут.',
      tours_eyebrow: 'Фирменный пакет', tours_title: '3 дня вкуса Азербайджана.',
      exp_eyebrow: 'Впечатления', exp_title: 'Мало увидеть — нужно почувствовать.',
      season_eyebrow: 'Сезоны', season_title: 'Азербайджан прекрасен четырежды в год.',
      guides_eyebrow: 'Команда', guides_title: 'Гид, который вас понимает.',
      food_eyebrow: 'Гастрономия', food_title: 'Познайте Азербайджан через стол.',
      prep_eyebrow: 'Подготовка', prep_title: 'Знаете — значит спокойны.',
      reviews_eyebrow: 'Отзывы', reviews_title: 'Они уже в пути.',
      faq_eyebrow: 'Вопросы', faq_title: 'Частые вопросы.',
      story_eyebrow: 'Наша история', story_title: 'Мы учим любить страну, а не карту.',
      journal_eyebrow: 'Дневник путешествий', journal_title: 'Почитайте перед дорогой.',
      video_eyebrow: 'Видеоистории', video_title: 'Они рассказывают сами.',
      news_eyebrow: 'Рассылка', news_title: 'Узнавайте о новых маршрутах первыми.',
      final_eyebrow: 'Начните', final_title: 'Ваша следующая история начинается в Азербайджане.'
    }
  };

  const langButtons = $$('.lang-btn');
  const langNote = $('#lang-note');
  let langTimer;

  function applyLang(lang) {
    const pack = I18N[lang] || I18N.az;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      const value = pack[el.dataset.i18n];
      if (value == null) return;
      if (el.dataset.i18n === 'hero_title') el.innerHTML = value;
      else el.textContent = value;
    });
    try { localStorage.setItem('cj_lang', lang); } catch (_) { /* ignore */ }
    logEvent('lang_change', { lang });
  }

  let storedLang = 'az';
  try { storedLang = localStorage.getItem('cj_lang') || 'az'; } catch (_) { /* ignore */ }
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang && I18N[urlLang]) storedLang = urlLang;

  langButtons.forEach((b) => {
    const active = b.dataset.lang === storedLang;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  if (storedLang !== 'az') applyLang(storedLang);

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      langButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      applyLang(lang);
      if (langNote) {
        langNote.textContent = lang === 'az'
          ? 'Sayt Azərbaycan dilindədir.'
          : lang === 'en' ? 'Site is now in English.' : 'Сайт переключён на русский язык.';
        langNote.classList.add('is-shown');
      }
      window.clearTimeout(langTimer);
      langTimer = window.setTimeout(() => langNote && langNote.classList.remove('is-shown'), 2600);
      logEvent('lang_button', { lang });
    });
  });

  /* ---------- Tur filtri ---------- */
  const filterForm = $('#tour-filter');
  const filterSearch = $('#filter-search');
  const filterRegion = $('#filter-region');
  const filterDuration = $('#filter-duration');
  const filterInterest = $('#filter-interest');
  const filterCount = $('#filter-count');
  const placeCards = $$('#destination-grid .destination-card');

  function applyFilter() {
    if (!placeCards.length) return;
    const q = (filterSearch && filterSearch.value || '').trim().toLocaleLowerCase('az');
    const region = filterRegion && filterRegion.value || '';
    const duration = filterDuration && filterDuration.value || '';
    const interest = filterInterest && filterInterest.value || '';
    let visible = 0;

    placeCards.forEach((card) => {
      const text = card.textContent.toLocaleLowerCase('az');
      const ok = (!q || text.includes(q))
        && (!region || card.dataset.region === region)
        && (!duration || card.dataset.duration === duration)
        && (!interest || card.dataset.interest === interest);
      card.classList.toggle('is-filtered-out', !ok);
      if (ok) visible += 1;
    });

    if (filterCount) filterCount.textContent = `${visible} marşrut tapıldı`;
  }

  if (filterForm) {
    filterForm.addEventListener('input', applyFilter);
    filterForm.addEventListener('change', applyFilter);
    filterForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilter(); logEvent('tour_filter', { q: filterSearch && filterSearch.value }); });
    filterForm.addEventListener('reset', () => window.setTimeout(applyFilter, 0));
  }

  /* ---------- Daha çox istiqamət / rəy ---------- */
  const loadPlaces = $('#load-places');
  if (loadPlaces) {
    loadPlaces.addEventListener('click', () => {
      $$('.extra-place').forEach((card, i) => {
        card.style.transitionDelay = `${i * 50}ms`;
        card.classList.add('is-shown', 'is-visible');
      });
      loadPlaces.hidden = true;
      logEvent('load_places');
    });
  }

  const loadReviews = $('#load-reviews');
  if (loadReviews) {
    loadReviews.addEventListener('click', () => {
      $$('.extra-review').forEach((card) => card.classList.add('is-visible'));
      loadReviews.hidden = true;
      logEvent('load_reviews');
    });
  }

  /* ---------- Interaktiv xəritə ---------- */
  const mapData = {
    baki: { title: 'Bakı & İçərişəhər', desc: 'Qız qalası, dar daş küçələr, sahil bulvarı və yerli çay evləri.', time: '3 saat', people: '2–6 nəfər' },
    qobustan: { title: 'Qobustan & Palçıq Vulkanları', desc: 'Qaya təsvirləri, vulkanlar və yarım səhra işığı.', time: '5 saat', people: '2–8 nəfər' },
    sheki: { title: 'Şəki & Qəbələ', desc: 'Karvansaraylar, vitrajlar, meşə yolu və ev mətbəxi.', time: '2 gün', people: '2–6 nəfər' },
    shahdag: { title: 'Şahdağ & Quba', desc: 'Zirvə havası, meşə yolları və Quba bağları.', time: '1 gün', people: '2–6 nəfər' },
    lahc: { title: 'Lahıc & İsmayıllı', desc: 'Mis sənətkarlığı, daş küçələr və meşə qəhvəsi.', time: '1 gün', people: '2–6 nəfər' }
  };
  const mapDetail = $('#map-detail');

  function selectPlace(key, point) {
    const data = mapData[key];
    if (!data || !mapDetail) return;
    $$('.map-point').forEach((p) => p.classList.toggle('is-selected', p === point));
    $('h3', mapDetail).textContent = data.title;
    $('.map-detail-desc', mapDetail).textContent = data.desc;
    const meta = $$('.map-detail-meta span', mapDetail);
    if (meta[0]) meta[0].innerHTML = `<svg class="icon"><use href="#i-clock"/></svg> ${data.time}`;
    if (meta[1]) meta[1].innerHTML = `<svg class="icon"><use href="#i-users"/></svg> ${data.people}`;
    logEvent('map_select', { place: key });
  }

  $$('.map-point').forEach((point) => {
    point.addEventListener('click', () => selectPlace(point.dataset.place, point));
    point.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPlace(point.dataset.place, point);
      }
    });
  });

  /* ---------- Qiymət hesablayıcı ---------- */
  const calcPeople = $('#calc-people');
  const calcDays = $('#calc-days');
  const calcTransfer = $('#calc-transfer');
  const calcVip = $('#calc-vip');
  const calcOutput = $('#calc-output');

  function updatePrice() {
    if (!calcOutput) return;
    const people = Math.max(1, Math.min(12, Number(calcPeople && calcPeople.value || 1)));
    const days = Math.max(1, Math.min(10, Number(calcDays && calcDays.value || 1)));
    let base = people * days * 45;
    if (calcTransfer && calcTransfer.checked) base += people * 25;
    if (calcVip && calcVip.checked) base += people * 30;
    const min = Math.round(base * 0.9 / 10) * 10;
    const max = Math.round(base * 1.2 / 10) * 10;
    calcOutput.textContent = `Təxmini: ${min} – ${max} AZN`;
  }

  [calcPeople, calcDays, calcTransfer, calcVip].forEach((el) => {
    if (el) el.addEventListener('input', updatePrice);
  });
  const calcForm = $('#price-calculator');
  if (calcForm) calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updatePrice();
    logEvent('price_calculate', { output: calcOutput && calcOutput.textContent });
  });
  updatePrice();

  /* ---------- Marşrut qurucu ---------- */
  const builderForm = $('#builder-form');
  const builderDays = $('#builder-days');
  const builderDaysOutput = $('#builder-days-output');
  const builderOutput = $('#builder-output');
  const interestIdeas = {
    'şəhər tarixi': 'İçərişəhər, Qız qalası və yerli bazar gəzintisi',
    'təbiət': 'Qobustan petroqlifləri və palçıq vulkanları',
    'kulinariya': 'Ev mətbəxində plov, dolma və çay dərsi',
    'dağ': 'Quba kənd yolu və Şahdağ zirvə havası',
    'fotoqrafiya': 'Gün doğumu / batımı üçün xüsusi kadr nöqtələri'
  };

  function renderBuilder() {
    if (!builderOutput) return;
    const days = Number(builderDays && builderDays.value || 2);
    const chosen = $$('[data-interest]:checked').map((i) => i.value);
    const list = chosen.length ? chosen : ['şəhər tarixi'];

    const html = Array.from({ length: days }, (_, index) => {
      const first = interestIdeas[list[index % list.length]];
      const second = interestIdeas[list[(index + 1) % list.length]];
      return `<div class="builder-day"><strong>Gün ${String(index + 1).padStart(2, '0')}</strong><p>${first}. Ardınca: ${second}. Vaxt və transfer bələdçi tərəfindən tənzimlənir.</p></div>`;
    }).join('');

    builderOutput.innerHTML = html;
    if (builderDaysOutput) builderDaysOutput.textContent = String(days);
  }

  if (builderDays) builderDays.addEventListener('input', renderBuilder);
  if (builderForm) {
    builderForm.addEventListener('change', renderBuilder);
    builderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderBuilder();
      logEvent('builder_submit', { days: builderDays && builderDays.value, interests: $$('[data-interest]:checked').map(i => i.value) });
      builderOutput.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
    });
  }

  /* ---------- Modal köməkçisi ---------- */
  let lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
    logEvent('modal_open', { id: modal.id });
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$('[data-close-modal]').forEach((btn) => btn.addEventListener('click', (e) => {
    closeModal(e.target.closest('.modal'));
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.modal:not([hidden])').forEach(closeModal);
  });

  /* ---------- Foto lightbox ---------- */
  const lightbox = $('#lightbox-modal');
  $$('[data-lightbox]').forEach((card) => {
    card.addEventListener('click', () => {
      const img = $('#lightbox-img');
      const caption = $('#lightbox-caption');
      if (img) { img.src = card.dataset.lightbox; img.alt = card.dataset.caption || 'Səyahət fotoşəkili'; }
      if (caption) caption.textContent = card.dataset.caption || '';
      openModal(lightbox);
      logEvent('lightbox', { image: card.dataset.lightbox });
    });
  });

  /* ---------- Video hekayə (slider) ---------- */
  const videoModal = $('#video-modal');
  const videoStories = {
    baku: [
      { src: 'assets/images/dest-baku.jpg', title: 'Səhər: İçərişəhər', text: 'Daş küçələr, Qız qalası və ilk çay.' },
      { src: 'assets/images/dest-baku.jpg', title: 'Günorta: bazar', text: 'Ədviyyat, meyvə və yerli sahibkarlar.' },
      { src: 'assets/images/dest-baku.jpg', title: 'Axşam: Xəzər', text: 'Bulvar işıqları və şam yeməyi.' }
    ],
    gobustan: [
      { src: 'assets/images/dest-gobustan.jpg', title: 'Səhər: petroqliflər', text: 'Min illərin daş üzərindəki izləri.' },
      { src: 'assets/images/dest-gobustan.jpg', title: 'Günorta: vulkanlar', text: 'Yarım səhra işığında palçıq vulkanları.' },
      { src: 'assets/images/dest-gobustan.jpg', title: 'Axşam: Yanar dağ', text: 'Əbədi alov və gün batımı.' }
    ],
    sheki: [
      { src: 'assets/images/dest-sheki.jpg', title: 'Səhər: karvansaray', text: 'Vitrajlar və ipək yolu hekayəsi.' },
      { src: 'assets/images/dest-sheki.jpg', title: 'Günorta: Qəbələ', text: 'Meşə yolu və ev mətbəxi.' },
      { src: 'assets/images/dest-sheki.jpg', title: 'Axşam: çay', text: 'Şəki halvası və uzun söhbət.' }
    ],
    default: [
      { src: 'assets/images/dest-baku.jpg', title: 'Bakı', text: 'Daş küçələrdə başlayan bir gün.' },
      { src: 'assets/images/dest-gobustan.jpg', title: 'Qobustan', text: 'Vulkanlar və qaya təsvirləri.' },
      { src: 'assets/images/dest-sheki.jpg', title: 'Şəki', text: 'Karvansaraylar və vitrajlar.' },
      { src: 'assets/images/dest-shahdag.jpg', title: 'Şahdağ', text: 'Qafqaz zirvələrinin havası.' }
    ]
  };
  let storySlides = videoStories.default;
  let storyIndex = 0;
  let storyTimer = null;

  function renderStory() {
    const slide = storySlides[storyIndex];
    const img = $('#video-stage-img');
    const title = $('#video-stage-title');
    const text = $('#video-stage-text');
    const counter = $('#video-counter');
    if (img) { img.src = slide.src; img.alt = slide.title; }
    if (title) title.textContent = slide.title;
    if (text) text.textContent = slide.text;
    if (counter) counter.textContent = `${storyIndex + 1} / ${storySlides.length}`;
  }

  function moveStory(step) {
    storyIndex = (storyIndex + step + storySlides.length) % storySlides.length;
    renderStory();
  }

  function stopStory() {
    if (storyTimer) window.clearInterval(storyTimer);
    storyTimer = null;
  }

  $$('[data-open-video]').forEach((btn) => {
    btn.addEventListener('click', () => {
      storySlides = videoStories[btn.dataset.videoStory || 'default'] || videoStories.default;
      storyIndex = 0;
      renderStory();
      openModal(videoModal);
      stopStory();
      if (!reduceMotion) storyTimer = window.setInterval(() => moveStory(1), 3200);
    });
  });

  const videoNext = $('#video-next');
  const videoPrev = $('#video-prev');
  if (videoNext) videoNext.addEventListener('click', () => moveStory(1));
  if (videoPrev) videoPrev.addEventListener('click', () => moveStory(-1));
  if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target.closest('[data-close-modal]')) stopStory(); });

  /* ---------- Rəy formu və lokal rəylər ---------- */
  const reviewForm = $('#review-form');
  const reviewStatus = $('#review-status');
  const customReviewList = $('#custom-review-list');

  function renderCustomReviews() {
    if (!customReviewList) return;
    const reviews = readStore('cj_reviews');
    customReviewList.innerHTML = reviews.map((r) => `
      <article class="custom-review-item">
        <strong>${escapeHtml(r.name)}</strong>
        <span>${escapeHtml(r.country)} · ${escapeHtml(r.tour)}</span>
        <p>“${escapeHtml(r.text)}”</p>
      </article>`).join('');
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(reviewForm);
      const review = {
        name: String(data.get('name') || '').trim(),
        country: String(data.get('country') || '').trim(),
        tour: String(data.get('tour') || '').trim(),
        text: String(data.get('text') || '').trim()
      };
      if (!review.name || !review.country || !review.tour || !review.text) return;
      const reviews = readStore('cj_reviews');
      reviews.push(review);
      writeStore('cj_reviews', reviews);
      renderCustomReviews();
      if (reviewStatus) reviewStatus.textContent = 'Rəyin qeyd olundu. Təşəkkür edirik!';
      reviewForm.reset();
      if (window.CJNotify && window.CJNotify.send) window.CJNotify.send('review', review);
      logEvent('review_submit', { name: review.name });
    });
  }
  renderCustomReviews();

  /* ---------- Bülleten ---------- */
  const newsletterForm = $('#newsletter-form');
  const nlStatus = $('#nl-status');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = String(new FormData(newsletterForm).get('email') || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (nlStatus) nlStatus.textContent = 'Zəhmət olmasa, düzgün e-poçt ünvanı daxil et.';
        return;
      }
      const emails = readStore('cj_newsletter');
      if (!emails.includes(email)) emails.push(email);
      writeStore('cj_newsletter', emails);
      if (nlStatus) nlStatus.textContent = 'Abunə tamamlandı! Yeni marşrutları ilk sən alacaqsan.';
      newsletterForm.reset();
      if (window.CJNotify && window.CJNotify.send) window.CJNotify.send('newsletter', { email });
      logEvent('newsletter', { email });
    });
  }

  /* ---------- Paylaş və copy-link ---------- */
  const shareText = 'Azərbaycanı sadəcə görmə, onu yaşa — Caspian Journeys';

  $$('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0];
      const type = button.dataset.share;
      logEvent('share', { type });
      if (navigator.share && type === 'whatsapp') {
        try { await navigator.share({ title: 'Caspian Journeys', text: shareText, url }); return; } catch (_) { /* davam */ }
      }
      const targets = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
      };
      if (targets[type]) window.open(targets[type], '_blank', 'noopener,noreferrer');
    });
  });

  $$('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href.split('#')[0]);
        button.setAttribute('aria-label', 'Link kopyalandı');
        button.style.color = '#25d366';
        window.setTimeout(() => { button.style.color = ''; }, 1600);
      } catch (_) { /* clipboard icazəsi yoxdursa sus */ }
      logEvent('copy_link');
    });
  });

  /* ---------- CTA və form ---------- */
  const bookingForm = $('#booking');
  const interest = $('#interest');
  const nameInput = $('#name');
  const phoneInput = $('#phone');
  const formStatus = $('#form-status');
  const successModal = $('#success-modal');

  document.querySelectorAll('[data-route]').forEach((cta) => {
    cta.addEventListener('click', (event) => {
      if (!bookingForm) return;
      event.preventDefault();
      const route = cta.dataset.route;
      if (interest && route) {
        let option = Array.from(interest.options).find((o) => o.value === route);
        if (!option) { option = new Option(route, route); interest.add(option); }
        interest.value = route;
      }
      bookingForm.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      bookingForm.classList.remove('is-highlighted');
      void bookingForm.offsetWidth;
      bookingForm.classList.add('is-highlighted');
      window.setTimeout(() => nameInput && nameInput.focus({ preventScroll: true }), reduceMotion ? 0 : 520);
      window.setTimeout(() => bookingForm.classList.remove('is-highlighted'), 1400);
      logEvent('route_cta', { route });
    });
  });

  $$('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = $(`#${btn.dataset.scrollTo}`);
      if (!target) return;
      target.hidden = false;
      target.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
      const firstInput = $('input', target);
      if (firstInput) window.setTimeout(() => firstInput.focus({ preventScroll: true }), reduceMotion ? 0 : 400);
    });
  });

  function makeIcs(dateValue) {
    const start = dateValue ? new Date(`${dateValue}T09:00:00`) : new Date(Date.now() + 7 * 86400000);
    const end = new Date(start.getTime() + 3 * 86400000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Caspian Journeys//AZ',
      'BEGIN:VEVENT', `UID:${Date.now()}@caspianjourneys.az`,
      `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      'SUMMARY:Caspian Journeys — səyahət planı',
      'DESCRIPTION:Bələdçimiz sizinlə əlaqə saxlayacaq.',
      'LOCATION:Bakı, Azərbaycan', 'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      $$('.is-invalid', bookingForm).forEach((el) => el.classList.remove('is-invalid'));
      const required = $$('[required]', bookingForm);
      const invalid = required.filter((el) => !String(el.value || '').trim());
      if (phoneInput && phoneInput.value.trim() && !/^[+0-9 ()-]{8,20}$/.test(phoneInput.value.trim())) invalid.push(phoneInput);

      if (invalid.length) {
        invalid.forEach((el) => el.classList.add('is-invalid'));
        if (formStatus) formStatus.textContent = 'Zəhmət olmasa, qırmızı ilə qeyd olunan sahələri doldur.';
        invalid[0].focus();
        logEvent('form_validation_error', { fields: invalid.map(i => i.id) });
        return;
      }

      const submit = $('.form-submit', bookingForm);
      const originalLabel = submit ? submit.textContent : '';
      const data = new FormData(bookingForm);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const date = String(data.get('date') || '').trim();
      const people = String(data.get('people') || '').trim();
      const interestValue = String(data.get('interest') || '').trim();
      const budget = String(data.get('budget') || '').trim();

      const booking = { name, phone, date, people, interest: interestValue, budget, createdAt: new Date().toISOString() };
      const bookings = readStore('cj_bookings');
      bookings.push(booking);
      writeStore('cj_bookings', bookings);

      const subject = `Caspian Journeys — ${interestValue}`;
      const body = [
        `Ad: ${name}`,
        `WhatsApp / telefon: ${phone}`,
        `Tarix: ${date || 'hələ təyin edilməyib'}`,
        `Nəfər sayı: ${people}`,
        `Maraq dairəsi: ${interestValue}`,
        `Büdcə: ${budget}`,
        '',
        'Salam, mənim üçün səyahət planı hazırlaya bilərsinizmi?'
      ].join('\n');
      const mailto = `mailto:hello@caspianjourneys.az?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (submit) { submit.disabled = true; submit.textContent = 'Hazırlanır...'; }
      if (formStatus) formStatus.textContent = '';

      window.setTimeout(() => {
        window.location.href = mailto;
        if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
        if (formStatus) formStatus.textContent = 'Məktub e-poçt proqmanında açıldı. Göndərməyi unutma.';

        const icsLink = $('#ics-link');
        if (icsLink) {
          if (icsLink.dataset.url) URL.revokeObjectURL(icsLink.dataset.url);
          const url = URL.createObjectURL(new Blob([makeIcs(date)], { type: 'text/calendar;charset=utf-8' }));
          icsLink.href = url;
          icsLink.dataset.url = url;
        }
        openModal(successModal);
        if (window.CJNotify && window.CJNotify.send) window.CJNotify.send('booking', booking);
        logEvent('booking_submit', { interest: interestValue, people, budget });
      }, reduceMotion ? 0 : 450);
    });
  }

  /* ---------- Service Worker ---------- */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js?v=4').catch(() => { /* offline dəstək kritik deyil */ });
  }
});
