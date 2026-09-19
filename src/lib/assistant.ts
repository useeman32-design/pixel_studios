export type AiChip = { label: string; route?: string; reply?: string };
export type AiReply = { text: string; chips?: AiChip[] };

export const AI_NAME = 'Pixel AI';

export const greeting: AiReply = {
  text:
    "Hi, I'm Pixel AI 👋 — the studio's assistant. I can help you order products, pick the right services, or figure out exactly what your brand needs.\n\nWhat can I help you with today?",
  chips: [
    { label: 'I need branding', reply: 'I need branding for my business' },
    { label: 'I want NFC cards', reply: 'I want NFC business cards' },
    { label: 'Something printed', reply: 'I need printing' },
    { label: 'Website or app', reply: 'I need a website or app' },
    { label: 'Help me decide', reply: 'Help me decide what I need' },
  ],
};

const startChip: AiChip = { label: 'Start a Project', route: '/start' };
const chatChip: AiChip = { label: 'Talk to the team', route: '/chat' };

function packageReply(intro: string, items: string[], chips: AiChip[]): AiReply {
  const list = items.map((i) => `• ${i}`).join('\n');
  return { text: `${intro}\n\n${list}`, chips };
}

export function aiRespond(raw: string): AiReply {
  const input = raw.toLowerCase();
  const has = (...words: string[]) => words.some((w) => input.includes(w));

  /* ------------------------------ guided flow ------------------------------ */
  if (has('restaurant', 'café', 'cafe', 'food', 'kitchen', 'eatery')) {
    return packageReply(
      'For a restaurant, this is the setup most of our food clients start with:',
      [
        'Logo & brand identity (Pixel Creative)',
        'Menu design — plus an NFC digital menu for tables (Pixel Smart)',
        'Packaging for takeaway orders',
        'Social media launch designs (Pixel Marketing)',
      ],
      [
        { label: 'See the NFC menu card', route: '/nfc' },
        { label: 'Start this package', route: '/start' },
        chatChip,
      ],
    );
  }
  if (has('boutique', 'fashion', 'clothing', 'salon', 'barber', 'beauty')) {
    return packageReply(
      'For a fashion or beauty business, I would recommend:',
      [
        'Brand identity — logo, colors & style (Pixel Creative)',
        'Stickers & labels for your packaging',
        'Branded bags, tags or apparel',
        'Instagram content designs to attract clients',
      ],
      [
        { label: 'See premium stickers', route: '/product/premium-stickers' },
        { label: 'Start with branding', route: '/start' },
        chatChip,
      ],
    );
  }
  if (has('startup', 'tech', 'app idea', 'new business', 'company')) {
    return packageReply(
      'For a startup, the strongest launch kit is:',
      [
        'Logo + full brand identity',
        'NFC business cards for networking (one tap shares everything)',
        'A professional website or landing page',
        'Pitch or social media design pack',
      ],
      [
        { label: 'See NFC cards', route: '/nfc' },
        { label: 'Start your launch kit', route: '/start' },
        chatChip,
      ],
    );
  }
  if (has('school', 'hospital', 'clinic', 'organization', 'ngo')) {
    return packageReply(
      'For schools, hospitals and organizations we typically build:',
      [
        'Official branding & letterheads',
        'ID cards for staff and members',
        'A management system (school, hospital or inventory)',
        'Official website',
      ],
      [
        { label: 'Start a conversation', route: '/start' },
        chatChip,
      ],
    );
  }
  if (has('help me decide', 'not sure', 'unsure', 'what do i need', 'decide')) {
    return {
      text:
        "No problem — that's what I'm here for. Tell me what kind of business you run and I'll suggest the right starting package:",
      chips: [
        { label: 'Restaurant / food', reply: 'I run a restaurant' },
        { label: 'Fashion / beauty', reply: 'I have a boutique fashion business' },
        { label: 'Startup', reply: 'I am building a startup' },
        { label: 'School / organization', reply: 'I run a school or organization' },
      ],
    };
  }

  /* -------------------------------- ordering ------------------------------- */
  if (has('nfc', 'smart card', 'tap card', 'digital card')) {
    return {
      text:
        'Great choice — our signature product. The Smart NFC Business Card shares your name, phone, WhatsApp, email, website and socials with one tap. From ₦25,000, and the digital profile is editable forever.',
      chips: [
        { label: 'Configure & order', route: '/nfc' },
        { label: 'See a digital profile', route: '/nfc-profile' },
        chatChip,
      ],
    };
  }
  if (has('business card') && !has('nfc')) {
    return {
      text:
        'We print premium business cards on thick 420gsm stock — matte or gloss, from ₦15,000 per 100. Want to go further? The NFC version shares your whole profile with one tap.',
      chips: [
        { label: 'Order premium cards', route: '/product/premium-business-card' },
        { label: 'Compare with NFC', route: '/nfc' },
      ],
    };
  }
  if (has('t-shirt', 'tshirt', 'shirt', 'apparel', 'merch', 'cap')) {
    return {
      text: 'We produce branded apparel — premium cotton tees from ₦8,000 with sharp DTF prints. Bulk team pricing available.',
      chips: [{ label: 'See branded t-shirts', route: '/product/branded-tshirt' }, startChip],
    };
  }
  if (has('mug')) {
    return {
      text: 'Custom mugs from ₦5,500 — full-wrap sublimation that survives the dishwasher.',
      chips: [{ label: 'See custom mugs', route: '/product/custom-mug' }],
    };
  }
  if (has('sticker', 'label')) {
    return {
      text: 'Premium die-cut stickers and product labels from ₦12,000 per 100 — waterproof vinyl available.',
      chips: [{ label: 'See premium stickers', route: '/product/premium-stickers' }],
    };
  }
  if (has('invitation', 'wedding', 'event card')) {
    return {
      text: 'Elegant invitation suites from ₦25,000 per 50 — textured paper, gold foil and custom envelopes.',
      chips: [{ label: 'See invitation cards', route: '/product/invitation-cards' }],
    };
  }
  if (has('packaging', 'box', 'pouch')) {
    return {
      text: 'Custom packaging is quoted per project — boxes, pouches, labels and full brand systems. Share your product details and we will price it.',
      chips: [{ label: 'See packaging', route: '/product/product-packaging' }, startChip],
    };
  }
  if (has('print', 'flyer', 'poster')) {
    return {
      text: 'For printing we cover business cards, flyers, posters, stickers, banners and apparel. Browse the shop or tell me the specific item.',
      chips: [
        { label: 'Browse the shop', route: '/shop' },
        { label: 'Flyers & posters', reply: 'I need flyers' },
      ],
    };
  }

  /* -------------------------------- services ------------------------------- */
  if (has('brand', 'logo', 'identity')) {
    return {
      text:
        'Branding is where strong businesses start. Our Creative studio designs logos, full identities and brand guidelines — the same team then rolls it onto cards, packaging and social media so everything matches.',
      chips: [
        { label: 'See the Creative studio', route: '/service/creative' },
        startChip,
      ],
    };
  }
  if (has('website', 'web', 'app', 'software', 'system', 'dashboard', 'ecommerce', 'e-commerce', 'online store')) {
    return {
      text:
        'Our Digital studio takes you from idea to launch: business websites, e-commerce stores, mobile apps and management systems — with hosting and maintenance included.',
      chips: [
        { label: 'See the Digital studio', route: '/service/digital' },
        { label: 'See app work', route: '/portfolio' },
        startChip,
      ],
    };
  }
  if (has('market', 'social media', 'instagram', 'promotion', 'advert', 'seo')) {
    return {
      text: 'Pixel Marketing grows your presence: content design, campaigns, SEO and page management built for the Nigerian market.',
      chips: [startChip, chatChip],
    };
  }
  if (has('menu')) {
    return {
      text: 'For menus we offer both printed menu design and NFC digital menus — customers tap the table card and your menu opens on their phone.',
      chips: [{ label: 'See NFC solutions', route: '/nfc' }, startChip],
    };
  }

  /* ------------------------------ general topics ---------------------------- */
  if (has('price', 'cost', 'how much', 'budget', 'expensive', 'cheap')) {
    return {
      text:
        'Quick price guide:\n\n• Business cards — from ₦15,000/100\n• NFC Smart Card — from ₦25,000\n• T-shirts — from ₦8,000\n• Mugs — from ₦5,500\n• Stickers — from ₦12,000/100\n\nBranding, websites and systems are quoted per project. Want an exact quote?',
      chips: [startChip, { label: 'Open the shop', route: '/shop' }],
    };
  }
  if (has('order', 'track', 'delivery', 'status')) {
    return {
      text: 'You can follow every order from design approval to delivery in the Orders tab.',
      chips: [{ label: 'View my orders', route: '/orders' }, chatChip],
    };
  }
  if (has('location', 'where', 'address', 'gusau')) {
    return {
      text: 'Pixel Studios is based in Gusau, Zamfara State — and we serve clients across Nigeria with delivery and remote projects.',
      chips: [chatChip],
    };
  }
  if (has('hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening')) {
    return {
      text: 'Hello! 👋 Tell me what you are working on — a brand, a print order, a website — and I will point you in the right direction.',
      chips: [
        { label: 'Help me decide', reply: 'Help me decide what I need' },
        { label: 'Browse the shop', route: '/shop' },
      ],
    };
  }
  if (has('thank', 'thanks')) {
    return { text: 'You are welcome! I am here whenever you need me. 🎨', chips: [chatChip] };
  }

  /* --------------------------------- fallback -------------------------------- */
  return {
    text:
      "I can help with orders, pricing and choosing the right service — try one of these, or describe your project and I'll route it to the team:",
    chips: [
      { label: 'Help me decide', reply: 'Help me decide what I need' },
      { label: 'See pricing', reply: 'How much do things cost?' },
      startChip,
      chatChip,
    ],
  };
}
