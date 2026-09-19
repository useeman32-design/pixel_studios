export type Product = {
  id: string;
  name: string;
  category: 'Cards' | 'Apparel' | 'Mugs' | 'Stickers' | 'Packaging';
  price?: number;
  quoteOnly?: boolean;
  description: string;
  features: string[];
  materials?: string[];
  finishes?: string[];
  image: any;
};

export const products: Product[] = [
  {
    id: 'nfc-business-card',
    name: 'NFC Business Card',
    category: 'Cards',
    price: 25000,
    description: 'A premium physical card connected to your digital identity.',
    features: [
      'One tap shares your full profile',
      'No app needed — works with any smartphone',
      'WhatsApp, phone, email & socials built in',
      'Editable digital profile, forever',
    ],
    materials: ['Matte Black', 'Pure White', 'Transparent'],
    finishes: ['Matte', 'Gloss'],
    image: require('../../assets/images/nfc-card.jpg'),
  },
  {
    id: 'premium-business-card',
    name: 'Premium Business Card',
    category: 'Cards',
    price: 15000,
    description: 'Thick-stock, full-color cards that feel as good as they look.',
    features: [
      '420gsm premium stock',
      'Matte or gloss lamination',
      'Double-sided full color',
      'Free design review',
    ],
    materials: ['Matte', 'Glossy', 'Textured'],
    finishes: ['Rounded corners', 'Square'],
    image: require('../../assets/images/products/cards.jpg'),
  },
  {
    id: 'branded-tshirt',
    name: 'Branded T-Shirt',
    category: 'Apparel',
    price: 8000,
    description: 'High-quality tees with sharp, long-lasting prints.',
    features: [
      'Premium cotton blend',
      'DTF & sublimation printing',
      'Any size, any color',
      'Bulk team pricing',
    ],
    materials: ['Black', 'White', 'Navy'],
    image: require('../../assets/images/products/tshirt.jpg'),
  },
  {
    id: 'custom-mug',
    name: 'Custom Mug',
    category: 'Mugs',
    price: 5500,
    description: 'Vibrant, dishwasher-safe prints on premium ceramic.',
    features: [
      'Premium ceramic body',
      'Full-wrap sublimation',
      'Dishwasher safe',
      'Gift box available',
    ],
    materials: ['White', 'Black', 'Magic color-change'],
    image: require('../../assets/images/products/mug.jpg'),
  },
  {
    id: 'premium-stickers',
    name: 'Premium Stickers',
    category: 'Stickers',
    price: 12000,
    description: 'Die-cut stickers and labels that make packaging look premium.',
    features: [
      'Any custom shape',
      'Waterproof vinyl option',
      'Matte or gloss finish',
      'Perfect for product labels',
    ],
    finishes: ['Matte', 'Gloss', 'Clear'],
    image: require('../../assets/images/products/stickers.jpg'),
  },
  {
    id: 'invitation-cards',
    name: 'Invitation Cards',
    category: 'Cards',
    price: 25000,
    description: 'Elegant invitations your guests will keep forever.',
    features: [
      'Premium textured paper',
      'Gold foil available',
      'Custom envelopes',
      'Full design service',
    ],
    materials: ['Classic white', 'Dark textured', 'Gold foil'],
    image: require('../../assets/images/products/invite.jpg'),
  },
  {
    id: 'product-packaging',
    name: 'Product Packaging',
    category: 'Packaging',
    quoteOnly: true,
    description: 'Custom boxes, pouches and labels that sell before a word is read.',
    features: [
      'Structural + graphic design',
      'Boxes, pouches & labels',
      'Small and large runs',
      'Full brand packaging systems',
    ],
    image: require('../../assets/images/portfolio/packaging.jpg'),
  },
];

export function getProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
