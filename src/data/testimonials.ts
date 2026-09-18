export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amina Bello',
    role: 'Founder, Aurelia Homes',
    quote:
      'Pixel Studios built our entire brand — logo, website and business cards. People now assume we are a much bigger company. The quality speaks for itself.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Ibrahim Musa',
    role: 'Owner, Zephyra Skincare',
    quote:
      'Our packaging went from local-looking to world-class. Sales improved because customers finally trusted the product on sight. Fast delivery too.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Chiamaka Okafor',
    role: 'Manager, NovaPay',
    quote:
      'They delivered our dashboard ahead of schedule and kept communicating at every step. Easily the most professional tech team we have worked with.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Sani Abdullahi',
    role: 'Principal, Sunrise Academy',
    quote:
      'Pixel Systems built our school management platform. Results, fees and attendance in one place. Our staff learned it in a day.',
    rating: 5,
  },
];

export const stats = [
  { value: '250+', label: 'Projects delivered' },
  { value: '120+', label: 'Happy clients' },
  { value: '7', label: 'Service divisions' },
  { value: '24h', label: 'Average response' },
];
