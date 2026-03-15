import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripeServer() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    price: 4.99,
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    price: 39.99,
    interval: "year" as const,
  },
};

export const FREE_LIMITS = {
  maxFlows: 3,
  maxDocuments: 10,
};