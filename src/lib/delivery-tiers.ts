export type Plan = 'single' | 'bundle';
export type Delivery = '6h' | '24h' | '48h';

export interface Tier {
  amount: number;
  label: string;
  name: string;
  display: string;
  per: string;
  feat: string;
}

export const DELIVERY_TIERS: Record<Delivery, Record<Plan, Tier>> = {
  '6h': {
    single: { amount: 4999, label: '₹4,999', name: '1 Custom Song — 6hr',    display: '4,999', per: 'delivered within 6 hours',            feat: 'Ready within 6 hours'  },
    bundle: { amount: 7999, label: '₹7,999', name: '2 Songs Bundle — 6hr',   display: '7,999', per: '2 songs · delivered within 6 hours',  feat: 'Ready within 6 hours'  },
  },
  '24h': {
    single: { amount: 3999, label: '₹3,999', name: '1 Custom Song — 24hr',   display: '3,999', per: 'delivered within 24 hours',           feat: 'Ready within 24 hours' },
    bundle: { amount: 5999, label: '₹5,999', name: '2 Songs Bundle — 24hr',  display: '5,999', per: '2 songs · delivered within 24 hours', feat: 'Ready within 24 hours' },
  },
  '48h': {
    single: { amount: 2999, label: '₹2,999', name: '1 Custom Song — 48hr',   display: '2,999', per: 'delivered within 48 hours',           feat: 'Ready within 48 hours' },
    bundle: { amount: 4999, label: '₹4,999', name: '2 Songs Bundle — 48hr',  display: '4,999', per: '2 songs · delivered within 48 hours', feat: 'Ready within 48 hours' },
  },
};
