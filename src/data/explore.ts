export type ExplorePost = {
  id: string;
  title: string;
  category: string;
  type: 'photo' | 'video';
  media: any[];
  caption: string;
  product: string;
  priceFrom?: number;
  /** Where "Order this" deep-links; when absent, checkout uses the product name. */
  offerLink?: string;
};

export const explorePosts: ExplorePost[] = [
  {
    id: 'smart-cards-reel',
    title: 'Smart Cards in action',
    category: 'Smart Cards',
    type: 'video',
    media: [require('../../assets/images/cat-smart.jpg'), require('../../assets/images/nfc-card.jpg'), require('../../assets/images/qr-card.jpg')],
    caption: 'Watch how one tap opens a full business page. Premium cards, printed and programmed in-house.',
    product: 'Premium Smart Card',
    priceFrom: 35000,
    offerLink: '/nfc?tier=premium',
  },
  {
    id: 'brand-identity-set',
    title: 'Full brand identity — Aurelia Homes',
    category: 'Design',
    type: 'photo',
    media: [require('../../assets/images/portfolio/branding.jpg')],
    caption: 'Logo suite, color system and stationery designed as one story. Ready in 5–7 days.',
    product: 'Brand Identity',
    priceFrom: 60000,
    offerLink: '/brief/brand-identity',
  },
  {
    id: 'print-suite',
    title: 'Corporate print suite',
    category: 'Print',
    type: 'photo',
    media: [require('../../assets/images/portfolio/print.jpg'), require('../../assets/images/products/cards.jpg')],
    caption: 'Business cards, letterheads and envelopes — one consistent look across every page.',
    product: 'Business Cards (x100)',
    priceFrom: 15000,
    offerLink: '/offer/business-cards',
  },
  {
    id: 'packaging-drop',
    title: 'Packaging that sells',
    category: 'Packaging',
    type: 'video',
    media: [require('../../assets/images/portfolio/packaging.jpg'), require('../../assets/images/boxes.jpg')],
    caption: 'Custom boxes and pouches — from kraft to luxury foil. Watch the unboxing.',
    product: 'Custom Packaging',
    offerLink: '/offer/packaging',
  },
  {
    id: 'menu-restaurant',
    title: 'Digital menu for Mama Put Kitchen',
    category: 'Digital Menu',
    type: 'photo',
    media: [require('../../assets/images/biz/restaurant.jpg'), require('../../assets/images/menu.jpg')],
    caption: 'Scan the QR on the table — the menu opens instantly, prices update anytime.',
    product: 'Digital Menu',
    priceFrom: 25000,
    offerLink: '/menu-studio',
  },
  {
    id: 'app-launch',
    title: 'Orbit delivery app — launch screens',
    category: 'Mobile & Web',
    type: 'photo',
    media: [require('../../assets/images/portfolio/app.jpg'), require('../../assets/images/portfolio/web.jpg')],
    caption: 'From wireframe to app store. iOS + Android with one codebase.',
    product: 'Mobile App',
    priceFrom: 400000,
    offerLink: '/brief/mobile-apps',
  },
  {
    id: 'campaign-season',
    title: 'Season campaign flyers',
    category: 'Print',
    type: 'photo',
    media: [require('../../assets/images/portfolio/social.jpg')],
    caption: 'Scroll-stopping campaign designs for social and print — delivered in 48 hours.',
    product: 'Social Media Design',
    priceFrom: 15000,
    offerLink: '/offer/social-media',
  },
];
