export type ServiceCategory = {
  id: string;
  name: string;
  subtitle: string;
  image: any;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'creative',
    name: 'Design',
    subtitle: 'Logos / Branding / Social Media / Menus',
    image: require('../../assets/images/cat-creative.jpg'),
  },
  {
    id: 'print',
    name: 'Print',
    subtitle: 'Business Cards / Flyers / Stickers / Apparel / Packaging',
    image: require('../../assets/images/cat-print.jpg'),
  },
  {
    id: 'smart',
    name: 'Smart Cards',
    subtitle: 'Direct Link Cards / Premium Portfolio Cards / QR',
    image: require('../../assets/images/cat-smart.jpg'),
  },
  {
    id: 'digital',
    name: 'Mobile & Web Development',
    subtitle: 'Websites / E-commerce / Mobile Apps / Business Systems',
    image: require('../../assets/images/cat-digital.jpg'),
  },
];

export function getCategory(id: string | undefined): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.id === id);
}
