export const orderSteps = ['Order Confirmed', 'Design Approved', 'In Production', 'Ready', 'Delivered'];

export type Order = {
  id: string;
  product: string;
  price: number;
  date: string;
  status: string;
  step: number; // index in orderSteps
  eta: string;
};

export const orders: Order[] = [
  {
    id: 'PS-2847',
    product: 'NFC Business Card × 2',
    price: 50000,
    date: 'Sep 14, 2026',
    status: 'In Production',
    step: 2,
    eta: 'Estimated completion: Sep 26, 2026',
  },
  {
    id: 'PS-2863',
    product: 'Branded T-Shirts × 25',
    price: 200000,
    date: 'Sep 17, 2026',
    status: 'Design Approval',
    step: 1,
    eta: 'Waiting on your design approval',
  },
  {
    id: 'PS-2791',
    product: 'Premium Business Cards × 200',
    price: 30000,
    date: 'Sep 02, 2026',
    status: 'Delivered',
    step: 4,
    eta: 'Delivered Sep 09, 2026',
  },
];

export function getOrder(id: string | undefined): Order | undefined {
  return orders.find((o) => o.id === id);
}
