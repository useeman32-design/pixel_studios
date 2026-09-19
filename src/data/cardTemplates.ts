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
