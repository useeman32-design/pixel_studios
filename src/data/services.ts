export type ServiceCategory = {
  id: string;
  name: string;
  subtitle: string;
  image: any;
  services: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'creative',
    name: 'Creative',
    subtitle: 'Graphic Design / Branding / Social Media',
    image: require('../../assets/images/cat-creative.jpg'),
    services: [
      'Logo design',
      'Brand identity',
      'Social media design',
      'Marketing graphics',
      'Invitations & menus',
      'Packaging design',
    ],
  },
  {
    id: 'print',
    name: 'Print',
    subtitle: 'Business Cards / Flyers / Stickers / Apparel',
    image: require('../../assets/images/cat-print.jpg'),
    services: [
      'Business cards',
      'Flyers & posters',
      'Stickers & labels',
      'T-shirts & apparel',
      'Mugs & merchandise',
      'Invitation cards',
    ],
  },
  {
    id: 'smart',
    name: 'Smart Business',
    subtitle: 'NFC Cards / QR Solutions / Digital Profiles',
    image: require('../../assets/images/cat-smart.jpg'),
    services: [
      'NFC business cards',
      'NFC review cards',
      'Digital business profiles',
      'QR / NFC menus',
      'Smart staff cards',
      'Event NFC products',
    ],
  },
  {
    id: 'digital',
    name: 'Digital',
    subtitle: 'Websites / Mobile Apps / Business Systems',
    image: require('../../assets/images/cat-digital.jpg'),
    services: [
      'Website development',
      'Mobile applications',
      'E-commerce stores',
      'Business systems',
      'Dashboards',
      'Hosting & maintenance',
    ],
  },
];

export function getCategory(id: string | undefined): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.id === id);
}
