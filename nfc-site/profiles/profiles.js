/* Pixel Studios · browseable fictional profile library */
(function () {
  'use strict';
  var DATA = window.PSProfileTemplates && window.PSProfileTemplates.profiles;
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var palette = {
    sand:'#a9845d', ink:'#00bfb8', cobalt:'#4868cf', clay:'#c8795c', forest:'#4c886e',
    burgundy:'#8f4054', ocean:'#27889a', navy:'#394d79', violet:'#7459a9', teal:'#15968c',
    rose:'#be657b', amber:'#b67a2c', sky:'#3d8bad', coral:'#d36c55', plum:'#82638e'
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
    gear:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8L13 18.8a8 8 0 0 1-1.6 0l-.3 1.8H8.3L8 18.8a8 8 0 0 1-1.4-.8l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.6l-1.4-1.1 1.4-2.4 1.7.6A8 8 0 0 1 8 9.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6 0l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.5Z"/>'
  };
  var pageLabels = { overview:'Overview', services:'Services', sections:'Sections', team:'Team' };
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

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    var out = '';
    for (var i = 0; i < parts.length && out.length < 2; i++) {
      if (/^(and|&|co\.?|the|of)$/i.test(parts[i])) continue;
      out += parts[i].charAt(0).toUpperCase();
    }
    return out || 'PS';
  }
  function icon(name, className) {
    var art = paths[name];
    if (!art) return '<b aria-hidden="true">' + esc(initials(name)) + '</b>';
    return '<svg class="' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + art + '</svg>';
  }
  function profileColor(profile) { return palette[profile.palette] || '#00bfb8'; }
  function accentStyle(profile) { return '--profile-accent:' + profileColor(profile) + ';'; }
  function makeButton(profile, index) {
    var teamCount = profile.team.length;
    var serviceCount = profile.services.length;
    var servicesText = serviceCount + ' services · ' + (teamCount ? (teamCount + 1) + ' profiles' : 'owner profile');
    var logo = icon(profile.mark);
    return '<article class="library-card" data-profile-card="' + esc(profile.id) + '" style="' + accentStyle(profile) + '">' +
      '<div class="profile-card-top"><div class="profile-card-logo" aria-hidden="true">' + logo + '</div><span class="profile-card-industry">' + esc(profile.category) + '</span></div>' +
      '<h2 class="profile-card-title">' + esc(profile.brand) + '</h2><p class="profile-card-tagline">' + esc(profile.tagline) + '</p>' +
      '<span class="profile-card-city">' + icon('home') + esc(profile.city) + '</span>' +
      '<div class="profile-card-owner"><span class="profile-card-avatar" aria-hidden="true">' + esc(initials(profile.owner)) + '</span><div><strong>' + esc(profile.owner) + '</strong><small>' + esc(profile.role) + '</small></div></div>' +
      '<div class="profile-card-bottom"><span>' + esc(servicesText) + '</span><button class="profile-card-open" type="button" data-preview-profile="' + esc(profile.id) + '" aria-label="Preview the ' + esc(profile.brand) + ' fictional profile concept, ' + (index + 1) + ' of 50">Preview page <span aria-hidden="true">↗</span></button></div></article>';
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
    var text = [profile.group,profile.category,profile.brand,profile.owner,profile.role,profile.city,profile.tagline,profile.bio,profile.services.join(' '),profile.highlights.join(' '),profile.team.map(function (t) { return t.join(' '); }).join(' ')].join(' ').toLowerCase();
    return text.indexOf(term) !== -1;
  }
  function updateFilter() {
    var term = (search && search.value || '').trim().toLowerCase();
    var visible = 0;
    allProfiles.forEach(function (profile) {
      var match = (selectedGroup === 'All industries' || profile.group === selectedGroup) && profileMatches(profile, term);
      var card = cardsById[profile.id];
      if (card) card.hidden = !match;
      if (match) visible++;
    });
    var countEl = $('#profileResultCount');
    var textEl = $('#profileResultsText');
    var empty = $('#profileEmpty');
    var clear = $('#clearProfileSearch');
    var hint = $('#filterHint');
    if (countEl) countEl.textContent = String(visible);
    if (textEl) textEl.textContent = visible === allProfiles.length ? 'Showing all ' + visible + ' concepts' : 'Showing ' + visible + ' of ' + allProfiles.length + ' concepts';
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = !term;
    if (hint) hint.textContent = selectedGroup === 'All industries' ? (term ? 'Matching all industries' : 'Showing every concept') : 'Filtered: ' + selectedGroup;
    $$('.profile-filter', filterWrap).forEach(function (button) { button.setAttribute('aria-pressed', button.getAttribute('data-group') === selectedGroup ? 'true' : 'false'); });
  }
  function setCurrentPage(page) {
    currentPage = pageLabels[page] ? page : 'overview';
    $$('#profilePreview [data-page]').forEach(function (button) {
      var active = button.getAttribute('data-page') === currentPage;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
    renderPreviewPage();
  }
  function pageTabsMarkup() {
    return Object.keys(pageLabels).map(function (key) {
      var active = key === currentPage;
      return '<button type="button" role="tab" id="sidebar-tab-' + key + '" tabindex="' + (active ? '0' : '-1') + '" aria-selected="' + (active ? 'true' : 'false') + '" aria-controls="profilePageBody" data-page="' + key + '">' + pageLabels[key] + '</button>';
    }).join('');
  }
  function previewPageContent(profile, page) {
    if (page === 'services') {
      return '<div class="preview-section-heading"><div><span>HOW WE CAN HELP</span><h2 id="profile-preview-heading">' + esc(profile.moduleTitle || 'Services') + '</h2></div><small>Sample service list</small></div><div class="preview-services-list">' + profile.services.map(function (service, i) {
        return '<div class="preview-service-item"><span class="preview-service-dot" aria-hidden="true">0' + (i + 1) + '</span><div><strong>' + esc(service) + '</strong><small>A clear place to explain this service and invite an enquiry.</small></div></div>';
      }).join('') + '</div><p class="preview-demo-note">Example profile content. Add current scope, availability and accurate service information before publishing.</p>';
    }
    if (page === 'sections') {
      return '<div class="preview-section-heading"><div><span>IDEAS FOR YOUR PAGE</span><h2 id="profile-preview-heading">Sample sections</h2></div><small>Content directions</small></div><div class="preview-feature-grid">' + profile.highlights.map(function (item, i) {
        return '<article class="preview-feature-card"><span>SECTION 0' + (i + 1) + '</span><strong>' + esc(item) + '</strong><small>Example block for approved business content.</small></article>';
      }).join('') + '</div><p class="preview-demo-note">These are layout prompts, not claims of completed client projects, outcomes or testimonials. Replace them with approved information.</p>';
    }
    if (page === 'team') {
      var people = [[profile.owner,profile.role]].concat(profile.team || []);
      return '<div class="preview-section-heading"><div><span>PEOPLE BEHIND THE PAGE</span><h2 id="profile-preview-heading">Owner &amp; team</h2></div><small>Fictional profiles</small></div><div class="preview-team-grid">' + people.map(function (person, i) {
        return '<div class="preview-team-card"><span class="preview-team-avatar" aria-hidden="true">' + esc(initials(person[0])) + '</span><div><strong>' + esc(person[0]) + '</strong><small>' + esc(person[1]) + (i === 0 ? ' · Owner profile' : '') + '</small></div></div>';
      }).join('') + '</div>' + (people.length === 1 ? '<p class="preview-demo-note">This independent profile uses an owner introduction. Add collaborators only when suitable and with their approval.</p>' : '<p class="preview-demo-note">All names and roles are invented demonstration content. Add real team details only with consent and after verification.</p>');
    }
    return '<div class="preview-section-heading"><div><span>PROFILE OVERVIEW</span><h2 id="profile-preview-heading">A clear introduction</h2></div><small>About this concept</small></div><div class="preview-about-card"><p>' + esc(profile.bio) + '</p><p>This fictional page is structured to make the business, its offer and a next step easy to understand on a phone.</p></div><div class="preview-info-grid"><div class="preview-info-chip"><small>INDUSTRY</small><strong>' + esc(profile.category) + '</strong></div><div class="preview-info-chip"><small>PROFILE AREA</small><strong>' + esc(profile.city) + '</strong></div><div class="preview-info-chip"><small>OWNER PROFILE</small><strong>' + esc(profile.owner) + '</strong></div><div class="preview-info-chip"><small>PAGE CONCEPT</small><strong>' + esc(profile.layout) + ' profile</strong></div></div><p class="preview-demo-note">Fictional demonstration content. Confirm all text, service details, credentials and contact links before publishing.</p>';
  }
  function renderPreviewPage() {
    if (!currentProfile) return;
    var p = currentProfile;
    var root = $('#profilePageLive');
    if (!root) return;
    root.setAttribute('data-palette', p.palette || 'teal');
    root.style.setProperty('--profile-accent', profileColor(p));
    var logo = icon(p.mark);
    root.innerHTML = '<header class="preview-page-header"><div class="preview-page-brand"><span class="preview-page-logo" aria-hidden="true">' + logo + '</span><span class="preview-page-brandcopy"><strong>' + esc(p.brand) + '</strong><small>' + esc(p.category) + '</small></span></div><div class="preview-header-menu"><span>' + esc(p.city) + '</span><span aria-hidden="true">···</span></div></header>' +
      '<nav class="preview-page-tabs" role="tablist" aria-label="Sample page sections">' + Object.keys(pageLabels).map(function (key) { var active = key === currentPage; return '<button type="button" role="tab" id="page-nav-' + key + '" tabindex="' + (active ? '0' : '-1') + '" aria-selected="' + (active ? 'true' : 'false') + '" aria-controls="profilePageBody" data-page="' + key + '">' + pageLabels[key] + '</button>'; }).join('') + '</nav>' +
      '<main class="preview-page-content" id="profilePageBody" role="tabpanel" tabindex="0" aria-labelledby="profile-preview-heading"><section class="preview-page-hero"><span>' + esc(p.category) + ' · ' + esc(p.city) + '</span><h1>' + esc(p.tagline) + '</h1><p>' + esc(p.bio) + '</p><button class="preview-page-action" type="button" data-preview-action>' + esc(p.cta || 'Start a conversation') + ' <span aria-hidden="true">→</span></button></section>' +
      '<div class="preview-page-meta"><span>' + icon('home') + esc(p.city) + '</span><span>' + icon('spark') + 'Fictional profile concept</span></div>' + previewPageContent(p, currentPage) +
      '<footer class="preview-page-footer"><span>Concept page · ' + esc(p.brand) + '</span><strong>PROFILE SAMPLE</strong></footer></main>';
    $$('#previewPageTabs [data-page]').forEach(function (button) { var active = button.getAttribute('data-page') === currentPage; button.setAttribute('aria-selected', active ? 'true' : 'false'); button.setAttribute('tabindex', active ? '0' : '-1'); });
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
    url.searchParams.set('profile', profile.id);
    url.hash = '';
    return url.toString();
  }
  function updatePreviewMeta(profile) {
    var index = allProfiles.indexOf(profile) + 1;
    $('#previewNumber').textContent = 'PROFILE CONCEPT ' + String(index).padStart(2, '0') + ' / ' + String(allProfiles.length).padStart(2, '0');
    $('#previewBrandName').textContent = profile.brand;
    $('#previewCategory').textContent = profile.group.toUpperCase() + ' · ' + profile.category.toUpperCase();
    $('#previewTagline').textContent = profile.tagline;
    $('#previewOwner').textContent = profile.owner;
    $('#previewRole').textContent = profile.role;
    $('#previewCity').textContent = profile.city;
    $('#previewBrandLogo').innerHTML = icon(profile.mark);
    $('#previewBrandLogo').style.cssText = accentStyle(profile);
    $('#previewSidebarNote').textContent = profile.note ? 'Before publishing: ' + profile.note : 'Use approved copy, verified information and contact links that belong to your business.';
    var message = 'Hello Pixel Studios! I would like to discuss a business profile similar to the fictional ' + profile.brand + ' sample. Please confirm the current options, pricing and next steps.';
    $('#previewDiscussLink').href = 'https://wa.me/2349031528732?text=' + encodeURIComponent(message);
    setAddress(profile);
    var tabs = $('#previewPageTabs');
    tabs.innerHTML = pageTabsMarkup();
    renderPreviewPage();
  }
  function setUrlProfile(id) {
    try {
      var url = new URL(window.location.href);
      if (id) url.searchParams.set('profile', id);
      else url.searchParams.delete('profile');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    } catch (e) { /* embedded or older browser; the page still works without a share URL */ }
  }
  function openProfile(id, trigger) {
    var profile = allProfiles.filter(function (p) { return p.id === id; })[0];
    if (!profile || !previewDialog) return;
    currentProfile = profile;
    currentPage = 'overview';
    opener = trigger || document.activeElement;
    updatePreviewMeta(profile);
    document.title = profile.brand + ' — Sample Profile | Pixel Studios';
    setUrlProfile(profile.id);
    if (typeof previewDialog.showModal === 'function') previewDialog.showModal();
    else previewDialog.setAttribute('open', 'open');
    var close = previewDialog.querySelector('[data-close-preview]');
    if (close) window.setTimeout(function () { close.focus(); }, 0);
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

  if (filterWrap) filterWrap.addEventListener('click', function (event) {
    var button = event.target.closest('[data-group]');
    if (!button) return;
    selectedGroup = button.getAttribute('data-group');
    updateFilter();
  });
  if (search) search.addEventListener('input', updateFilter);
  var clear = $('#clearProfileSearch');
  if (clear) clear.addEventListener('click', function () { search.value = ''; search.focus(); updateFilter(); });
  var reset = $('#resetProfileFilters');
  if (reset) reset.addEventListener('click', function () {
    selectedGroup = 'All industries';
    if (search) search.value = '';
    updateFilter();
    if (search) search.focus();
  });
  if (grid) grid.addEventListener('click', function (event) {
    var button = event.target.closest('[data-preview-profile]');
    if (button) openProfile(button.getAttribute('data-preview-profile'), button);
  });
  if (previewDialog) {
    previewDialog.addEventListener('click', function (event) {
      if (event.target === previewDialog || event.target.closest('[data-close-preview]')) { closeProfile(); return; }
      var pageButton = event.target.closest('[data-page]');
      if (pageButton) { setCurrentPage(pageButton.getAttribute('data-page')); return; }
      if (event.target.closest('[data-preview-action]')) {
        showToast('Sample action only — connect your own booking, enquiry or contact link when publishing.');
      }
    });
    previewDialog.addEventListener('keydown', function (event) {
      var tab = event.target.closest('[role="tab"][data-page]');
      if (!tab) return;
      var keys = Object.keys(pageLabels), index = keys.indexOf(tab.getAttribute('data-page'));
      if (event.key === 'ArrowRight') index = (index + 1) % keys.length;
      else if (event.key === 'ArrowLeft') index = (index - 1 + keys.length) % keys.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = keys.length - 1;
      else return;
      event.preventDefault();
      var page = keys[index], inPreviewPage = !!tab.closest('.preview-page-tabs');
      setCurrentPage(page);
      var list = inPreviewPage ? $('#profilePageLive .preview-page-tabs') : $('#previewPageTabs');
      var nextTab = list && list.querySelector('[data-page="' + page + '"]');
      if (nextTab) nextTab.focus();
    });
    previewDialog.addEventListener('close', handleClose);
  }
  $$('.preview-size-switch [data-preview-size]').forEach(function (button) {
    button.addEventListener('click', function () {
      var mode = button.getAttribute('data-preview-size');
      var win = $('#previewWindow');
      $$('.preview-size-switch [data-preview-size]').forEach(function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
      if (win) win.classList.toggle('is-desktop', mode === 'desktop');
    });
  });
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast('Shareable sample preview link copied.'); }).catch(function () { showToast('Sample link is in the address bar; copy it to share.'); });
      return;
    }
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', 'readonly');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
    field.remove();
    showToast(copied ? 'Shareable sample preview link copied.' : 'Sample link is in the address bar; copy it to share.');
  }
  var copyLink = $('#copyProfileLink');
  if (copyLink) copyLink.addEventListener('click', function () {
    if (!currentProfile) return;
    copyToClipboard(previewShareURL(currentProfile));
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !previewDialog.open) {
      var active = document.activeElement;
      if (active && /INPUT|TEXTAREA|SELECT/.test(active.tagName)) return;
      event.preventDefault();
      if (search) search.focus();
    }
  });
  window.addEventListener('popstate', function () {
    var id = new URL(window.location.href).searchParams.get('profile');
    if (id && !previewDialog.open) openProfile(id, null);
    else if (!id && previewDialog.open) closeProfile();
  });
  var initialProfile = new URL(window.location.href).searchParams.get('profile');
  if (initialProfile && allProfiles.some(function (p) { return p.id === initialProfile; })) openProfile(initialProfile, null);
})();
