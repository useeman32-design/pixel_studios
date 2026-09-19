export type PortfolioItem = {
  id: string;
  title: string;
  category: 'Branding' | 'Print' | 'Digital' | 'Packaging';
  image: any;
};

export const portfolioCategories = ['All', 'Branding', 'Print', 'Digital', 'Packaging'];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'aurelia',
    title: 'Aurelia Homes Identity',
    category: 'Branding',
    image: require('../../assets/images/portfolio/branding.jpg'),
  },
  {
    id: 'zephyra',
    title: 'Zephyra Packaging',
    category: 'Packaging',
    image: require('../../assets/images/portfolio/packaging.jpg'),
  },
  {
    id: 'novapay',
    title: 'NovaPay Dashboard',
    category: 'Digital',
    image: require('../../assets/images/portfolio/web.jpg'),
  },
  {
    id: 'orbit',
    title: 'Orbit Delivery App',
    category: 'Digital',
    image: require('../../assets/images/portfolio/app.jpg'),
  },
  {
    id: 'print-suite',
    title: 'Corporate Print Suite',
    category: 'Print',
    image: require('../../assets/images/portfolio/print.jpg'),
  },
  {
    id: 'campaign',
    title: 'Season Campaign',
    category: 'Print',
    image: require('../../assets/images/portfolio/social.jpg'),
  },
];
