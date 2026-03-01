"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import type { SubscriptionTier } from "@prisma/client";

export async function createCheckoutSession(tier: SubscriptionTier) {
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") {
    return { error: "Nicht autorisiert." };
  }

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  if (!provider?.subscription) {
    return { error: "Kein Abonnement gefunden." };
  }

  const plan = STRIPE_PLANS[tier];
  if (!plan) return { error: "Ungültiger Plan." };

  // Create or get Stripe customer
  let stripeCustomerId = provider.subscription.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: {
        providerId: provider.id,
        userId: session.user.id,
      },
    });
    stripeCustomerId = customer.id;

    await db.subscription.update({
      where: { id: provider.subscription.id },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/anbieter/abo/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/anbieter/abo`,
    metadata: {
      providerId: provider.id,
      tier,
    },
  });

  return { url: checkoutSession.url };
}

export async function createPortalSession() {
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") {
    return { error: "Nicht autorisiert." };
  }

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  if (!provider?.subscription?.stripeCustomerId) {
    return { error: "Kein Stripe-Konto gefunden." };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: provider.subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/anbieter/abo`,
  });

  return { url: portalSession.url };
}

export async function getSubscriptionInfo() {
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") return null;

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  return provider?.subscription || null;
}
