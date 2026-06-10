'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Plan, Delivery } from '@/lib/delivery-tiers';

interface OrderContextType {
  activePlan: Plan;
  activeDelivery: Delivery;
  setPlan: (p: Plan) => void;
  setDelivery: (d: Delivery) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [activePlan, setPlan] = useState<Plan>('single');
  const [activeDelivery, setDelivery] = useState<Delivery>('6h');

  return (
    <OrderContext.Provider value={{ activePlan, activeDelivery, setPlan, setDelivery }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
