import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { db } from "@/lib/db";
import type { SubscriptionTier } from "@prisma/client";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Use `any` for Stripe event objects since type definitions vary across API versions
    const obj = event.data.object as any;

    switch (event.type) {
      case "checkout.session.completed": {
        const providerId = obj.metadata?.providerId;
        const tier = obj.metadata?.tier as SubscriptionTier | undefined;
        const stripeSubscriptionId = obj.subscription as string;

        if (providerId && tier && stripeSubscriptionId) {
          const plan = STRIPE_PLANS[tier];
          const stripeSub: any = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          await db.subscription.update({
            where: { providerId },
            data: {
              tier,
              status: "ACTIVE",
              stripeSubscriptionId,
              stripePriceId: plan.priceId,
              monthlyAwardsLimit: plan.monthlyAwards,
              monthlyAwardsUsed: 0,
              currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              trialEndsAt: null,
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const stripeSubscriptionId = obj.subscription as string;

        if (stripeSubscriptionId) {
          const subscription = await db.subscription.findFirst({
            where: { stripeSubscriptionId },
          });

          if (subscription) {
            const stripeSub: any = await stripe.subscriptions.retrieve(stripeSubscriptionId);

            await db.subscription.update({
              where: { id: subscription.id },
              data: {
                status: "ACTIVE",
                monthlyAwardsUsed: 0,
                currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const stripeSubscriptionId = obj.subscription as string;

        if (stripeSubscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const dbSub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: obj.id },
        });

        if (dbSub) {
          let newTier: SubscriptionTier | undefined;
          const priceId = obj.items?.data?.[0]?.price?.id;

          for (const [tier, plan] of Object.entries(STRIPE_PLANS)) {
            if (plan.priceId === priceId) {
              newTier = tier as SubscriptionTier;
              break;
            }
          }

          await db.subscription.update({
            where: { id: dbSub.id },
            data: {
              ...(newTier && {
                tier: newTier,
                monthlyAwardsLimit: STRIPE_PLANS[newTier].monthlyAwards,
              }),
              cancelAtPeriodEnd: obj.cancel_at_period_end,
              currentPeriodEnd: new Date(obj.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: obj.id },
          data: {
            status: "CANCELLED",
            stripeSubscriptionId: null,
          },
        });
        break;
      }
    }
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
