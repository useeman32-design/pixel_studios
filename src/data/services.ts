export type Service = { name: string; blurb: string };

export type ServiceCategory = {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  description: string;
  gradient: [string, string];
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'creative',
    name: 'Pixel Creative',
    shortName: 'Creative',
    emoji: '🎨',
    tagline: 'Brand identity & design that makes you unforgettable',
    description:
      'We craft professional visual identities that help businesses look established, trusted and memorable — from a single logo to a complete brand system.',
    gradient: ['#EC4899', '#8B5CF6'],
    services: [
      { name: 'Logo Design', blurb: 'Distinctive marks built to represent your brand for years.' },
      { name: 'Brand Identity', blurb: 'Colors, typography and visual language that feel like you.' },
      { name: 'Business Branding', blurb: 'Complete branding kits for new and growing businesses.' },
      { name: 'Flyers & Posters', blurb: 'Attention-grabbing print and digital campaign graphics.' },
      { name: 'Social Media Designs', blurb: 'Scroll-stopping content designed for every platform.' },
      { name: 'Marketing Graphics', blurb: 'Banners, ads and promos engineered to convert.' },
      { name: 'Product & Packaging Design', blurb: 'Packaging that sells before a word is read.' },
      { name: 'Invitations & Menus', blurb: 'Elegant designs for events, restaurants and more.' },
    ],
  },
  {
    id: 'print',
    name: 'Pixel Print',
    shortName: 'Print',
    emoji: '🖨️',
    tagline: 'Professional printing, from business cards to merchandise',
    description:
      'Premium physical production with crisp color, quality materials and fast turnaround. We manage design, production and delivery end-to-end.',
    gradient: ['#0EA5E9', '#22D3EE'],
    services: [
      { name: 'Business Cards', blurb: 'Matte, glossy, foil — cards that feel premium.' },
      { name: 'NFC Business Cards', blurb: 'Tap-to-share smart cards with your digital profile.' },
      { name: 'ID Cards', blurb: 'Durable PVC staff and member ID cards with lanyards.' },
      { name: 'Invitation Cards', blurb: 'Weddings, ceremonies and corporate events.' },
      { name: 'Flyers & Posters', blurb: 'Sharp full-color prints in every size.' },
      { name: 'Stickers & Labels', blurb: 'Die-cut stickers and product labels that stick.' },
      { name: 'Certificates & Documents', blurb: 'Certificates and laminated documents done right.' },
      { name: 'T-Shirts, Mugs & Caps', blurb: 'Custom merchandise and sublimation products.' },
      { name: 'Packaging Production', blurb: 'Boxes, pouches and packaging materials.' },
    ],
  },
  {
    id: 'digital',
    name: 'Pixel Digital',
    shortName: 'Digital',
    emoji: '💻',
    tagline: 'Websites, apps and software that take you online',
    description:
      'From idea to complete digital presence — we design, build, host and maintain modern web and mobile products for Nigerian businesses.',
    gradient: ['#7C3AED', '#22D3EE'],
    services: [
      { name: 'Website Development', blurb: 'Fast, beautiful business websites.' },
      { name: 'Web Applications', blurb: 'Powerful tools your customers use in the browser.' },
      { name: 'Mobile Applications', blurb: 'iOS and Android apps built with modern technology.' },
      { name: 'E-commerce Websites', blurb: 'Online stores that sell while you sleep.' },
      { name: 'Custom Software', blurb: 'Software shaped around how your business works.' },
      { name: 'Dashboards', blurb: 'Live insight into sales, stock and performance.' },
      { name: 'Hosting & Maintenance', blurb: 'We keep your products fast, secure and online.' },
      { name: 'Digital Automation', blurb: 'Automate repetitive work and save hours weekly.' },
    ],
  },
  {
    id: 'smart',
    name: 'Pixel Smart',
    shortName: 'Smart',
    emoji: '📡',
    tagline: 'NFC & smart products for the modern business',
    description:
      'Physical products with a digital brain. Tap an NFC card with any smartphone to instantly share your profile, menu, reviews or products.',
    gradient: ['#10B981', '#22D3EE'],
    services: [
      { name: 'NFC Business Cards', blurb: 'One tap shares your name, contacts and portfolio.' },
      { name: 'NFC Review Cards', blurb: 'Turn happy customers into 5-star reviews instantly.' },
      { name: 'NFC Digital Menus', blurb: 'Contactless menus for restaurants and cafés.' },
      { name: 'Smart Staff Cards', blurb: 'Digital identity cards for modern teams.' },
      { name: 'QR / NFC Product Tags', blurb: 'Let products tell their own story.' },
      { name: 'Digital Business Profiles', blurb: 'Your business, one beautiful link.' },
      { name: 'Event NFC Products', blurb: 'Smart check-ins, programs and souvenirs.' },
    ],
  },
  {
    id: 'marketing',
    name: 'Pixel Marketing',
    shortName: 'Marketing',
    emoji: '📣',
    tagline: 'Get seen, get talked about, get customers',
    description:
      'We grow your online presence with content, campaigns and strategy designed for the Nigerian market — and measured in real results.',
    gradient: ['#F59E0B', '#EF4444'],
    services: [
      { name: 'Social Media Management', blurb: 'Consistent, professional pages across platforms.' },
      { name: 'Content Creation', blurb: 'Posts, graphics and copy your audience loves.' },
      { name: 'Advertising Design', blurb: 'Ad creatives built to stop the scroll.' },
      { name: 'Digital Campaigns', blurb: 'Launches and promotions with clear goals.' },
      { name: 'SEO', blurb: 'Get found when customers search.' },
      { name: 'Product Marketing', blurb: 'Position and promote what you sell.' },
    ],
  },
  {
    id: 'systems',
    name: 'Pixel Systems',
    shortName: 'Systems',
    emoji: '⚙️',
    tagline: 'Custom systems that run your organization',
    description:
      'Purpose-built management systems for schools, hospitals, shops and companies — so your operations run smoothly and nothing gets lost.',
    gradient: ['#475569', '#8B5CF6'],
    services: [
      { name: 'School Management Systems', blurb: 'Students, results, fees — one platform.' },
      { name: 'Hospital Management Systems', blurb: 'Patients, records and billing simplified.' },
      { name: 'Inventory Systems', blurb: 'Know your stock in real time.' },
      { name: 'POS Systems', blurb: 'Fast checkout and daily sales reports.' },
      { name: 'Employee Management', blurb: 'Staff records, attendance and tasks.' },
      { name: 'Booking Systems', blurb: 'Appointments and reservations on autopilot.' },
      { name: 'Business Dashboards', blurb: 'Every number that matters, one screen.' },
    ],
  },
  {
    id: 'ai',
    name: 'Pixel AI',
    shortName: 'AI',
    emoji: '🤖',
    tagline: 'Our innovation lab — AI that works for your business',
    description:
      'The frontier division of Pixel Studios. We apply artificial intelligence to real business workflows: support, content, automation and custom integrations.',
    gradient: ['#8B5CF6', '#22D3EE'],
    services: [
      { name: 'AI Business Assistants', blurb: 'Smart assistants for daily operations.' },
      { name: 'AI Customer Support', blurb: '24/7 answers for your customers.' },
      { name: 'AI Content Generation', blurb: 'On-brand content at the speed of thought.' },
      { name: 'AI Automation', blurb: 'Workflows that run themselves.' },
      { name: 'Custom AI Integrations', blurb: 'AI woven into the tools you already use.' },
    ],
  },
];

export function getCategory(id: string | undefined): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.id === id);
}
