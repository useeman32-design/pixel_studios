export type Product = {
  id: string;
  name: string;
  category: 'Cards' | 'Print' | 'Merch' | 'Smart' | 'Packaging';
  price?: number;
  priceNote: string;
  quoteOnly?: boolean;
  popular?: boolean;
  description: string;
  options: string[];
  image: any;
};

export const products: Product[] = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    category: 'Cards',
    price: 15000,
    priceNote: 'per 100 cards',
    popular: true,
    description:
      'Premium full-color business cards on thick matte or glossy stock. Make a first impression that feels established and professional.',
    options: ['Matte finish', 'Glossy finish', 'Double-sided', 'Rounded corners'],
    image: require('../../assets/images/products/cards.jpg'),
  },
  {
    id: 'nfc-business-cards',
    name: 'NFC Business Cards',
    category: 'Smart',
    price: 25000,
    priceNote: 'per card',
    popular: true,
    description:
      'The business card from the future. One tap on any smartphone instantly shares your name, phone, WhatsApp, email, website and socials — no app needed.',
    options: ['Matte black', 'White', 'Custom design', 'Digital profile setup included'],
    image: require('../../assets/images/products/nfc.jpg'),
  },
  {
    id: 'id-cards',
    name: 'ID Cards',
    category: 'Cards',
    price: 3500,
    priceNote: 'per card',
    description:
      'Durable PVC staff and member ID cards with professional layouts, photos and branding. Lanyards and holders available.',
    options: ['Single-sided', 'Double-sided', 'With lanyard', 'Bulk discounts'],
    image: require('../../assets/images/products/idcard.jpg'),
  },
  {
    id: 'flyers',
    name: 'Flyers & Posters',
    category: 'Print',
    price: 20000,
    priceNote: 'per 100 (A5)',
    description:
      'Sharp, vibrant flyers and posters for campaigns, events and promotions. Design included or print-ready files accepted.',
    options: ['A5 / A4 / A3', 'Glossy', 'Matte', 'Design included'],
    image: require('../../assets/images/portfolio/print.jpg'),
  },
  {
    id: 'stickers',
    name: 'Stickers & Labels',
    category: 'Print',
    price: 12000,
    priceNote: 'per 100 stickers',
    description:
      'Die-cut stickers and product labels that make packaging look professional. Waterproof options available.',
    options: ['Die-cut custom shape', 'Waterproof', 'Clear background', 'Product labels'],
    image: require('../../assets/images/products/stickers.jpg'),
  },
  {
    id: 'invitations',
    name: 'Invitation Cards',
    category: 'Print',
    price: 25000,
    priceNote: 'per 50 cards',
    popular: true,
    description:
      'Elegant wedding, ceremony and event invitations with premium paper and foil options. Your guests will keep them.',
    options: ['Gold foil', 'Embossed', 'Custom envelope', 'RSVP card included'],
    image: require('../../assets/images/products/invite.jpg'),
  },
  {
    id: 'tshirts',
    name: 'Custom T-Shirts',
    category: 'Merch',
    price: 8000,
    priceNote: 'per shirt',
    description:
      'High-quality printed tees for brands, teams, events and merch drops. DTF and sublimation printing available.',
    options: ['Any size', 'Front & back print', 'Bulk pricing', 'Design included'],
    image: require('../../assets/images/products/tshirt.jpg'),
  },
  {
    id: 'mugs',
    name: 'Custom Mugs',
    category: 'Merch',
    price: 5500,
    priceNote: 'per mug',
    description:
      'Personalized mugs for gifts, offices and brand merchandise. Vibrant sublimation printing that lasts.',
    options: ['White', 'Black', 'Magic color-change', 'Gift box available'],
    image: require('../../assets/images/products/mug.jpg'),
  },
  {
    id: 'caps',
    name: 'Custom Caps',
    category: 'Merch',
    price: 6000,
    priceNote: 'per cap',
    description:
      'Embroidered and printed caps for brands, teams and events. Premium stitching and adjustable fits.',
    options: ['Embroidered logo', 'Printed', 'Multiple colors', 'Bulk pricing'],
    image: require('../../assets/images/products/tshirt.jpg'),
  },
  {
    id: 'packaging',
    name: 'Product Packaging',
    category: 'Packaging',
    quoteOnly: true,
    priceNote: 'request a quote',
    description:
      'Custom boxes, pouches, labels and packaging that make your product look world-class on any shelf.',
    options: ['Boxes', 'Pouches', 'Labels', 'Full brand packaging'],
    image: require('../../assets/images/portfolio/packaging.jpg'),
  },
  {
    id: 'custom-products',
    name: 'Custom Products',
    category: 'Merch',
    quoteOnly: true,
    priceNote: 'request a quote',
    description:
      'Have something unique in mind? Banners, jotters, keyholders, souvenirs and more — tell us your idea and we will make it real.',
    options: ['Tell us your idea', 'Corporate souvenirs', 'Event materials', 'Banners & signage'],
    image: require('../../assets/images/hero.jpg'),
  },
];

export function getProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
