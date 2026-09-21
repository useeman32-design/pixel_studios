export type OfferDesign = { name: string; colors: [string, string] };

export type Offer = {
  id: string;
  categoryId: string;
  name: string;
  blurb: string;
  image: any;
  priceFrom?: number;
  quoteOnly?: boolean;
  /** When set, the grid card deep-links here instead of /offer/[id]. */
  link?: string;
  designs: OfferDesign[];
  types: string[];
};

export const offers: Offer[] = [
  /* -------------------------------- PRINT -------------------------------- */
  {
    id: 'business-cards',
    categoryId: 'print',
    name: 'Business Cards',
    blurb: 'Thick-stock premium cards that feel as good as they look.',
    image: require('../../assets/images/products/cards.jpg'),
    priceFrom: 15000,
    designs: [
      { name: 'Matte Noir', colors: ['#101014', '#26262E'] },
      { name: 'Classic Ivory', colors: ['#EDEAE2', '#D9D4C7'] },
      { name: 'Ocean', colors: ['#0E7490', '#22D3EE'] },
      { name: 'Emerald Edge', colors: ['#065F46', '#34D399'] },
    ],
    types: ['Matte finish', 'Gloss finish', 'Textured paper', 'Rounded corners'],
  },
  {
    id: 'flyers',
    categoryId: 'print',
    name: 'Flyers & Posters',
    blurb: 'Sharp full-color prints for campaigns and events.',
    image: require('../../assets/images/portfolio/print.jpg'),
    priceFrom: 20000,
    designs: [
      { name: 'Bold Pop', colors: ['#F59E0B', '#EF4444'] },
      { name: 'Minimal', colors: ['#18181B', '#3F3F46'] },
      { name: 'Photo Hero', colors: ['#0EA5E9', '#6366F1'] },
      { name: 'Corporate', colors: ['#1E3A8A', '#3B82F6'] },
    ],
    types: ['A5', 'A4', 'A3', 'Double-sided'],
  },
  {
    id: 'stickers',
    categoryId: 'print',
    name: 'Stickers & Labels',
    blurb: 'Die-cut stickers and product labels that stick.',
    image: require('../../assets/images/products/stickers.jpg'),
    priceFrom: 12000,
    designs: [
      { name: 'Gloss', colors: ['#EC4899', '#8B5CF6'] },
      { name: 'Matte', colors: ['#18181B', '#52525B'] },
      { name: 'Clear', colors: ['#67E8F9', '#A5F3FC'] },
      { name: 'Holographic', colors: ['#8B5CF6', '#22D3EE'] },
    ],
    types: ['Any shape', 'Waterproof vinyl', 'Product labels', 'Roll format'],
  },
  {
    id: 'invitations',
    categoryId: 'print',
    name: 'Invitation Cards',
    blurb: 'Elegant invitations your guests will keep forever.',
    image: require('../../assets/images/products/invite.jpg'),
    priceFrom: 25000,
    designs: [
      { name: 'Gold Foil', colors: ['#B45309', '#FBBF24'] },
      { name: 'Minimal White', colors: ['#F5F5F4', '#D6D3D1'] },
      { name: 'Royal Dark', colors: ['#111113', '#7C3AED'] },
      { name: 'Floral', colors: ['#BE185D', '#FDA4AF'] },
    ],
    types: ['Textured paper', 'Gold foil', 'Custom envelope', 'RSVP card'],
  },
  {
    id: 'apparel',
    categoryId: 'print',
    name: 'T-Shirts & Merch',
    blurb: 'Branded apparel with sharp, lasting prints.',
    image: require('../../assets/images/products/tshirt.jpg'),
    priceFrom: 8000,
    designs: [
      { name: 'Street', colors: ['#18181B', '#BFF549'] },
      { name: 'Team', colors: ['#1D4ED8', '#60A5FA'] },
      { name: 'Merch Drop', colors: ['#7C3AED', '#EC4899'] },
      { name: 'Event', colors: ['#0F766E', '#2DD4BF'] },
    ],
    types: ['DTF print', 'Sublimation', 'Embroidery', 'Bulk team pricing'],
  },
  {
    id: 'packaging',
    categoryId: 'print',
    name: 'Packaging & Boxes',
    blurb: 'Custom boxes, pouches and packaging that sell.',
    image: require('../../assets/images/boxes.jpg'),
    quoteOnly: true,
    designs: [
      { name: 'Kraft', colors: ['#92400E', '#D97706'] },
      { name: 'Premium Black', colors: ['#0B0B0E', '#3F3F46'] },
      { name: 'Full Color', colors: ['#DB2777', '#F59E0B'] },
      { name: 'Luxury Foil', colors: ['#78350F', '#FCD34D'] },
    ],
    types: ['Product boxes', 'Shipping boxes', 'Pouches', 'Labels included'],
  },

  /* -------------------------------- DESIGN ------------------------------- */
  {
    id: 'logo',
    categoryId: 'creative',
    name: 'Logo Design',
    blurb: 'A distinctive mark built to represent you for years.',
    image: require('../../assets/images/cat-creative.jpg'),
    priceFrom: 25000,
    link: '/brief/logo',
    designs: [
      { name: 'Wordmark', colors: ['#18181B', '#71717A'] },
      { name: 'Monogram', colors: ['#7C3AED', '#C4B5FD'] },
      { name: 'Emblem', colors: ['#B45309', '#FBBF24'] },
      { name: 'Abstract', colors: ['#0EA5E9', '#22D3EE'] },
    ],
    types: ['3 concepts', 'Unlimited revisions', 'All file formats', 'Brand mini-guide'],
  },
  {
    id: 'brand-identity',
    categoryId: 'creative',
    name: 'Brand Identity',
    blurb: 'Colors, typography and visual language that feel like you.',
    image: require('../../assets/images/portfolio/branding.jpg'),
    priceFrom: 60000,
    link: '/brief/brand-identity',
    designs: [
      { name: 'Signature', colors: ['#111113', '#BFF549'] },
      { name: 'Playful', colors: ['#F59E0B', '#EC4899'] },
      { name: 'Luxury', colors: ['#78350F', '#F5F5F4'] },
      { name: 'Tech', colors: ['#1E3A8A', '#22D3EE'] },
    ],
    types: ['Logo suite', 'Color system', 'Typography', 'Brand guidelines'],
  },
  {
    id: 'social-media',
    categoryId: 'creative',
    name: 'Social Media Design',
    blurb: 'Scroll-stopping content designed for every platform.',
    image: require('../../assets/images/portfolio/social.jpg'),
    priceFrom: 15000,
    designs: [
      { name: 'Feed Kit', colors: ['#7C3AED', '#A78BFA'] },
      { name: 'Story Pack', colors: ['#EC4899', '#FDA4AF'] },
      { name: 'Campaign', colors: ['#F59E0B', '#EF4444'] },
      { name: 'Full Month', colors: ['#0EA5E9', '#22D3EE'] },
    ],
    types: ['Instagram', 'Facebook', 'WhatsApp status', 'TikTok covers'],
  },
  {
    id: 'menu-design',
    categoryId: 'creative',
    name: 'Digital Menu',
    blurb: 'A scannable, always-up-to-date menu page for your restaurant or café.',
    image: require('../../assets/images/menu.jpg'),
    priceFrom: 25000,
    link: '/menu-studio',
    designs: [
      { name: 'Classic Chalk', colors: ['#14161A', '#E8E4DA'] },
      { name: 'Café Light', colors: ['#8C5A3C', '#F3E5D6'] },
      { name: 'Fine Dining', colors: ['#0D0B08', '#D9B36C'] },
      { name: 'Printed Menu', colors: ['#78350F', '#FCD34D'] },
    ],
    types: ['QR table cards', 'Smart menu card', 'Menu page', 'Chalkboard style'],
  },

  /* -------------------------------- SMART -------------------------------- */
  {
    id: 'direct-card',
    categoryId: 'smart',
    name: 'Direct Smart Card',
    blurb: 'Scan or tap — it opens your WhatsApp, Instagram or any link instantly.',
    image: require('../../assets/images/qr-card.jpg'),
    priceFrom: 15000,
    link: '/nfc?tier=direct',
    designs: [
      { name: 'Matte Noir', colors: ['#101014', '#3F3F46'] },
      { name: 'Pure White', colors: ['#F4F4F2', '#D4D4D8'] },
    ],
    types: ['Paper / cardstock', 'Plastic (PVC)'],
  },
  {
    id: 'premium-card',
    categoryId: 'smart',
    name: 'Premium Portfolio Card',
    blurb: 'Scan to open your own portfolio page — pixelstudios.com/card/you.',
    image: require('../../assets/images/nfc-card.jpg'),
    priceFrom: 35000,
    link: '/nfc?tier=premium',
    designs: [
      { name: 'Signature Dark', colors: ['#0B0B0E', '#BFF549'] },
      { name: 'Clean Light', colors: ['#F4F4F2', '#18181B'] },
      { name: 'Bold Brand', colors: ['#7C3AED', '#22D3EE'] },
    ],
    types: ['Paper / cardstock', 'Plastic (PVC)', 'Template included', 'Editable anytime'],
  },
  {
    id: 'digital-profile',
    categoryId: 'smart',
    name: 'Digital Business Profile',
    blurb: 'Your business, one beautiful link — included with every card.',
    image: require('../../assets/images/cat-smart.jpg'),
    link: '/nfc-profile',
    designs: [
      { name: 'Signature', colors: ['#111113', '#BFF549'] },
      { name: 'Minimal', colors: ['#F4F4F2', '#3F3F46'] },
    ],
    types: ['WhatsApp button', 'Call button', 'Socials', 'Gallery'],
  },

  /* -------------------------------- DIGITAL ------------------------------ */
  {
    id: 'websites',
    categoryId: 'digital',
    name: 'Business Websites',
    blurb: 'Fast, beautiful websites that earn trust.',
    image: require('../../assets/images/portfolio/web.jpg'),
    priceFrom: 150000,
    link: '/brief/websites',
    designs: [
      { name: 'Minimal', colors: ['#18181B', '#A1A1AA'] },
      { name: 'Editorial', colors: ['#F5F5F4', '#18181B'] },
      { name: 'Bold', colors: ['#7C3AED', '#EC4899'] },
      { name: 'Techy', colors: ['#0EA5E9', '#22D3EE'] },
    ],
    types: ['Landing page', 'Business site', 'Portfolio', 'Hosting included'],
  },
  {
    id: 'ecommerce',
    categoryId: 'digital',
    name: 'E-commerce Stores',
    blurb: 'Online stores that sell while you sleep.',
    image: require('../../assets/images/ecommerce.jpg'),
    priceFrom: 250000,
    designs: [
      { name: 'Storefront', colors: ['#16A34A', '#86EFAC'] },
      { name: 'Catalog', colors: ['#18181B', '#71717A'] },
      { name: 'Marketplace', colors: ['#F59E0B', '#FDE68A'] },
      { name: 'Subscription', colors: ['#7C3AED', '#C4B5FD'] },
    ],
    types: ['Product catalog', 'Payments setup', 'Order tracking', 'WhatsApp checkout'],
  },
  {
    id: 'mobile-apps',
    categoryId: 'digital',
    name: 'Mobile Apps',
    blurb: 'iOS and Android apps built with modern technology.',
    image: require('../../assets/images/portfolio/app.jpg'),
    priceFrom: 400000,
    link: '/brief/mobile-apps',
    designs: [
      { name: 'Consumer', colors: ['#EC4899', '#FDA4AF'] },
      { name: 'Business', colors: ['#1E3A8A', '#60A5FA'] },
      { name: 'Booking', colors: ['#0F766E', '#2DD4BF'] },
      { name: 'Delivery', colors: ['#F59E0B', '#EF4444'] },
    ],
    types: ['iOS + Android', 'Push notifications', 'Payments', 'App store launch'],
  },
  {
    id: 'business-systems',
    categoryId: 'digital',
    name: 'Business Systems',
    blurb: 'Management systems for schools, hospitals, shops and more.',
    image: require('../../assets/images/cat-digital.jpg'),
    quoteOnly: true,
    designs: [
      { name: 'School', colors: ['#1D4ED8', '#93C5FD'] },
      { name: 'Hospital', colors: ['#0F766E', '#5EEAD4'] },
      { name: 'Inventory', colors: ['#92400E', '#FCD34D'] },
      { name: 'POS', colors: ['#18181B', '#BFF549'] },
    ],
    types: ['Web dashboard', 'Staff accounts', 'Reports', 'Training included'],
  },
];

export function getOffer(id: string | undefined): Offer | undefined {
  return offers.find((o) => o.id === id);
}

export function offersFor(categoryId: string): Offer[] {
  return offers.filter((o) => o.categoryId === categoryId);
}
