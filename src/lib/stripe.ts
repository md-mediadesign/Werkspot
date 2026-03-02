import Stripe from "stripe";

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export const STRIPE_PLANS = {
  BASIC:   { priceId: process.env.STRIPE_PRICE_BASIC!,   name: "Basic",   price: 29,  monthlyAwards: 5      },
  PRO:     { priceId: process.env.STRIPE_PRICE_PRO!,     name: "Pro",     price: 50,  monthlyAwards: 10     },
  PREMIUM: { priceId: process.env.STRIPE_PRICE_PREMIUM!, name: "Premium", price: 139, monthlyAwards: 999999 },
} as const;
