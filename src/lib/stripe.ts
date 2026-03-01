import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const STRIPE_PLANS = {
  BASIC: {
    priceId: process.env.STRIPE_PRICE_BASIC!,
    name: "Basic",
    price: 29,
    monthlyAwards: 5,
  },
  PRO: {
    priceId: process.env.STRIPE_PRICE_PRO!,
    name: "Pro",
    price: 50,
    monthlyAwards: 10,
  },
  PREMIUM: {
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    name: "Premium",
    price: 139,
    monthlyAwards: 999999,
  },
} as const;
