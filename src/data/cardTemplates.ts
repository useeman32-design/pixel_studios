export type BusinessType = {
  id: string;
  label: string;
  emoji: string;
  sample: string;
  tagline: string;
  accent: string;
};

export const businessTypes: BusinessType[] = [
  { id: 'catering', label: 'Catering & Cakes', emoji: '🎂', sample: "Sandra's Cakes", tagline: 'Custom cakes & catering for every occasion', accent: '#F9A8D4' },
  { id: 'tailor', label: 'Tailoring', emoji: '✂️', sample: 'Fine Fit Tailors', tagline: 'Bespoke tailoring, perfect fit every time', accent: '#93C5FD' },
  { id: 'salon', label: 'Hair Salon', emoji: '💇‍♀️', sample: 'Glow Hair Studio', tagline: 'Hair artistry that turns heads', accent: '#C4B5FD' },
  { id: 'plumber', label: 'Plumbing', emoji: '🔧', sample: 'SwiftFix Plumbing', tagline: 'Fast, reliable plumbing — day or night', accent: '#5EEAD4' },
  { id: 'doctor', label: 'Medical', emoji: '🩺', sample: 'CarePoint Clinic', tagline: 'Quality care, close to home', accent: '#86EFAC' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', sample: 'Mama Put Kitchen', tagline: 'Fresh. Local. Delicious.', accent: '#FCD34D' },
  { id: 'boutique', label: 'Boutique', emoji: '👗', sample: 'Velvet Rose', tagline: 'Curated fashion for the modern you', accent: '#FDA4AF' },
  { id: 'general', label: 'Other', emoji: '💼', sample: 'Your Business', tagline: 'Your business, one beautiful page', accent: '#BFF549' },
];

export type CardTemplate = {
  id: string;
  name: string;
  bg: string;
  surface: string;
  text: string;
  subtext: string;
  accent: string;
};

export const cardTemplates: CardTemplate[] = [
  {
    id: 'signature',
    name: 'Signature Dark',
    bg: '#0C0C0F',
    surface: '#17171B',
    text: '#F4F4F2',
    subtext: '#9B9BA1',
    accent: '#BFF549',
  },
  {
    id: 'clean',
    name: 'Clean Light',
    bg: '#F5F4F0',
    surface: '#FFFFFF',
    text: '#141416',
    subtext: '#6B6C72',
    accent: '#141416',
  },
  {
    id: 'bold',
    name: 'Bold Brand',
    bg: '#1B1035',
    surface: 'rgba(255,255,255,0.07)',
    text: '#FFFFFF',
    subtext: 'rgba(255,255,255,0.65)',
    accent: '#22D3EE',
  },
];

export function getBusinessType(id: string): BusinessType {
  return businessTypes.find((b) => b.id === id) ?? businessTypes[businessTypes.length - 1];
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'your-name'
  );
}

/* ---------------------------------------------------------------------------
 * Per-profession landing designs — every business type gets its own layout,
 * sections and call-to-action, themed by the chosen card template.
 * ------------------------------------------------------------------------- */

export type LandingConfig = {
  headline: string;
  cta: string;
  ctaIcon: string;
  layout: 'gallery' | 'shop' | 'menu' | 'services' | 'urgent';
  items: { label: string; price?: string }[];
  urgentNote?: string;
};

export const landingConfigs: Record<string, LandingConfig> = {
  catering: {
    headline: 'Sweet treats for every celebration',
    cta: 'Order on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Signature Cakes' }, { label: 'Cupcake Boxes' }, { label: 'Small Chops' }],
  },
  tailor: {
    headline: 'Tailored to fit you perfectly',
    cta: 'Book a Fitting',
    ctaIcon: 'calendar-outline',
    layout: 'gallery',
    items: [{ label: 'Senator Wear' }, { label: 'Agbada' }, { label: 'Aso Ebi' }],
  },
  salon: {
    headline: 'Look your best, every day',
    cta: 'Book Appointment',
    ctaIcon: 'calendar-outline',
    layout: 'services',
    items: [
      { label: 'Box Braids', price: '₦8,000' },
      { label: 'Wig Install', price: '₦5,500' },
      { label: 'Makeup', price: '₦12,000' },
    ],
  },
  plumber: {
    headline: 'Fast fixes, day or night',
    cta: 'Call Now',
    ctaIcon: 'call',
    layout: 'urgent',
    items: [{ label: 'Pipe Repairs' }, { label: 'Water Heaters' }, { label: 'Bathroom Fitting' }],
    urgentNote: '24/7 Emergency Service',
  },
  doctor: {
    headline: 'Quality care, close to home',
    cta: 'Book Consultation',
    ctaIcon: 'calendar-outline',
    layout: 'services',
    items: [
      { label: 'General Check-up', price: '₦5,000' },
      { label: 'Pediatrics', price: '₦6,000' },
      { label: 'Lab Tests', price: 'From ₦2,500' },
    ],
  },
  restaurant: {
    headline: 'Fresh. Local. Delicious.',
    cta: 'Order Food',
    ctaIcon: 'logo-whatsapp',
    layout: 'menu',
    items: [
      { label: 'Jollof Rice', price: '₦2,500' },
      { label: 'Suya Platter', price: '₦4,000' },
      { label: 'Zobo Drink', price: '₦800' },
    ],
  },
  boutique: {
    headline: 'New arrivals every week',
    cta: 'Shop on WhatsApp',
    ctaIcon: 'bag-outline',
    layout: 'shop',
    items: [{ label: 'Dresses' }, { label: 'Bags' }, { label: 'Accessories' }, { label: 'Shoes' }],
  },
  general: {
    headline: 'Your business, one beautiful page',
    cta: 'Contact on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Our Work' }, { label: 'Reviews' }, { label: 'Location' }],
  },
};

