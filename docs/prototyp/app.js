(function () {
  'use strict';
  var ACCENT = '#0B6E69';
  var KEY = 'nyhetsanalys-prototyp-konto';
  var LIMIT = 5;
  var rootEl = document.getElementById('proto-root');
  var PAGE = rootEl ? rootEl.getAttribute('data-page') : 'idag';

  const S = {
      frankrike: [
        { label: '[1] Euronews, 24 okt', href: 'https://fr.euronews.com/2026/10/24/france-acte-ii-de-la-colere-sociale-la-manifestation-contre-le-congres-du-rn-debute-a-orle' },
        { label: '[2] Euronews, 23 okt', href: 'https://fr.euronews.com/2026/10/23/violences-en-france-voir-lultragauche-derriere-les-casseurs-semble-etre-une-erreur' },
        { label: '[3] Euronews pressöversikt', href: 'https://fr.euronews.com/2026/10/19/anatomie-dun-chaos-le-17-octobre-vu-par-la-presse-francaise' },
        { label: '[4] CNN, 17 okt', href: 'https://www.cnn.com/2026/10/17/world/live-news/france-protests-paris-intl' },
        { label: '[5] TV4 analys', href: 'https://www.tv4.se/artikel/2B8rnFoXMXVNtAg2NCUXsA/daerfoer-slutar-de-franska-protesterna-sa-ofta-i-vald' },
        { label: '[6] INSEE, statsskuld', href: 'https://www.insee.fr/fr/statistiques/9053525' },
        { label: '[7] SCB, offentlig skuld', href: 'https://www.scb.se/en/NR0108' },
        { label: '[8] EFN, räntan', href: 'https://efn.se/franska-10-aringen-nar-hogsta-nivan-pa-over-20-ar' },
        { label: '[9] Dagens PS', href: 'https://www.dagensps.se/varlden/konflikter/eu-granskar-utlandsk-paverkan-kring-upploppen-i-frankrike/' },
        { label: '[10] SVT direktrapport', href: 'https://www.svt.se/nyheter/utrikes/protesterna-i-europa' },
        { label: '[11] iFRAP', href: 'https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros' },
        { label: '[12] Kelwatt', href: 'https://www.kelwatt.fr/actu/baisse-petrole-prix-carburants-pompe-octobre-2026' },
        { label: '[13] INSEE, räkenskaper', href: 'https://www.insee.fr/fr/statistiques/9039499' },
        { label: '[14] Eurostat via Euronews', href: 'https://www.euronews.com/2026/10/21/eurozone-government-debt-climbs-to-888-of-gdp-as-italy-closes-in-on-greece' },
        { label: '[15] Le Figaro', href: 'https://www.lefigaro.fr/vox/societe/l-editorial-de-vincent-tremolet-de-villers-la-france-defiguree-20261018' },
        { label: '[16] LCP', href: 'https://lcp.fr/actualites/violences-du-17-octobre-marine-le-pen-et-edouard-philippe-accusent-lfi-jean-luc' }
      ],
      idag: [
        { label: '[1] Euronews, 24 okt', href: 'https://fr.euronews.com/2026/10/24/france-acte-ii-de-la-colere-sociale-la-manifestation-contre-le-congres-du-rn-debute-a-orle' },
        { label: '[2] Placera/Finwire', href: 'https://www.placera.se/telegram/talmannen-ger-sonderingsuppdraget-till-elisabeth-thand-ringqvist-c-uppdatering-20261019' },
        { label: '[3] EFN', href: 'https://efn.se/c-ledaren-vill-bilda-mittenregering-men-inte-leda-den' },
        { label: '[4] SVT', href: 'https://www.svt.se/nyheter/inrikes/last-mellan-c-och-v-infor-regeringsforhandlingar' },
        { label: '[5] SCB, KPI sep', href: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/priser-och-ekonomiska-tendenser/priser/konsumentprisindex-kpi/pong/statistiknyhet/konsumentprisindex-kpi-september-2026/' },
        { label: '[6] SVT direktrapport', href: 'https://www.svt.se/nyheter/utrikes/protesterna-i-europa' },
        { label: '[7] Reuters', href: 'https://www.internazionale.it/ultime-notizie-reuters/2026/10/18/milan-police-clash-with-protesters-on-second-day-of-unrest' },
        { label: '[8] Euronews, Abu Dhabi', href: 'https://fr.euronews.com/2026/10/23/la-russie-annonce-des-negociations-a-abou-dhabi-avec-lukraine-et-les-etats-unis' },
        { label: '[9] Euronews, Austen', href: 'https://fr.euronews.com/2026/10/23/la-tempete-austen-frappe-le-nord-ouest-de-la-france-161000-foyers-sans-electricite' }
      ]
    };
    const Q = {
      frankrike: [
        { q: 'Varför blev det just våld nu?', src: [1, 2, 4], a: 'Det finns ingen enkel förklaring, och flera kan gälla samtidigt. I rapporteringen syns främst fyra:\n\n• Ekonomisk press: dyrare bränsle, fallande köpkraft och en budget med åtstramningar på omkring 54 miljarder euro. Förklarar missnöjet, men inte varför det blev våld.\n• Opportunistisk plundring: åklagaren och forskare beskriver de gripna främst som plundrare utan politiska krav.\n• Organiserade extremgrupper: regeringen pekar ut ultravänstern, men hittills finns inga belägg som kopplar den till plundringen.\n• Polisens taktik: en polisforskare menar att tidiga ingripanden splittrade demonstrationstågen.\n\nSkolans villkor, fransk protestkultur och valrörelsen inför 2027 nämns också.' },
        { q: 'Hur stor är Frankrikes skuld jämfört med Sveriges?', src: [5, 6, 13, 7], a: 'Frankrikes statsskuld var 119,0 procent av BNP under andra kvartalet 2026. Sveriges låg på 35,1 procent 2025. Snittet i euroområdet var 88,8 procent, och EU:s gräns är 60 procent.\n\nDen franska tioårsräntan nådde 5 procent den 21 oktober, den högsta nivån sedan 2002. Det gör statens lån dyrare och är en del av bakgrunden till budgetens åtstramningar.' },
        { q: 'Vad är bekräftat och vad är osäkert?', src: [3, 1, 8], a: 'Bekräftat: det var de största protesterna på flera år, plundring och bränder följde på flera orter och stadshuset i Limoges brann.\n\nSiffror som skiljer sig: deltagarna den 17 oktober, 550 000 enligt inrikesministeriet och 800 000 enligt facket CGT.\n\nÄndras över tid: antalet gripna, nu omkring 2 500, och antalet skadade poliser.\n\nOmstritt: vilka som låg bakom plundringen.\n\nFalskt: en viral video som påstods visa våldet var filmad i Georgien 2024.' },
        { q: 'Hur skiljer sig mediernas bild?', src: [2, 14, 4], a: 'I de 8 artiklar vi analyserat handlar ungefär sju av tio omnämnanden om våldet eller om det politiska spelet inför valet. Orsakerna får omkring en tiondel och demonstranternas egna röster omkring sex procent.\n\nDe franska tidningarna skiljer sig tydligt: Le Figaros ledare ser våldet som ett angrepp på statens auktoritet, medan Libération granskar polisinsatsen. Ingen artikel i urvalet låter demonstranterna själva stå i centrum.' }
      ],
      idag: [
        { q: 'Vad är viktigast i dag?', src: [0, 1, 4], a: 'Tre saker sticker ut i dag:\n\n1. Frankrike: en andra protestdag pågår under hårda restriktioner, med 70 000 poliser och gendarmer i tjänst.\n2. Sverige: regeringsfrågan är olöst. C-ledaren Elisabeth Thand Ringqvist har ett sonderingsuppdrag från talmannen.\n3. Ekonomi: KPIF-inflationen steg till 1,5 procent i september, främst på grund av dyrare el och drivmedel.\n\nVill du gå djupare i något av dem?' },
        { q: 'Vad händer i regeringsfrågan?', src: [1, 2, 3], a: 'Sverige har ännu ingen ny regering efter valet. Den 19 oktober gav talmannen C-ledaren Elisabeth Thand Ringqvist ett sonderingsuppdrag. Hon säger att hon vill bidra till en mittenregering men inte själv bli statsminister, och att hon ska bjuda in alla partiledare.\n\nEn knut är relationen mellan C och V: efter valet sa C nej till organiserat samarbete med V, medan V sagt att partiet bara stödjer en regering det själv sitter i.\n\nÄmnet är en förhandsvisning och har ännu inte analyserats artikel för artikel.' },
        { q: 'Varför stiger inflationen?', src: [4], a: 'Enligt SCB steg KPIF-inflationen till 1,5 procent i september, från 0,7 procent i augusti. Den främsta förklaringen är dyrare el och drivmedel: på ett år har drivmedel blivit omkring 20 procent dyrare och el omkring 17 procent dyrare. Rensat för energi låg inflationen kvar på 0,5 procent.\n\nRiksbankens mål är 2 procent, så inflationen är fortfarande under målet.' },
        { q: 'Vilka källor använder ni?', src: [], a: 'Vi läser svenska medier och medier i landet där händelsen sker, plus myndigheter och statistikkällor. Samma TT-text i flera tidningar räknas som en källa, och varje påstående länkas.\n\nI prototypen är bara Frankrike-ämnet analyserat artikel för artikel, med 8 artiklar och 46 källor. Övriga ämnen är förhandsvisningar.' }
      ]
    };

  var LOGO_DARK = '<svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden="true"><path d="M5 24 L13 6 L21 24 Z" stroke="#101317" stroke-width="2" stroke-linejoin="round"></path><path d="M1 15 H9" stroke="#101317" stroke-width="2" stroke-linecap="round"></path><path d="M16.5 13 L29 8" stroke="#0B6E69" stroke-width="2" stroke-linecap="round"></path><path d="M17.6 16 H29" stroke="#0B6E69" stroke-width="2" stroke-linecap="round"></path><path d="M18.8 19 L29 24" stroke="#0B6E69" stroke-width="2" stroke-linecap="round"></path></svg>';
  var LOGO_LIGHT = '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true"><path d="M5 24 L13 6 L21 24 Z" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"></path><path d="M1 15 H9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"></path><path d="M16.5 13 L29 8" stroke="#1BAF7A" stroke-width="2" stroke-linecap="round"></path><path d="M17.6 16 H29" stroke="#1BAF7A" stroke-width="2" stroke-linecap="round"></path><path d="M18.8 19 L29 24" stroke="#1BAF7A" stroke-width="2" stroke-linecap="round"></path></svg>';
  var X_LIGHT = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4 L14 14 M14 4 L4 14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"></path></svg>';
  var X_DARK = '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4 L14 14 M14 4 L4 14" stroke="#101317" stroke-width="2" stroke-linecap="round"></path></svg>';
  var SEND = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10 H16 M11 5 L16 10 L11 15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  var CHECK = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3.5 9.5 L7 13 L14.5 5" stroke="#0B6E69" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  var MAIL = '<svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><rect x="6" y="12" width="40" height="28" rx="5" fill="#DDEFEC" stroke="#0B6E69" stroke-width="2.2"></rect><path d="M8 15 L26 29 L44 15" stroke="#0B6E69" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  function today() { return new Date().toISOString().slice(0, 10); }
  var acct = { account: 'Utan konto', used: 0 };
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && ['Utan konto', 'Gratiskonto', 'Premium'].indexOf(o.account) !== -1) {
        acct.account = o.account;
        acct.used = o.day === today() ? (Number(o.used) || 0) : 0;
      }
    }
  } catch (e) {}
  function saveAcct() {
    try { window.localStorage.setItem(KEY, JSON.stringify({ account: acct.account, used: acct.used, day: today() })); } catch (e) {}
  }

  var ui = { chatOpen: false, wantPremium: false };
  var page = { cat: 'alla', subscribed: false, depth: 1, following: false, reported: false };
  var chat = null;
  var login = null;

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  var TOPIC_TAGS = { fr: ['utrikes', 'politik', 'ekonomi'], reg: ['inrikes', 'politik'], inf: ['inrikes', 'ekonomi'], eu: ['utrikes'], ukr: ['utrikes', 'politik'], storm: ['utrikes'] };

  function flags() {
    var a = acct.account;
    return {
      isAnon: a === 'Utan konto', isMember: a !== 'Utan konto', isPremium: a === 'Premium', notPremium: a !== 'Premium',
      chatOpen: ui.chatOpen, chatClosed: !ui.chatOpen,
      subscribed: page.subscribed, notSubscribed: !page.subscribed,
      only30: page.depth === 0, show5: page.depth >= 1, showDeep: page.depth >= 2, notDeep: page.depth < 2,
      following: page.following, notFollowing: !page.following,
      reported: page.reported, notReported: !page.reported
    };
  }

  function render() {
    var f = flags();
    each('[data-if]', function (el) { el.hidden = !f[el.getAttribute('data-if')]; });
    each('[data-bind="limit"]', function (el) { el.textContent = String(LIMIT); });
    var prem = acct.account === 'Premium';
    each('[data-bind="badgeLabel"]', function (el) { el.textContent = prem ? 'Premium' : 'Gratiskonto'; });
    each('[data-badge]', function (el) { el.style.background = prem ? ACCENT : '#E6E9ED'; el.style.color = prem ? '#FFFFFF' : '#101317'; });
    each('[data-cat]', function (b) {
      var on = b.getAttribute('data-cat') === page.cat;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? '#101317' : '#FFFFFF';
      b.style.color = on ? '#FFFFFF' : '#101317';
      b.style.borderColor = on ? '#101317' : '#D5D9DE';
    });
    each('[data-topic]', function (a) {
      var t = TOPIC_TAGS[a.getAttribute('data-topic')] || [];
      a.hidden = !(page.cat === 'alla' || t.indexOf(page.cat) !== -1);
    });
    each('[data-depth]', function (b) {
      var on = Number(b.getAttribute('data-depth')) === page.depth;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? ACCENT : '#FFFFFF';
      b.style.color = on ? '#FFFFFF' : '#101317';
      var s = b.querySelector('[data-sub]');
      if (s) s.style.color = on ? '#FFFFFF' : '#5B6370';
    });
    if (chat) chat.refresh();
  }

  function setAccount(a) {
    acct.account = a;
    if (a === 'Utan konto') acct.used = 0;
    saveAcct();
    render();
    if (chat) chat.accountChanged();
  }
  function upgrade() {
    if (acct.account === 'Utan konto') { ui.wantPremium = true; openLogin('Skapa konto', 'premium'); }
    else setAccount('Premium');
  }

  var ACTIONS = {
    openChat: function () { openChat(PAGE === 'frankrike' ? 'frankrike' : 'idag', ''); },
    openChatFr: function () { openChat('frankrike', ''); },
    ask1: function () { openChat('idag', 'Vad är viktigast i dag?'); },
    ask2: function () { openChat('idag', 'Vad händer i regeringsfrågan?'); },
    ask3: function () { openChat('idag', 'Varför stiger inflationen?'); },
    openLoginHeader: function () { openLogin('Logga in', 'header'); },
    openLoginSignup: function () { openLogin('Skapa konto', 'header'); },
    upgrade: upgrade,
    logout: function () { setAccount('Utan konto'); },
    toggleFollow: function () { page.following = !page.following; render(); },
    go5: function () { page.depth = 1; render(); },
    goDeep: function () { page.depth = 2; render(); },
    report: function () { page.reported = true; render(); }
  };

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-action],[data-cat],[data-depth]') : null;
    if (!t) return;
    if (t.hasAttribute('data-cat')) { page.cat = t.getAttribute('data-cat'); render(); return; }
    if (t.hasAttribute('data-depth')) { page.depth = Number(t.getAttribute('data-depth')); render(); return; }
    var fn = ACTIONS[t.getAttribute('data-action')];
    if (fn) { e.preventDefault(); fn(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute('data-submit') === 'subscribe') { e.preventDefault(); page.subscribed = true; render(); }
  });

  /* Inloggning */
  function openLogin(mode, reason) {
    closeLogin(true);
    var opener = document.activeElement;
    var st = { mode: mode === 'Logga in' ? 'Logga in' : 'Skapa konto', sent: false, email: '' };
    var overlay = h('div', { class: 'pl-overlay' });
    var dialog = h('div', { class: 'pl-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'pl-rubrik' });
    overlay.appendChild(dialog);
    overlay.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLogin(); });
    function finish() {
      var plan = (ui.wantPremium || acct.account === 'Premium') ? 'Premium' : 'Gratiskonto';
      ui.wantPremium = false;
      closeLogin();
      setAccount(plan);
    }
    function draw() {
      dialog.textContent = '';
      dialog.appendChild(h('div', { class: 'pl-head' }, [
        h('span', { class: 'pl-brand', html: LOGO_DARK + '<span>[Produktnamn]</span>' }),
        h('button', { type: 'button', class: 'pl-x', 'aria-label': 'Stäng', html: X_DARK, onclick: function () { closeLogin(); } })
      ]));
      var tabs = h('div', { class: 'pl-tabs', role: 'group', 'aria-label': 'Välj' });
      ['Skapa konto', 'Logga in'].forEach(function (m) {
        tabs.appendChild(h('button', { type: 'button', class: 'pl-tab', 'aria-pressed': st.mode === m ? 'true' : 'false', text: m, onclick: function () { st.mode = m; st.sent = false; draw(); } }));
      });
      dialog.appendChild(tabs);
      if (!st.sent) {
        var signup = st.mode === 'Skapa konto';
        var sub = 'Följ ämnen och ställ egna frågor till AI:n.';
        if (reason === 'chat') sub = signup ? 'Skapa ett gratis konto för att ställa egna frågor till AI:n. De föreslagna frågorna är alltid fria.' : 'Logga in för att ställa egna frågor till AI:n.';
        if (reason === 'premium') sub = 'Skapa ett konto först, sedan startar Premium direkt.';
        dialog.appendChild(h('div', { class: 'pl-intro' }, [
          h('h2', { id: 'pl-rubrik', class: 'pl-h', text: signup ? 'Skapa ditt gratiskonto' : 'Välkommen tillbaka' }),
          h('p', { class: 'pl-p', text: sub })
        ]));
        if (signup) {
          var ul = h('ul', { class: 'pl-benefits' });
          [LIMIT + ' egna frågor till AI:n varje dag', 'Följ ämnen och se vad som är nytt sedan sist', 'Veckobrevet varje söndag'].forEach(function (t) {
            ul.appendChild(h('li', { html: CHECK }, [h('span', { text: t })]));
          });
          dialog.appendChild(ul);
        }
        dialog.appendChild(h('div', { class: 'pl-providers' }, [
          h('button', { type: 'button', class: 'pl-btn', text: 'Fortsätt med Google', onclick: finish }),
          h('button', { type: 'button', class: 'pl-btn', text: 'Fortsätt med Apple', onclick: finish })
        ]));
        dialog.appendChild(h('div', { class: 'pl-or', 'aria-hidden': 'true', html: '<span></span>eller med e-post<span></span>' }));
        var input = h('input', { id: 'pl-epost', type: 'email', required: true, placeholder: 'namn@exempel.se', autocomplete: 'email', class: 'pl-input' });
        input.value = st.email;
        input.addEventListener('input', function () { st.email = input.value; });
        dialog.appendChild(h('form', { class: 'pl-form', onsubmit: function (e) { e.preventDefault(); if (String(st.email).indexOf('@') > 0) { st.sent = true; draw(); } } }, [
          h('label', { for: 'pl-epost', class: 'pl-label', text: 'E-post' }),
          input,
          h('button', { type: 'submit', class: 'pl-btn pri', text: 'Skicka inloggningslänk' })
        ]));
      } else {
        dialog.appendChild(h('div', { class: 'pl-sent' }, [
          h('div', { html: MAIL }),
          h('h2', { id: 'pl-rubrik', class: 'pl-h', text: 'Kolla din inkorg' }),
          h('p', { class: 'pl-p' }, ['Vi har skickat en länk till ', h('strong', { text: st.email }), '. Klicka på den så är du inloggad. Inga lösenord behövs.']),
          h('button', { type: 'button', class: 'pl-btn pri', text: 'Öppna länken (prototyp)', onclick: finish }),
          h('button', { type: 'button', class: 'pl-link', text: 'Ändra e-postadress', onclick: function () { st.sent = false; draw(); } })
        ]));
      }
      dialog.appendChild(h('p', { class: 'pl-fine', text: 'Prototyp: inget konto skapas och ingen e-post skickas.' }));
    }
    draw();
    document.body.appendChild(overlay);
    login = { el: overlay, opener: opener };
    var first = dialog.querySelector('.pl-tab[aria-pressed="true"]') || dialog.querySelector('button');
    if (first) first.focus();
  }
  function closeLogin(silent) {
    if (!login) return;
    var o = login;
    login = null;
    if (o.el.parentNode) o.el.parentNode.removeChild(o.el);
    if (!silent) {
      ui.wantPremium = false;
      if (o.opener && o.opener.focus && document.body.contains(o.opener)) { try { o.opener.focus(); } catch (e) {} }
    }
  }

  /* Chatt */
  function norm(s) { return String(s || '').toLowerCase().replace(/[?!.\s]+/g, ' ').trim(); }

  function openChat(topic, q) {
    if (chat) chat.destroy();
    chat = makeChat(topic);
    ui.chatOpen = true;
    render();
    if (q) chat.ask(q);
    chat.focus();
  }
  function closeChat() {
    if (chat) { chat.destroy(); chat = null; }
    ui.chatOpen = false;
    render();
  }

  function makeChat(topic) {
    var key = topic === 'frankrike' ? 'frankrike' : 'idag';
    var sources = S[key];
    var sugg = Q[key];
    var msgs = [];
    var busy = false;
    var pendingQ = '';
    var timers = [];
    var panel = h('section', { class: 'pc', 'aria-label': 'Fråga om nyheten' });
    var head = h('div', { class: 'pc-head' }, [
      h('span', { class: 'pc-logo', html: LOGO_LIGHT }),
      h('div', { class: 'pc-head-txt' }, [
        h('h2', { class: 'pc-title', text: 'Fråga om nyheten' }),
        h('p', { class: 'pc-sub', text: (key === 'idag' ? 'Dagens nyheter' : 'Protesterna i Frankrike') + ' · förberedda svar' })
      ]),
      h('button', { type: 'button', class: 'pc-x', 'aria-label': 'Stäng chatten', html: X_LIGHT, onclick: closeChat })
    ]);
    var list = h('div', { class: 'pc-list' });
    var quota = h('div', { class: 'pc-quota' });
    var suggBox = h('div', { class: 'pc-sugg' });
    var input = h('input', { id: 'pc-fraga', type: 'text', class: 'pc-input', placeholder: 'Skriv en följdfråga …', autocomplete: 'off' });
    var send = h('button', { type: 'submit', class: 'pc-send', 'aria-label': 'Skicka frågan', html: SEND });
    var form = h('form', { class: 'pc-form', onsubmit: function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); } }, [
      h('label', { for: 'pc-fraga', class: 'pc-sr', text: 'Skriv en fråga' }), input, send
    ]);
    var foot = h('div', { class: 'pc-foot' }, [quota, suggBox, form,
      h('p', { class: 'pc-fine', text: 'Prototyp: föreslagna frågor har förberedda svar med källor. I den färdiga appen svarar AI:n även på egna frågor om ämnen vi har analyserat.' })]);
    panel.appendChild(head);
    panel.appendChild(list);
    panel.appendChild(foot);
    document.body.appendChild(panel);

    function botRow(kids) { return h('div', { class: 'pc-row' }, [h('div', { class: 'pc-b' }, kids)]); }
    function loginCard() {
      return h('div', { class: 'pc-card' }, [
        h('p', { class: 'pc-card-title', text: 'Skapa ett gratis konto för att ställa egna frågor' }),
        h('p', { class: 'pc-card-text', text: 'Du får ' + LIMIT + ' egna frågor per dag, och de föreslagna frågorna är alltid fria. Din fråga besvaras direkt när du har loggat in.' }),
        h('div', { class: 'pc-btns' }, [
          h('button', { type: 'button', class: 'pc-btn pri', text: 'Skapa gratis konto', onclick: function () { openLogin('Skapa konto', 'chat'); } }),
          h('button', { type: 'button', class: 'pc-btn', text: 'Logga in', onclick: function () { openLogin('Logga in', 'chat'); } })
        ])
      ]);
    }
    function premiumCard(title) {
      return h('div', { class: 'pc-prem' }, [
        h('p', { class: 'pc-prem-kicker', text: 'Premium' }),
        h('p', { class: 'pc-prem-title', text: title }),
        h('p', { class: 'pc-prem-text', text: 'Med Premium ställer du så många följdfrågor du vill, får djupdykningen i alla ämnen och notiser när ämnen du följer uppdateras.' }),
        h('button', { type: 'button', class: 'pc-btn light', text: 'Prova Premium', onclick: upgrade }),
        h('p', { class: 'pc-prem-fine', text: '[Pris] kr/mån. Gratisfrågorna fylls på i morgon.' })
      ]);
    }
    function drawQuota() {
      quota.textContent = '';
      var a = acct.account;
      if (a === 'Utan konto') {
        quota.appendChild(h('p', { class: 'pc-q' }, ['Föreslagna frågor är alltid fria. ',
          h('button', { type: 'button', class: 'pc-linkbtn', text: 'Logga in', onclick: function () { openLogin('Logga in', 'chat'); } }),
          ' för att ställa egna frågor.']));
      } else if (a === 'Gratiskonto') {
        var left = Math.max(0, LIMIT - acct.used);
        var fill = h('div', { class: 'pc-bar-fill' });
        fill.style.width = Math.round(left / LIMIT * 100) + '%';
        fill.style.background = left === 0 ? '#A84F06' : ACCENT;
        quota.appendChild(h('div', { class: 'pc-qrow' }, [
          h('div', { class: 'pc-bar', 'aria-hidden': 'true' }, [fill]),
          h('span', { class: 'pc-qtxt', text: left + ' av ' + LIMIT + ' egna frågor kvar i dag' })
        ]));
      } else {
        quota.appendChild(h('p', { class: 'pc-q' }, [h('span', { class: 'pc-pill', text: 'Premium' }), ' Fråga så mycket du vill']));
      }
    }
    function draw() {
      list.textContent = '';
      list.appendChild(botRow([h('p', { text: 'Hej! Fråga vad du vill om ' + (key === 'idag' ? 'dagens nyheter' : 'protesterna i Frankrike') + '. Jag svarar utifrån de källor vi har analyserat, visar vad som är osäkert och tar inte politisk ställning.' })]));
      msgs.forEach(function (m) {
        if (m.role === 'user') { list.appendChild(h('div', { class: 'pc-row u' }, [h('p', { class: 'pc-u', text: m.text })])); return; }
        var kids = [];
        if (m.pending) kids.push(h('p', { class: 'pc-think', html: '<span class="pc-dots" aria-hidden="true"><i></i><i></i><i></i></span>Tänker …' }));
        if (!m.pending && m.text) kids.push(h('p', { class: 'pc-text', text: m.text }));
        if (m.note) kids.push(h('p', { class: 'pc-note', text: m.note }));
        if (!m.pending && m.src && m.src.length) {
          var s = h('div', { class: 'pc-src' }, ['Källor: ']);
          m.src.forEach(function (i) { var x = sources[i]; if (x) s.appendChild(h('a', { href: x.href, target: '_blank', rel: 'noopener', text: x.label })); });
          kids.push(s);
        }
        if (m.kind === 'login') kids.push(loginCard());
        if (m.kind === 'premium') kids.push(premiumCard(m.title));
        list.appendChild(botRow(kids));
      });
      var asked = msgs.filter(function (m) { return m.role === 'user'; }).map(function (m) { return norm(m.text); });
      suggBox.textContent = '';
      sugg.filter(function (s) { return asked.indexOf(norm(s.q)) === -1; }).forEach(function (s) {
        suggBox.appendChild(h('button', { type: 'button', class: 'pc-chip', text: s.q, disabled: busy, onclick: function () { ask(s.q); } }));
      });
      suggBox.hidden = !suggBox.childNodes.length;
      send.disabled = busy;
      drawQuota();
      list.scrollTop = list.scrollHeight;
    }
    function push(m) { msgs.push(m); draw(); }
    function own(q) {
      var a = acct.account;
      if (a === 'Utan konto') { pendingQ = q; push({ role: 'assistant', kind: 'login' }); return; }
      if (a === 'Gratiskonto' && acct.used >= LIMIT) { pendingQ = q; push({ role: 'assistant', kind: 'premium', title: 'Du har använt dagens ' + LIMIT + ' gratisfrågor' }); return; }
      pendingQ = '';
      var last = a === 'Gratiskonto' && acct.used + 1 >= LIMIT;
      if (a === 'Gratiskonto') { acct.used += 1; saveAcct(); }
      push({ role: 'assistant', note: a === 'Gratiskonto'
        ? 'I prototypen svarar chatten bara på de föreslagna frågorna. Frågan räknas ändå, så att du ser hur gränsen fungerar.'
        : 'I prototypen svarar chatten bara på de föreslagna frågorna. I den färdiga appen svarar AI:n fritt om de ämnen vi har analyserat.' });
      if (last) push({ role: 'assistant', kind: 'premium', title: 'Det var dagens sista gratisfråga' });
    }
    function ask(raw) {
      var q = String(raw || '').trim();
      if (!q || busy) return;
      var hit = null;
      sugg.forEach(function (s) { if (!hit && norm(s.q) === norm(q)) hit = s; });
      push({ role: 'user', text: q });
      if (hit) {
        var m = { role: 'assistant', pending: true };
        busy = true;
        push(m);
        timers.push(setTimeout(function () { m.pending = false; m.text = hit.a; m.src = hit.src; busy = false; draw(); }, 650));
        return;
      }
      own(q);
    }
    draw();
    return {
      ask: ask,
      refresh: drawQuota,
      accountChanged: function () {
        draw();
        if (pendingQ && acct.account !== 'Utan konto') { var q = pendingQ; pendingQ = ''; own(q); }
      },
      focus: function () { try { input.focus(); } catch (e) {} },
      destroy: function () { timers.forEach(clearTimeout); if (panel.parentNode) panel.parentNode.removeChild(panel); }
    };
  }

  render();
})();
