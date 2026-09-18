export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  client: string;
  image: any;
};

export const portfolioCategories = [
  'All',
  'Branding',
  'Graphic Design',
  'Printing',
  'Packaging',
  'Websites',
  'Apps',
  'Systems',
  'NFC',
  'Marketing',
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'aurelia-brand',
    title: 'Aurelia Homes — Full Brand Identity',
    category: 'Branding',
    client: 'Real Estate · Abuja',
    image: require('../../assets/images/portfolio/branding.jpg'),
  },
  {
    id: 'zephyr-packaging',
    title: 'Zephyra Skincare Packaging',
    category: 'Packaging',
    client: 'Beauty Brand · Lagos',
    image: require('../../assets/images/portfolio/packaging.jpg'),
  },
  {
    id: 'nova-dashboard',
    title: 'NovaPay Finance Dashboard',
    category: 'Websites',
    client: 'Fintech · Remote',
    image: require('../../assets/images/portfolio/web.jpg'),
  },
  {
    id: 'orbit-app',
    title: 'Orbit Delivery App',
    category: 'Apps',
    client: 'Logistics · Kano',
    image: require('../../assets/images/portfolio/app.jpg'),
  },
  {
    id: 'print-suite',
    title: 'Corporate Print Suite',
    category: 'Printing',
    client: 'Consulting Firm · Gusau',
    image: require('../../assets/images/portfolio/print.jpg'),
  },
  {
    id: 'social-campaign',
    title: 'Ramadan Sale Campaign',
    category: 'Marketing',
    client: 'Retail Chain · Zamfara',
    image: require('../../assets/images/portfolio/social.jpg'),
  },
  {
    id: 'nfc-launch',
    title: 'NFC Card Launch Kit',
    category: 'NFC',
    client: 'Pixel Smart Product',
    image: require('../../assets/images/products/nfc.jpg'),
  },
  {
    id: 'menu-system',
    title: 'Restaurant NFC Menu System',
    category: 'Systems',
    client: 'Hospitality · Abuja',
    image: require('../../assets/images/portfolio/web.jpg'),
  },
  {
    id: 'flyer-series',
    title: 'Event Flyer Series',
    category: 'Graphic Design',
    client: 'Events · Gusau',
    image: require('../../assets/images/portfolio/print.jpg'),
  },
];
