/* Pixel Studios · 200-profile fictional library and niche-specific preview renderer */
(function () {
  'use strict';
  var DATA = window.PSProfileTemplates && window.PSProfileTemplates.profiles;
  var FAMILY_DATA = window.PSProfileTemplates && window.PSProfileTemplates.families || {};
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var palette = {
    sand:'#a9845d', ink:'#00bfb8', cobalt:'#4868cf', clay:'#c8795c', forest:'#4c886e',
    burgundy:'#8f4054', ocean:'#27889a', navy:'#394d79', violet:'#7459a9', teal:'#15968c',
    rose:'#be657b', amber:'#b67a2c', sky:'#3d8bad', coral:'#d36c55', plum:'#82638e'
  };
  var paletteDeep = {
    sand:'#59442e', ink:'#006e68', cobalt:'#263d90', clay:'#744431', forest:'#2d6049',
    burgundy:'#592138', ocean:'#145965', navy:'#1d2b4a', violet:'#48316f', teal:'#12645f',
    rose:'#713244', amber:'#71450f', sky:'#235a74', coral:'#803b2e', plum:'#4f3759'
  };
  var paths = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
    building:'<path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M10 21v-4h4v4"/>',
    spark:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    gavel:'<path d="m14 5 5 5M12 7l5 5M3 21h18M5 18l8-8M4 14l5 5M11 5l5 5"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
    chart:'<path d="M4 19V5M4 19h17M8 15l4-4 3 2 5-6"/><path d="M16 7h4v4"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4.6"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    camera:'<path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>',
    social:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    fork:'<path d="M6 3v6a3 3 0 0 0 6 0V3M9 12v9M18 3v18M18 3c-3 2-3 6 0 8"/>',
    cup:'<path d="M4 8h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a3 3 0 0 1 0 6h-2M8 3v2M12 3v2"/>',
    bread:'<path d="M4 12a8 8 0 1 1 16 0v7H4zM4 12H2a2 2 0 0 1 0-4 3 3 0 0 1 4-4M10 8v2M15 7v2M11 14v2M16 13v2"/>',
    plate:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M3 3v5M6 3v5M4.5 8v3M21 3c-3 2-3 6 0 8"/>',
    bed:'<path d="M3 20V5M3 16h18v4M3 12h18v4M7 12V9a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3M14 12V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/>',
    hanger:'<path d="M12 4a2 2 0 1 0-2 2M12 6l9 8a1 1 0 0 1-.7 1.7H3.7A1 1 0 0 1 3 14l9-8Z"/>',
    needle:'<path d="m3 21 12-12M14 4l6 6M16 2l6 6M4 20l-2 2M11 13l-1-1M14 10l-1-1"/>',
    scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.1 8.1 12.4 12.4M8.1 15.9 20.5 3.5"/>',
    leaf:'<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-6 7-9 13-12"/>',
    code:'<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/>',
    monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 8h10"/>',
    heart:'<path d="M20.8 8.6c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>',
    smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    move:'<path d="M4 12h16M12 4v16M7 7l-3 5 3 5M17 7l3 5-3 5M7 7l5-3 5 3M7 17l5 3 5-3"/>',
    bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7z"/>',
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    truck:'<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    car:'<path d="m5 11 2-5h10l2 5 2 2v5H3v-5zM5 11h14M7 18v2M17 18v2"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/>',
    sprout:'<path d="M12 21v-9M12 15c0-5-5-8-9-7 0 5 3 8 9 7ZM12 11c0-5 5-8 9-7 0 5-3 8-9 7Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    wrench:'<path d="M14 6a6 6 0 0 0-8 7.4L3 16.5a2.1 2.1 0 0 0 3 3l3.1-3a6 6 0 0 0 7.4-8l-3.5 3.5-3-3zM13 11l-2-2"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8L13 18.8a8 8 0 0 1-1.6 0l-.3 1.8H8.3L8 18.8a8 8 0 0 1-1.4-.8l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.6l-1.4-1.1 1.4-2.4 1.7.6A8 8 0 0 1 8 9.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6 0l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.5Z"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9 2 2-2 2 2 2-3 3-2-2-3 3"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/><path d="M16.5 10a2.5 2.5 0 1 0-5 0c0 2.5 2.5 5 2.5 5s2.5-2.5 2.5-5Z"/>',
    ruler:'<path d="M3 7h18v10H3zM7 7v4M11 7v3M15 7v4M19 7v3"/>',
    clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h5"/>',
    checklist:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M8 10l1.5 1.5L12 9M14 10h3M8 16l1.5 1.5L12 15M14 16h3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01"/>',
    microphone:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    music:'<path d="M9 18V5l12-2v13M9 9l12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    cloud:'<path d="M20 16.2A4.8 4.8 0 0 0 18 7h-1.2A7 7 0 0 0 3 10.5 4.5 4.5 0 0 0 4.5 19H18a4 4 0 0 0 2-2.8Z"/><path d="m9 14 3-3 3 3M12 11v7"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    drop:'<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
    tooth:'<path d="M12 3c-2-2-7-1-8 3-1 5 2 7 3 11 1 4 3 5 4 1l1-4 1 4c1 4 3 3 4-1 1-4 4-6 3-11-1-4-6-5-8-3Z"/>',
    apple:'<path d="M12 8c-3-4-9-2-9 4 0 5 4 10 7 10 1 0 1-1 2-1s1 1 2 1c3 0 7-5 7-10 0-6-6-8-9-4Z"/><path d="M12 7c0-3 2-5 5-5M12 8c-2-2-4-2-6-1"/>',
    package:'<path d="m3 7 9-5 9 5v10l-9 5-9-5zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5"/>',
    handshake:'<path d="m3 12 4-4 4 1 2-2 8 5-7 8-5-4-3 1-3-5Z"/><path d="m7 8 4-4 5 1 3 2M8 15l3 2m0-5 4 4m-1-6 4 4"/>',
    flower:'<path d="M12 12c-5-1-6-5-3-7 2-1 4 1 3 7Zm0 0c1-5 5-6 7-3 1 2-1 4-7 3Zm0 0c5 1 6 5 3 7-2 1-4-1-3-7Zm0 0c-1 5-5 6-7 3-1-2 1-4 7-3Z"/><circle cx="12" cy="12" r="2"/><path d="M12 14v8m0-4-3-2m3 0 3-2"/>',
    lock:'<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v4"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    coffee:'<path d="M4 8h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a3 3 0 0 1 0 6h-2M8 3v2M12 3v2"/>',
    scales:'<path d="M12 3v18M5 7h14M12 3l-8 4m8-4 8 4M4 7l-3 7h6L4 7Zm16 0-3 7h6l-3-7ZM7 21h10"/>',
    play:'<path d="m8 5 11 7-11 7z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    arrow:'<path d="M5 12h14M13 5l7 7-7 7"/>',
    headphones:'<path d="M3 13v-2a9 9 0 0 1 18 0v2M3 13h4v7H5a2 2 0 0 1-2-2v-5Zm18 0h-4v7h2a2 2 0 0 0 2-2v-5Z"/>',
    document:'<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
    route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/>',
    flower:'<path d="M12 12c-5-1-6-5-3-7 2-1 4 1 3 7Zm0 0c1-5 5-6 7-3 1 2-1 4-7 3Zm0 0c5 1 6 5 3 7-2 1-4-1-3-7Zm0 0c-1 5-5 6-7 3-1-2 1-4 7-3Z"/><circle cx="12" cy="12" r="2"/><path d="M12 14v8"/>',
    bookOpen:'<path d="M12 6v15M12 6C9 3 5 3 2 4v15c4-1 7 0 10 2M12 6c3-3 7-3 10-2v15c-4-1-7 0-10 2"/>',
    badge:'<circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8"/>'
  };
  var pageKeys = ['overview','services','sections','team'];
  var defaultPageLabels = { overview:'Overview', services:'Services', sections:'Sections', team:'Team' };
  var allProfiles = Array.isArray(DATA) ? DATA : [];
  var cardsById = Object.create(null);
  var currentProfile = null;
  var currentPage = 'overview';
  var opener = null;
  var toastTimer = null;
  var previewDialog = $('#profilePreview');
  var grid = $('#profileGrid');
  var search = $('#profileSearch');
  var filterWrap = $('#profileFilters');
  var selectedGroup = 'All industries';
  var pageTitle = document.title;
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reducedMotion = !!(motionQuery && motionQuery.matches);
  var motionChoice = null;
  var motionEnabled = !reducedMotion;
  var previewWindow = $('#previewWindow');
  var renderToken = 0;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function safeToken(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'sample'; }
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean), out = '';
    for (var i = 0; i < parts.length && out.length < 2; i++) {
      if (/^(and|&|co\.?|the|of)$/i.test(parts[i])) continue;
      out += parts[i].charAt(0).toUpperCase();
    }
    return out || 'PS';
  }
  function icon(name, className) {
    var art = paths[name];
    if (!art) return '<b aria-hidden="true">' + esc(initials(name)) + '</b>';
    return '<svg class="' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + art + '</svg>';
  }
  function profileColor(profile) { return palette[profile.palette] || '#087f78'; }
  function profileDeepColor(profile) { return paletteDeep[profile.palette] || '#07534e'; }
  function accentStyle(profile) { return '--profile-accent:' + profileColor(profile) + ';--profile-accent-deep:' + profileDeepColor(profile) + ';'; }
  function familyMeta(profile) { return FAMILY_DATA[profile.family] || { label:profile.layoutName || profile.layout || 'Sample profile layout', renderer:'practice', focus:profile.focus || 'Introduce the work, explain the next step and make contact clear.', tabs:defaultPageLabels, motion:'reveal' }; }
  function artPath(profile) { return '../assets/profile-art/' + encodeURIComponent(profile.art || 'property') + '.svg'; }
  function countText(n) { return String(n).padStart(3, '0'); }
  function makeButton(profile, index) {
    var meta = familyMeta(profile);
    var teamCount = (profile.team || []).length;
    var servicesText = profile.services.length + ' focus areas · ' + (teamCount ? (teamCount + 1) + ' fictional profiles' : 'owner profile');
    var logo = icon(profile.mark);
    return '<article class="library-card" data-profile-card="' + esc(profile.id) + '" data-family="' + esc(profile.family) + '" style="' + accentStyle(profile) + '">' +
      '<div class="profile-card-art"><img src="' + esc(artPath(profile)) + '" alt="" aria-hidden="true" loading="lazy" decoding="async"><span class="profile-card-sample">FICTIONAL SAMPLE</span><span class="profile-card-mark" aria-hidden="true">' + logo + '</span></div>' +
      '<div class="profile-card-copy"><div class="profile-card-top"><span class="profile-card-industry">' + esc(profile.category) + '</span><span class="profile-card-city">' + icon('pin') + esc(profile.city) + '</span></div>' +
      '<h2 class="profile-card-title">' + esc(profile.brand) + '</h2><p class="profile-card-tagline">' + esc(profile.tagline) + '</p>' +
      '<div class="profile-card-owner"><span class="profile-card-avatar" aria-hidden="true">' + esc(initials(profile.owner)) + '</span><div><strong>' + esc(profile.owner) + '</strong><small>' + esc(profile.role) + '</small></div></div>' +
      '<div class="profile-card-bottom"><span>' + esc(servicesText) + '</span><button class="profile-card-open" type="button" data-preview-profile="' + esc(profile.id) + '" aria-label="Explore concept: Preview fictional ' + esc(profile.brand) + ' profile concept, ' + countText(index + 1) + ' of ' + countText(allProfiles.length) + '">Explore concept <span aria-hidden="true">↗</span></button></div>' +
      '<p class="profile-card-layout">' + icon('spark') + '<span>' + esc(meta.label) + '</span></p></div></article>';
  }
  function buildCards() {
    if (!grid || !allProfiles.length) return;
    grid.innerHTML = allProfiles.map(makeButton).join('');
    allProfiles.forEach(function (profile) { cardsById[profile.id] = grid.querySelector('[data-profile-card="' + profile.id + '"]'); });
    updateFilter();
  }
  function buildFilters() {
    if (!filterWrap || !allProfiles.length) return;
    var groups = [];
    allProfiles.forEach(function (p) { if (groups.indexOf(p.group) < 0) groups.push(p.group); });
    var html = '<button type="button" class="profile-filter" data-group="All industries" aria-pressed="true"><span>All industries</span><small>' + allProfiles.length + '</small></button>';
    groups.forEach(function (group) {
      var count = allProfiles.filter(function (p) { return p.group === group; }).length;
      html += '<button type="button" class="profile-filter" data-group="' + esc(group) + '" aria-pressed="false"><span>' + esc(group) + '</span><small>' + count + '</small></button>';
    });
    filterWrap.innerHTML = html;
  }
  function profileMatches(profile, term) {
    if (!term) return true;
    var text = [profile.group,profile.category,profile.brand,profile.owner,profile.role,profile.city,profile.tagline,profile.bio,profile.layoutName,profile.focus,profile.services.join(' '),profile.highlights.join(' '),profile.team.map(function (t) { return t.join(' '); }).join(' ')].join(' ').toLowerCase();
    return text.indexOf(term) !== -1;
  }
  function updateFilter() {
    var term = (search && search.value || '').trim().toLowerCase(), visible = 0;
    allProfiles.forEach(function (profile) {
      var match = (selectedGroup === 'All industries' || profile.group === selectedGroup) && profileMatches(profile, term);
      var card = cardsById[profile.id];
      if (card) card.hidden = !match;
      if (match) visible++;
    });
    var countEl = $('#profileResultCount'), textEl = $('#profileResultsText'), empty = $('#profileEmpty');
    var clear = $('#clearProfileSearch'), hint = $('#filterHint'), total = allProfiles.length;
    if (countEl) countEl.textContent = String(visible);
    if (textEl) textEl.textContent = visible === total ? 'Showing all ' + visible + ' concepts' : 'Showing ' + visible + ' of ' + total + ' concepts';
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = !term;
    if (hint) hint.textContent = selectedGroup === 'All industries' ? (term ? 'Matching all industries' : 'Showing every concept') : 'Filtered: ' + selectedGroup;
    $$('.profile-filter', filterWrap).forEach(function (button) { button.setAttribute('aria-pressed', button.getAttribute('data-group') === selectedGroup ? 'true' : 'false'); });
  }
  function pageLabel(profile, key) {
    var meta = familyMeta(profile), labels = meta.tabs || defaultPageLabels;
    return labels[key] || defaultPageLabels[key] || key;
  }
  function setCurrentPage(page) {
    currentPage = pageKeys.indexOf(page) >= 0 ? page : 'overview';
    $$('#profilePreview [data-page]').forEach(function (button) {
      var active = button.getAttribute('data-page') === currentPage;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
    renderPreviewPage();
  }
  function pageTabsMarkup(profile, idPrefix) {
    return pageKeys.map(function (key) {
      var active = key === currentPage;
      return '<button type="button" role="tab" id="' + idPrefix + key + '" tabindex="' + (active ? '0' : '-1') + '" aria-selected="' + (active ? 'true' : 'false') + '" aria-controls="profilePageBody" data-page="' + key + '">' + esc(pageLabel(profile, key)) + '</button>';
    }).join('');
  }
  function artFigure(profile, className, caption) {
    return '<figure class="sample-art ' + (className || '') + '"><img src="' + esc(artPath(profile)) + '" alt="' + esc(profile.artAlt || ('Original sample artwork representing ' + profile.category)) + '" loading="lazy" decoding="async"><figcaption>' + esc(caption || 'Original sample illustration · fictional concept') + '</figcaption></figure>';
  }
  function sampleButton(profile, label, className) {
    return '<button type="button" class="sample-action ' + (className || '') + '" data-preview-action>' + esc(label || profile.cta || 'Start a conversation') + '<span aria-hidden="true">→</span></button>';
  }
  function chips(items, className) {
    return '<div class="sample-chip-list ' + (className || '') + '">' + items.map(function (item) { return '<span>' + esc(item) + '</span>'; }).join('') + '</div>';
  }
  function smallTag(text, iconName) { return '<span class="sample-mini-tag">' + icon(iconName || 'spark') + esc(text) + '</span>'; }
  function intro(profile, eyebrow, extraClass) {
    return '<div class="sample-intro ' + (extraClass || '') + '"><span class="sample-eyebrow">' + esc(eyebrow || (profile.category + ' · ' + profile.city)) + '</span><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + sampleButton(profile) + '</div>';
  }
  function focusNote(profile) {
    var meta = familyMeta(profile);
    return '<aside class="sample-focus-note"><span>' + icon('spark') + ' PAGE DESIGN NOTE</span><p>' + esc(meta.focus) + '</p></aside>';
  }
  function sectionCards(profile, title, mode) {
    return '<section class="sample-content-section sample-section-cards sample-section-cards--' + safeToken(mode || 'grid') + '"><div class="sample-section-heading"><div><span class="sample-eyebrow">A PAGE THAT FITS THE WORK</span><h2>' + esc(title || 'What visitors can explore') + '</h2></div><span class="sample-section-count">' + String(profile.highlights.length).padStart(2,'0') + ' sample sections</span></div><div class="sample-highlight-grid">' + profile.highlights.map(function (item, i) {
      return '<article class="sample-highlight-card"><span class="sample-card-number">0' + (i + 1) + '</span><div class="sample-highlight-icon">' + icon(profile.mark || 'spark') + '</div><h3>' + esc(item) + '</h3><p>Sample content slot. Replace with approved details and useful next steps.</p><span class="sample-card-arrow" aria-hidden="true">↗</span></article>';
    }).join('') + '</div></section>';
  }
  function quickFacts(profile, entries) {
    return '<div class="sample-quick-facts">' + entries.map(function (entry) {
      return '<div><span>' + icon(entry[0]) + '</span><small>' + esc(entry[1]) + '</small><strong>' + esc(entry[2]) + '</strong></div>';
    }).join('') + '</div>';
  }
  function rendererMarkup(profile) {
    var meta = familyMeta(profile), family = profile.family, art = artFigure(profile, 'sample-art--hero', 'Fictional ' + profile.category.toLowerCase() + ' sample artwork');
    var lead = intro(profile, profile.category + ' · ' + profile.city);
    var high = profile.highlights;
    var services = profile.services;
    var i;
    if (meta.renderer === 'property') {
      if (family === 'home-owner') {
        return '<div class="sample-property-owner"><div class="sample-property-owner-lead">' + lead + art + '</div>' + quickFacts(profile,[['key','OWNER VIEW','Sample dashboard'],['clipboard','RESIDENT HELP','Maintenance route'],['calendar','UPDATES','Add current notices']]) + '<div class="sample-action-board">' + high.map(function (x, n) { return '<article><span>0' + (n+1) + '</span><strong>' + esc(x) + '</strong><small>Sample information area</small></article>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
      }
      if (family === 'workplace') {
        return '<div class="sample-workspace"><div class="sample-workspace-heading">' + lead + '</div>' + art + '<div class="sample-workspace-strip"><span>SPACE GUIDE</span><h2>Choose a place to focus, meet or make.</h2><div>' + services.map(function (x,n) { return '<article><span>0' + (n+1) + '</span><strong>' + esc(x) + '</strong><small>Sample option · ask about access</small></article>'; }).join('') + '</div></div>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-property-finder"><div class="sample-property-heading">' + lead + '</div>' + art + '<div class="sample-property-search"><span>' + icon('pin') + '<small>LOCATION</small><strong>' + esc(profile.city) + '</strong></span><span>' + icon('home') + '<small>PROPERTY TYPE</small><strong>Browse sample options</strong></span>' + sampleButton(profile,'Request a viewing','sample-action--compact') + '</div><section class="sample-content-section"><div class="sample-section-heading"><div><span class="sample-eyebrow">EXAMPLE LISTINGS</span><h2>A considered place to start.</h2></div><span class="sample-section-count">Illustrative only</span></div><div class="sample-property-cards">' + high.map(function (x,n) { return '<article><div class="sample-property-swatch sample-property-swatch--' + (n+1) + '">' + icon('home') + '<span>DEMO ' + String(n+1).padStart(2,'0') + '</span></div><div><small>FICTIONAL LISTING CONCEPT</small><h3>' + esc(x) + '</h3><p>Sample area · add verified details</p></div></article>'; }).join('') + '</div></section>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'technical') {
      return '<div class="sample-technical"><div class="sample-technical-top"><span>FIELD NOTES / ' + esc(profile.city.toUpperCase()) + '</span><span>CONCEPT 0' + String((allProfiles.indexOf(profile)+1)%10 || 1) + '</span></div><div class="sample-technical-grid">' + art + '<div class="sample-technical-copy">' + lead + '</div></div><div class="sample-technical-data"><span>01 / ' + esc(services[0]) + '</span><span>02 / ' + esc(services[1]) + '</span><span>03 / ' + esc(services[2]) + '</span></div>' + sectionCards(profile, family === 'landscape' ? 'A place-led approach' : 'From early brief to next step','technical') + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'projects') {
      return '<div class="sample-project-log"><div class="sample-project-masthead"><div>' + lead + '</div><div class="sample-project-stamp"><span>PROJECT JOURNAL</span><strong>01</strong><small>Illustrative layout</small></div></div>' + art + '<div class="sample-project-status"><div><span>PROJECT STATUS</span><strong>Sample progress view</strong><small>Update with verified milestones</small></div><div class="sample-progress-track"><i></i><i></i><i></i><i></i></div></div><div class="sample-project-milestones">' + high.map(function (x,n) { return '<article><span class="sample-milestone-dot">0' + (n+1) + '</span><div><small>STAGE 0' + (n+1) + '</small><strong>' + esc(x) + '</strong><p>Example checkpoint · add current dates and approved project details.</p></div></article>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'studio') {
      if (family === 'moodboard') {
        return '<div class="sample-studio sample-studio--moodboard"><div class="sample-studio-header">' + lead + '<div class="sample-studio-index">MOOD / 01<br>SPACE / 02<br>DETAIL / 03</div></div>' + art + '<div class="sample-material-row"><span>MATERIAL STUDY</span>' + high.map(function (x,n) { return '<div><i class="sample-material-swatch sample-material-swatch--' + (n+1) + '"></i><strong>' + esc(x) + '</strong></div>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
      }
      if (family === 'photo-gallery') {
        return '<div class="sample-studio sample-studio--gallery"><div class="sample-gallery-title">' + lead + '</div><div class="sample-gallery-mosaic">' + artFigure(profile,'sample-art--gallery-main','Selected fictional sample image') + high.map(function (x,n) { return '<article class="sample-gallery-tile sample-gallery-tile--' + (n+1) + '"><img src="' + esc(artPath(profile)) + '" alt="" aria-hidden="true" loading="lazy"><span>0' + (n+1) + '</span><strong>' + esc(x) + '</strong></article>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
      }
      if (family === 'atelier') {
        return '<div class="sample-studio sample-studio--atelier"><div class="sample-atelier-copy"><span class="sample-eyebrow">THE ATELIER / ' + esc(profile.city.toUpperCase()) + '</span><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + chips(high,'sample-atelier-tags') + sampleButton(profile,'Ask about a fitting') + '</div>' + art + '<div class="sample-atelier-steps">' + ['Reference','Fitting','Collection'].map(function (x,n) { return '<span><b>0' + (n+1) + '</b>' + x + '</span>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
      }
      if (family === 'creative-case') {
        return '<div class="sample-case-study"><div class="sample-case-top"><span>CASE STUDY / SAMPLE</span><span>' + esc(profile.category.toUpperCase()) + '</span></div>' + art + '<div class="sample-case-lead">' + lead + '</div><div class="sample-case-columns"><article><small>THE BRIEF</small><strong>What does the audience need to do?</strong><p>Use this slot to explain the challenge without inventing client results.</p></article><article><small>THE APPROACH</small><strong>' + esc(high[0]) + '</strong><p>Show process, decisions and approved outcomes with clear context.</p></article></div>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-studio sample-studio--portfolio"><div class="sample-portfolio-head">' + lead + '<span class="sample-portfolio-index">SELECTED<br>WORK<br><b>01—03</b></span></div><div class="sample-portfolio-stage">' + art + '<div class="sample-portfolio-caption"><span>FEATURED / SAMPLE</span><strong>' + esc(high[0]) + '</strong><small>Replace with work you have permission to share.</small></div></div><div class="sample-portfolio-mini-grid">' + high.slice(1).map(function (x,n) { return '<article class="sample-portfolio-mini sample-portfolio-mini--' + (n+1) + '"><span>0' + (n+2) + '</span><strong>' + esc(x) + '</strong></article>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'practice') {
      if (family === 'finance-ledger') {
        return '<div class="sample-practice sample-practice--finance"><div class="sample-practice-head"><div>' + lead + '</div><div class="sample-plan-graphic"><span>PLAN</span><i></i><i></i><i></i><b>REVIEW</b></div></div>' + artFigure(profile,'sample-art--finance','Original financial-planning sample artwork') + '<div class="sample-finance-steps">' + ['Understand the context','Set a useful direction','Review what changes'].map(function (x,n) { return '<article><span>0' + (n+1) + '</span><strong>' + x + '</strong><small>Example planning stage</small></article>'; }).join('') + '</div><p class="sample-caveat">Illustrative process only. No financial outcomes, returns or regulated status are implied.</p>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-practice"><div class="sample-practice-masthead"><span class="sample-practice-mark">' + icon(profile.mark) + '</span><span class="sample-eyebrow">' + esc(profile.category.toUpperCase()) + ' / ' + esc(profile.city.toUpperCase()) + '</span></div><div class="sample-practice-grid"><div class="sample-practice-copy"><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + sampleButton(profile,'Arrange an introduction') + '</div><div class="sample-practice-list">' + artFigure(profile,'sample-art--practice','Original professional-services sample artwork') + '<span>AREAS OF WORK</span>' + services.map(function (x,n) { return '<article><b>0' + (n+1) + '</b><strong>' + esc(x) + '</strong><span aria-hidden="true">↗</span></article>'; }).join('') + '</div></div><div class="sample-practice-footer">' + smallTag('Fictional practice','badge') + '<span>Credentials and scope must be verified before use.</span></div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'people') {
      return '<div class="sample-people-hub"><div class="sample-people-intro">' + lead + '</div>' + artFigure(profile,'sample-art--people','Original team and people-services sample artwork') + '<div class="sample-people-routes"><article class="sample-people-route sample-people-route--employer"><span>01 / FOR ORGANISATIONS</span><div class="sample-route-icon">' + icon('briefcase') + '</div><h2>Build the team you need.</h2><p>Sample route for employers exploring a role, hiring plan or people-process question.</p><strong>' + esc(services[0]) + '</strong></article><article class="sample-people-route sample-people-route--candidate"><span>02 / FOR PEOPLE</span><div class="sample-route-icon">' + icon('people') + '</div><h2>Find a clearer next step.</h2><p>Sample route for candidates, team members or participants looking for information.</p><strong>' + esc(services[1]) + '</strong></article></div><div class="sample-process-strip">' + high.map(function (x,n) { return '<span><b>0' + (n+1) + '</b>' + esc(x) + '</span>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'media') {
      if (family === 'social-wall') {
        return '<div class="sample-social-page"><div class="sample-social-head">' + lead + '</div><div class="sample-social-board">' + high.map(function (x,n) { return '<article class="sample-social-card sample-social-card--' + (n+1) + '"><div class="sample-social-top"><span>' + icon(profile.mark) + '</span><b>' + esc(profile.brand) + '</b><small>DEMO</small></div><strong>' + esc(x) + '</strong><div class="sample-social-art"><img src="' + esc(artPath(profile)) + '" alt="" aria-hidden="true" loading="lazy" decoding="async"></div><small>Sample content format · not a live post</small></article>'; }).join('') + '</div>' + focusNote(profile) + '</div>';
      }
      if (family === 'music-room') {
        return '<div class="sample-audio-page"><div class="sample-audio-header">' + lead + '</div>' + art + '<div class="sample-waveform" aria-hidden="true">' + Array.from({length:28},function(_,n){return '<i style="--bar:' + (18 + ((n*17)%67)) + '%"></i>';}).join('') + '</div><div class="sample-audio-notes"><span>STUDIO PROCESS</span>' + high.map(function(x,n){return '<div><b>0'+(n+1)+'</b><strong>'+esc(x)+'</strong></div>';}).join('') + '</div><p class="sample-caveat">No audio autoplay. Add permission-cleared sample clips with captions or transcripts before publishing.</p>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-cinematic"><div class="sample-cinema-art">' + art + '<span class="sample-cinema-stamp">' + icon('play') + ' STATIC SAMPLE STILL</span></div><div class="sample-cinema-copy">' + lead + '<div class="sample-reel-meta">' + high.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">A still frame only; no autoplay video. Add captions, transcript and release-cleared footage before launch.</p></div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'event') {
      return '<div class="sample-event-page"><div class="sample-event-cover">' + art + '<span>GATHER / PLAN / HOST</span></div><div class="sample-event-copy">' + lead + '</div><div class="sample-event-run"><div><span>EVENT PLAN</span><h2>From first conversation to the day itself.</h2></div>' + high.map(function(x,n){return '<article><span>0'+(n+1)+'</span><div><small>PLANNING STAGE</small><strong>'+esc(x)+'</strong><p>Sample milestone · add confirmed dates and access details.</p></div></article>';}).join('') + '</div>' + quickFacts(profile,[['calendar','DATE','Confirm availability'],['people','GUESTS','Add a guest-count range'],['pin','LOCATION',profile.city]]) + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'digital') {
      if (family === 'security-console') {
        return '<div class="sample-security"><div class="sample-security-top"><span>' + icon('shield') + ' SCOPE / NOT A CERTIFICATION</span><span>DEMO</span></div><div class="sample-security-lead">' + lead + '</div><div class="sample-security-console"><div class="sample-console-sidebar"><i></i><i></i><i></i><i></i></div><div class="sample-console-content"><span>ENGAGEMENT MAP</span><img src="' + esc(artPath(profile)) + '" alt="' + esc(profile.artAlt || profile.category + ' sample illustration') + '" loading="lazy" decoding="async"><strong>Clear scope. Private conversation.</strong><div class="sample-console-grid">' + services.map(function(x,n){return '<article><b>0'+(n+1)+'</b><span>'+esc(x)+'</span></article>';}).join('') + '</div></div></div><p class="sample-caveat">Fictional interface illustration. No certification, test result or security status is claimed.</p>' + focusNote(profile) + '</div>';
      }
      if (family === 'support-desk') {
        return '<div class="sample-support"><div class="sample-support-heading">' + lead + '</div><div class="sample-support-panel"><div class="sample-support-panel-head"><span>HELP DESK / SAMPLE</span><span class="sample-status-dot">SERVICE GUIDE</span></div><h2>What do you need help with?</h2>' + services.map(function(x,n){return '<button type="button" data-preview-action><span>0'+(n+1)+'</span>'+esc(x)+'<b aria-hidden="true">↗</b></button>';}).join('') + '<small>Replace this sample with your real support route and response hours.</small></div>' + artFigure(profile,'sample-art--support','Original support-service sample artwork') + focusNote(profile) + '</div>';
      }
      if (family === 'mobile-device') {
        return '<div class="sample-mobile-product"><div class="sample-mobile-copy">' + lead + '<div class="sample-product-points">' + services.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div></div><div class="sample-phone-shell"><div class="sample-phone-top"><span>'+esc(profile.brand)+'</span><i></i></div><img src="'+esc(artPath(profile))+'" alt="'+esc(profile.artAlt)+'" loading="lazy"><div class="sample-phone-lines"><i></i><i></i><i></i></div><span class="sample-phone-cta">PRODUCT PREVIEW</span></div>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-digital-product"><div class="sample-digital-copy">' + lead + '<div class="sample-digital-points">' + high.map(function(x,n){return '<article><span>0'+(n+1)+'</span><strong>'+esc(x)+'</strong></article>';}).join('') + '</div></div><div class="sample-browser-mock"><div class="sample-browser-bar"><i></i><i></i><i></i><span>sample-product.local</span></div><img src="'+esc(artPath(profile))+'" alt="'+esc(profile.artAlt)+'" loading="lazy"><div class="sample-browser-foot"><span>'+icon('code')+' SAMPLE INTERFACE</span><b>Not a live product</b></div></div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'care') {
      return '<div class="sample-care-page"><div class="sample-care-header">' + lead + '<div class="sample-care-contact"><span>VISIT INFORMATION</span><strong>' + esc(profile.city) + '</strong><small>Confirm hours and access before visiting.</small><button type="button" data-preview-action>Ask about a visit <span aria-hidden="true">→</span></button></div></div>' + art + '<div class="sample-care-services"><div><span>CARE INFORMATION</span><h2>Start with the information you need.</h2></div>' + services.map(function(x,n){return '<article><span>'+icon(n===0?'heart':n===1?'clipboard':'calendar')+'</span><div><b>0'+(n+1)+'</b><strong>'+esc(x)+'</strong><small>Sample information · confirm with the practice.</small></div></article>';}).join('') + '</div><p class="sample-caveat">Fictional demo only. This page is not medical advice, a patient portal or an emergency service.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'wellness') {
      return '<div class="sample-wellness-page"><div class="sample-wellness-copy">' + lead + '</div><div class="sample-wellness-layout">' + art + '<div class="sample-session-card"><span>SESSION GUIDE</span><h2>A plan that leaves room for the person.</h2>' + high.map(function(x,n){return '<article><b>0'+(n+1)+'</b><span>'+esc(x)+'</span></article>';}).join('') + '</div></div><div class="sample-wellness-strip">' + services.map(function(x,n){return '<span><i>0'+(n+1)+'</i>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Sample information only. Avoid outcome promises; confirm professional scope and accessibility details.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'appointment') {
      return '<div class="sample-appointment-page"><div class="sample-appointment-head"><div>' + lead + '</div>' + art + '</div><div class="sample-appointment-board"><div><span>APPOINTMENT MENU</span><h2>Choose a service to ask about.</h2></div>' + services.map(function(x,n){return '<article><span class="sample-appointment-number">0'+(n+1)+'</span><div><strong>'+esc(x)+'</strong><small>Sample service · confirm duration and availability</small></div><button type="button" data-preview-action aria-label="Ask about '+esc(x)+'">Ask <span aria-hidden="true">↗</span></button></article>';}).join('') + '</div>' + chips(['Studio access','Appointment information','Sample only'],'sample-appointment-chips') + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'food') {
      if (family === 'cafe-menu') {
        return '<div class="sample-food-page sample-food-page--cafe"><div class="sample-cafe-masthead"><span>THE COUNTER / ' + esc(profile.city.toUpperCase()) + '</span><h1 id="profile-preview-heading">' + esc(profile.brand) + '</h1><p>' + esc(profile.tagline) + '</p><div class="sample-cafe-rule"></div><p>' + esc(profile.bio) + '</p>' + sampleButton(profile,'Find the café') + '</div>' + art + '<div class="sample-menu-board"><div><span>COUNTER MENU</span><b>ILLUSTRATIVE SAMPLE</b></div>' + services.map(function(x,n){return '<article><span>0'+(n+1)+'</span><strong>'+esc(x)+'</strong><i>Sample menu</i></article>';}).join('') + '</div><p class="sample-caveat">Menu and prices are illustrative placeholders. Confirm current items, ingredients, allergens, hours and prices.</p>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-food-page"><div class="sample-food-head"><div>' + lead + '<div class="sample-food-actions">' + smallTag('Menu first','fork') + smallTag(profile.city,'pin') + '</div></div>' + art + '</div><div class="sample-menu-ledger"><div class="sample-menu-heading"><div><span>FROM THE SAMPLE MENU</span><h2>Good things, clearly listed.</h2></div><b>ILLUSTRATIVE ONLY</b></div>' + services.map(function(x,n){var price=['₦4,500','₦6,000','₦3,200'][n%3];return '<article><span class="sample-menu-number">0'+(n+1)+'</span><div><strong>'+esc(x)+'</strong><small>Sample menu group · add description and allergen notes</small></div><b>'+price+'</b></article>';}).join('') + '</div><div class="sample-food-footer"><span>' + icon('clock') + ' Confirm today’s opening hours</span><span>' + icon('pin') + esc(profile.city) + '</span><button type="button" data-preview-action>Order / reserve <span aria-hidden="true">→</span></button></div><p class="sample-caveat">Sample menu and illustrative prices only. Confirm current dishes, ingredients, allergens, opening hours and order links.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'shop') {
      if (family === 'bakery-shop') {
        return '<div class="sample-bakery-page"><div class="sample-bakery-top"><span>THE BAKE LIST / ' + esc(profile.city.toUpperCase()) + '</span><span>ORDER GUIDE</span></div><div class="sample-bakery-grid">' + art + '<div class="sample-bakery-copy">' + lead + '</div></div><div class="sample-bake-cards">' + services.map(function(x,n){return '<article><span class="sample-bake-index">0'+(n+1)+'</span><strong>'+esc(x)+'</strong><small>Sample bake · confirm order lead time</small></article>';}).join('') + '</div><div class="sample-order-note"><strong>Planning a celebration?</strong><span>Show lead time, collection point and order cut-off here.</span>' + sampleButton(profile,'Enquire about an order','sample-action--compact') + '</div><p class="sample-caveat">Illustrative product list only. Confirm ingredients, allergens, prices and order availability.</p>' + focusNote(profile) + '</div>';
      }
      if (family === 'materials') {
        return '<div class="sample-shop-page sample-shop-page--trade"><div class="sample-shop-head">' + lead + '</div>' + art + '<div class="sample-product-grid">' + services.map(function(x,n){return '<article><span class="sample-product-chip">TRADE RANGE 0'+(n+1)+'</span><div class="sample-product-swatch sample-product-swatch--'+(n+1)+'"></div><strong>'+esc(x)+'</strong><small>Sample range · check stock and specifications</small><button type="button" data-preview-action>Ask about supply <span aria-hidden="true">→</span></button></article>';}).join('') + '</div><p class="sample-caveat">Product range and availability are illustrative. Verify specifications, stock, delivery and pricing.</p>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-shop-page"><div class="sample-shop-nav"><span>' + esc(profile.brand.toUpperCase()) + '</span><span>' + esc(profile.city) + '</span></div><div class="sample-shop-hero">' + art + '<div class="sample-shop-copy">' + lead + '</div></div><div class="sample-shop-filter"><span>CURATED SAMPLE EDIT</span><span>PRODUCT DETAILS / SHIPPING / RETURNS</span></div><div class="sample-product-grid">' + high.map(function(x,n){return '<article><div class="sample-product-thumb sample-product-thumb--'+(n+1)+'"><img src="'+esc(artPath(profile))+'" alt="" aria-hidden="true" loading="lazy"><span>0'+(n+1)+'</span></div><strong>'+esc(x)+'</strong><small>Sample product · add size, material and care details</small><div><b>Illustrative</b><button type="button" data-preview-action aria-label="Ask about '+esc(x)+'">Ask ↗</button></div></article>';}).join('') + '</div><div class="sample-shop-policies">' + smallTag('Shipping details','package') + smallTag('Returns information','arrow') + smallTag('Contact the shop','people') + '</div><p class="sample-caveat">Products, availability and prices are illustrative placeholders. Add accurate delivery, return and product information.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'stay') {
      return '<div class="sample-stay-page"><div class="sample-stay-cover">' + art + '<span class="sample-stay-badge">STAY / ' + esc(profile.city.toUpperCase()) + '</span></div><div class="sample-stay-head">' + lead + '</div><div class="sample-booking-panel"><div><span>CHECK A SAMPLE STAY</span><strong>Arrival details</strong><small>Confirm live availability directly.</small></div><div><span>ROOM OPTIONS</span><strong>Explore the stay</strong><small>Add current rate and booking terms.</small></div><button type="button" data-preview-action>Ask about availability <span aria-hidden="true">→</span></button></div><div class="sample-stay-amenities">' + high.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Illustrative hospitality page. Room details, availability, rates and booking terms must be confirmed.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'learning') {
      if (family === 'education') {
        return '<div class="sample-learning-page sample-learning-page--school"><div class="sample-school-masthead"><span class="sample-school-mark">' + icon(profile.mark) + '</span><div><span>' + esc(profile.category.toUpperCase()) + '</span><strong>' + esc(profile.brand) + '</strong></div><span class="sample-school-city">' + esc(profile.city) + '</span></div><div class="sample-school-hero">' + artFigure(profile,'sample-art--school','Original learning-space sample illustration') + '<div>' + intro(profile,'A PLACE TO LEARN') + '</div></div><div class="sample-admissions-path"><span>FAMILY INFORMATION</span><h2>Find the next step.</h2>' + ['Explore programmes','Ask a question','Arrange a visit'].map(function(x,n){return '<article><b>0'+(n+1)+'</b><strong>'+x+'</strong><small>Sample admissions step</small></article>';}).join('') + '</div><div class="sample-learning-programmes">' + services.map(function(x,n){return '<span><i>0'+(n+1)+'</i>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Fictional education concept. Verify programme, admission, safeguarding and access information.</p>' + focusNote(profile) + '</div>';
      }
      return '<div class="sample-learning-page"><div class="sample-learning-header">' + lead + '<div class="sample-learning-art">' + art + '</div></div><div class="sample-course-catalog"><div><span>LEARNING CATALOGUE</span><h2>Find a useful place to begin.</h2></div>' + services.map(function(x,n){return '<article><span>0'+(n+1)+'</span><div><strong>'+esc(x)+'</strong><small>Sample topic · add level, format and timetable</small></div><b>↗</b></article>';}).join('') + '</div><div class="sample-learning-notes">' + high.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'academic') {
      return '<div class="sample-academic-page"><div class="sample-academic-rubric"><span>RESEARCH / TEACHING / PUBLIC WORK</span><span>' + esc(profile.city.toUpperCase()) + '</span></div><div class="sample-academic-grid"><div class="sample-academic-title"><span class="sample-academic-monogram">' + esc(initials(profile.owner)) + '</span><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + sampleButton(profile,'Discuss a collaboration') + '</div>' + artFigure(profile,'sample-art--academic','Original research-themed sample illustration') + '</div><div class="sample-academic-columns"><div><span>RESEARCH THEMES</span>' + services.map(function(x,n){return '<article><b>0'+(n+1)+'</b>'+esc(x)+'</article>';}).join('') + '</div><div><span>SELECTED PAGE SECTIONS</span>' + high.map(function(x,n){return '<article><b>0'+(n+1)+'</b>'+esc(x)+'</article>';}).join('') + '</div></div><p class="sample-caveat">Publication titles, affiliations, credentials and research claims must be accurate and permission-cleared.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'community') {
      return '<div class="sample-community-page"><div class="sample-community-hero"><div><span>COMMUNITY / ' + esc(profile.city.toUpperCase()) + '</span><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + sampleButton(profile,'Find a way to connect') + '</div>' + art + '</div><div class="sample-community-mission"><span>OUR APPROACH</span><h2>Start with the people and priorities already here.</h2><p>Use this space to describe the programme, who it serves and how to take part—without unsupported impact claims.</p></div><div class="sample-community-programmes">' + high.map(function(x,n){return '<article><span>PROGRAMME 0'+(n+1)+'</span><strong>'+esc(x)+'</strong><small>Example programme area</small></article>';}).join('') + '</div><div class="sample-community-links">' + services.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Use verified programme and impact information; get permission for any participant story or image.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'travel') {
      if (family === 'tracking') {
        return '<div class="sample-tracking-page"><div class="sample-tracking-heading">' + lead + '</div><div class="sample-tracking-card"><div class="sample-tracking-card-top"><span>ROUTE GUIDE / SAMPLE</span><span>' + icon('route') + ' No live tracking</span></div><div class="sample-route-line">' + ['Request','Pickup','In transit','Delivery'].map(function(x,n){return '<article class="'+(n<2?'is-complete':'')+'"><i></i><b>0'+(n+1)+'</b><span>'+x+'</span></article>';}).join('') + '</div><div class="sample-tracking-detail"><span>SERVICE AREA</span><strong>' + esc(profile.city) + '</strong><small>Confirm coverage, timing and service terms.</small></div></div><div class="sample-tracking-options">' + services.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div>' + artFigure(profile,'sample-art--route','Original transport sample artwork') + focusNote(profile) + '</div>';
      }
      if (family === 'tour-route') {
        return '<div class="sample-tour-page"><div class="sample-tour-heading">' + lead + '</div><div class="sample-tour-map">' + art + '<span class="sample-map-stop sample-map-stop--one">01 / START</span><span class="sample-map-stop sample-map-stop--two">02 / PAUSE</span><span class="sample-map-stop sample-map-stop--three">03 / RETURN</span></div><div class="sample-tour-details"><div><span>ROUTE NOTES</span><h2>A local way to see more.</h2></div>' + high.map(function(x,n){return '<article><b>0'+(n+1)+'</b><strong>'+esc(x)+'</strong><small>Sample detail · confirm before booking</small></article>';}).join('') + '</div>' + quickFacts(profile,[['compass','MEET','Confirm starting point'],['clock','DURATION','Add route timing'],['people','GROUP','Confirm group size']]) + focusNote(profile) + '</div>';
      }
      return '<div class="sample-travel-page"><div class="sample-travel-copy">' + lead + '<div class="sample-travel-destination">' + art + '<span>DESTINATION NOTES / SAMPLE</span></div></div><div class="sample-trip-plan"><div><span>TRIP PLANNER</span><h2>Keep the moving parts in one place.</h2></div>' + high.map(function(x,n){return '<article><span class="sample-trip-day">0'+(n+1)+'</span><div><small>TRIP NOTE</small><strong>'+esc(x)+'</strong><p>Add confirmed transport, accommodation and preparation information.</p></div></article>';}).join('') + '</div><div class="sample-travel-essentials">' + services.map(function(x,n){return '<span>' + icon(n===0?'compass':n===1?'bed':'document') + esc(x) + '</span>';}).join('') + '</div><p class="sample-caveat">Check official sources for current travel rules. No bookings, visas or availability are confirmed here.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'auto') {
      return '<div class="sample-garage-page"><div class="sample-garage-top"><span>WORKSHOP / ' + esc(profile.city.toUpperCase()) + '</span><span>DEMO SERVICE BOARD</span></div><div class="sample-garage-hero">' + art + '<div>' + lead + '</div></div><div class="sample-garage-menu"><div><span>START WITH THE VEHICLE</span><h2>What needs attention?</h2></div>' + services.map(function(x,n){return '<article><b>0'+(n+1)+'</b><strong>'+esc(x)+'</strong><small>Sample service · confirm availability</small><button type="button" data-preview-action>Ask <span aria-hidden="true">↗</span></button></article>';}).join('') + '</div><div class="sample-vehicle-checklist">' + chips(['Make and model','Year','Service question'],'') + '</div><p class="sample-caveat">Sample workshop layout. Verify technical claims, service scope, prices and warranties before publication.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'agriculture') {
      return '<div class="sample-farm-page"><div class="sample-farm-heading">' + lead + '<span class="sample-harvest-mark">HARVEST<br>NOTES</span></div>' + art + '<div class="sample-harvest-board"><div><span>SEASONAL SAMPLE</span><h2>What is available changes with the season.</h2></div>' + services.map(function(x,n){return '<article><span>0'+(n+1)+'</span><strong>'+esc(x)+'</strong><small>Confirm current crop, quantity and collection.</small></article>';}).join('') + '</div><div class="sample-farm-footer">' + high.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Sample seasonal layout. Confirm produce availability, growing information, weights and prices.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'energy') {
      return '<div class="sample-energy-page"><div class="sample-energy-heading">' + lead + '</div><div class="sample-energy-map"><div class="sample-energy-sun">' + icon('sun') + '<span>ASSESS</span></div><div class="sample-energy-lines"><i></i><i></i><i></i></div><div class="sample-energy-home"><img src="' + esc(artPath(profile)) + '" alt="' + esc(profile.artAlt || profile.category + ' sample illustration') + '" loading="lazy" decoding="async">' + icon('home') + '<span>YOUR SPACE</span></div></div><div class="sample-energy-steps">' + high.map(function(x,n){return '<article><b>0'+(n+1)+'</b><span>STEP 0'+(n+1)+'</span><strong>'+esc(x)+'</strong></article>';}).join('') + '</div>' + quickFacts(profile,[['sun','ASSESSMENT','Start with site needs'],['gear','SYSTEM','Compare suitable options'],['clipboard','CARE','Plan maintenance']]) + '<p class="sample-caveat">No savings, output, capacity or warranty is claimed. Add only verified technical details.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'service') {
      return '<div class="sample-home-service"><div class="sample-home-service-copy">' + lead + '</div><div class="sample-home-service-body">' + art + '<div class="sample-job-checklist"><span>BEFORE A VISIT</span><h2>Help us understand the job.</h2>' + ['What needs attention?','Where is the work?','When can someone visit?'].map(function(x,n){return '<label><i>'+icon('checklist')+'</i><span><b>0'+(n+1)+'</b>'+x+'</span></label>';}).join('') + sampleButton(profile,'Request a visit','sample-action--compact') + '</div></div><div class="sample-service-list">' + services.map(function(x,n){return '<span><i>0'+(n+1)+'</i>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Confirm service area, trade qualifications, safety information and availability before publishing.</p>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'career') {
      return '<div class="sample-career-page"><div class="sample-career-head"><div><span>CAREER / NEXT STEP</span><h1 id="profile-preview-heading">' + esc(profile.tagline) + '</h1><p>' + esc(profile.bio) + '</p>' + sampleButton(profile,'Ask about coaching') + '</div>' + art + '</div><div class="sample-career-road">' + ['Notice what is changing','Choose the question to work on','Make a practical next move'].map(function(x,n){return '<article><span>0'+(n+1)+'</span><div><small>ROADMAP</small><strong>'+x+'</strong><p>Example coaching step · not a promised employment outcome.</p></div></article>';}).join('') + '</div><div class="sample-career-services">' + services.map(function(x,n){return '<span><b>0'+(n+1)+'</b>'+esc(x)+'</span>';}).join('') + '</div><p class="sample-caveat">Publish accurate qualifications and scope; no employment or income outcome is guaranteed.</p>' + focusNote(profile) + '</div>';
    }
    return '<div class="sample-fallback">' + art + lead + sectionCards(profile,'Useful things to know','fallback') + focusNote(profile) + '</div>';
  }
  function renderServices(profile) {
    var meta = familyMeta(profile), food = meta.renderer === 'food', shop = meta.renderer === 'shop';
    var title = food ? 'Menu and ordering information' : shop ? 'Products and useful details' : (profile.moduleTitle || 'Services');
    var items = profile.services.map(function (service, i) {
      var supporting = food ? 'Sample menu group · add current items, prices and allergen details.' : shop ? 'Sample product group · add sizing, materials, fulfilment and returns.' : 'Sample information slot · add current scope, access details and a clear next step.';
      var badge = food ? ['₦4,500','₦6,000','₦3,200'][i%3] : shop ? ['DETAILS','OPTIONS','ENQUIRE'][i%3] : ['SCOPE','FORMAT','NEXT STEP'][i%3];
      return '<article class="sample-service-row sample-service-row--' + safeToken(meta.renderer) + '"><span class="sample-service-index">0' + (i+1) + '</span><div><strong>' + esc(service) + '</strong><small>' + esc(supporting) + '</small></div><b>' + esc(badge) + '</b></article>';
    }).join('');
    return '<div class="sample-secondary-page sample-services-page sample-services-page--' + safeToken(meta.renderer) + '"><div class="sample-secondary-kicker">' + icon(profile.mark) + '<span>' + esc(profile.category.toUpperCase()) + ' / ' + esc(profile.city.toUpperCase()) + '</span></div><div class="sample-secondary-heading"><div><span class="sample-eyebrow">' + (food?'SAMPLE MENU':shop?'SAMPLE CATALOGUE':'WHAT VISITORS CAN DO') + '</span><h1 id="profile-preview-heading">' + esc(title) + '</h1><p>' + esc(profile.bio) + '</p></div><span class="sample-secondary-count">' + String(profile.services.length).padStart(2,'0') + '<small>sample items</small></span></div><div class="sample-service-rows">' + items + '</div><aside class="sample-service-footer"><strong>' + (food?'Please confirm the menu.':shop?'Product details matter.':'Make the next step easy.') + '</strong><p>' + esc(food ? 'Use current menu items, prices, ingredients, allergen notes, opening hours and ordering routes.' : shop ? 'Show accurate product information, stock, delivery costs, returns and the right product questions.' : 'Replace these prompts with verified service scope, locations, accessibility and clear contact instructions.') + '</p>' + sampleButton(profile, food?'Check the current menu':shop?'Ask about a product':profile.cta) + '</aside><p class="sample-caveat">Fictional demonstration content; no real service, menu, product or booking is being offered.</p></div>';
  }
  function renderSections(profile) {
    var meta = familyMeta(profile), items = profile.highlights;
    var visual = '<div class="sample-sections-lead"><span class="sample-eyebrow">' + esc(profile.category.toUpperCase()) + ' / PAGE CONTENT</span><h1 id="profile-preview-heading">' + esc(meta.tabs.sections || 'Sample sections') + '</h1><p>' + esc(meta.focus) + '</p></div>';
    if (meta.renderer === 'creative' || meta.renderer === 'media' || meta.renderer === 'studio') {
      return '<div class="sample-secondary-page sample-sections-page sample-sections-page--visual">' + visual + '<div class="sample-section-gallery">' + artFigure(profile,'sample-art--section','Original fictional section artwork') + '<div class="sample-section-labels">' + items.map(function(x,n){return '<article><span>0'+(n+1)+'</span><strong>'+esc(x)+'</strong><small>Permission-cleared work goes here.</small></article>';}).join('') + '</div></div>' + focusNote(profile) + '</div>';
    }
    if (meta.renderer === 'travel' || meta.renderer === 'projects' || meta.renderer === 'energy') {
      return '<div class="sample-secondary-page sample-sections-page sample-sections-page--timeline">' + visual + '<div class="sample-detail-timeline">' + items.map(function(x,n){return '<article><span>0'+(n+1)+'</span><div><small>DETAIL / SAMPLE</small><strong>'+esc(x)+'</strong><p>Add confirmed dates, location, accessibility and practical information.</p></div></article>';}).join('') + '</div>' + focusNote(profile) + '</div>';
    }
    return '<div class="sample-secondary-page sample-sections-page sample-sections-page--' + safeToken(meta.renderer) + '">' + visual + sectionCards(profile,'What visitors may need to know',meta.renderer) + '<p class="sample-caveat">These are content prompts, not project results, testimonials, patient stories or real event details.</p></div>';
  }
  function renderTeam(profile) {
    var people = [[profile.owner,profile.role]].concat(profile.team || []), meta = familyMeta(profile);
    return '<div class="sample-secondary-page sample-team-page sample-team-page--' + safeToken(meta.renderer) + '"><div class="sample-team-head"><span class="sample-eyebrow">FICTIONAL PEOPLE / DEMO ONLY</span><h1 id="profile-preview-heading">People behind ' + esc(profile.brand) + '</h1><p>Names and roles are invented for this sample. Add real team details only with consent and after verification.</p></div><div class="sample-team-cards">' + people.map(function(person,i){return '<article><span class="sample-team-number">0'+(i+1)+'</span><span class="sample-team-avatar">'+esc(initials(person[0]))+'</span><div><strong>'+esc(person[0])+'</strong><small>'+esc(person[1])+(i===0?' · owner profile':'')+'</small></div><span class="sample-team-spark">' + icon('spark') + '</span></article>';}).join('') + '</div><div class="sample-team-note">' + icon('people') + '<p>' + (people.length === 1 ? 'This concept uses an owner introduction. Add collaborators only where it is useful and with their approval.' : 'All people, titles and work shown here are fictional. Confirm permission before publishing real staff details.') + '</p></div></div>';
  }
  function previewPageContent(profile, page) {
    if (page === 'services') return renderServices(profile);
    if (page === 'sections') return renderSections(profile);
    if (page === 'team') return renderTeam(profile);
    return rendererMarkup(profile);
  }
  function buildPreviewMarkup(profile, page) {
    var meta = familyMeta(profile), familyClass = safeToken(profile.family), pageNow = pageKeys.indexOf(page) >= 0 ? page : 'overview';
    return '<div class="sample-site sample-layout--' + familyClass + '" data-family="' + familyClass + '" data-renderer="' + safeToken(meta.renderer) + '" data-palette="' + esc(profile.palette || 'teal') + '" data-motion="' + safeToken(meta.motion || 'reveal') + '" data-motion-enabled="' + (motionEnabled ? 'true':'false') + '" style="' + accentStyle(profile) + '">' +
      '<div class="sample-fiction-banner"><span><b>FICTIONAL SAMPLE</b><span>Invented business, people and details · not a real client</span></span><span class="sample-fiction-mark">DEMO PAGE</span></div>' +
      '<header class="sample-site-header"><a class="sample-site-brand" href="#"><span class="sample-site-logo">' + icon(profile.mark) + '</span><span><strong>' + esc(profile.brand) + '</strong><small>' + esc(profile.category) + '</small></span></a><div class="sample-header-meta"><span>' + icon('pin') + esc(profile.city) + '</span><span class="sample-header-menu" aria-hidden="true">···</span></div></header>' +
      '<nav class="sample-site-tabs" role="tablist" aria-label="Fictional profile sample sections">' + pageTabsMarkup(profile,'sample-tab-') + '</nav>' +
      '<div class="sample-main" id="profilePageBody" role="tabpanel" tabindex="0" aria-labelledby="profile-preview-heading" data-active-page="' + pageNow + '">' + previewPageContent(profile,pageNow) + '</div>' +
      '<footer class="sample-site-footer"><span>' + icon('spark') + ' ' + esc(profile.brand) + ' · fictional concept</span><strong>PROFILE SAMPLE</strong><span>Replace with approved business information</span></footer></div>';
  }
  function renderPreviewPage() {
    if (!currentProfile) return;
    var root = $('#profilePageLive');
    if (!root) return;
    root.classList.remove('sample-playing');
    root.setAttribute('data-palette', currentProfile.palette || 'teal');
    root.setAttribute('data-family', currentProfile.family || '');
    root.style.setProperty('--profile-accent', profileColor(currentProfile));
    root.innerHTML = buildPreviewMarkup(currentProfile,currentPage);
    if (previewWindow) previewWindow.classList.toggle('motion-off',!motionEnabled);
    var token = ++renderToken;
    if (motionEnabled && !reducedMotion) {
      var play = function () {
        if (token !== renderToken || !root) return;
        root.classList.remove('sample-playing');
        void root.offsetWidth;
        root.classList.add('sample-playing');
        window.setTimeout(function(){ if(token===renderToken && root) root.classList.remove('sample-playing'); },1300);
      };
      if (window.requestAnimationFrame) window.requestAnimationFrame(play); else window.setTimeout(play,0);
    }
    $$('#previewPageTabs [data-page]').forEach(function (button) {
      var active = button.getAttribute('data-page') === currentPage;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
    updateMotionControl();
  }
  function updateMotionControl() {
    var button = $('#previewMotionToggle');
    if (!button) return;
    button.disabled = reducedMotion;
    button.setAttribute('aria-pressed',motionEnabled?'true':'false');
    button.setAttribute('aria-label',reducedMotion ? 'Motion reduced — animations are disabled by your reduced-motion preference' : (motionEnabled?'Motion on — turn sample animations off':'Motion off — turn sample animations on'));
    var text = button.querySelector('[data-motion-label]');
    if (text) text.textContent = reducedMotion ? 'Motion reduced' : (motionEnabled ? 'Motion on' : 'Motion off');
    if (previewWindow) previewWindow.classList.toggle('motion-off',!motionEnabled || reducedMotion);
  }
  if (motionQuery) {
    var onMotionPreferenceChange = function (event) {
      reducedMotion = !!event.matches;
      motionEnabled = reducedMotion ? false : (motionChoice === null ? true : motionChoice);
      if (currentProfile) renderPreviewPage(); else updateMotionControl();
    };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change',onMotionPreferenceChange);
    else if (motionQuery.addListener) motionQuery.addListener(onMotionPreferenceChange);
  }
  function showToast(text) {
    var toast = $('#previewToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  function setAddress(profile) {
    var address = $('#previewSlug');
    if (address) address.textContent = profile.id;
  }
  function previewShareURL(profile) {
    var url = new URL(window.location.href);
    url.searchParams.set('profile',profile.id);
    url.hash = '';
    return url.toString();
  }
  function updatePreviewMeta(profile) {
    var index = allProfiles.indexOf(profile) + 1;
    var number = $('#previewNumber');
    if (number) number.textContent = 'PROFILE CONCEPT ' + countText(index) + ' / ' + countText(allProfiles.length);
    $('#previewBrandName').textContent = profile.brand;
    $('#previewCategory').textContent = profile.group.toUpperCase() + ' · ' + profile.category.toUpperCase();
    $('#previewTagline').textContent = profile.tagline;
    $('#previewOwner').textContent = profile.owner;
    $('#previewRole').textContent = profile.role;
    $('#previewCity').textContent = profile.city;
    $('#previewBrandLogo').innerHTML = icon(profile.mark);
    $('#previewBrandLogo').style.cssText = accentStyle(profile);
    $('#previewSidebarNote').textContent = profile.note ? 'Before publishing: ' + profile.note : 'Replace the sample copy, images, service details and contact links with approved information.';
    var structure = $('#previewPageStructure');
    if (structure) structure.textContent = familyMeta(profile).label;
    var focus = $('#previewLayoutFocus');
    if (focus) focus.textContent = familyMeta(profile).focus;
    var message = 'Hello Pixel Studios! I would like to discuss a business profile similar to the fictional ' + profile.brand + ' sample. Please confirm the current options, pricing and next steps.';
    $('#previewDiscussLink').href = 'https://wa.me/2349031528732?text=' + encodeURIComponent(message);
    setAddress(profile);
    $('#previewPageTabs').innerHTML = pageTabsMarkup(profile,'sidebar-tab-');
    renderPreviewPage();
  }
  function setUrlProfile(id) {
    try {
      var url = new URL(window.location.href);
      if (id) url.searchParams.set('profile',id); else url.searchParams.delete('profile');
      history.replaceState(history.state,'',url.pathname + url.search + url.hash);
    } catch (e) { /* the sample still works in a browser that blocks history access */ }
  }
  function openProfile(id, trigger) {
    var profile = allProfiles.filter(function(p){return p.id===id;})[0];
    if (!profile || !previewDialog) return;
    currentProfile = profile;
    currentPage = 'overview';
    opener = trigger || document.activeElement;
    updatePreviewMeta(profile);
    document.title = profile.brand + ' — Fictional Sample Profile | Pixel Studios';
    setUrlProfile(profile.id);
    if (typeof previewDialog.showModal === 'function') previewDialog.showModal();
    else previewDialog.setAttribute('open','open');
    var close = previewDialog.querySelector('[data-close-preview]');
    if (close) window.setTimeout(function(){close.focus();},0);
  }
  function closeProfile() {
    if (!previewDialog) return;
    if (typeof previewDialog.close === 'function' && previewDialog.open) previewDialog.close();
    else previewDialog.removeAttribute('open');
  }
  function handleClose() {
    setUrlProfile(null);
    document.title = pageTitle;
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
    currentProfile = null;
  }

  buildFilters();
  buildCards();
  var year = $('#profileYear');
  if (year) year.textContent = new Date().getFullYear();
  var countLabels = $$('.js-profile-count');
  countLabels.forEach(function(el){el.textContent=String(allProfiles.length);});

  if (filterWrap) filterWrap.addEventListener('click',function(event){
    var button=event.target.closest('[data-group]');
    if(!button)return;
    selectedGroup=button.getAttribute('data-group'); updateFilter();
  });
  if (search) search.addEventListener('input',updateFilter);
  var clear=$('#clearProfileSearch');
  if(clear)clear.addEventListener('click',function(){search.value='';search.focus();updateFilter();});
  var reset=$('#resetProfileFilters');
  if(reset)reset.addEventListener('click',function(){selectedGroup='All industries';if(search)search.value='';updateFilter();if(search)search.focus();});
  if(grid)grid.addEventListener('click',function(event){var button=event.target.closest('[data-preview-profile]');if(button)openProfile(button.getAttribute('data-preview-profile'),button);});
  if(previewDialog){
    previewDialog.addEventListener('click',function(event){
      if(event.target===previewDialog||event.target.closest('[data-close-preview]')){closeProfile();return;}
      if(event.target.closest('[data-motion-toggle]')){if(reducedMotion){updateMotionControl();return;}motionEnabled=!motionEnabled;motionChoice=motionEnabled;renderPreviewPage();updateMotionControl();return;}
      var pageButton=event.target.closest('[data-page]');
      if(pageButton){setCurrentPage(pageButton.getAttribute('data-page'));return;}
      if(event.target.closest('[data-preview-action]'))showToast('Sample action only — connect your own booking, enquiry or contact link when publishing.');
    });
    previewDialog.addEventListener('keydown',function(event){
      var tab=event.target.closest('[role="tab"][data-page]');
      if(!tab)return;
      var index=pageKeys.indexOf(tab.getAttribute('data-page'));
      if(event.key==='ArrowRight')index=(index+1)%pageKeys.length;
      else if(event.key==='ArrowLeft')index=(index-1+pageKeys.length)%pageKeys.length;
      else if(event.key==='Home')index=0;
      else if(event.key==='End')index=pageKeys.length-1;
      else return;
      event.preventDefault();
      var page=pageKeys[index], inPage=!!tab.closest('.sample-site-tabs');
      setCurrentPage(page);
      var list=inPage?$('#profilePageLive .sample-site-tabs'):$('#previewPageTabs');
      var next=list&&list.querySelector('[data-page="'+page+'"]');
      if(next)next.focus();
    });
    previewDialog.addEventListener('close',handleClose);
  }
  $$('.preview-size-switch [data-preview-size]').forEach(function(button){
    button.addEventListener('click',function(){
      var mode=button.getAttribute('data-preview-size'),win=$('#previewWindow');
      $$('.preview-size-switch [data-preview-size]').forEach(function(b){b.setAttribute('aria-pressed',b===button?'true':'false');});
      if(win)win.classList.toggle('is-desktop',mode==='desktop');
    });
  });
  function copyToClipboard(text){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){showToast('Shareable sample preview link copied.');}).catch(function(){showToast('Sample link is in the address bar; copy it to share.');});return;}
    var field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','readonly');field.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(field);field.select();
    var copied=false;try{copied=document.execCommand('copy');}catch(e){copied=false;}field.remove();showToast(copied?'Shareable sample preview link copied.':'Sample link is in the address bar; copy it to share.');
  }
  var copyLink=$('#copyProfileLink');
  if(copyLink)copyLink.addEventListener('click',function(){if(currentProfile)copyToClipboard(previewShareURL(currentProfile));});
  document.addEventListener('keydown',function(event){
    if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!previewDialog.open){var active=document.activeElement;if(active&&/INPUT|TEXTAREA|SELECT/.test(active.tagName))return;event.preventDefault();if(search)search.focus();}
  });
  window.addEventListener('popstate',function(){var id=new URL(window.location.href).searchParams.get('profile');if(id&&!previewDialog.open)openProfile(id,null);else if(!id&&previewDialog.open)closeProfile();});
  var initialProfile=new URL(window.location.href).searchParams.get('profile');
  if(initialProfile&&allProfiles.some(function(p){return p.id===initialProfile;}))openProfile(initialProfile,null);

  /* Pure sample renderer exposed for deterministic offline QA and future preview integrations. */
  window.PSProfileLibrary = {
    count:allProfiles.length,
    renderSample:function(id,page){var p=allProfiles.filter(function(item){return item.id===id;})[0];return p?buildPreviewMarkup(p,page||'overview'):'';},
    profileIds:allProfiles.map(function(p){return p.id;})
  };
})();
