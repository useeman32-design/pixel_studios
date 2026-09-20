export type BusinessType = {
  id: string;
  label: string;
  icon: string; // Ionicons name
  sample: string;
  tagline: string;
  accent: string;
  hours: string;
  hero: any;
  rating: string;
  reviews: string;
  badge: string;
};

/* Nigerian SME categories — researched for the Gusau / national market. */
export const businessTypes: BusinessType[] = [
  { id: 'catering', label: 'Catering & Cakes', icon: 'cafe-outline', sample: "Sandra's Cakes", tagline: 'Custom cakes & catering for every occasion', accent: '#F9A8D4', hours: 'Mon – Sat · 8am – 8pm', hero: require('../../assets/images/biz/catering.jpg'), rating: '4.9', reviews: '180+ happy clients', badge: 'TOP RATED' },
  { id: 'restaurant', label: 'Restaurant & Buka', icon: 'fast-food-outline', sample: 'Mama Put Kitchen', tagline: 'Fresh. Local. Delicious.', accent: '#FCD34D', hours: 'Every day · 10am – 10pm', hero: require('../../assets/images/biz/restaurant.jpg'), rating: '4.8', reviews: '900+ orders', badge: 'HOT & FRESH' },
  { id: 'tailor', label: 'Tailoring & Fashion', icon: 'shirt-outline', sample: 'Fine Fit Tailors', tagline: 'Bespoke tailoring, perfect fit every time', accent: '#93C5FD', hours: 'Mon – Sat · 9am – 7pm', hero: require('../../assets/images/biz/tailor.jpg'), rating: '4.8', reviews: '300+ fittings', badge: 'MASTER FIT' },
  { id: 'boutique', label: 'Boutique & Fashion Store', icon: 'pricetag-outline', sample: 'Velvet Rose', tagline: 'Curated fashion for the modern you', accent: '#FDA4AF', hours: 'Mon – Sat · 9am – 8pm', hero: require('../../assets/images/biz/boutique.jpg'), rating: '4.7', reviews: '600+ shoppers', badge: 'NEW DROPS' },
  { id: 'salon', label: 'Hair Salon & Beauty', icon: 'flower-outline', sample: 'Glow Hair Studio', tagline: 'Hair artistry that turns heads', accent: '#C4B5FD', hours: 'Tue – Sun · 9am – 7pm', hero: require('../../assets/images/biz/salon.jpg'), rating: '5.0', reviews: '450+ clients', badge: 'BOOKED SOLID' },
  { id: 'barbing', label: 'Barbing', icon: 'cut-outline', sample: 'Sharp Edge Barbers', tagline: 'Clean cuts, sharp looks — every time', accent: '#A5B4FC', hours: 'Every day · 8am – 9pm', hero: require('../../assets/images/biz/barbing.jpg'), rating: '4.9', reviews: '700+ haircuts', badge: 'SHARP LOOKS' },
  { id: 'plumber', label: 'Plumbing & Repairs', icon: 'water-outline', sample: 'SwiftFix Plumbing', tagline: 'Fast, reliable plumbing — day or night', accent: '#5EEAD4', hours: '24/7 emergency service', hero: require('../../assets/images/biz/plumber.jpg'), rating: '4.9', reviews: '500+ jobs done', badge: '24/7 SERVICE' },
  { id: 'mechanic', label: 'Auto Mechanic', icon: 'build-outline', sample: 'PowerHouse Auto', tagline: 'Diagnostics, repairs & maintenance done right', accent: '#FCA5A5', hours: 'Mon – Sat · 8am – 6pm', hero: require('../../assets/images/biz/mechanic.jpg'), rating: '4.8', reviews: '350+ cars fixed', badge: 'TRUSTED HANDS' },
  { id: 'electronics', label: 'Phones & Electronics', icon: 'phone-portrait-outline', sample: 'GadgetHub NG', tagline: 'Original gadgets, honest prices, instant repairs', accent: '#93C5FD', hours: 'Mon – Sat · 9am – 8pm', hero: require('../../assets/images/biz/electronics.jpg'), rating: '4.7', reviews: '800+ sales', badge: 'ORIGINAL ONLY' },
  { id: 'supermarket', label: 'Supermarket & Provisions', icon: 'cart-outline', sample: 'Daily Fresh Mart', tagline: 'Everything your home needs, in one place', accent: '#86EFAC', hours: 'Every day · 7am – 9pm', hero: require('../../assets/images/biz/supermarket.jpg'), rating: '4.8', reviews: '1,000+ shoppers', badge: 'DAILY FRESH' },
  { id: 'realestate', label: 'Real Estate', icon: 'home-outline', sample: 'Solid Rock Realty', tagline: 'Verified properties — rent, buy or sell with confidence', accent: '#FDBA74', hours: 'Mon – Sat · 9am – 6pm', hero: require('../../assets/images/biz/realestate.jpg'), rating: '4.9', reviews: '120+ properties', badge: 'VERIFIED LISTINGS' },
  { id: 'logistics', label: 'Logistics & Delivery', icon: 'rocket-outline', sample: 'SwiftMove NG', tagline: 'Same-day dispatch, nationwide delivery', accent: '#67E8F9', hours: 'Every day · 7am – 10pm', hero: require('../../assets/images/biz/logistics.jpg'), rating: '4.8', reviews: '2,000+ deliveries', badge: 'SAME-DAY' },
  { id: 'photography', label: 'Photography Studio', icon: 'camera-outline', sample: 'GoldenLens Studio', tagline: 'Moments captured beautifully, forever', accent: '#D8B4FE', hours: 'By appointment', hero: require('../../assets/images/biz/photography.jpg'), rating: '5.0', reviews: '200+ shoots', badge: 'AWARD WINNER' },
  { id: 'events', label: 'Event Planning & Decor', icon: 'ribbon-outline', sample: 'Sparkle Events', tagline: 'Weddings, birthdays & corporate events done beautifully', accent: '#F9A8D4', hours: 'Mon – Sun · 9am – 8pm', hero: require('../../assets/images/biz/events.jpg'), rating: '4.9', reviews: '150+ events', badge: 'FULL SERVICE' },
  { id: 'school', label: 'School & Tutoring', icon: 'school-outline', sample: 'Brightpath Academy', tagline: 'Building confident learners, one class at a time', accent: '#FDE68A', hours: 'Mon – Fri · 8am – 4pm', hero: require('../../assets/images/biz/school.jpg'), rating: '4.9', reviews: '250+ students', badge: 'ACCREDITED' },
  { id: 'medical', label: 'Medical & Pharmacy', icon: 'medkit-outline', sample: 'CarePoint Clinic', tagline: 'Quality care, close to home', accent: '#86EFAC', hours: 'Every day · 8am – 10pm', hero: require('../../assets/images/biz/doctor.jpg'), rating: '4.9', reviews: '1,200+ patients', badge: 'TRUSTED CARE' },
  { id: 'general', label: 'Other Business', icon: 'briefcase-outline', sample: 'Your Business', tagline: 'Your business, one beautiful page', accent: '#BFF549', hours: 'Mon – Sat · 9am – 6pm', hero: require('../../assets/images/biz/general.jpg'), rating: '5.0', reviews: 'Verified business', badge: 'VERIFIED' },
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

/* Six structurally different landing page designs. */
export const cardTemplates: CardTemplate[] = [
  { id: 'signature', name: 'Signature Dark', bg: '#0C0C0F', surface: '#17171B', text: '#F4F4F2', subtext: '#9B9BA1', accent: '#BFF549' },
  { id: 'clean', name: 'Clean Light', bg: '#F5F4F0', surface: '#FFFFFF', text: '#141416', subtext: '#6B6C72', accent: '#141416' },
  { id: 'bold', name: 'Bold Brand', bg: '#1B1035', surface: 'rgba(255,255,255,0.07)', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.65)', accent: '#22D3EE' },
  { id: 'luxe', name: 'Elegant Luxe', bg: '#100D09', surface: '#1B1610', text: '#F3EADA', subtext: '#A79B85', accent: '#E6C079' },
  { id: 'trust', name: 'Trust Pro', bg: '#F4F7FB', surface: '#FFFFFF', text: '#0F1B2D', subtext: '#5A6B84', accent: '#1D6FE0' },
  { id: 'pop', name: 'Fresh Pop', bg: '#FFF8EF', surface: '#FFFFFF', text: '#2A1E14', subtext: '#8A7360', accent: '#FF7A45' },
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
 * Physical card face designs — swipeable in the configurator.
 * ------------------------------------------------------------------------- */

export type CardDesign = {
  id: string;
  name: string;
  desc: string;
  bg: string;
  text: string;
  sub: string;
  accent: string;
  deco: 'pixels' | 'band' | 'corner' | 'frame' | 'dots';
};

export const cardDesigns: CardDesign[] = [
  { id: 'classic', name: 'Studio Classic', desc: 'Charcoal with lime pixel accents', bg: '#0E0E11', text: '#F4F4F2', sub: 'rgba(244,244,242,0.55)', accent: '#BFF549', deco: 'pixels' },
  { id: 'statement', name: 'Lime Statement', desc: 'A bold lime edge that pops', bg: '#10130A', text: '#F4F7EC', sub: 'rgba(240,247,230,0.5)', accent: '#BFF549', deco: 'band' },
  { id: 'royal', name: 'Royal Navy', desc: 'Deep navy with sky-blue detail', bg: '#0B1424', text: '#ECF3FF', sub: 'rgba(220,235,255,0.5)', accent: '#82B4FF', deco: 'corner' },
  { id: 'gold', name: 'Gold Luxe', desc: 'Black & gold for premium brands', bg: '#161009', text: '#F6EEDF', sub: 'rgba(240,228,205,0.5)', accent: '#E6C079', deco: 'frame' },
  { id: 'ivory', name: 'Fresh Ivory', desc: 'Light, airy and modern', bg: '#F4F2EC', text: '#141416', sub: 'rgba(20,20,22,0.55)', accent: '#0F766E', deco: 'dots' },
];

export function getCardDesign(id: string): CardDesign {
  return cardDesigns.find((d) => d.id === id) ?? cardDesigns[0];
}

/* ---------------------------------------------------------------------------
 * Per-profession landing content — every business type gets its own layout,
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
  tailor: {
    headline: 'Tailored to fit you perfectly',
    cta: 'Book a Fitting',
    ctaIcon: 'calendar-outline',
    layout: 'gallery',
    items: [{ label: 'Senator Wear' }, { label: 'Agbada' }, { label: 'Aso Ebi' }],
  },
  boutique: {
    headline: 'New arrivals every week',
    cta: 'Shop on WhatsApp',
    ctaIcon: 'bag-outline',
    layout: 'shop',
    items: [{ label: 'Dresses' }, { label: 'Bags' }, { label: 'Accessories' }, { label: 'Shoes' }],
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
  barbing: {
    headline: 'Walk in sharp, walk out sharper',
    cta: 'Book a Chair',
    ctaIcon: 'calendar-outline',
    layout: 'services',
    items: [
      { label: 'Classic Haircut', price: '₦2,000' },
      { label: 'Beard Trim', price: '₦1,000' },
      { label: 'Full Grooming', price: '₦3,500' },
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
  mechanic: {
    headline: 'Your car, in trusted hands',
    cta: 'Call for Help',
    ctaIcon: 'call-outline',
    layout: 'gallery',
    items: [{ label: 'Diagnostics' }, { label: 'Engine Repair' }, { label: 'Oil & Service' }],
  },
  electronics: {
    headline: 'Original gadgets, honest prices',
    cta: 'Shop on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'shop',
    items: [{ label: 'Phones' }, { label: 'Accessories' }, { label: 'Repairs' }, { label: 'Gadgets' }],
  },
  supermarket: {
    headline: 'Everything your home needs',
    cta: 'Order Groceries',
    ctaIcon: 'logo-whatsapp',
    layout: 'shop',
    items: [{ label: 'Groceries' }, { label: 'Drinks' }, { label: 'Household' }, { label: 'Fresh Food' }],
  },
  realestate: {
    headline: 'Verified homes, honest deals',
    cta: 'Book Inspection',
    ctaIcon: 'calendar-outline',
    layout: 'gallery',
    items: [{ label: 'For Sale' }, { label: 'To Rent' }, { label: 'Land' }],
  },
  logistics: {
    headline: 'Your package, delivered on time',
    cta: 'Request Pickup',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Same-Day' }, { label: 'Nationwide' }, { label: 'Warehousing' }],
  },
  photography: {
    headline: 'Moments captured beautifully',
    cta: 'Book a Session',
    ctaIcon: 'calendar-outline',
    layout: 'gallery',
    items: [{ label: 'Weddings' }, { label: 'Portraits' }, { label: 'Events' }],
  },
  events: {
    headline: 'Events your guests never forget',
    cta: 'Plan Your Event',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Weddings' }, { label: 'Birthdays' }, { label: 'Corporate' }],
  },
  school: {
    headline: 'Building confident learners',
    cta: 'Enroll Now',
    ctaIcon: 'school-outline',
    layout: 'services',
    items: [
      { label: 'Creche & Nursery', price: 'From ₦35k/term' },
      { label: 'Primary School', price: 'From ₦45k/term' },
      { label: 'After-school Tutors', price: '₦15k/month' },
    ],
  },
  medical: {
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
  general: {
    headline: 'Your business, one beautiful page',
    cta: 'Contact on WhatsApp',
    ctaIcon: 'logo-whatsapp',
    layout: 'gallery',
    items: [{ label: 'Our Work' }, { label: 'Reviews' }, { label: 'Location' }],
  },
};
