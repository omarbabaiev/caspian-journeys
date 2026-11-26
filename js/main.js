// Caspian Journeys — bütün landing page interaksiyaları

document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollBehavior = reduceMotion ? 'auto' : 'smooth';

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
  let waReady = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-scrolled', y > 30);
    if (waButton) waButton.classList.toggle('is-visible', y > 260 && waReady);
    if (backTop) backTop.classList.toggle('is-visible', y > 700);
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;

    if (heroBg && !motionDisabled() && y < window.innerHeight * 1.2) {
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

  /* Üzən WhatsApp: yalnız mobildə (CSS) və 2 saniyə gecikmə ilə görünür. */
  window.setTimeout(() => { waReady = true; onScroll(); }, 2000);

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

  /* ---------- Aktiv nav: menyu sırası ilə eyni ardıcıllıq ---------- */
  const navLinks = nav ? $$('a[href^="#"]', nav) : [];
  const navSections = navLinks
    .map((link) => ({ link, section: $(link.getAttribute('href')) }))
    .filter((item) => item.section)
    .sort((a, b) => (a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  function updateActiveNav() {
    if (!navSections.length) return;
    const marker = window.scrollY + Math.min(160, window.innerHeight * 0.22);
    let active = navSections[0];
    navSections.forEach((item) => {
      const top = item.section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) active = item;
    });
    navSections.forEach((item) => {
      item.link.classList.toggle('is-active', item === active);
      if (item === active) item.link.setAttribute('aria-current', 'true');
      else item.link.removeAttribute('aria-current');
    });
  }

  if (navSections.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();
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
  const I18 = window.CJI18n;
  const T = (text) => (I18 ? I18.T(text) : String(text == null ? '' : text));
  const langButtons = $$('.lang-btn');
  const langNote = $('#lang-note');
  const motionToggle = $('#motion-toggle');
  const calcNote = $('#calc-note');
  let langTimer;
  let langInitialized = false;

  const LANG_NOTES = {
    az: 'Sayt Azərbaycan dilindədir.',
    en: 'Site is now in English.',
    ru: 'Сайт переключён на русский язык.'
  };

  /* Statik mətnləri CJI18n tərcümə edir. Dəyişən mətnlər data-no-i18n ilə
     qeyd olunub və dil dəyişəndə aşağıdakı funksiyalarla yenidən çizilir. */
  function refreshDynamic() {
    if (!langInitialized) return;
    if (activeMapKey) selectPlace(activeMapKey, activeMapPoint, true);
    updatePrice();
    renderBuilder();
    renderStory();
    applyFilter();
    $$('[data-i18n-key]').forEach((el) => { el.textContent = T(el.dataset.i18nKey); });
    if (successModal && !successModal.hidden) applySuccessText();
    if (lightbox && !lightbox.hidden && lightbox.dataset.captionKey) {
      const caption = $('#lightbox-caption');
      const image = $('#lightbox-img');
      if (caption) caption.textContent = T(lightbox.dataset.captionKey);
      if (image) image.alt = T(lightbox.dataset.captionKey);
    }
    applyMotionLabel();
    applyContacts();
    applyNotifyStatus();
    applyStructuredData();
  }

  function setLang(lang, announce) {
    const target = ['az', 'en', 'ru'].indexOf(lang) >= 0 ? lang : 'az';
    langButtons.forEach((b) => {
      const active = b.dataset.lang === target;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    if (I18) I18.set(target);
    else document.documentElement.lang = target;
    try { localStorage.setItem('cj_lang', target); } catch (_) { /* ignore */ }
    logEvent('lang_change', { lang: target });
    if (announce && langNote) {
      langNote.textContent = T(LANG_NOTES[target]);
      langNote.classList.add('is-shown');
      window.clearTimeout(langTimer);
      langTimer = window.setTimeout(() => langNote.classList.remove('is-shown'), 2600);
    }
    return target;
  }

  if (I18) window.addEventListener('cj:langchange', refreshDynamic);

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      setLang(lang, true);
      logEvent('lang_button', { lang });
    });
  });

  /* Mərkəzləşdirilmiş əlaqə məlumatları — js/config.js */
  function applyContacts() {
    const cfg = window.CJ_CONFIG || {};
    const setHref = (selector, value) => {
      if (!value) return;
      $$(selector).forEach((el) => el.setAttribute('href', value));
    };
    if (cfg.email) setHref('[data-contact="email"]', `mailto:${cfg.email}`);
    if (cfg.phone) setHref('[data-contact="phone"]', `tel:${String(cfg.phone).replace(/[^\d+]/g, '')}`);
    if (cfg.whatsapp) setHref('[data-contact="whatsapp"]', cfg.whatsapp);
    if (cfg.instagram) setHref('[data-contact="instagram"]', cfg.instagram);
    if (cfg.tiktok) setHref('[data-contact="tiktok"]', cfg.tiktok);
    const emailText = $('[data-contact-text="email"]');
    if (emailText && cfg.email) emailText.textContent = cfg.email;
    const phoneText = $('[data-contact-text="phone"]');
    if (phoneText && cfg.phoneDisplay) phoneText.textContent = cfg.phoneDisplay;
    const phoneField = $('#phone');
    if (phoneField && cfg.phoneDisplay) phoneField.placeholder = cfg.phoneDisplay;
    const mailFallback = $('#mail-fallback');
    if (mailFallback && cfg.email) mailFallback.href = `mailto:${cfg.email}`;
    const hoursText = $('[data-contact-text="hours"]');
    if (hoursText && cfg.hours) hoursText.textContent = T(cfg.hours);
  }

  function applyNotifyStatus() {
    const note = $('#notify-note');
    if (!note) return;
    const live = !!(window.CJNotify && window.CJNotify.enabled);
    const key = live
      ? 'Bildiriş kanalı aktivdir — sorğular komandaya çatdırılır.'
      : 'Bildiriş kanalı demo rejimindədir; sorğular bu cihazda saxlanılır.';
    note.dataset.i18nKey = key;
    note.textContent = T(key);
    note.classList.toggle('is-live', live);
  }

  /* JSON-LD only advertises contact details once they are marked as verified. */
  function applyStructuredData() {
    const script = $('script[type="application/ld+json"]');
    const cfg = window.CJ_CONFIG;
    if (!script || !cfg) return;
    try {
      const data = JSON.parse(script.textContent);
      ['email', 'telephone', 'sameAs', 'openingHours'].forEach((key) => { delete data[key]; });
      if (cfg.contactVerified === true) {
        if (cfg.email) data.email = cfg.email;
        if (cfg.phone) data.telephone = String(cfg.phone).replace(/[^\d+]/g, '');
        if (cfg.hours) data.openingHours = 'Mo-Su 09:00-21:00';
        const sameAs = [cfg.instagram, cfg.tiktok].filter(Boolean);
        if (sameAs.length) data.sameAs = sameAs;
      }
      script.textContent = JSON.stringify(data, null, 2);
    } catch (_) { /* schema is optional */ }
  }

  /* İstifadəçinin öz animasiya seçimi (OS preference ilə yanaşı) */
  function motionDisabled() {
    return reduceMotion || document.body.classList.contains('no-motion');
  }
  function applyMotionLabel() {
    if (!motionToggle) return;
    const off = document.body.classList.contains('no-motion');
    motionToggle.textContent = T(off ? 'Animasiyaları aç' : 'Animasiyaları söndür');
    motionToggle.setAttribute('aria-pressed', String(off));
  }
  try {
    if (localStorage.getItem('cj_motion') === 'off') document.body.classList.add('no-motion');
  } catch (_) { /* ignore */ }
  applyMotionLabel();
  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      const off = document.body.classList.toggle('no-motion');
      scrollBehavior = motionDisabled() ? 'auto' : 'smooth';
      try { localStorage.setItem('cj_motion', off ? 'off' : 'on'); } catch (_) { /* ignore */ }
      applyMotionLabel();
      onScroll();
      logEvent('motion_toggle', { off });
    });
  }

  function setStatus(el, key) {
    if (!el) return;
    el.dataset.i18nKey = key;
    el.textContent = T(key);
  }

  /* ---------- Tur filtri ---------- */
  const filterForm = $('#tour-filter');
  const filterSearch = $('#filter-search');
  const filterRegion = $('#filter-region');
  const filterDuration = $('#filter-duration');
  const filterInterest = $('#filter-interest');
  const filterCount = $('#filter-count');
  const placeCards = $$('#destination-grid .destination-card');
  /* Axtarış hər dil işləyir: orijinal AZ mətn saxlanılır, cari tərcümə ilə birlikdə axtarılır. */
  placeCards.forEach((card) => { card.dataset.searchText = card.textContent.toLocaleLowerCase('az'); });

  function applyFilter() {
    if (!placeCards.length) return;
    const q = (filterSearch && filterSearch.value || '').trim().toLocaleLowerCase('az');
    const region = filterRegion && filterRegion.value || '';
    const duration = filterDuration && filterDuration.value || '';
    const interest = filterInterest && filterInterest.value || '';
    let visible = 0;

    placeCards.forEach((card) => {
      const text = `${card.dataset.searchText || ''} ${card.textContent.toLocaleLowerCase('az')}`;
      const ok = (!q || text.includes(q))
        && (!region || card.dataset.region === region)
        && (!duration || card.dataset.duration === duration)
        && (!interest || card.dataset.interest === interest);
      card.classList.toggle('is-filtered-out', !ok);
      if (ok) visible += 1;
    });

    if (filterCount) {
      const lang = I18 ? I18.current : 'az';
      let label;
      if (lang === 'ru') {
        const mod10 = visible % 10;
        const mod100 = visible % 100;
        label = mod10 === 1 && mod100 !== 11 ? 'маршрут найден'
          : (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) ? 'маршрута найдено'
          : 'маршрутов найдено';
      } else if (lang === 'en') {
        label = `route${visible === 1 ? '' : 's'} found`;
      } else {
        label = 'marşrut tapıldı';
      }
      filterCount.textContent = `${visible} ${label}`;
    }
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
    abseron: { title: 'Abşeron kəndləri', desc: 'Üzüm bağları, kənd evləri və çay süfrəsi.', time: '1 gün', people: '2–6 nəfər' },
    xezer: { title: 'Xəzər sahili', desc: 'Bulvar, marina və gün batımı.', time: '3 saat', people: '2–6 nəfər' },
    yanardag: { title: 'Yanar Dağ', desc: 'Yeraltı qazın yaratdığı əbədi alov və gün batımı.', time: '2 saat', people: '2–6 nəfər' }
  };
  const mapDetail = $('#map-detail');
  let activeMapKey = null;
  let activeMapPoint = null;

  function selectPlace(key, point, silent) {
    const data = mapData[key];
    if (!data || !mapDetail) return;
    activeMapKey = key;
    activeMapPoint = point || activeMapPoint;
    $$('.map-point').forEach((p) => p.classList.toggle('is-selected', p === activeMapPoint));
    $('h3', mapDetail).textContent = T(data.title);
    $('.map-detail-desc', mapDetail).textContent = T(data.desc);
    const meta = $$('.map-detail-meta span', mapDetail);
    if (meta[0]) meta[0].innerHTML = `<svg class="icon"><use href="#i-clock"/></svg> ${T(data.time)}`;
    if (meta[1]) meta[1].innerHTML = `<svg class="icon"><use href="#i-users"/></svg> ${T(data.people)}`;
    if (!silent) logEvent('map_select', { place: key });
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
    const groupDiscount = people >= 4;
    if (groupDiscount) base *= 0.9;
    const min = Math.round(base * 0.9 / 10) * 10;
    const max = Math.round(base * 1.2 / 10) * 10;
    calcOutput.textContent = `${T('Təxmini:')} ${min} – ${max} AZN`;
    if (calcNote) calcNote.textContent = T(groupDiscount
      ? 'Qrup endirimi tətbiq olundu (10%).'
      : '4+ nəfər üçün 10% qrup endirimi avtomatik tətbiq olunur.');
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
    'sahil': 'Xəzər bulvarı və gün batımı kadrları',
    'fotoqrafiya': 'Gün doğumu / batımı üçün xüsusi kadr nöqtələri'
  };
  const builderSlots = ['Səhər', 'Günorta', 'Axşam'];

  function renderBuilder() {
    if (!builderOutput) return;
    const days = Number(builderDays && builderDays.value || 2);
    const chosen = $$('[data-interest]:checked').map((i) => i.value);
    /* Seçilmiş maraqlar öndə gəlir, lakin heç bir gün eyni fəaliyyəti təkrarlamır. */
    const pool = Array.from(new Set(chosen.concat(Object.keys(interestIdeas))));
    const html = Array.from({ length: days }, (_, dayIndex) => {
      const items = builderSlots.map((slot, slotIndex) => {
        const key = pool[(dayIndex * builderSlots.length + slotIndex) % pool.length];
        return `<p><strong>${T(slot)}:</strong> ${T(interestIdeas[key])}</p>`;
      }).join('');
      return `<div class="builder-day"><strong>${T('Gün')} ${String(dayIndex + 1).padStart(2, '0')}</strong>${items}<p class="calc-note">${T('Vaxt və transfer bələdçi tərəfindən tənzimlənir.')}</p></div>`;
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

  /* ---------- Modal köməkçisi: focus trap + geri qayıdış ---------- */
  let lastFocused = null;
  let activeModal = null;

  function modalFocusables(modal) {
    return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter((el) => el.getClientRects().length > 0);
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    activeModal = modal;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const header = $('.site-header');
    const footer = $('.site-footer');
    if (header) header.inert = true;
    if (footer) footer.inert = true;
    const closeBtn = $('.modal-close', modal) || modalFocusables(modal)[0];
    if (closeBtn) closeBtn.focus();
    logEvent('modal_open', { id: modal.id });
  }

  function closeModal(modal) {
    if (!modal) return;
    if (modal === videoModal) stopStory();
    modal.hidden = true;
    document.body.style.overflow = '';
    const header = $('.site-header');
    const footer = $('.site-footer');
    if (header) header.inert = false;
    if (footer) footer.inert = false;
    if (activeModal === modal) activeModal = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$('[data-close-modal]').forEach((btn) => btn.addEventListener('click', (e) => {
    closeModal(e.target.closest('.modal'));
  }));

  document.addEventListener('keydown', (e) => {
    if (!activeModal) return;
    if (e.key === 'Escape') { closeModal(activeModal); return; }
    if (e.key !== 'Tab') return;
    const items = modalFocusables(activeModal);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const outside = !activeModal.contains(document.activeElement);
    if (e.shiftKey && (outside || document.activeElement === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (outside || document.activeElement === last)) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------- Foto lightbox ---------- */
  const lightbox = $('#lightbox-modal');
  $$('[data-lightbox]').forEach((card) => {
    card.addEventListener('click', () => {
      const img = $('#lightbox-img');
      const caption = $('#lightbox-caption');
      const key = card.dataset.caption || 'Səyahət fotoşəkili';
      if (img) { img.src = card.dataset.lightbox; img.alt = T(key); }
      if (caption) caption.textContent = T(key);
      if (lightbox) lightbox.dataset.captionKey = key;
      openModal(lightbox);
      logEvent('lightbox', { image: card.dataset.lightbox });
    });
  });

  /* ---------- Foto hekayə (slider) ---------- */
  const videoModal = $('#video-modal');
  const storySlidesData = {
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
    abseron: [
      { src: 'assets/images/dest-baku.jpg', title: 'Səhər: kənd yolu', text: 'Üzüm bağları və ilk çay.' },
      { src: 'assets/images/dest-baku.jpg', title: 'Günorta: ev mətbəxi', text: 'Plov, çörək və uzun söhbət.' },
      { src: 'assets/images/dest-baku.jpg', title: 'Axşam: Xəzər', text: 'Sahil işıqları və şam yeməyi.' }
    ],
    default: [
      { src: 'assets/images/dest-baku.jpg', title: 'Bakı', text: 'Daş küçələrdə başlayan bir gün.' },
      { src: 'assets/images/dest-gobustan.jpg', title: 'Qobustan', text: 'Vulkanlar və qaya təsvirləri.' },
      { src: 'assets/images/dest-baku.jpg', title: 'Abşeron', text: 'Kənd evləri və üzüm bağları.' },
      { src: 'assets/images/dest-gobustan.jpg', title: 'Yanar Dağ', text: 'Əbədi alov və gün batımı.' }
    ]
  };
  let storySlides = storySlidesData.default;
  let storyIndex = 0;
  let storyTimer = null;

  function renderStory() {
    const slide = storySlides[storyIndex];
    const img = $('#video-stage-img');
    const title = $('#video-stage-title');
    const text = $('#video-stage-text');
    const counter = $('#video-counter');
    if (img) { img.src = slide.src; img.alt = T(slide.title); }
    if (title) title.textContent = T(slide.title);
    if (text) text.textContent = T(slide.text);
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
      storySlides = storySlidesData[btn.dataset.videoStory || 'default'] || storySlidesData.default;
      storyIndex = 0;
      renderStory();
      openModal(videoModal);
      stopStory();
      if (!motionDisabled()) storyTimer = window.setInterval(() => moveStory(1), 3200);
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
      setStatus(reviewStatus, 'Rəyin qeyd olundu. Təşəkkür edirik!');
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
        setStatus(nlStatus, 'Zəhmət olmasa, düzgün e-poçt ünvanı daxil et.');
        return;
      }
      const emails = readStore('cj_newsletter');
      if (!emails.includes(email)) emails.push(email);
      writeStore('cj_newsletter', emails);
      setStatus(nlStatus, 'Abunə tamamlandı! Yeni marşrutları ilk sən alacaqsan.');
      newsletterForm.reset();
      if (window.CJNotify && window.CJNotify.send) window.CJNotify.send('newsletter', { email });
      logEvent('newsletter', { email });
    });
  }

  /* ---------- Paylaş və copy-link ---------- */
  const shareText = () => T('Bakını sadəcə görmə, onu yaşa — Caspian Journeys');

  $$('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0];
      const type = button.dataset.share;
      logEvent('share', { type });
      if (navigator.share && type === 'whatsapp') {
        try { await navigator.share({ title: 'Caspian Journeys', text: shareText(), url }); return; } catch (_) { /* davam */ }
      }
      const targets = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText()} ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(url)}`
      };
      if (targets[type]) window.open(targets[type], '_blank', 'noopener,noreferrer');
    });
  });

  $$('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href.split('#')[0]);
        button.setAttribute('aria-label', T('Link kopyalandı'));
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
      window.setTimeout(() => nameInput && nameInput.focus({ preventScroll: true }), motionDisabled() ? 0 : 520);
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
      if (firstInput) window.setTimeout(() => firstInput.focus({ preventScroll: true }), motionDisabled() ? 0 : 400);
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
      `SUMMARY:${T('Caspian Journeys — səyahət planı')}`,
      `DESCRIPTION:${T('Bələdçimiz sizinlə əlaqə saxlayacaq.')}`,
      'LOCATION:Bakı, Azərbaycan', 'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
  }

  function applySuccessText() {
    if (!successModal) return;
    const live = !!(window.CJNotify && window.CJNotify.enabled);
    const title = $('#success-title');
    const text = $('#success-text');
    if (title) title.textContent = T(live ? 'Sorğun qəbul edildi' : 'Sorğun qeyd olundu');
    if (text) text.textContent = T(live
      ? 'Sorğun qəbul edildi və komandamıza çatdı. Bələdçimiz 15 dəqiqə ərzində əlaqə saxlayacaq.'
      : 'Sorğu bu cihazda saxlanıldı. Canlı kanal qoşulana qədər məktubu e-poçtla göndər; göndərdikdən sonra 15 dəqiqə ərzində yazacağıq.');
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
        setStatus(formStatus, 'Zəhmət olmasa, qırmızı ilə qeyd olunan sahələri doldur.');
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
      const notifyLive = !!(window.CJNotify && window.CJNotify.enabled);

      /* Admin panel üçün status əlavə olunur. */
      const booking = { name, phone, date, people, interest: interestValue, budget, status: 'Yeni', createdAt: new Date().toISOString() };
      const bookings = readStore('cj_bookings');
      bookings.push(booking);
      writeStore('cj_bookings', bookings);

      const cfg = window.CJ_CONFIG || {};
      const email = cfg.email || 'hello@caspianjourneys.az';
      const subject = `Caspian Journeys — ${T(interestValue)}`;
      const body = [
        `${T('Ad:')} ${name}`,
        `${T('WhatsApp / telefon:')} ${phone}`,
        `${T('Tarix:')} ${date || T('hələ təyin edilməyib')}`,
        `${T('Nəfər sayı:')} ${people}`,
        `${T('Maraq dairəsi:')} ${T(interestValue)}`,
        `${T('Büdcə:')} ${budget}`,
        '',
        T('Salam, mənim üçün səyahət planı hazırlaya bilərsinizmi?')
      ].join('\n');
      const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (submit) { submit.disabled = true; submit.textContent = T('Hazırlanır...'); }
      if (formStatus) formStatus.textContent = '';

      window.setTimeout(() => {
        if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
        setStatus(formStatus, notifyLive
          ? 'Sorğun qəbul edildi və komandamıza çatdı. Bələdçimiz 15 dəqiqə ərzində əlaqə saxlayacaq.'
          : 'Sorğu qeyd olundu. Məktubu e-poçt proqramında açmaq üçün modaldakı düyməyə bas.');

        const mailFallback = $('#mail-fallback');
        if (mailFallback) mailFallback.href = mailto;

        const icsLink = $('#ics-link');
        if (icsLink) {
          if (icsLink.dataset.url) URL.revokeObjectURL(icsLink.dataset.url);
          const url = URL.createObjectURL(new Blob([makeIcs(date)], { type: 'text/calendar;charset=utf-8' }));
          icsLink.href = url;
          icsLink.dataset.url = url;
        }
        applySuccessText();
        openModal(successModal);
        if (window.CJNotify && window.CJNotify.send) window.CJNotify.send('booking', booking);
        logEvent('booking_submit', { interest: interestValue, people, budget, channel: notifyLive ? 'worker' : 'demo' });
      }, motionDisabled() ? 0 : 450);
    });
  }

  /* ---------- Dil, əlaqə və service worker ---------- */
  let initialLang = 'az';
  try { initialLang = localStorage.getItem('cj_lang') || 'az'; } catch (_) { /* ignore */ }
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (['az', 'en', 'ru'].indexOf(urlLang) >= 0) initialLang = urlLang;
  const initialMapPoint = $('.map-point[data-place="baki"]');
  if (initialMapPoint) selectPlace('baki', initialMapPoint, true);
  langInitialized = true;
  setLang(initialLang, false);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js?v=8').catch(() => { /* offline dəstək kritik deyil */ });
  }
});
