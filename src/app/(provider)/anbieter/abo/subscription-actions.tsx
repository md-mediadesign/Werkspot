"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCheckoutSession, createPortalSession } from "@/actions/subscription";
import { toast } from "sonner";
import type { SubscriptionTier, SubscriptionStatus } from "@prisma/client";

export function SubscriptionActions({
  currentTier,
  status,
  isTrialing,
  hasStripeSubscription,
}: {
  currentTier: SubscriptionTier;
  status: SubscriptionStatus;
  isTrialing: boolean;
  hasStripeSubscription: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(tier: SubscriptionTier) {
    setLoading(tier);
    try {
      const result = await createCheckoutSession(tier);
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const result = await createPortalSession();
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(null);
    }
  }

  const needsSubscription =
    isTrialing || status === "CANCELLED" || status === "EXPIRED";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abo verwalten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {needsSubscription && (
          <div className="grid gap-3 sm:grid-cols-3">
            {(["BASIC", "PRO", "PREMIUM"] as SubscriptionTier[]).map((tier) => (
              <Button
                key={tier}
                variant={tier === currentTier ? "default" : "outline"}
                disabled={loading !== null}
                onClick={() => handleCheckout(tier)}
              >
                {loading === tier ? "Laden..." : `${tier === "BASIC" ? "Basic (29 €)" : tier === "PRO" ? "Pro (50 €)" : "Premium (139 €)"}`}
              </Button>
            ))}
          </div>
        )}

        {hasStripeSubscription && (
          <Button
            variant="outline"
            className="w-full"
            disabled={loading !== null}
            onClick={handlePortal}
          >
            {loading === "portal" ? "Laden..." : "Rechnungen & Zahlungsmethode verwalten"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
