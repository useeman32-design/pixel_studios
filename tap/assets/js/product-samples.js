/* Pixel Studios · app-backed product sample screen + quote shortlist */
(function () {
  'use strict';

  var CATALOG = {
    'logo-design': {
      title:'Logo Design', studio:'Design Studio', price:'From ₦25,000',
      description:'Explore mark directions for a new brand: wordmark, monogram, emblem or abstract symbol. The app offer includes three concepts, revisions, delivery formats and a mini brand guide.',
      options:['3 concepts','Revisions','All file formats','Mini brand guide'], kind:'brand', icon:'spark',
      samples:[['Wordmark','A clear, confident name-first identity.','minimal'],['Monogram','A compact mark for cards, avatars and packaging.','editorial'],['Emblem','A badge-style identity for a heritage or product brand.','warm']]
    },
    'brand-identity': {
      title:'Brand Identity', studio:'Design Studio', price:'From ₦60,000',
      description:'A connected system, not only a logo: mark suite, colour palette, typography and practical usage guidance.',
      options:['Logo suite','Colour system','Typography','Brand guidelines'], kind:'brand', icon:'brand',
      samples:[['Signature system','A restrained core mark with a teal accent.','minimal'],['Warm editorial','Soft paper, serif contrast and a human voice.','editorial'],['Bold modern','High-contrast geometry for a digital-first brand.','bold']]
    },
    'social-media-design': {
      title:'Social Media Design', studio:'Design Studio', price:'From ₦15,000',
      description:'A consistent set of feed, story and campaign artwork, built around the platform and audience you want to reach.',
      options:['Instagram','Facebook','WhatsApp Status','TikTok covers'], kind:'social', icon:'social',
      samples:[['Feed kit','A reusable square post system for weekly content.','bold'],['Story pack','Vertical offer and announcement frames.','warm'],['Campaign set','A coordinated launch series across channels.','editorial']]
    },
    'digital-menu': {
      title:'Digital Menu', studio:'Design Studio', price:'From ₦25,000',
      description:'An easy-to-scan restaurant or café menu page, with options for QR table cards and a smart menu card.',
      options:['QR table cards','Smart menu card','Menu page','Chalkboard style'], kind:'menu', icon:'menu',
      samples:[['Café light','Bright menu categories with clear item hierarchy.','editorial'],['Fine dining','A dark, elegant menu with generous spacing.','warm'],['Classic chalk','A familiar board-inspired menu direction.','minimal']]
    },
    'flyer-poster-design': {
      title:'Flyer & Poster Design', studio:'Design Studio', price:'From ₦10,000',
      description:'Persuasive artwork for product launches, events, campaigns and announcements, sized for print or digital sharing.',
      options:['Single flyer','Double-sided','Tri-fold brochure','Campaign series'], kind:'poster', icon:'poster',
      samples:[['Bold pop','Large headline and one strong action.','bold'],['Minimal','Quiet hierarchy for a premium announcement.','minimal'],['Corporate','Structured information for a business audience.','editorial']]
    },
    'business-cards': {
      title:'Premium Business Cards', studio:'Print Studio', price:'₦15,000 / 100',
      description:'Thick-stock, double-sided business cards made to carry your brand clearly in the hand.',
      options:['420gsm stock','Matte or gloss','Double-sided full colour','Rounded or square corners'], kind:'card', icon:'card',
      samples:[['Matte Noir','A crisp dark card with a restrained teal edge.','minimal'],['Classic Ivory','Warm paper, strong typography and open space.','editorial'],['Ocean','A vivid brand panel with a clean contact side.','bold']]
    },
    'flyers-posters': {
      title:'Flyers & Posters', studio:'Print Studio', price:'From ₦20,000',
      description:'Full-colour campaign and event prints, set to the size, quantity and finish your brief needs.',
      options:['A5','A4','A3','Double-sided'], kind:'poster', icon:'poster',
      samples:[['Event poster','Date, place and headline at a glance.','bold'],['Product flyer','A clear offer with a product-first layout.','warm'],['Corporate notice','Calm, information-led design for organisations.','minimal']]
    },
    'stickers-labels': {
      title:'Stickers & Labels', studio:'Print Studio', price:'₦12,000 / 100',
      description:'Die-cut stickers and product labels with shape, finish and material chosen for the job.',
      options:['Custom shapes','Waterproof vinyl option','Matte or gloss','Product labels'], kind:'label', icon:'sticker',
      samples:[['Matte label','A tactile, quiet label for a premium product.','minimal'],['Gloss seal','A bright branded seal for boxes and bags.','bold'],['Clear label','Transparent treatment that lets the package show.','editorial']]
    },
    'invitation-cards': {
      title:'Invitation Cards', studio:'Print Studio', price:'₦25,000 / 50',
      description:'An invitation suite designed around your event, with premium paper and optional foil and envelopes.',
      options:['Textured paper','Gold foil option','Custom envelopes','RSVP card'], kind:'invitation', icon:'invite',
      samples:[['Gold foil','A formal, warm invitation with a foil focal point.','warm'],['Minimal white','A clean type-led event announcement.','minimal'],['Royal dark','A dramatic dark stock with bright detail.','bold']]
    },
    'tshirts-merch': {
      title:'T-Shirts & Merch', studio:'Print Studio', price:'From ₦8,000',
      description:'Branded apparel and merchandise using sharp, durable printing for individuals, teams and events.',
      options:['Premium cotton blend','DTF printing','Sublimation','Bulk team pricing'], kind:'apparel', icon:'shirt',
      samples:[['Studio uniform','A small chest mark with a considered back print.','minimal'],['Team drop','A bold front graphic for an event or crew.','bold'],['Merch capsule','A cohesive tee and cap direction for a brand.','editorial']]
    },
    'custom-mugs': {
      title:'Custom Mugs', studio:'Print Studio', price:'From ₦5,500',
      description:'Premium ceramic mugs with full-wrap sublimation; choose a simple branded piece or a personalised gift direction.',
      options:['Premium ceramic','Full-wrap sublimation','Dishwasher-safe print','Gift box available'], kind:'mug', icon:'mug',
      samples:[['Daily ritual','A minimal wordmark wrap for the office or studio.','minimal'],['Colour block','A bright full-wrap campaign treatment.','bold'],['Personal gift','A name-led keepsake with a soft palette.','warm']]
    },
    'packaging-boxes': {
      title:'Packaging & Boxes', studio:'Print Studio', price:'Custom quote',
      description:'Packaging projects can include structural and graphic design for boxes, pouches and labels, in small or large runs.',
      options:['Product boxes','Shipping boxes','Pouches','Labels included'], kind:'package', icon:'package',
      samples:[['Kraft essentials','A natural, clear-label package direction.','editorial'],['Premium black','A dark rigid-box concept with a teal reveal.','minimal'],['Colour story','A bright shelf-ready package system.','bold']]
    },
    'exercise-books': {
      title:'Exercise Books', studio:'Print Studio', price:'From ₦45,000',
      description:'Branded exercise books for schools, events and organisations, with a designed cover and flexible page count.',
      options:['Custom cover design','School branding','Any page count','Bulk pricing'], kind:'stationery', icon:'book',
      samples:[['School identity','A clear crest area and subject coding.','bold'],['Classroom set','A coordinated series of books by colour.','editorial'],['Campaign edition','Branded notebooks for outreach and events.','minimal']]
    },
    'memo-pads': {
      title:'Memo Pads', studio:'Print Studio', price:'From ₦18,000',
      description:'Branded memo and note pads designed to keep your identity on desks, counters and meeting tables.',
      options:['A5 or A6 pads','Branded header','50 or 100 sheets','Carbonless option'], kind:'stationery', icon:'note',
      samples:[['Corporate desk','A neat header, ample writing space and footer.','minimal'],['Studio notes','A colour-accented pad for a creative team.','bold'],['Order pad','A functional customer-facing order form direction.','editorial']]
    },
    'key-holders': {
      title:'Key Holders', studio:'Print Studio', price:'From ₦15,000',
      description:'Card-style key holders for hotels, estates, gifts and hospitality, with optional leather finishes or embossing.',
      options:['Card-style holder','Leather finish','Logo emboss','Gift packs'], kind:'key', icon:'key',
      samples:[['Hotel welcome','Room identity and return details, clearly placed.','warm'],['Estate access','A durable, minimal property key tag.','minimal'],['Gift finish','A branded keepsake for a customer or event.','editorial']]
    },
    'cloth-labels-tags': {
      title:'Cloth Labels & Tags', studio:'Print Studio', price:'From ₦20,000',
      description:'Woven labels, printed hang tags and care labels that make a garment feel finished and recognisably yours.',
      options:['Woven labels','Printed tags','Hang tags','Care labels'], kind:'label', icon:'tag',
      samples:[['Woven signature','A compact woven name label for apparel.','minimal'],['Boutique hang tag','A shaped tag with room for a short brand story.','warm'],['Care label','Clear care instructions in a tidy small format.','editorial']]
    },
    'face-cap-printing': {
      title:'Face Cap Printing', studio:'Print Studio', price:'From ₦12,000',
      description:'Custom caps for teams, campaigns and merchandise, with embroidered or printed artwork.',
      options:['Embroidery','Printed caps','Custom colours','Team bulk'], kind:'apparel', icon:'cap',
      samples:[['Embroidered mark','A compact mark centred on a structured cap.','minimal'],['Team cap','A high-contrast team colour direction.','bold'],['Campaign edition','A message-led cap treatment for an event.','warm']]
    },
    'badges': {
      title:'Badges', studio:'Print Studio', price:'From ₦15,000',
      description:'Pin and button badges for staff, events and campaigns; artwork can be adapted to your shape and quantity.',
      options:['Pin badges','Button badges','Any shape','Event bulk'], kind:'badge', icon:'badge',
      samples:[['Staff identity','Role and brand mark for a team uniform.','minimal'],['Event badge','A bold colour-coded pass for an event.','bold'],['Campaign badge','A concise message with a clear emblem.','warm']]
    },
    'political-posters': {
      title:'Political Posters', studio:'Print Studio', price:'From ₦25,000',
      description:'High-impact campaign posters with a clear candidate/name area, message hierarchy and outdoor-grade print options.',
      options:['A2 or A3 sizes','Outdoor-grade ink','Bulk pricing','Design included'], kind:'poster', icon:'megaphone',
      samples:[['Bold rally','Large name, readable promise and clear colour blocks.','bold'],['Trust blue','An orderly, institutional campaign direction.','editorial'],['Grassroots','A warm, local-community poster style.','warm']]
    },
    'banners-large-format': {
      title:'Banners & Large Format', studio:'Print Studio', price:'From ₦30,000',
      description:'Flex banners, roll-up stands and large-format prints prepared for viewing distance and the installation space.',
      options:['Flex banners','Roll-up stands','Any size','Outdoor-grade option'], kind:'banner', icon:'banner',
      samples:[['Roll-up display','A vertical event or reception banner.','minimal'],['Storefront flex','A high-contrast outdoor-facing business banner.','bold'],['Event backdrop','A repeatable logo wall and sponsor layout.','editorial']]
    },
    'direct-smart-card': {
      title:'Direct Smart Card', studio:'Smart Card Studio', price:'Cardstock ₦15,000 · PVC ₦25,000',
      description:'A direct destination card: tap or scan to open the one link you choose, such as WhatsApp, Instagram, LinkedIn or your website.',
      options:['Cardstock or PVC','NFC tap + QR','WhatsApp or social link','Matte Noir or Pure White'], kind:'card', icon:'nfc',
      samples:[['Matte Noir','A dark card with a clear tap/scan cue.','minimal'],['Pure White','A bright, simple route to one destination.','editorial'],['Brand colour','A custom colour treatment built around your identity.','bold']]
    },
    'premium-portfolio-card': {
      title:'Premium Portfolio Card', studio:'Smart Card Studio', price:'Cardstock ₦35,000 · PVC ₦45,000',
      description:'A tap-and-scan card that opens your own editable business page, with your profile, services, gallery and contact actions.',
      options:['Cardstock or PVC','Profile page','Services and gallery','Edit through dashboard'], kind:'profile', icon:'profile',
      samples:[['Signature dark','A profile-first page with a confident business identity.','minimal'],['Clean light','A light editorial profile with strong contact actions.','editorial'],['Portfolio layout','A visual-first page for a creative business.','bold']]
    },
    'digital-business-profile': {
      title:'Digital Business Profile', studio:'Smart Card Studio', price:'Included with Premium Portfolio Card',
      description:'A shareable business page that presents the owner, services, selected work and a clear way to enquire.',
      options:['Profile and owner details','Contact buttons','Gallery and services','Editable page'], kind:'profile', icon:'profile',
      samples:[['Owner profile','A clear personal introduction and contact route.','editorial'],['Service business','Services, opening details and an enquiry action.','minimal'],['Team profile','Owner plus optional team member cards.','bold']]
    },
    'business-websites': {
      title:'Business Websites', studio:'Mobile & Web Studio', price:'From ₦150,000',
      description:'A mobile-first business site or landing page, planned around your audience, message and next action.',
      options:['Landing page','Business site','Portfolio','Hosting included in offer'], kind:'web', icon:'web',
      samples:[['Service business','Clear offer, proof points and a contact action.','minimal'],['Editorial brand','A story-led site with image and type hierarchy.','editorial'],['Digital-first','A bold product page with a strong conversion path.','bold']]
    },
    'ecommerce-stores': {
      title:'E-commerce Stores', studio:'Mobile & Web Studio', price:'From ₦250,000',
      description:'An online store concept with product catalogue, payment setup, order tracking and WhatsApp checkout options.',
      options:['Product catalogue','Payments setup','Order tracking','WhatsApp checkout'], kind:'shop', icon:'shop',
      samples:[['Curated shop','A refined product grid for a focused collection.','editorial'],['Everyday store','Categories, availability and a quick purchase path.','minimal'],['Market drop','Campaign-led store for a limited collection.','bold']]
    },
    'mobile-apps': {
      title:'Mobile Apps', studio:'Mobile & Web Studio', price:'From ₦400,000',
      description:'A product preview for iOS and Android, with the user journey, core screens and launch scope shaped around your brief.',
      options:['iOS + Android','Push notifications','Payments','App store launch'], kind:'device', icon:'phone',
      samples:[['Consumer app','A clear browse, detail and account experience.','bold'],['Business app','A compact dashboard for everyday tasks.','minimal'],['Booking app','Service discovery, selection and booking flow.','editorial']]
    },
    'business-systems': {
      title:'Business Systems', studio:'Mobile & Web Studio', price:'Custom quote',
      description:'A tailored web system for a school, hospital, inventory or POS workflow, scoped to the real roles and reports you need.',
      options:['Web dashboard','Staff accounts','Reports','Training included'], kind:'dashboard', icon:'dashboard',
      samples:[['School admin','Student, class and payment overview.','minimal'],['Inventory control','Stock movements and low-stock signals.','editorial'],['POS operations','Sales summary and transaction workflow.','bold']]
    }
  };

  var ICONS = {
    spark:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    brand:'<path d="M4 7h16M4 12h10M4 17h7"/><circle cx="18" cy="16" r="3"/>',
    social:'<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><path d="M17.5 6.8h.01"/>',
    menu:'<path d="M4 5h16M4 10h16M4 15h10M4 19h7"/><path d="m17 17 2 2 3-4"/>',
    poster:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h5M8 15h8"/>',
    card:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    sticker:'<path d="M5 3h14v12l-6 6H5z"/><path d="M13 21v-6h6"/><path d="M8 8h8M8 12h4"/>',
    invite:'<path d="M4 6h16v13H4z"/><path d="m4 8 8 6 8-6"/><path d="M8 3h8"/>',
    shirt:'<path d="m8 4 4 2 4-2 5 4-3 4-2-1v10H8V11l-2 1-3-4z"/>',
    mug:'<path d="M5 7h12v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M17 9h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/>',
    package:'<path d="m4 7 8-4 8 4v10l-8 4-8-4z"/><path d="m4 7 8 4 8-4M12 11v10M8 5l8 4"/>',
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8"/>',
    note:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3v3M15 3v3M8 10h8M8 14h8M8 18h5"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8 2 2-2 2 2 2-3 3-2-2-3 3"/>',
    tag:'<path d="M20 13 13 20 3 10V4h6z"/><circle cx="7.5" cy="8" r="1"/><path d="m12 7 5 5"/>',
    cap:'<path d="M3 15c1-4 4-7 9-7s8 3 9 7v2H3z"/><path d="M3 15c3 2 6 2 10 1 3-1 5-1 8 1M12 8V5"/>',
    badge:'<circle cx="12" cy="10" r="7"/><path d="m8.5 16-1 6 4.5-2.5 4.5 2.5-1-6M9.5 10l1.7 1.7 3.5-3.5"/>',
    megaphone:'<path d="m4 13 14 5V6L4 11z"/><path d="M4 13l2 7h4l-2-6M18 9h2a2 2 0 0 1 0 4h-2"/>',
    banner:'<path d="M4 4v16M4 5h15l-3 4 3 4H4"/><path d="M7 8h6M7 11h4"/>',
    nfc:'<path d="M6.5 4.2a10.8 10.8 0 0 1 0 15.6M10 7.5a6.2 6.2 0 0 1 0 9M13.5 10.6a1.9 1.9 0 0 1 0 2.8"/><circle cx="17.6" cy="12" r="1" fill="currentColor" stroke="none"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M18 5h4M20 3v4"/>',
    web:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M3 8h18"/>',
    shop:'<path d="M4 9h16l-1 12H5zM3 9l2-6h14l2 6M9 13v2M15 13v2"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    dashboard:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M12 13h5M12 16h5"/>'
  };

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function iconSvg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>';
  }

  var iconSlots = document.querySelectorAll('.offer-icon[data-icon]');
  for (var ii = 0; ii < iconSlots.length; ii++) iconSlots[ii].innerHTML = iconSvg(iconSlots[ii].getAttribute('data-icon'));

  var dialog = document.getElementById('productSampleDialog');
  var titleEl = document.getElementById('productSampleTitle');
  var descriptionEl = document.getElementById('productSampleDescription');
  var studioEl = document.getElementById('productSampleStudio');
  var priceEl = document.getElementById('productSamplePrice');
  var gridEl = document.getElementById('productSampleGrid');
  var optionsEl = document.getElementById('productSampleOptions');
  var sampleIconEl = document.getElementById('productSampleIcon');
  var addProjectBtn = document.getElementById('addProductToProject');
  var feedbackEl = document.getElementById('productSampleFeedback');
  var tray = document.getElementById('projectTray');
  var trayCount = document.getElementById('projectTrayCount');
  var trayLabel = document.getElementById('projectTrayLabel');
  var traySend = document.getElementById('sendProjectItems');
  var clearBtn = document.getElementById('clearProjectItems');
  var currentId = null;
  var lastOpener = null;
  var STORE_KEY = 'ps_project_items_v1';

  function readSelection() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      return Array.isArray(stored) ? stored.filter(function (id) { return !!CATALOG[id]; }) : [];
    } catch (e) { return []; }
  }
  var selected = readSelection();
  function saveSelection() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(selected)); } catch (e) { /* shortlist still works for this page load */ }
  }
  function projectPayload() {
    return selected.map(function (id) {
      var product = CATALOG[id];
      return { id:id, title:product.title, studio:product.studio, listedPrice:product.price };
    });
  }
  function notifyProjectChange() {
    var payload = projectPayload();
    try { window.dispatchEvent(new CustomEvent('pixelstudios:projectchange', { detail:{ items:payload } })); } catch (e) { /* custom event is an optional integration */ }
    var api = window.PixelStudiosAPI;
    if (api && typeof api.onProjectBriefChange === 'function') {
      try { api.onProjectBriefChange(payload); } catch (e) { /* backend integration must not block the demo shortlist */ }
    }
  }
  function setSelection(id, shouldAdd) {
    selected = selected.filter(function (entry) { return entry !== id; });
    if (shouldAdd) selected.push(id);
    saveSelection();
    renderTray();
    updateRowButtons();
    updateModalAddButton();
    notifyProjectChange();
  }
  function updateRowButtons() {
    var buttons = document.querySelectorAll('[data-open-sample][data-item]');
    for (var i = 0; i < buttons.length; i++) {
      var isAdded = selected.indexOf(buttons[i].getAttribute('data-item')) !== -1;
      buttons[i].setAttribute('aria-pressed', isAdded ? 'true' : 'false');
      buttons[i].setAttribute('aria-label', isAdded ? 'View ' + CATALOG[buttons[i].getAttribute('data-item')].title + ' samples; already added to your project' : 'Add ' + CATALOG[buttons[i].getAttribute('data-item')].title + ' to a project and view samples');
      var span = buttons[i].querySelector('span:last-child');
      if (span) span.textContent = isAdded ? 'View' : 'Add';
    }
  }
  function renderTray() {
    if (!tray) return;
    tray.hidden = selected.length === 0;
    if (trayCount) trayCount.textContent = String(selected.length);
    if (trayLabel) trayLabel.textContent = selected.length === 1 ? 'item in your project' : 'items in your project';
    if (traySend) {
      var names = selected.map(function (id) { return CATALOG[id].title; });
      var message = 'Hello Pixel Studios! I would like to discuss these items for my project:\n\n' + names.map(function (name) { return '• ' + name; }).join('\n') + '\n\nPlease confirm options, quantity, exact pricing and timeline.';
      traySend.href = 'https://wa.me/2349031528732?text=' + encodeURIComponent(message);
    }
  }
  function updateModalAddButton() {
    if (!addProjectBtn || !currentId) return;
    var isAdded = selected.indexOf(currentId) !== -1;
    addProjectBtn.setAttribute('aria-pressed', isAdded ? 'true' : 'false');
    addProjectBtn.innerHTML = isAdded ? '<span aria-hidden="true">✓</span> Added to my project · Remove' : '<span aria-hidden="true">+</span> Add to my project';
  }
  function productArtwork(kind, index, product) {
    var mark = iconSvg(product.icon);
    var word = ['COMMON GROUND','STUDIO NORTH','GOOD THINGS'][index % 3];
    var small = ['YOUR NEXT CHAPTER','MADE WITH INTENTION','A BETTER EVERYDAY'][index % 3];
    var layouts = {
      brand:'<div class="sample-art-object art-brand"><span class="art-brand-mark">' + mark + '</span><span class="art-brand-name">' + word.split(' ')[0] + '<i>' + word.split(' ').slice(1).join(' ') + '</i></span><small>IDENTITY SYSTEM</small></div>',
      social:'<div class="sample-art-object art-social"><span class="art-social-top"><i>PS</i> SOCIAL / 01</span><strong>' + small.split(' ').slice(0,2).join('<br>') + '</strong><span>NEW SEASON · NOW LIVE</span></div>',
      menu:'<div class="sample-art-object art-menu"><span>MENU <i>·</i> TODAY</span><b>Seasonal favourites</b><i>House bowl <em></em> Price</i><i>Fresh plate <em></em> Price</i><i>Something sweet <em></em> Price</i></div>',
      poster:'<div class="sample-art-object art-poster"><span>MAKE ROOM FOR</span><b>GOOD<br>IDEAS.</b><i>CREATIVE WEEK / 2026</i></div>',
      card:'<div class="sample-art-object art-card"><span class="art-card-mark">' + mark + '</span><b>' + word + '</b><small>BUSINESS · PROFILE</small><i>PIXEL STUDIOS / CONCEPT</i></div>',
      nfc:'<div class="sample-art-object art-card art-nfc"><span class="art-card-mark">' + mark + '</span><b>' + word + '</b><small>TAP OR SCAN</small><span class="art-qr" aria-hidden="true"></span></div>',
      profile:'<div class="sample-art-object art-profile"><span class="art-profile-top"><i>' + initialsFor(product.title) + '</i><b>YOUR BUSINESS<br><small>PROFILE PAGE</small></b>···</span><strong>' + small + '</strong><span>ABOUT&nbsp;&nbsp; SERVICES&nbsp;&nbsp; CONTACT</span><i class="art-profile-button">View profile&nbsp; →</i></div>',
      web:'<div class="sample-art-object art-browser"><span class="art-browser-top"><i></i><i></i><i></i><small>yourbrand.com</small></span><span class="art-web-nav">BRAND NAME <i>MENU</i></span><b>' + small + '</b><small>WEBSITE / LANDING PAGE</small><span class="art-web-cta">Explore <i>→</i></span></div>',
      shop:'<div class="sample-art-object art-shop"><span class="art-shop-top">THE EDIT <i>SHOP / NEW IN</i></span><span class="art-product-grid"><i><b></b><small>01</small></i><i><b></b><small>02</small></i><i><b></b><small>03</small></i></span><strong>Thoughtful goods, chosen for you.</strong></div>',
      device:'<div class="sample-art-object art-phone"><span class="art-phone-island"></span><b>' + small + '</b><i>Discover</i><span class="art-phone-cards"><em></em><em></em></span><small>HOME&nbsp;&nbsp; EXPLORE&nbsp;&nbsp; ACCOUNT</small></div>',
      dashboard:'<div class="sample-art-object art-dashboard"><span class="art-dashboard-top">WORKSPACE <i>•••</i></span><b>Overview</b><span class="art-stat-grid"><i><small>ACTIVITY</small><strong>24</strong></i><i><small>UPDATES</small><strong>08</strong></i></span><span class="art-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>',
      apparel:'<div class="sample-art-object art-wear"><svg viewBox="0 0 120 100" aria-hidden="true"><path d="M37 13 51 7h18l14 6 23 14-12 18-12-7v54H38V38l-12 7-12-18z"/><path d="M49 9c1 10 21 10 22 0"/></svg><span class="art-wear-mark">' + mark + '</span></div>',
      mug:'<div class="sample-art-object art-mug"><svg viewBox="0 0 120 100" aria-hidden="true"><path d="M19 25h65v48a14 14 0 0 1-14 14H33a14 14 0 0 1-14-14z"/><path d="M84 35h9a16 16 0 0 1 0 32h-9"/><path d="M34 14v7M52 14v7M69 14v7"/></svg><span class="art-mug-mark">' + mark + '</span></div>',
      package:'<div class="sample-art-object art-box"><svg viewBox="0 0 120 100" aria-hidden="true"><path d="m20 30 40-20 40 20v48L60 96 20 78z"/><path d="m20 30 40 21 40-21M60 51v45M40 20l40 21"/></svg><span class="art-box-mark">' + mark + '</span></div>',
      stationery:'<div class="sample-art-object art-stationery"><span class="art-notebook art-notebook-back"></span><span class="art-notebook"><i>' + mark + '</i><b>NOTES<br>&amp; IDEAS</b><small>STUDIO EDITION</small></span></div>',
      key:'<div class="sample-art-object art-key"><span class="art-key-ring"></span><span class="art-key-tag"><i>' + mark + '</i><b>WELCOME</b><small>YOUR BRAND</small></span></div>',
      label:'<div class="sample-art-object art-label"><span class="art-label-shape"><i>' + mark + '</i><b>MADE WITH<br>CARE</b><small>BRAND LABEL</small></span><span class="art-label-small">CUSTOM<br>FINISH</span></div>',
      invitation:'<div class="sample-art-object art-invitation"><span>YOU ARE INVITED</span><b>AN EVENING<br>TO REMEMBER</b><i>FRIDAY · 7 PM</i><small>PLEASE JOIN US</small></div>',
      badge:'<div class="sample-art-object art-badge"><span class="art-badge-disc"><i>' + mark + '</i><b>YOUR<br>TEAM</b></span><small>MADE TO WEAR</small></div>',
      banner:'<div class="sample-art-object art-banner"><span class="art-banner-pole"></span><span class="art-banner-face"><i>' + mark + '</i><b>' + small.split(' ').slice(0,2).join('<br>') + '</b><small>WELCOME / CONNECT</small></span><span class="art-banner-base"></span></div>'
    };
    return '<div class="sample-art-visual" aria-hidden="true">' + (layouts[kind] || layouts.brand) + '</div>';
  }
  function initialsFor(text) {
    var pieces = String(text || '').split(/\s+/).filter(Boolean), result = '';
    for (var i = 0; i < pieces.length && result.length < 2; i++) result += pieces[i].charAt(0).toUpperCase();
    return result || 'PS';
  }
  function renderProductSamples(product) {
    titleEl.textContent = product.title;
    descriptionEl.textContent = product.description;
    studioEl.textContent = product.studio;
    priceEl.textContent = product.price;
    sampleIconEl.innerHTML = iconSvg(product.icon);
    optionsEl.innerHTML = product.options.map(function (option) { return '<span>' + escapeHtml(option) + '</span>'; }).join('');
    gridEl.innerHTML = product.samples.map(function (sample, index) {
      var name = sample[0], detail = sample[1], kind = sample[2];
      var color = ['#00bfb8','#d6b27a','#7894dc'][index % 3];
      return '<article class="product-sample-card"><div class="product-sample-art" data-kind="' + escapeHtml(kind) + '" data-product="' + escapeHtml(product.kind) + '" style="--sample-accent:' + color + '">' +
        '<div class="sample-art-top"><span>PIXEL STUDIOS / CONCEPT</span><span>0' + (index + 1) + '</span></div>' + productArtwork(product.kind, index, product) +
        '<div class="sample-art-mark">' + iconSvg(product.icon) + '</div>' +
        '<div class="sample-art-copy"><strong>' + escapeHtml(name) + '</strong><span>' + escapeHtml(detail) + '</span></div>' +
        '<div class="sample-art-bottom"><span>' + escapeHtml(product.title.toUpperCase()) + '</span><span>DESIGN DIRECTION</span></div></div>' +
        '<div class="product-sample-card-body"><span>Direction 0' + (index + 1) + '</span><h4>' + escapeHtml(name) + '</h4><p>' + escapeHtml(detail) + '</p></div></article>';
    }).join('');
  }
  function openSample(id, opener) {
    var product = CATALOG[id];
    if (!product || !dialog) return;
    currentId = id;
    lastOpener = opener || document.activeElement;
    if (feedbackEl) feedbackEl.textContent = '';
    renderProductSamples(product);
    updateModalAddButton();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', 'open');
    var back = dialog.querySelector('[data-close-product-sample]');
    if (back) window.setTimeout(function () { back.focus(); }, 0);
  }
  function closeSample() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  document.addEventListener('click', function (e) {
    var openButton = e.target && e.target.closest ? e.target.closest('[data-open-sample][data-item]') : null;
    if (openButton) {
      e.preventDefault();
      openSample(openButton.getAttribute('data-item'), openButton);
      return;
    }
    var closeButton = e.target && e.target.closest ? e.target.closest('[data-close-product-sample]') : null;
    if (closeButton) { e.preventDefault(); closeSample(); return; }
    if (e.target === dialog) { closeSample(); return; }
  });
  if (dialog) {
    dialog.addEventListener('close', function () {
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
      lastOpener = null;
    });
  }
  if (addProjectBtn) addProjectBtn.addEventListener('click', function () {
    if (!currentId) return;
    var added = selected.indexOf(currentId) === -1;
    setSelection(currentId, added);
    if (feedbackEl) feedbackEl.textContent = added ? CATALOG[currentId].title + ' added to your project brief.' : CATALOG[currentId].title + ' removed from your project brief.';
  });
  if (clearBtn) clearBtn.addEventListener('click', function () {
    selected = [];
    saveSelection();
    renderTray();
    updateRowButtons();
    updateModalAddButton();
    notifyProjectChange();
  });
  updateRowButtons();
  renderTray();
})();
