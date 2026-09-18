/**
 * Pixel Studios contact details.
 * TODO: replace the placeholder values below with the real business contacts.
 */
export const CONTACT = {
  phone: '+234 803 000 0000',
  phoneRaw: '+2348030000000',
  /** WhatsApp number in international format, digits only (no +). */
  whatsappNumber: '2348030000000',
  email: 'hello@pixelstudios.ng',
  instagram: 'pixelstudios.ng',
  instagramUrl: 'https://instagram.com/pixelstudios.ng',
  facebook: 'Pixel Studios',
  facebookUrl: 'https://facebook.com/pixelstudios',
  location: 'Gusau, Zamfara State, Nigeria',
  mapsUrl: 'https://maps.google.com/?q=Gusau,+Zamfara+State,+Nigeria',
  hours: [
    { days: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', time: '9:00 AM – 5:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
} as const;

export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const waDefaultMessage =
  'Hello Pixel Studios! 👋 I discovered you through your app and I would love to discuss a project.';
